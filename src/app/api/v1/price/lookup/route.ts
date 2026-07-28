import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateOptimalPrice } from '@/lib/bellman';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json({ error: 'Missing batchId parameter' }, { status: 400 });
    }

    const t0 = performance.now();

    // 1. Fetch Batch and Product Data
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { product: true }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    // 2. Calculate State Hash (Inventory + Time to Expiry)
    const now = new Date();
    const daysToExpiry = Math.max(0, Math.ceil((batch.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const stateHash = `${batch.quantity}_${daysToExpiry}`;
    const redisKey = `yieldpulse:price:${batchId}:${stateHash}`;

    let finalPrice = Number(batch.currentPrice);
    let source = 'REDIS_L2_CACHE';

    // 3. Check Redis L2 Cache for Ultra-Fast Lookup (<2ms)
    // Dynamic import to avoid next.js edge routing issues if redis isn't exposed
    const { redisPublisher } = require('@/lib/redis');
    const redisCache = await redisPublisher.get(redisKey);

    if (redisCache) {
      finalPrice = Number(redisCache);
    } else {
      // 4. Check L3 Cache (Database) as Fallback
      source = 'DB_L3_CACHE';
      const dbCache = await prisma.bellmanPolicyCache.findUnique({
        where: {
          batchId_stateHash: {
            batchId: batch.id,
            stateHash: stateHash
          }
        }
      });

      if (dbCache) {
        finalPrice = Number(dbCache.recommendedPrice);
        
        // Populate Redis L2 for next time
        await redisPublisher.set(redisKey, finalPrice, 'EX', 3600);
      } else {
        // 5. Cache Miss -> Calculate on the fly (Stochastic DP)
        source = 'ON_THE_FLY_COMPUTATION';
        
        const bellmanResult = await calculateOptimalPrice(batch.product.id, {
          inventory: batch.quantity,
          daysToExpiry: daysToExpiry,
          basePrice: Number(batch.product.basePrice),
          cogs: Number(batch.product.cogs),
          minPrice: Number(batch.product.minPrice),
          baseDemand: batch.product.baseDemand,
          elasticity: -1.5, // Simplifikasi dari ElasticityMatrix
        });

        finalPrice = bellmanResult.optimalPrice;

        // Update the cache asynchronously so we don't block the POS response
        Promise.all([
          prisma.bellmanPolicyCache.create({
            data: {
              batchId: batch.id,
              stateHash: stateHash,
              recommendedPrice: bellmanResult.optimalPrice,
              expectedValue: bellmanResult.expectedValue,
              wasteRisk: bellmanResult.wasteRisk,
            }
          }),
          redisPublisher.set(redisKey, finalPrice, 'EX', 3600)
        ]).catch(err => console.error('Failed to update cache in background:', err));
      }
    }

    const t1 = performance.now();
    const latency = (t1 - t0).toFixed(2);

    // 5. Return sub-20ms response to POS
    return NextResponse.json({
      batchId: batch.id,
      sku: batch.product.sku,
      price: finalPrice,
      originalPrice: Number(batch.product.basePrice),
      discountPercentage: ((Number(batch.product.basePrice) - finalPrice) / Number(batch.product.basePrice)) * 100,
      meta: {
        latencyMs: latency,
        source: source,
        inventory: batch.quantity,
        daysToExpiry: daysToExpiry
      }
    });

  } catch (error) {
    console.error('POS Lookup Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
