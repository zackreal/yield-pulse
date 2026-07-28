import { calculateOptimalPrice } from './src/lib/bellman';
import * as guardrails from './src/lib/guardrails';

// Mock DB call
Object.defineProperty(guardrails, 'enforcePriceSafety', {
  value: async (id: string, p: number) => Math.max(10000, p)
});

async function run() {
  console.log("Running Bellman ADP Engine Test...");
  const t0 = Date.now();
  
  const result = await calculateOptimalPrice('prod-1', {
    inventory: 10000, 
    daysToExpiry: 14, 
    basePrice: 20000,
    cogs: 8000,
    minPrice: 10000,
    baseDemand: 500,
    elasticity: -1.5,
    holdingCostPerDay: 50,
    historicalSales: [450, 600, 520, 480],
    aggregationThreshold: 100
  });

  const t1 = Date.now();
  
  console.log(`Execution Time: ${t1 - t0} ms`);
  console.log(`Optimal Price: ${result.optimalPrice}`);
  console.log(`Expected Value: ${result.expectedValue}`);
  console.log(`Waste Risk: ${(result.wasteRisk * 100).toFixed(2)}%`);
  console.log(`Calibrated Demand: ${result.calibratedDemand}`);
  console.log(`Bucket Size Used: ${result.bucketSize}`);
}

run().catch(console.error);
