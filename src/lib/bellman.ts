import { enforcePriceSafety } from './guardrails';

interface BellmanParams {
  inventory: number;           // Sisa stok saat ini (I)
  daysToExpiry: number;        // Sisa hari menuju kadaluarsa (T)
  basePrice: number;           // Harga asli/dasar
  cogs: number;                // Modal (Cost of Goods Sold)
  minPrice: number;            // Harga minimal absolut (Guardrail)
  baseDemand: number;          // Permintaan bawaan produk (λ0) - Prior
  elasticity: number;          // Sensitivitas harga (ε) - biasanya negatif
  holdingCostPerDay?: number;  // Biaya penyimpanan per hari (H)
  wasteCostPerItem?: number;   // Biaya pembuangan barang basi (W)
  historicalSales?: number[];  // Data penjualan lampau untuk Bayesian Update
  aggregationThreshold?: number; // Ambang batas stok untuk State Aggregation
  isSimulation?: boolean;      // Jika true, tidak melakukan verifikasi Guardrail ke DB
}

export interface BellmanResult {
  optimalPrice: number;
  expectedValue: number;
  wasteRisk: number;
  policyMatrix: number[][];    // Matriks rekomendasi harga P[t][bucket] (Terkompresi jika besar)
  bucketSize: number;          // Ukuran batch per bucket (1 jika < threshold)
  calibratedDemand: number;    // Demand setelah Bayesian Update
}

/**
 * Enterprise Approximate Dynamic Programming (ADP) Engine
 * dengan Memory Optimization (1D Backward Induction) & Bayesian Calibration
 */
