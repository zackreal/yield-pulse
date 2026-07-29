import React from 'react';

const HEATMAP_DATA = [
const HEATMAP_DATA = [
  {
    category: "Produk Susu Segar",
    "> 7 Hari": { value: 42500000, status: "safe" },
    "3-7 Hari": { value: 8200000, status: "warning" },
    "<= 2 Hari": { value: 2400000, status: "critical" },
  },
  {
    category: "Roti & Daging",
    "> 7 Hari": { value: 18000000, status: "safe" },
    "3-7 Hari": { value: 4100000, status: "warning" },
    "<= 2 Hari": { value: 1100000, status: "critical" },
  },
  {
    category: "Sayur & Buah",
    "> 7 Hari": { value: 12000000, status: "safe" },
    "3-7 Hari": { value: 6800000, status: "warning" },
    "<= 2 Hari": { value: 3800000, status: "critical" },
  }
];

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}M`;
  }
  return `Rp ${(value / 1000).toFixed(1)}K`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
    case 'warning':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
    case 'critical':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer transition';
    default:
      return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800';
  }
};

export function ExpiryRiskHeatmap() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
        Heatmap Risiko Kedaluwarsa
      </h3>

      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3 text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">Kategori</th>
              <th className="py-2 px-3 text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800 text-center">{"> 7 Hari"}</th>
              <th className="py-2 px-3 text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800 text-center">{"3-7 Hari"}</th>
              <th className="py-2 px-3 text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800 text-center">{"<= 2 Hari"}</th>
            </tr>
          </thead>
          <tbody>
            {HEATMAP_DATA.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                <td className="py-3 px-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {row.category}
                </td>
                
                <td className="py-2 px-2">
                  <div className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center h-full ${getStatusColor(row["> 7 Hari"].status)}`}>
                    <span className="font-mono font-semibold">{formatCurrency(row["> 7 Hari"].value)}</span>
                  </div>
                </td>
                
                <td className="py-2 px-2">
                  <div className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center h-full ${getStatusColor(row["3-7 Hari"].status)}`}>
                    <span className="font-mono font-semibold">{formatCurrency(row["3-7 Hari"].value)}</span>
                  </div>
                </td>
                
                <td className="py-2 px-2">
                  <div className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center h-full ${getStatusColor(row["<= 2 Hari"].status)}`}>
                    <span className="font-mono font-semibold">{formatCurrency(row["<= 2 Hari"].value)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}