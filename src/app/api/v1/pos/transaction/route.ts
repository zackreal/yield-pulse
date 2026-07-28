import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redisPublisher } from '@/lib/redis';
import { calculateOptimalPrice } from '@/lib/bellman';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { batchId, quantitySold, priceAtSale } = body;

    if (!batchId || !quantitySold || !priceAtSale) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const t0 = performance.now();

    // 1. Transactionally update Inventory and log Sales
    const [updatedBatch, salesLog] = await prisma.$transaction([
      prisma.batch.update({
        where: { id: batchId },
        data: {
          quantity: { decrement: quantitySold }
        },
        include: { product: true }
      }),
      prisma.salesLog.create({
        data: {
          productId: batchId, // Should ideally map to product id, keeping simple for now
          quantitySold: quantitySold,
          priceAtSale: priceAtSale
        }
      })
    ]);

    // 2. Respond immediately to POS (Zero-blocking)
    const response = NextResponse.json({
      success: true,
      message: 'Transaction recorded',
      remainingInventory: updatedBatch.quantity,
      latencyMs: (performance.now() - t0).toFixed(2)
    });

    // 3. ASYNCHRONOUS BACKGROUND WORK
    // We do NOT `await` this block so the response returns to POS instantly.
    (async () => {
      try {
        // A. Broadcast event to WebSocket clients via Redis
        const eventPayload = JSON.stringify({
          type: 'SALE_RECORDED',
          data: {
            batchId: updatedBatch.batchNumber,
            quantitySold: quantitySold,
            price: priceAtSale,
            remainingInventory: updatedBatch.quantity,
            timestamp: new Date().toISOString()
          }
        });
        
        await redisPublisher.publish('yieldpulse_events', eventPayload);

        // B. Recompute Bellman Matrix with new Inventory
        const now = new Date();
        const daysToExpiry = Math.max(0, Math.ceil((updatedBatch.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const stateHash = `${updatedBatch.quantity}_${daysToExpiry}`;

        // Only compute if we haven't already computed this exact state
        const existingCache = await prisma.bellmanPolicyCache.findUnique({
          where: {
            batchId_stateHash: { batchId: updatedBatch.id, stateHash: stateHash }
          }
        });

        if (!existingCache) {
          const bellmanResult = await calculateOptimalPrice(updatedBatch.product.id, {
            inventory: updatedBatch.quantity,
            daysToExpiry: daysToExpiry,
            basePrice: Number(updatedBatch.product.basePrice),
            cogs: Number(updatedBatch.product.cogs),
            minPrice: Number(updatedBatch.product.minPrice),
            baseDemand: updatedBatch.product.baseDemand,
            elasticity: -1.5,
          });

          // Update Cache
          await prisma.bellmanPolicyCache.create({
            data: {
              batchId: updatedBatch.id,
              stateHash: stateHash,
              recommendedPrice: bellmanResult.optimalPrice,
              expectedValue: bellmanResult.expectedValue,
              wasteRisk: bellmanResult.wasteRisk,
            }
          });

          // Also update the current live price on the batch itself
          await prisma.batch.update({
            where: { id: updatedBatch.id },
            data: { currentPrice: bellmanResult.optimalPrice }
          });

          // Broadcast price update to UI
          await redisPublisher.publish('yieldpulse_events', JSON.stringify({
            type: 'PRICE_OPTIMIZED',
            data: {
              batchId: updatedBatch.batchNumber,
              newPrice: bellmanResult.optimalPrice,
              wasteRisk: bellmanResult.wasteRisk
            }
          }));
        }
      } catch (err) {
        console.error('Background Processing Error after POS transaction:', err);
      }
    })();

    return response;

  } catch (error) {
    console.error('POS Transaction Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
