"use client";

import React, { useState, useEffect } from 'react';
import { TopKPIStrip } from '@/components/dashboard/TopKPIStrip';
import { HeroDecisionPanel } from '@/components/dashboard/HeroDecisionPanel';
import { ExecutiveSummaryWidget } from '@/components/dashboard/ExecutiveSummaryWidget';
import { ExpiryRiskHeatmap } from '@/components/dashboard/ExpiryRiskHeatmap';
import { RevenueChartWidget } from '@/components/dashboard/RevenueChartWidget';
import dynamic from 'next/dynamic';

const InventoryGrid3DWidget = dynamic(
  () => import('@/components/dashboard/InventoryGrid3DWidget').then(mod => mod.InventoryGrid3DWidget),
  { ssr: false, loading: () => <div className="w-full h-[400px] flex items-center justify-center bg-slate-950 text-slate-500 border border-slate-800 rounded-2xl">Loading 3D Grid...</div> }
);

import { TimelineBellmanWidget } from '@/components/dashboard/TimelineBellmanWidget';
import { ScenarioSimulatorWidget } from '@/components/dashboard/ScenarioSimulatorWidget';
import { ApprovalWorkflowWidget } from '@/components/dashboard/ApprovalWorkflowWidget';
import { NotificationCenterWidget } from '@/components/dashboard/NotificationCenterWidget';
import { ModelMonitoringWidget } from '@/components/dashboard/ModelMonitoringWidget';
import { ReportsWidget } from '@/components/dashboard/ReportsWidget';
import WelcomeModal from '@/components/onboarding/WelcomeModal';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import { BellmanExplanationModal } from '@/components/dashboard/BellmanExplanationModal';

