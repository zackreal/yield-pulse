"use client";

import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface MarkdownRecommendation {
  batchId: string;
  productName: string;
  daysLeft: number;
  stockQty: number;
  basePrice: number;
  recommendedPrice: number;
  marginSaved: number;
}

const DUMMY_DATA: MarkdownRecommendation[] = [
  {
    batchId: 'MILK-UHT-B402',
    productName: 'Susu UHT Full Cream 1L',
    daysLeft: 2,
    stockQty: 24,
    basePrice: 20000,
    recommendedPrice: 16500,
    marginSaved: 156000
  },
  {
    batchId: 'CHZ-CHD-B109',
    productName: 'Keju Cheddar 200g',
    daysLeft: 1,
    stockQty: 12,
    basePrice: 24000,
    recommendedPrice: 14000,
    marginSaved: 98000
  },
  {
    batchId: 'YGT-BLU-B992',
    productName: 'Yogurt Blueberry 100g',
    daysLeft: 1,
    stockQty: 8,
    basePrice: 12000,
    recommendedPrice: 7500,
    marginSaved: 36000
  }
];

export function ActionableMarkdownFeed() {
  const [appliedBatches, setAppliedBatches] = useState<string[]>([]);
  const data = DUMMY_DATA;

  const handleApplyPrice = (batchId: string, price: number) => {
    // In a real app, this would be an API Call to backend to update price to Redis & POS
    console.log(`Applying price ${price} for batch ${batchId}`);
    setAppliedBatches((prev) => [...prev, batchId]);
  };

  const handleApplyAll = () => {
    const unappliedBatches = data
      .filter(item => !appliedBatches.includes(item.batchId))
      .map(item => item.batchId);
    
    setAppliedBatches(prev => [...prev, ...unappliedBatches]);
  };

  const allApplied = data.length > 0 && appliedBatches.length === data.length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
            Actionable Markdowns
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Bellman DP recommended price adjustments for today.
          </p>
        </div>
        <button 
          onClick={handleApplyAll}
          disabled={allApplied}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center gap-2 ${
            allApplied 
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
              : 'text-white bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {allApplied ? (
            <>
              <Check className="w-4 h-4" />
              All Approved
            </>
          ) : (
            `Approve All (${data.length - appliedBatches.length})`
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Days Left</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Base Price</th>
              <th className="py-3 px-4">Rec. Price (P*)</th>
              <th className="py-3 px-4">Margin Saved</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {data.map((item) => {
              const isApplied = appliedBatches.includes(item.batchId);
              return (
                <tr key={item.batchId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {item.productName}
                    <span className="block text-xs font-mono text-slate-400 mt-1">{item.batchId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400">
                      {item.daysLeft} {item.daysLeft === 1 ? 'Day' : 'Days'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono">{item.stockQty} pcs</td>
                  <td className="py-4 px-4 font-mono text-slate-400 line-through">
                    Rp {item.basePrice.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 flex flex-col">
                    Rp {item.recommendedPrice.toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-slate-500 mt-0.5">
                      {Math.round(((item.recommendedPrice - item.basePrice) / item.basePrice) * 100)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                    +Rp {item.marginSaved.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      disabled={isApplied}
                      onClick={() => handleApplyPrice(item.batchId, item.recommendedPrice)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                        isApplied
                          ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed flex items-center gap-1 ml-auto'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 ml-auto'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3 h-3" />
                          Applied
                        </>
                      ) : (
                        'Apply Price'
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}