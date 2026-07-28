"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Sliders, 
  Server, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const [gamma, setGamma] = useState('0.95');
  const [floorPricePct, setFloorPricePct] = useState('60');
  const [posWebhookUrl, setPosWebhookUrl] = useState('https://pos.enterprise-store.com/v1/sync');
  const [autoApproval, setAutoApproval] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase font-bold mb-1">
            <Settings className="w-4 h-4" /> System Configuration & Integration
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pengaturan Parameter & Keamanan Algoritma
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Atur batas toleransi risiko, parameter matematika Bellman Engine, dan koneksi POS Kasir.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Simpan Pengaturan
        </button>
      </div>

      {savedSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold"
        >
          <CheckCircle2 className="w-5 h-5" /> Pengaturan berhasil disimpan dan disinkronkan ke Bellman Engine!
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Bellman Engine Guardrails */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-500" /> Parameter Keamanan Algoritma Bellman (ADP)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Faktor Diskon Masa Depan ($\gamma$)</span>
                <span className="text-indigo-500 font-mono font-bold">{gamma}</span>
              </label>
              <input 
                type="range" 
                min="0.80" 
                max="0.99" 
                step="0.01"
                value={gamma}
                onChange={(e) => setGamma(e.target.value)}
                className="w-full accent-indigo-600"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Makin tinggi nilainya (mendekati 0.99), perhitungan akan makin memperhitungkan keuntungan jangka panjang daripada potongan instan.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Floor Price Limit (Batas Minimum Harga)</span>
                <span className="text-rose-500 font-mono font-bold">{floorPricePct}% dari HPP</span>
              </label>
              <input 
                type="range" 
                min="40" 
                max="90" 
                step="5"
                value={floorPricePct}
                onChange={(e) => setFloorPricePct(e.target.value)}
                className="w-full accent-rose-600"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sistem tidak akan pernah memberikan diskon di bawah {floorPricePct}% dari modal dasar (HPP) untuk menjamin perlindungan margin dasar.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Otomatisasi Persetujuan Diskon (Auto-Approve)</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Izinkan sistem langsung mengirim diskon ke Kasir jika sisa hari kedaluwarsa ≤ 2 hari.</div>
            </div>
            <input 
              type="checkbox" 
              checked={autoApproval}
              onChange={(e) => setAutoApproval(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Section 2: Integration & Webhook POS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-500" /> Integrasi Sistem POS & Retail API
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                POS Webhook Sync URL
              </label>
              <input 
                type="url" 
                value={posWebhookUrl}
                onChange={(e) => setPosWebhookUrl(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Alamat API tempat rekomendasi perubahan harga dikirim langsung ke mesin Kasir di toko.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="font-bold text-xs text-emerald-400">Status Koneksi POS Retail</div>
                  <div className="text-xs text-slate-400">Terhubung • Latency 0.4ms • 100% Uptime</div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => alert('Testing connection to POS... OK!')}
                className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-200 rounded-lg hover:bg-slate-700"
              >
                Tes Koneksi
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}