export default function Home() {
  const [viewMode, setViewMode] = useState<'executive' | 'spatial'>('executive');
  const [showTour, setShowTour] = useState(false);
  const [showBellmanExplanation, setShowBellmanExplanation] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const isCashier = user?.role === 'POS_CASHIER';

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      {/* Mobile-Only Manager View (Tinder-style approval) */}
      <div className="md:hidden flex flex-col h-full bg-slate-900 text-white p-6 justify-center items-center">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="w-8 h-8 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Critical Batch</h2>
          <h1 className="text-3xl font-black text-white">Milk B204</h1>
          <p className="text-rose-400 font-bold mt-2 text-lg">2 Days Left</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl w-full max-w-sm border border-slate-700 shadow-2xl mb-8">
          <h3 className="text-center text-slate-400 font-bold mb-4 uppercase tracking-wider">Approve Markdown?</h3>
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span className="text-slate-400 line-through">Rp20.000</span>
            <span className="text-indigo-400">Rp16.500</span>
          </div>
          <div className="flex gap-4 mt-8">
            <button className="flex-1 py-4 rounded-2xl bg-slate-700 text-white font-bold text-lg active:scale-95 transition">No</button>
            <button className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 active:scale-95 transition">Yes</button>
          </div>
        </div>
      </div>

      {/* Desktop Enterprise Dashboard */}
      <div className="hidden md:block">
        {/* Live Ticker Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs font-mono sticky top-0 z-40">
        <div className="flex items-center gap-6 text-slate-400">
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            STATUS: AKTIF
          </span>
          <span>Transaksi: 1,240/jam</span>
          <span>Koneksi: Stabil ({"<1ms"})</span>
          <span>AI Diskon: Aktif</span>
        </div>
        <div className="text-slate-300 font-semibold tracking-wider flex gap-6">
          <span>SISTEM: <span className="text-emerald-400">Optimal</span></span>
          <span>TOTAL PENYELAMATAN ASET: <span className="text-emerald-400">Rp 151.800.000</span></span>
        </div>
      </div>

      <WelcomeModal onComplete={() => setShowTour(true)} />
      {showTour && <OnboardingTour />}
      {showBellmanExplanation && <BellmanExplanationModal onClose={() => setShowBellmanExplanation(false)} />}

      <main className="p-4 lg:p-6 max-w-[1920px] mx-auto space-y-6">
        {/* Dashboard Header & View Switcher */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Pusat Kendali YieldPulse
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sistem Rekomendasi Harga & Penjualan Cerdas
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-1 rounded-xl flex gap-1 border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setViewMode('executive')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${
                viewMode === 'executive'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/50'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              📊 Tampilan Laporan
            </button>
            <button
              onClick={() => setViewMode('spatial')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${
                viewMode === 'spatial'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/50'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              🧊 Tampilan Rak Toko
            </button>
          </div>
        </div>

        {viewMode === 'executive' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Row 1: KPI Strip */}
            <TopKPIStrip />

            {/* Row 2: Hero Decision & Executive Summary */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <HeroDecisionPanel 
                  onWhyClick={() => setShowBellmanExplanation(true)} 
                  onSimulateClick={() => alert('Opening full simulator...')}
                  onApproveClick={() => alert('Markdown approved and synced to POS!')}
                />
              </div>
              <div className="xl:col-span-1">
                <ExecutiveSummaryWidget />
              </div>
            </div>

            {/* Row 3: Grid for widgets based on Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <TimelineBellmanWidget />
              {!isCashier && (
                <>
                  <ScenarioSimulatorWidget />
                  <ApprovalWorkflowWidget />
                </>
              )}
              <NotificationCenterWidget />
            </div>

            {/* Row 4 & 5: Analytics and Monitoring (Hidden for Cashier) */}
            {!isCashier && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <RevenueChartWidget />
                  </div>
                  <div className="xl:col-span-1 flex flex-col gap-6">
                    <div className="flex-1"><ExpiryRiskHeatmap /></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ModelMonitoringWidget />
                  <ReportsWidget />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 3D Spatial Grid View */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Sidebar (Catalog & Status) */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Catalog & Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fresh Dairy</span>
                      <span className="text-xs bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 px-2.5 py-1 rounded-full font-bold">High Risk</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Bakery & Meat</span>
                      <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 px-2.5 py-1 rounded-full font-bold">Warning</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Produce/Fruit</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold">Optimal</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Quick Metrics</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Total Risk Exposure</div>
                      <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">Rp 7.300.000</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Active Flash Sales</div>
                      <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">14 Batches</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Main Canvas (3D Voxel Grid) */}
              <div className="xl:col-span-2 h-[600px] xl:h-auto bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative shadow-inner">
                <InventoryGrid3DWidget />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl text-slate-200 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Optimal
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></span> Warning
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)] animate-pulse"></span> Critical
                  </div>
                </div>
              </div>

              {/* Right Sidebar (Live Sales Feed & Bellman) */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm h-full flex flex-col">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Sales Feed
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {[
                      { time: '21:40', batch: 'BATCH-1021', action: 'Sold 2 pcs', price: 'Rp 14.000', type: 'sale' },
                      { time: '21:39', batch: 'BATCH-1015', action: 'Markdown applied', price: 'Rp 18.000', type: 'system' },
                      { time: '21:35', batch: 'BATCH-1008', action: 'Sold 5 pcs', price: 'Rp 20.000', type: 'sale' },
                      { time: '21:31', batch: 'BATCH-1021', action: 'Critical Alert', price: 'Triggered', type: 'alert' },
                      { time: '21:28', batch: 'BATCH-1012', action: 'Sold 1 pc', price: 'Rp 20.000', type: 'sale' },
                    ].map((log, i) => (
                      <div key={i} className={`flex flex-col p-3 rounded-xl border ${
                        log.type === 'alert' ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50' : 
                        log.type === 'system' ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50' :
                        'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/50'
                      }`}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400">{log.time}</span>
                          <span className={`text-xs font-mono font-bold ${
                            log.type === 'alert' ? 'text-rose-600 dark:text-rose-400' :
                            log.type === 'system' ? 'text-indigo-600 dark:text-indigo-400' :
                            'text-slate-700 dark:text-slate-300'
                          }`}>{log.batch}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{log.action}</span>
                          <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">{log.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm active:scale-95">
                    View Full Audit Trail
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}