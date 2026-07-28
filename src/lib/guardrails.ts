import { prisma } from './db';

/**
 * Hard Guardrail: Enforce Price Safety
 * Ensures that the calculated Bellman dynamic price NEVER falls below the minimum price (P_min)
 * or the Cost of Goods Sold (COGS).
 * 
 * This is a critical enterprise safeguard.
 */
export async function enforcePriceSafety(productId: string, proposedPrice: number): Promise<number> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { cogs: true, minPrice: true }
  });

  if (!product) {
    throw new Error(`Product ${productId} not found during safety check.`);
  }

  const cogs = Number(product.cogs);
  const minPrice = Number(product.minPrice);

  // The floor is the absolute lowest we can go.
  // Ideally it's minPrice, but if minPrice is misconfigured below COGS, COGS acts as the final safety net.
  const absoluteFloor = Math.max(cogs, minPrice);

  if (proposedPrice < absoluteFloor) {
    // Log the anomaly to audit log
    await prisma.systemAuditLog.create({
      data: {
        actionType: 'GUARDRAIL_TRIGGERED',
        description: `Blocked proposed price ${proposedPrice} for product ${productId}. Reverting to absolute floor ${absoluteFloor}.`,
        metadata: JSON.stringify({ proposedPrice, absoluteFloor, cogs, minPrice })
      }
    });

    return absoluteFloor;
  }

  return proposedPrice;
}
