import React from 'react';
import { BellRing, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function NotificationCenterWidget() {
  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Milk B204',
      message: 'Expires tomorrow. Potential Loss: Rp280.000',
      icon: <AlertCircle className="w-4 h-4" />,
      colorClass: 'text-rose-600 dark:text-rose-400',
      bgClass: 'bg-rose-100 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Bread A109',
      message: 'Markdown overdue',
      icon: <ShieldAlert className="w-4 h-4" />,
      colorClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900',
    },
    {
      id: 3,
      type: 'success',
      title: 'Frozen Chicken',
      message: 'Safe / Optimal',
      icon: <CheckCircle2 className="w-4 h-4" />,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900',
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider flex items-center gap-2">
        <BellRing className="w-5 h-5 text-indigo-500" />
        Notification Center
      </h3>

      <div className="flex-1 space-y-3">
        {notifications.map((notification) => (
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
