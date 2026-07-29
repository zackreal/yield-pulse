import React from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';

export function ReportsWidget() {
  const reports = [
    { title: 'Laporan Limbah Mingguan', format: 'PDF', date: '7 Hari Terakhir' },
    { title: 'Pendapatan Bulanan', format: 'Excel', date: 'Juli 2026' },
    { title: 'Kinerja Sistem Bellman', format: 'PDF', date: 'Kuartal 3 2026' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-500" />
        Laporan Cepat
      </h3>

      <div className="flex-1 space-y-3">
        {reports.map((report, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                {report.format === 'PDF' ? <FileText className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {report.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {report.date}
                </p>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
        Lihat Semua Laporan &rarr;
      </button>
    </div>
  );
}
