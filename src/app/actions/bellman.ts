"use server";

import { calculateOptimalPrice } from "@/lib/bellman";

interface SimulatorParams {
  basePrice: number;
  minPrice: number;
  cogs: number;
  wasteCost: number;
  elasticity: number;
}

export async function simulateBellmanPolicy(params: SimulatorParams) {
  // We use dummy product id since we're in simulation mode
  const dummyProductId = "SIMULATION_PRODUCT";

  // Fixed matrix dimensions for the heatmap
  const inventoryLevel = 15; // Max stock we care about in heatmap is 15
  const daysToExpiry = 7;    // Max days for decay curve is 7, heatmap shows up to 3

  // Base Demand parameter (lambda_0). A realistic value for this simulation:
  // If basePrice is 20000, and stock is 15. We assume natural demand is around 2 items per day.
  const baseDemand = 2;

  const result = await calculateOptimalPrice(dummyProductId, {
    inventory: inventoryLevel,
    daysToExpiry: daysToExpiry,
    basePrice: params.basePrice,
    minPrice: params.minPrice,
    cogs: params.cogs,
    baseDemand: baseDemand,
    elasticity: -Math.abs(params.elasticity), // Ensure elasticity is negative
    wasteCostPerItem: params.wasteCost,
    isSimulation: true,
  });

  const { policyMatrix, bucketSize } = result;

  // We need to format POLICY_MATRIX for the UI:
  // const POLICY_MATRIX: Record<number, Record<number, string>>
  // Rows: s = 15, 10, 5, 2
  // Cols: d = 3, 2, 1, 0
  const stockLevels = [15, 10, 5, 2];
  const daysLeft = [3, 2, 1, 0];
  
  const uiPolicyMatrix: Record<number, Record<number, string>> = {};
  
  stockLevels.forEach(s => {
    uiPolicyMatrix[s] = {};
    daysLeft.forEach(d => {
      if (d === 0) {
        uiPolicyMatrix[s][d] = 'EXPIRED';
      } else {
        // Find the corresponding bucket for stock 's'
        // bucketSize could be > 1, so exact bucket is ceil(s/bucketSize)
        const bucket = Math.ceil(s / bucketSize);
        // Ensure bucket is within bounds (0 to numBuckets)
        const safeBucket = Math.min(bucket, policyMatrix[d].length - 1);
        const price = policyMatrix[d][safeBucket];
        uiPolicyMatrix[s][d] = price.toLocaleString('id-ID');
      }
    });
  });

  // Generate DECAY_CURVE for day 7 to day 1, assuming stock is 15 initially
  // We will trace the policy for stock = 15
  const decayCurve = [];
  const targetBucket = Math.ceil(15 / bucketSize);
  const safeTargetBucket = Math.min(targetBucket, policyMatrix[0].length - 1);

  for (let d = 7; d >= 1; d--) {
    const price = policyMatrix[d][safeTargetBucket];
    decayCurve.push({
      day: `Day ${d}`,
      price: Math.round(price),
      minPrice: params.minPrice,
    });
  }

  return {
    policyMatrix: uiPolicyMatrix,
    decayCurve: decayCurve,
  };
}
