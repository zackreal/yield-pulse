'use client';

import { motion } from 'framer-motion';
import { Terminal, Download, FileJson, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const DUMMY_LOGS = [
  { id: 'log-889', time: '21:45:02.12', category: 'SECURITY', action: 'HMAC_VERIFY_OK', user: '192.168.1.4', status: '200 OK', color: 'emerald' },
  { id: 'log-888', time: '21:44:18.04', category: 'AUDIT', action: 'PRICE_OVERRIDE', user: 'usr_alex88', status: '200 OK', color: 'indigo' },
  { id: 'log-887', time: '21:40:00.89', category: 'SECURITY', action: 'GUARDRAIL_BLOCKED', user: '10.0.4.12', status: '403 DENY', color: 'rose' },
  { id: 'log-886', time: '21:35:10.01', category: 'MATH_ENGINE', action: 'BELLMAN_RECOMPUTE', user: 'Worker-01', status: '200 OK', color: 'cyan' },
  { id: 'log-885', time: '21:30:45.55', category: 'TELEMETRY', action: 'REDIS_CACHE_WARMUP', user: 'System', status: '200 OK', color: 'slate' },
  { id: 'log-884', time: '21:28:11.22', category: 'SALES_LOG', action: 'POS_TRANSACTION', user: 'pos_register_3', status: '201 CREATED', color: 'emerald' },
  { id: 'log-883', time: '21:15:09.33', category: 'SECURITY', action: 'RATE_LIMIT_EXCEEDED', user: '45.33.12.1', status: '429 TOO_MANY', color: 'rose' },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case 'emerald': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    case 'indigo': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20';
    case 'rose': return 'bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
    case 'cyan': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20';
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
  }
};

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState('ALL LOGS');

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50 dark:bg-[#0B0F19]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Unified Audit Trail</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Centralized Telemetry, Sales & Security Logs</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Parquet / CSV
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[700px]">
          
          {/* Header Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19]">
            {['ALL LOGS', 'AUDIT TRAIL', 'SALES LOGS', 'SECURITY', 'TELEMETRY'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search payload..." 
                  className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Severity:</span>
                <select className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none">
                  <option>ALL</option>
                  <option>INFO</option>
                  <option>WARN</option>
                  <option>CRITICAL</option>
                </select>
              </div>
            </div>
            <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Terminal / Log Stream */}
          <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#0B0F19] p-4">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-50 dark:bg-[#0B0F19]">
                <div className="col-span-2">TIMESTAMP</div>
                <div className="col-span-2">CATEGORY</div>
                <div className="col-span-3">ACTION</div>
                <div className="col-span-2">USER / IP</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-1 text-center">DETAILS</div>
              </div>

              <div className="space-y-1 mt-2">
                {DUMMY_LOGS.map((log) => (
                  <div key={log.id} className="grid grid-cols-12 gap-4 px-4 py-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 items-center font-mono text-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                    <div className="col-span-2 text-slate-500 dark:text-slate-400">{log.time}</div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded border ${getColorClasses(log.color)}`}>
                        {log.category}
                      </span>
                    </div>
                    <div className="col-span-3 text-slate-700 dark:text-slate-300 font-semibold">{log.action}</div>
                    <div className="col-span-2 text-slate-500 dark:text-slate-400">{log.user}</div>
                    <div className={`col-span-2 font-bold ${log.status.includes('20') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {log.status}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100">
                        {log.action.includes('OVERRIDE') ? (
                          <><FileJson className="w-3.5 h-3.5" /> [Diff]</>
                        ) : (
                          <><Terminal className="w-3.5 h-3.5" /> [View]</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}