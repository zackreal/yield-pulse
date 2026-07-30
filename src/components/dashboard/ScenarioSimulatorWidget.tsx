"use client";

import React, { useEffect, useState } from 'react';
import { Activity, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { getScenarioSimulatorData } from '@/app/actions/dashboard';

export function ScenarioSimulatorWidget() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getScenarioSimulatorData();
        setScenarios(data);
      } catch (error) {
        console.error("Error fetching scenario data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex flex-col"
    >
      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-indigo-500" />
        Cek Skenario Keuntungan
      </h2>

      <div className="flex-1 flex flex-col gap-3">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
        ) : scenarios.map((s, idx) => (
          <div 
            key={idx}
            className={`p-3 rounded-xl border flex justify-between items-center ${
              s.best 
                ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 shadow-sm ring-1 ring-indigo-500/20' 
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {s.name}
                {s.best && <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Aktif</span>}
              </div>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Pendapatan</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.rev}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Buang</div>
                <div className={`text-sm font-bold ${parseFloat(s.waste) < 10 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {s.waste}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50" disabled={loading}>
        <Play className="w-4 h-4" /> Terapkan Simulasi
      </button>
    </motion.div>
  );
}
