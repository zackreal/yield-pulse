'use client';

import { motion } from 'framer-motion';
import { SlidersHorizontal, Settings2, RotateCcw, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { simulateBellmanPolicy } from '@/app/actions/bellman';

const STOCK_LEVELS = [15, 10, 5, 2];
const DAYS_LEFT = [3, 2, 1, 0];

export default function BellmanAnalyticsPage() {
  const [isComputing, setIsComputing] = useState(false);
  
  // Parameter State
  const [basePrice, setBasePrice] = useState(20000);
  const [minPrice, setMinPrice] = useState(10000);
  const [cogs, setCogs] = useState(8000);
  const [wasteCost, setWasteCost] = useState(2000);
  const [elasticity, setElasticity] = useState(1.5);

  // Results State
  const [policyMatrix, setPolicyMatrix] = useState<Record<number, Record<number, string>>>({});
  const [decayCurve, setDecayCurve] = useState<any[]>([]);

  const handleRecompute = async () => {
    setIsComputing(true);
    try {
      const result = await simulateBellmanPolicy({
        basePrice,
        minPrice,
        cogs,
        wasteCost,
        elasticity
      });
      setPolicyMatrix(result.policyMatrix);
      setDecayCurve(result.decayCurve);
    } catch (error) {
      console.error("Failed to compute Bellman policy", error);
    } finally {
      setIsComputing(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleRecompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Matriks Diskon Pintar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Pengaturan Harga Otomatis Berdasarkan Sisa Stok dan Kedaluwarsa</p>
        </div>

        {/* Intuitive Explanation Card */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-indigo-600 text-white rounded-xl font-bold text-xs">AI FAQ</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">Bagaimana cara membaca tabel ini?</span> <br />
            Tabel di bawah menunjukkan **harga diskon ideal ($P^*$)** yang harus dipasang toko berdasarkan sisa stok ($s$) dan sisa hari sebelum basi ($t$). 
            Warna merah menandakan diskon tajam untuk menyelamatkan modal sebelum basi, sedangkan warna biru menandakan harga normal aman.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Parameter Tuning */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pengaturan Perhitungan</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Harga Normal</span>
                    <span className="font-mono">Rp {basePrice.toLocaleString('id-ID')}</span>
                  </label>
                  <input type="range" min="15000" max="30000" step="1000" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className="w-full accent-indigo-500" />
                </div>
                
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Harga Terendah (Batas Rugi)</span>
                    <span className="font-mono text-rose-500">Rp {minPrice.toLocaleString('id-ID')}</span>
                  </label>
                  <input type="range" min="5000" max="15000" step="500" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full accent-rose-500" />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Modal Produk (Beli)</span>
                    <span className="font-mono text-amber-500">Rp {cogs.toLocaleString('id-ID')}</span>
                  </label>
                  <input type="range" min="4000" max="12000" step="500" value={cogs} onChange={(e) => setCogs(Number(e.target.value))} className="w-full accent-amber-500" />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Biaya Buang Barang Basi</span>
                    <span className="font-mono">Rp {wasteCost.toLocaleString('id-ID')}</span>
                  </label>
                  <input type="range" min="0" max="5000" step="100" value={wasteCost} onChange={(e) => setWasteCost(Number(e.target.value))} className="w-full accent-indigo-500" />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Sensitivitas Pembeli (Diskon)</span>
                    <span className="font-mono">-{elasticity}</span>
                  </label>
                  <input type="range" min="0.5" max="3.0" step="0.1" value={elasticity} onChange={(e) => setElasticity(Number(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              </div>

              <button 
                onClick={handleRecompute}
                disabled={isComputing}
                className="w-full mt-8 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isComputing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Settings2 className="w-4 h-4" />
                )}
                {isComputing ? 'Menghitung...' : 'Hitung Ulang Rekomendasi'}
              </button>

            </div>
          </div>

          {/* Right: Matrix & Chart */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Heatmap Matrix */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  Tabel Rekomendasi Diskon
                </h2>
                <div className="text-xs text-slate-500 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Diperbarui otomatis</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        Stok \ Sisa Hari
                      </th>
                      {DAYS_LEFT.map(d => (
                        <th key={d} className="p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-semibold">
                          Hari ke-{d} {d===0 && '(Basi)'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {STOCK_LEVELS.map(s => (
                      <tr key={s}>
                        <th className="p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-semibold">
                          s={s}
                        </th>
                        {DAYS_LEFT.map(d => {
                          const priceStr = policyMatrix[s]?.[d] || 'Menghitung...';
                          let priceVal = 0;
                          
                          // Dynamic Color Calculation (Fake Heatmap)
                          let bgColor = '';
                          if (priceStr === 'EXPIRED') {
                            bgColor = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
                          } else if (priceStr !== 'Menghitung...') {
                            priceVal = parseInt(priceStr.replace(/\./g, ''));
                            if (priceVal >= basePrice * 0.95) bgColor = 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-medium';
                            else if (priceVal >= minPrice + (basePrice-minPrice)*0.5) bgColor = 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium';
                            else bgColor = 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold';
                          }

                          return (
                            <td key={d} className={`p-3 border border-slate-200 dark:border-slate-700 font-mono text-sm transition-colors ${bgColor}`}>
                              {priceStr !== 'EXPIRED' && priceStr !== 'Menghitung...' ? `Rp ${priceStr}` : priceStr}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Decay Curve */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Grafik Penurunan Harga Seiring Waktu (s=15)</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={decayCurve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp ${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                      formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Price P*(t)']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      animationDuration={500}
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="minPrice" 
                      stroke="#f43f5e" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="none" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}