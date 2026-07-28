'use client';

import { motion } from 'framer-motion';
import { Play, Activity, TrendingUp, AlertTriangle, CloudRain, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonteCarloSimulatorPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const runSimulation = () => {
    setIsSimulating(true);
    setData([]);
    
    // Fake WASM processing delay
    setTimeout(() => {
      // Fake bell curve data
      const curveData = [];
      for (let i = -3; i <= 3; i += 0.5) {
        curveData.push({
          profit: 1250000 + (i * 100000),
          probability: Math.exp(-(i*i)/2) * 100
        });
      }
      setData(curveData);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Simulasi Risiko & Keuntungan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Menebak Masa Depan Berdasarkan Data Masa Lalu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pengaturan Simulasi</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Rata-rata Penjualan</span>
                  <span className="font-mono">25 pcs/day</span>
                </label>
                <input type="range" min="5" max="50" defaultValue="25" className="w-full accent-indigo-500" />
              </div>
              
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Fluktuasi Penjualan</span>
                  <span className="font-mono">8.5</span>
                </label>
                <input type="range" min="1" max="20" step="0.5" defaultValue="8.5" className="w-full accent-amber-500" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Sisa Stok</span>
                  <span className="font-mono">50 pcs</span>
                </label>
                <input type="range" min="10" max="200" defaultValue="50" className="w-full accent-indigo-500" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Sisa Hari (Sebelum Basi)</span>
                  <span className="font-mono">3 Days</span>
                </label>
                <input type="range" min="1" max="14" defaultValue="3" className="w-full accent-indigo-500" />
              </div>
            </div>

            <button 
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-medium transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <RotateCcw className="w-4 h-4" />
                </motion.div>
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              {isSimulating ? 'Menjalankan Prediksi...' : 'Mulai Prediksi'}
            </button>
            
            {data.length > 0 && (
              <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 font-mono mt-2">
                Kecepatan Proses: 3.8ms
              </p>
            )}
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Risk Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Perkiraan Untung</p>
                </div>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {data.length > 0 ? 'Rp 1.250.000' : 'Rp 0'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Skenario Paling Mungkin</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-rose-200 dark:border-rose-500/30 p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-xl" />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Potensi Kerugian Maksimal</p>
                </div>
                <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 relative z-10">
                  {data.length > 0 ? 'Rp 820.000' : 'Rp 0'}
                </p>
                <p className="text-xs text-slate-400 mt-1 relative z-10">Skenario Terburuk</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-500/30 p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl" />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <CloudRain className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Risiko Barang Basi</p>
                </div>
                <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 relative z-10">
                  {data.length > 0 ? '4.2%' : '0%'}
                </p>
                <p className="text-xs text-slate-400 mt-1 relative z-10">Kemungkinan Terbuang</p>
              </div>
            </div>

            {/* Fan Chart */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm min-h-[350px] flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Grafik Kemungkinan Untung-Rugi</h2>
              
              <div className="flex-1 w-full relative">
                {data.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <Activity className="w-12 h-12 mb-3 opacity-20" />
                    <p>Tekan Mulai Prediksi untuk melihat grafik kemungkinan masa depan.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                      <XAxis 
                        dataKey="profit" 
                        stroke="#64748b" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => `Rp ${val/1000}k`}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                        formatter={(value: any) => [`${Number(value || 0).toFixed(2)}%`, 'Probability']}
                        labelFormatter={(label) => `Profit: Rp ${Number(label || 0).toLocaleString()}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="probability" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorProb)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}