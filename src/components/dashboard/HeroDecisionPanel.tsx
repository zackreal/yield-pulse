"use client";

import React from 'react';
import { Play, Check, HelpCircle, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onWhyClick: () => void;
  onSimulateClick: () => void;
  onApproveClick: () => void;
}

export function HeroDecisionPanel({ onWhyClick, onSimulateClick, onApproveClick }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border-2 border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Today's Priority Decision
          </h2>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Fresh Milk A <span className="text-slate-400 font-medium text-lg ml-2">Batch B204</span>
          </h3>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-lg px-4 py-2">
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider mb-0.5">Remaining</div>
            <div className="text-lg font-black text-rose-700 dark:text-rose-300">2 Days</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Stock</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">26</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div>
          <div className="text-xs text-slate-500 mb-1">Current Price</div>
          <div className="text-xl font-bold text-slate-400 line-through decoration-slate-300">Rp20.000</div>
        </div>
        <div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">Recommended Price</div>
          <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">Rp16.500</div>
        </div>
        <div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Expected Revenue
          </div>
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Rp412.000</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Metrics</div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-semibold flex items-center gap-2">
              <span className="text-rose-500">▼ 82%</span> Waste Reduction
            </div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <span className="text-indigo-500">★ 94%</span> Confidence
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button 
          onClick={onWhyClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold transition active:scale-95"
        >
          <HelpCircle className="w-4 h-4" /> Why?
        </button>
        <button 
          onClick={onSimulateClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition active:scale-95"
        >
          <Activity className="w-4 h-4" /> Simulate
        </button>
        <button 
          onClick={onApproveClick}
          className="ml-auto flex items-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-lg shadow-indigo-500/30 active:scale-95"
        >
          <Check className="w-5 h-5" /> Approve Markdown
        </button>
      </div>
    </motion.div>
  );
}
