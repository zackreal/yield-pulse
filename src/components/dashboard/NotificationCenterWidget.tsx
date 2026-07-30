"use client";

import React, { useEffect, useState } from 'react';
import { BellRing, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getNotificationData } from '@/app/actions/dashboard';

export function NotificationCenterWidget() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getNotificationData();
        setNotifications(data.map((n: any) => ({
          ...n,
          icon: n.type === 'critical' ? <AlertCircle className="w-4 h-4" /> : n.type === 'warning' ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />,
          colorClass: n.type === 'critical' ? 'text-rose-600 dark:text-rose-400' : n.type === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
          bgClass: n.type === 'critical' ? 'bg-rose-100 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900' : n.type === 'warning' ? 'bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900' : 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900'
        })));
      } catch (error) {
        console.error("Error fetching notification data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider flex items-center gap-2">
        <BellRing className="w-5 h-5 text-indigo-500" />
        Pusat Notifikasi
      </h3>

      <div className="flex-1 space-y-3">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
        ) : notifications.map((notification) => (
          <div 
            key={notification.id} 
            className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800"
          >
            <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center border ${notification.bgClass} ${notification.colorClass}`}>
              {notification.icon}
            </div>
            <div>
              <p className={`text-sm font-bold ${notification.colorClass} mb-0.5`}>
                {notification.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
