"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Activity, CheckCircle } from 'lucide-react';

const CHART_DATA = [
  { day: 'Mon', actual: 21, bellman: 22, ruleBased: 20, fifo: 18 },
  { day: 'Tue', actual: 24, bellman: 25, ruleBased: 22, fifo: 19 },
  { day: 'Wed', actual: 28, bellman: 29, ruleBased: 24, fifo: 20 },
  { day: 'Thu', actual: 35, bellman: 34, ruleBased: 28, fifo: 22 },
  { day: 'Fri', actual: 42, bellman: 45, ruleBased: 32, fifo: 25 },
  { day: 'Sat', actual: 58, bellman: 60, ruleBased: 42, fifo: 30 },
  { day: 'Sun', actual: 65, bellman: 68, ruleBased: 48, fifo: 32 },
];

const formatCurrency = (value: number) => {
  return `Rp${value}M`;
};

export function RevenueChartWidget() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
        Revenue Trend
      </h3>

      <div className="flex-grow w-full min-h-[250px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={CHART_DATA}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={formatCurrency}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#1E293B',
                borderRadius: '0.75rem',
                color: '#F8FAFC',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ fontSize: '14px', fontWeight: 500 }}
              labelStyle={{ color: '#94A3B8', marginBottom: '8px' }}
              formatter={(value: any) => [`Rp ${value}M`, '']}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#64748B' }}
            />
            <Line 
              name="Bellman"
              type="monotone" 
              dataKey="bellman" 
              stroke="#10B981" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: '#0B0F19' }}
            />
            <Line 
              name="Actual"
              type="monotone" 
              dataKey="actual" 
              stroke="#00F3FF" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: '#0B0F19' }} 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              name="Rule Based"
              type="monotone" 
              dataKey="ruleBased" 
              stroke="#F59E0B" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false}
            />
            <Line 
              name="FIFO"
              type="monotone" 
              dataKey="fifo" 
              stroke="#F43F5E" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Confidence Interval</span>
          </div>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">± 2.4% (95%)</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Forecast Error</span>
          </div>
          <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">1.8% MAPE</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Model Accuracy</span>
          </div>
          <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">98.2%</p>
        </div>
      </div>
    </div>
  );
}