"use client";

import React from 'react';
import { GitMerge, Check, Clock, BrainCircuit, UserCog, Store, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function ApprovalWorkflowWidget() {
  const steps = [
    { name: 'Sistem Bellman', icon: BrainCircuit, status: 'done' },
    { name: 'Supervisor', icon: UserCog, status: 'done' },
    { name: 'Manajer Toko', icon: Store, status: 'current' },
    { name: 'Sinkronisasi POS', icon: TerminalSquare, status: 'pending' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex flex-col"
    >
      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-6">
        <GitMerge className="w-5 h-5 text-indigo-500" />
        Alur Persetujuan
      </h2>

      <div className="flex-1 flex flex-col justify-center pb-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="flex items-center w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                step.status === 'done' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                step.status === 'current' ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 ring-4 ring-indigo-500/20' :
                'bg-slate-50 border-slate-300 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
              }`}>
                {step.status === 'done' ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <div className="ml-4 flex-1">
                <div className={`text-sm font-bold ${
                  step.status === 'current' ? 'text-indigo-600 dark:text-indigo-400' :
                  step.status === 'done' ? 'text-slate-900 dark:text-white' :
                  'text-slate-500'
                }`}>
                  {step.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
                  {step.status === 'done' ? 'Disetujui' : step.status === 'current' ? 'Menunggu Tindakan' : 'Menunggu'}
                </div>
              </div>
            </div>
            
            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div className="w-full pl-5 py-1 flex justify-start">
                <div className={`w-0.5 h-6 ${
                  step.status === 'done' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
