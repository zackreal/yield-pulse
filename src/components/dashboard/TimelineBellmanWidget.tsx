"use client";

import React, { useEffect, useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getHeroDecisionData } from '@/app/actions/dashboard';

export function TimelineBellmanWidget() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getHeroDecisionData();
        if (result && result.timeline) {
          setTimeline(result.timeline);
        }
      } catch (error) {
        console.error("Failed to fetch timeline data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center">
        <Clock className="w-8 h-8 text-slate-400 mb-3" />
        <p className="text-slate-500 text-sm">Tidak ada riwayat keputusan harga yang tersedia.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full"
    >
      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-indigo-500" />
        Riwayat Keputusan Sistem
      </h2>

      <div className="flex-1 flex flex-col justify-center">
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-6">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pl-6">
              {/* Timeline dot */}
              <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 ${
                item.status === 'past' ? 'border-slate-300 dark:border-slate-600' :
                item.status === 'current' ? 'border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' :
                'border-dashed border-indigo-300 dark:border-indigo-700'
              }`}>
                {item.status === 'current' && (
                  <div className="absolute inset-[2px] bg-indigo-500 rounded-full animate-ping opacity-50"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  item.status === 'current' ? 'text-indigo-600 dark:text-indigo-400' :
                  item.status === 'past' ? 'text-slate-400' :
                  'text-slate-500'
                }`}>
                  {item.day} {item.status === 'current' && '(Hari Ini)'}
                </span>
                
                <span className={`text-lg font-black font-mono ${
                  item.status === 'current' ? 'text-indigo-600 dark:text-indigo-400 text-xl' :
                  item.status === 'past' ? 'text-slate-400 line-through' :
                  'text-slate-900 dark:text-white'
                }`}>
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
