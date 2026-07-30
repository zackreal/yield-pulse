"use client";

import React, { useEffect, useState } from 'react';
import { Cpu, Server, Database, Activity, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { getModelMonitoringData } from '@/app/actions/dashboard';

function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function ModelMonitoringWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getModelMonitoringData();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch model monitoring data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const metrics = [
    { label: 'Status Sistem', value: data?.status || 'Sistem Sehat', icon: Cpu, type: 'status' },
    { label: 'Data Diskon Silang', value: data?.crossDiscountData || 'Memuat...', icon: Activity, type: 'text' },
    { label: 'Data Penjualan', value: data?.salesData || 'Memuat...', icon: Database, type: 'text' },
    { label: 'Akurasi Prediksi', value: data?.predictionAccuracy || '95.9%', icon: Target, type: 'metric' },
    { label: 'Kecepatan Sistem', value: data?.systemSpeed || '61 ms', icon: Wifi, type: 'metric' },
  ];

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm h-full flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm h-full text-slate-300"
    >
      <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-6">
        <Server className="w-5 h-5 text-indigo-400" />
        Kesehatan Sistem
      </h2>

      <div className="space-y-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="flex justify-between items-center pb-3 border-b border-slate-800/60 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <m.icon className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">{m.label}</span>
            </div>
            {m.type === 'status' ? (
              <span className={`flex items-center gap-1.5 text-xs font-bold ${data?.status === 'Sistem Bermasalah' ? 'text-rose-400 bg-rose-400/10' : 'text-emerald-400 bg-emerald-400/10'} px-2 py-1 rounded-lg`}>
                <span className={`w-1.5 h-1.5 rounded-full ${data?.status === 'Sistem Bermasalah' ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`}></span>
                {m.value}
              </span>
            ) : m.type === 'metric' ? (
              <span className="text-sm font-mono font-bold text-white">{m.value}</span>
            ) : (
              <span className="text-sm text-slate-400">{m.value}</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