export async function calculateOptimalPrice(productId: string, params: BellmanParams): Promise<BellmanResult> {
  const {
    inventory,
    daysToExpiry,
    basePrice,
    minPrice,
    cogs,
    baseDemand,
    elasticity,
    holdingCostPerDay = 100,
    wasteCostPerItem = 0,
    historicalSales = [],
    aggregationThreshold = 100, // Defaul State Aggregation mulai saat stok > 100
    isSimulation = false,
  } = params;

  // --- 1. Bayesian Filter (Demand Calibration) ---
  let calibratedDemand = baseDemand;
  if (historicalSales.length > 0) {
    const sumSales = historicalSales.reduce((a, b) => a + b, 0);
    const meanSales = sumSales / historicalSales.length;
    // Simple Exponential Smoothing / Bayesian Prior Weight = 0.5
    const alpha = 0.5;
    calibratedDemand = (alpha * baseDemand) + ((1 - alpha) * meanSales);
  }

  // --- 2. State Aggregation Setup ---
  let bucketSize = 1;
  let numBuckets = inventory;
  
  if (inventory > aggregationThreshold) {
    // Misalnya target 100 buckets untuk I = 10000 -> bucketSize = 100
    bucketSize = Math.ceil(inventory / aggregationThreshold);
    numBuckets = Math.ceil(inventory / bucketSize);
  }

  // Fungsi utilitas permintaan
  const getDemand = (price: number) => {
    return calibratedDemand * Math.pow(price / basePrice, elasticity);
  };

  const allowedDiscounts = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
  const priceOptions = allowedDiscounts.map(d => basePrice * (1 - d));

  // --- 3. Memory Optimization (1D Array Backward Induction) ---
  // Kita hanya menyimpan Value Function hari esok (V_next) dan hari ini (V_curr)
  let V_next = new Float64Array(numBuckets + 1);
  for (let b = 0; b <= numBuckets; b++) {
    // Penalty at T (expiry) is waste cost for remaining inventory
    V_next[b] = -Math.min(b * bucketSize, inventory) * wasteCostPerItem;
  }
  let V_curr = new Float64Array(numBuckets + 1).fill(0);
  
  // Policy Matrix tetap 2D karena kita butuh trajektorinya untuk UI/Redis
  // P[t][b] = Optimal price at day t, bucket b
  const P: number[][] = Array.from({ length: daysToExpiry + 1 }, () => Array(numBuckets + 1).fill(basePrice));

  // Fungsi Bantuan Interpolasi Linear untuk state I_actual
  const getInterpolatedValue = (V_array: Float64Array, I_actual: number) => {
    if (I_actual <= 0) return V_array[0];
    if (I_actual >= inventory) return V_array[numBuckets];
    
    const exactBucket = I_actual / bucketSize;
    const lowerBucket = Math.floor(exactBucket);
    const upperBucket = Math.ceil(exactBucket);
    
    if (lowerBucket === upperBucket) return V_array[lowerBucket];
    
    const fraction = exactBucket - lowerBucket;
    return V_array[lowerBucket] * (1 - fraction) + V_array[upperBucket] * fraction;
  };

  // Pre-compute factorials for Poisson (up to a safe limit to prevent Infinity)
  const MAX_K = 150; 
  const fact = new Float64Array(MAX_K + 1);
  fact[0] = 1;
  for (let i = 1; i <= MAX_K; i++) fact[i] = fact[i - 1] * i;

  const poissonProb = (k: number, lambda: number) => {
    if (lambda > 100 || k > MAX_K) {
      // Gaussian approximation for large lambda or k to avoid Infinity * 0 = NaN
      const stdDev = Math.sqrt(lambda);
      // Avoid division by zero if lambda is extremely small (which shouldn't happen here)
      if (stdDev === 0) return k === 0 ? 1 : 0;
      const exponent = Math.exp(-Math.pow(k - lambda, 2) / (2 * lambda));
      return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
    }
    return (Math.exp(-lambda) * Math.pow(lambda, k)) / fact[k];
  };

  // Backward Induction
  for (let t = daysToExpiry - 1; t >= 0; t--) {
    for (let b = 0; b <= numBuckets; b++) {
      const i = Math.min(b * bucketSize, inventory); // Actual inventory level for this bucket

      if (i === 0) {
        V_curr[b] = 0;
        continue;
      }

      let maxExpectedValue = -Infinity;
      let optimalP = basePrice;

      for (const price of priceOptions) {
        const expectedDemand = getDemand(price);
        
        let expectedFutureValueSum = 0;
        let cumulativeProb = 0;
        
        // Batasi evaluasi loop demand K untuk mencegah CPU Spikes berlebih
        // 99.9% probability mass of Poisson is usually within lambda + 4*sqrt(lambda)
        const limitK = Math.min(i, Math.ceil(expectedDemand + 4 * Math.sqrt(expectedDemand)));
        
        for (let k = 0; k < limitK; k++) {
          const prob = poissonProb(k, expectedDemand);
          cumulativeProb += prob;
          
          const nextInventory = i - k;
          const futureValue = getInterpolatedValue(V_next, nextInventory);
          
          expectedFutureValueSum += prob * futureValue;
        }
        
        // Probabilitas terjual melebihi limitK (atau habis)
        const probSoldOutOrMore = Math.max(0, 1 - cumulativeProb);
        const futureValueSoldOut = getInterpolatedValue(V_next, Math.max(0, i - limitK));
        expectedFutureValueSum += probSoldOutOrMore * futureValueSoldOut;
        
        const currentRevenue = Math.min(i, expectedDemand) * price;
        const inventoryCost = i * holdingCostPerDay;

        const expectedValue = currentRevenue - inventoryCost + expectedFutureValueSum;

        if (expectedValue > maxExpectedValue) {
          maxExpectedValue = expectedValue;
          optimalP = price;
        }
      }

      V_curr[b] = maxExpectedValue;
      P[t][b] = optimalP;
    }

    // Roll array untuk hari berikutnya
    V_next.set(V_curr);
  }

  // 4. Keputusan untuk Hari Ini (t=0)
  const rawOptimalPrice = P[0][numBuckets]; // Karena saat ini state kita ada di full inventory bucket
  const expectedValueToday = V_curr[numBuckets];

  // 5. Hard Guardrail
  let finalSafePrice = rawOptimalPrice;
  if (isSimulation) {
    const absoluteFloor = Math.max(cogs, minPrice);
    finalSafePrice = Math.max(absoluteFloor, rawOptimalPrice);
  } else {
    finalSafePrice = await enforcePriceSafety(productId, rawOptimalPrice);
  }

  // 6. Waste Risk Estimation
  let wasteRisk = 0;
  const naturalDemandTotal = calibratedDemand * daysToExpiry;
  
  if (naturalDemandTotal > 0) {
    let sumProb = 0;
    const limitK = Math.min(inventory, Math.ceil(naturalDemandTotal + 4 * Math.sqrt(naturalDemandTotal)));
    for (let i = 0; i <= limitK; i++) {
      sumProb += poissonProb(i, naturalDemandTotal);
    }
    wasteRisk = Math.max(0, Math.min(1, 1 - sumProb));
  } else {
    wasteRisk = 1.0;
  }

  return {
    optimalPrice: finalSafePrice,
    expectedValue: expectedValueToday,
    wasteRisk: wasteRisk,
    policyMatrix: P,
    bucketSize,
    calibratedDemand
  };
}
