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

    // 1. Validasi Pra-Transaksi
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { product: true }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch tidak ditemukan' }, { status: 404 });
    }

    if (batch.quantity < quantitySold) {
      return NextResponse.json({ error: 'Stok tidak mencukupi untuk transaksi ini' }, { status: 400 });
    }

    const now = new Date();
    if (now > batch.expiryDate || batch.status === 'EXPIRED') {
      // Sebagai pengamanan, POS tidak boleh menjual barang basi.
      return NextResponse.json({ error: 'Penjualan ditolak: Barang telah melewati masa kedaluwarsa (Basi)' }, { status: 403 });
    }

    // 2. Eksekusi Transaksi (Inventory & Logging)
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
          productId: batch.product.id, // Pastikan menggunakan Product ID yang tepat, bukan Batch ID
          quantitySold: quantitySold,
          priceAtSale: priceAtSale
        }
      })
    ]);

    // 3. Merespons ke mesin POS secepat mungkin (Zero-blocking AI Compute)
    const response = NextResponse.json({
      success: true,
      message: 'Transaction recorded',
      remainingInventory: updatedBatch.quantity,
      latencyMs: (performance.now() - t0).toFixed(2)
    });

    // 4. Background Job: Hitung ulang AI & Broadcast Redis
    (async () => {
      try {
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
        
        await redisPublisher.publish('yieldpulse_events', eventPayload).catch(() => {});

        const daysToExpiry = Math.max(0, Math.ceil((updatedBatch.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const stateHash = `${updatedBatch.quantity}_${daysToExpiry}`;

        const existingCache = await prisma.bellmanPolicyCache.findUnique({
          where: {
            batchId_stateHash: { batchId: updatedBatch.id, stateHash: stateHash }
          }
        });

        if (!existingCache && updatedBatch.quantity > 0) {
          const bellmanResult = await calculateOptimalPrice(updatedBatch.product.id, {
            inventory: updatedBatch.quantity,
            daysToExpiry: daysToExpiry,
            basePrice: Number(updatedBatch.product.basePrice),
            cogs: Number(updatedBatch.product.cogs),
            minPrice: Number(updatedBatch.product.minPrice),
            baseDemand: updatedBatch.product.baseDemand,
            elasticity: -1.5,
          });

          await prisma.bellmanPolicyCache.create({
            data: {
              batchId: updatedBatch.id,
              stateHash: stateHash,
              recommendedPrice: bellmanResult.optimalPrice,
              expectedValue: bellmanResult.expectedValue,
              wasteRisk: bellmanResult.wasteRisk,
            }
          });

          await prisma.batch.update({
            where: { id: updatedBatch.id },
            data: { currentPrice: bellmanResult.optimalPrice }
          });

          await redisPublisher.publish('yieldpulse_events', JSON.stringify({
            type: 'PRICE_OPTIMIZED',
            data: {
              batchId: updatedBatch.batchNumber,
              newPrice: bellmanResult.optimalPrice,
              wasteRisk: bellmanResult.wasteRisk
            }
          })).catch(() => {});
        }
      } catch (err) {
        console.error('Background Processing Error:', err);
      }
    })();

    return response;

  } catch (error) {
    console.error('POS Transaction Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
