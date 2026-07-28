'use client';

import { motion } from 'framer-motion';
import { RefreshCcw, Network, TrendingDown, TrendingUp, Equal } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DUMMY_PRODUCTS = ['Fresh Milk 1L', 'Premium UHT', 'Soy Milk', 'Choc Cereal'];

// N x N Cross Elasticity Matrix
const ELASTICITY_MATRIX = [
  [-1.50,  0.80,  0.40, -0.40],
  [ 1.20, -1.20,  0.60,  0.00],
  [ 0.80,  0.50, -1.10, -0.20],
  [-0.60,  0.00, -0.10, -2.00],
];

export default function ElasticityAnalyticsPage() {
  const [discountPercent, setDiscountPercent] = useState(0);

  // Simulated Demand Impact
  const simulateImpact = () => {
    if (discountPercent === 0) return [
      { name: 'Fresh Milk 1L', impact: 0 },
      { name: 'Premium UHT', impact: 0 },
      { name: 'Soy Milk', impact: 0 },
      { name: 'Choc Cereal', impact: 0 },
    ];

    const discountP1 = discountPercent / 100; // E.g., -0.30
    return [
      { name: 'Fresh Milk 1L', impact: (ELASTICITY_MATRIX[0][0] * discountP1) * -100 }, // self
      { name: 'Premium UHT', impact: (ELASTICITY_MATRIX[1][0] * discountP1) * -100 },
      { name: 'Soy Milk', impact: (ELASTICITY_MATRIX[2][0] * discountP1) * -100 },
      { name: 'Choc Cereal', impact: (ELASTICITY_MATRIX[3][0] * discountP1) * -100 },
    ];
  };

  const impactData = simulateImpact();

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cek Dampak Diskon ke Produk Lain</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Matriks Analisa Kanibalisasi Produk</p>
        </div>

        {/* Matrix Editor */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Matriks Sensitivitas</h2>
            </div>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>Kategori: Susu & Sarapan</option>
              <option>Kategori: Buah & Sayur</option>
              <option>Kategori: Daging & Ayam</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-semibold uppercase tracking-wider text-left">
                    Produk yang Terdampak \ Produk yang Didiskon
                  </th>
                  {DUMMY_PRODUCTS.map((p, i) => (
                    <th key={i} className="p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-semibold text-sm">
                      {p} (P{i+1})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DUMMY_PRODUCTS.map((effectProduct, i) => (
                  <tr key={i}>
                    <th className="p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-semibold text-sm text-left">
                      {effectProduct} (Q{i+1})
                    </th>
                    {DUMMY_PRODUCTS.map((_, j) => {
                      const val = ELASTICITY_MATRIX[i][j];
                      
                      let badge = '';
                      let icon = <Equal className="w-3 h-3" />;
                      if (i === j) {
                        badge = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
                      } else if (val > 0) {
                        badge = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
                        icon = <TrendingUp className="w-3 h-3" />;
                      } else if (val < 0) {
                        badge = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
                        icon = <TrendingDown className="w-3 h-3" />;
                      } else {
                        badge = 'bg-slate-50 text-slate-500 dark:bg-slate-800/50 border-transparent';
                      }

                      return (
                        <td key={j} className="p-3 border border-slate-200 dark:border-slate-700">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-sm ${badge}`}>
                            {icon} {val.toFixed(2)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Simulasi Dampak Penjualan</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                  <span>Beri Diskon Fresh Milk 1L Sebesar:</span>
                  <span className="font-mono text-rose-500 font-bold">{discountPercent}%</span>
                </label>
                <input 
                  type="range" min="-50" max="0" step="5" 
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                  className="w-full accent-rose-500" 
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>-50% (Diskon Maksimal)</span>
                  <span>0% (Harga Normal)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {impactData.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center items-center text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Prediksi Penjualan {item.name}</p>
                    <p className={`text-2xl font-bold font-mono ${item.impact > 0 ? 'text-emerald-500' : item.impact < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {item.impact > 0 ? '+' : ''}{item.impact.toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Dampak Bersih pada Penjualan Kategori</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  />
                  <Bar dataKey="impact">
                    {impactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#10b981' : entry.impact < 0 ? '#f43f5e' : '#64748b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}