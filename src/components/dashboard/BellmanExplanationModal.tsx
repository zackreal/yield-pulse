import React from 'react';
import { X, BrainCircuit, Calculator, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onClose: () => void;
}

export function BellmanExplanationModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bellman Decision</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Stochastic DP Engine V2</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Current State</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Stock</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">26</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Remaining Days</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">2</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Demand λ</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">5.8/day</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Elasticity</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">-1.72</div>
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
              <div className="text-xs text-rose-600 dark:text-rose-400 mb-1">Waste Risk</div>
              <div className="text-xl font-bold text-rose-700 dark:text-rose-300">81%</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Holding Cost</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">Rp420</div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-6"></div>

          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Value Computation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Expected Revenue</div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">Rp412.000</div>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
              <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Future Value</div>
              <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">Rp68.000</div>
            </div>
          </div>

          <div className="mt-6 p-5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
              <Calculator className="w-32 h-32" />
            </div>
            <h4 className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" /> Logic Reason
            </h4>
            <p className="text-lg font-medium leading-relaxed relative z-10">
              Lowering price today maximizes expected total profit while reducing waste.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
