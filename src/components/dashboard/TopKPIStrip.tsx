"use client";

import React from 'react';
import { DollarSign, ShieldAlert, TrendingUp, PackageCheck, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

const kpis = [
  { 
    title: 'Revenue', 
    value: 'Rp151 M', 
    trend: '▲ 8%', 
    trendColor: 'text-emerald-500', 
    icon: DollarSign, 
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
  },
  { 
    title: 'Waste Saved', 
    value: 'Rp8.4 M', 
    trend: '▲ 12%', 
    trendColor: 'text-emerald-500', 
    icon: ShieldAlert, 
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' 
  },
  { 
    title: 'Gross Margin', 
    value: '31%', 
    trend: '▲ 4%', 
    trendColor: 'text-emerald-500', 
    icon: TrendingUp, 
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' 
  },
  { 
    title: 'Sell-through', 
    value: '97%', 
    trend: '▲ 3%', 
    trendColor: 'text-emerald-500', 
    icon: PackageCheck, 
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' 
  },
  { 
    title: 'Inventory Turnover', 
    value: '18 Days', 
    trend: '▼ 2 Days', 
    trendColor: 'text-emerald-500', // Down is good for turnover
    icon: Repeat, 
    color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' 
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function TopKPIStrip() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      {kpis.map((kpi, index) => (
        <motion.div 
          key={index} 
          variants={item}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-default"
        >
          <div className={`p-3 rounded-xl ${kpi.color} transition-transform group-hover:scale-110`}>
            <kpi.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{kpi.title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{kpi.value}</h3>
              <span className={`text-xs font-bold ${kpi.trendColor}`}>{kpi.trend}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}