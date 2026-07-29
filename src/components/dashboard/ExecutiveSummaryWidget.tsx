"use client";

import React from 'react';
import { Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function ExecutiveSummaryWidget() {
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
              ▲ +8.4%
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Prakiraan Limbah</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              ▼ -2.3%
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Kelompok Kritis</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">14</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Sangat Mendesak</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">3</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Menunggu Diskon</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">6</span>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 mb-4">
          <h4 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider flex items-center gap-2 mb-1.5">
            <Lightbulb className="w-4 h-4" /> Wawasan Bisnis
          </h4>
          <p className="text-sm text-amber-900 dark:text-amber-200">
            Produk Susu Segar menyumbang <span className="font-bold">62%</span> dari total risiko hari ini.
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
