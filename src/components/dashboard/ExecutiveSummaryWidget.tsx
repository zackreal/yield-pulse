"use client";

import React, { useEffect, useState } from 'react';
import { Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getExecutiveSummaryData } from '@/app/actions/dashboard';

export function ExecutiveSummaryWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getExecutiveSummaryData();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch executive summary data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between"
    >
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-indigo-500" />
          Ringkasan Eksekutif
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Prakiraan Pendapatan</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              ▲ {data?.revenueProjection || '0%'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Prakiraan Limbah</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              ▼ {data?.wasteProjection || '0%'}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Kelompok Kritis</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{data?.criticalCount || 0}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Sangat Mendesak</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{data?.urgentCount || 0}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Menunggu Diskon</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{data?.warningCount || 0}</span>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 mb-4">
          <h4 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider flex items-center gap-2 mb-1.5">
            <Lightbulb className="w-4 h-4" /> Wawasan Bisnis
          </h4>
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {data?.highestRiskCategory || 'Belum ada data'} menyumbang <span className="font-bold">{data?.highestRiskPercent || 0}%</span> dari total risiko hari ini.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mt-auto">
        <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2 mb-1.5">
          <CheckCircle2 className="w-4 h-4" /> Rekomendasi Tindakan
        </h4>
        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
          Setujui semua rekomendasi penurunan harga.
        </p>
      </div>
    </motion.div>
  );
}
