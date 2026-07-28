"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Percent, 
  ShieldAlert, 
  Sparkles, 
  Plus, 
  ToggleLeft, 
  ToggleRight,
  HelpCircle
} from 'lucide-react';

interface PricingRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  category: string;
  active: boolean;
}

const initialRules: PricingRule[] = [
  {
    id: 'RULE-01',
    name: 'Aturan Perlindungan Expired Kritis',
    condition: 'Sisa Masa Kedaluwarsa ≤ 2 Hari DAN Stok > 30 Pcs',
    action: 'Diskon Otomatis 20% (Targetkan Velocity Penjualan 3x)',
    category: 'Dairy & Fresh Food',
    active: true
  },
  {
    id: 'RULE-02',
    name: 'Aturan Pemulihan Modal Akhir Pekan',
    condition: 'Hari = Sabtu/Minggu DAN Jam ≥ 18:00',
    action: 'Tingkatkan Responsivitas Diskon sebesar +5%',
    category: 'Bakery',
    active: true
  },
  {
    id: 'RULE-03',
    name: 'Batas Atas Harga (Price Ceiling)',
    condition: 'Permintaan Melonjak > 200%',
    action: 'Maksimum Kenaikan Harga +15% dari Harga Acuan',
    category: 'Semua Kategori',
    active: true
  }
];

export default function PricingRulesPage() {
  const [rules, setRules] = useState<PricingRule[]>(initialRules);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, active: !rule.active } : rule));
  };

  return (
    <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase font-bold mb-1">
              <Tag className="w-4 h-4" /> Dynamic Pricing Control Center
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Aturan & Strategi Harga Otomatis
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Tentukan batasan dan aturan bisnis yang harus dipatuhi oleh sistem saat menghitung penyesuaian harga.
            </p>
          </div>

          <button 
            onClick={() => alert('Fitur Tambah Aturan Baru Siap!')}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buat Aturan Baru
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 text-slate-300 text-sm">
        <HelpCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
        <div>
          <span className="font-bold text-white">Bagaimana Aturan Ini Bekerja?</span>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Sistem Bellman Engine akan selalu memprioritaskan aturan keselamatan bisnis di bawah ini sebelum merekomendasikan harga baru ke Kasir POS.
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <motion.div 
            key={rule.id}
            layout
            className={`p-6 rounded-3xl border transition-all ${
              rule.active 
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm' 
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                    {rule.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {rule.name}
                  </h3>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-lg font-medium">
                    {rule.category}
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono pt-2">
                  <span className="text-indigo-400 font-semibold">IF:</span> {rule.condition}
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-mono font-semibold">
                  <span className="text-emerald-400 font-semibold">THEN:</span> {rule.action}
                </div>
              </div>

              <button 
                onClick={() => toggleRule(rule.id)}
                className="flex items-center gap-2 text-xs font-bold transition self-end md:self-center"
              >
                {rule.active ? (
                  <>
                    <span className="text-emerald-500">Status: AKTIF</span>
                    <ToggleRight className="w-8 h-8 text-indigo-500" />
                  </>
                ) : (
                  <>
                    <span className="text-slate-500">Status: NONAKTIF</span>
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
