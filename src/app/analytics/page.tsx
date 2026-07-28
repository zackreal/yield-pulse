"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Cpu, 
  PlayCircle, 
  ArrowRight, 
  Layers, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsHubPage() {
  return (
    <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-semibold mb-2">
            <BarChart3 className="w-4 h-4" /> Intelligence & Mathematical Modeling Center
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Pusat Analisis & Prediksi Mesin
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
            YieldPulse menggabungkan tiga algoritma matematika canggih untuk memberikan rekomendasi harga otomatis tanpa guesswork.
          </p>
        </div>
      </div>

      {/* Intuitive Guide Section for Users */}
      <div className="bg-indigo-500/5 border border-indigo-500/15 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cara Memahami Modul Analitik Kami (Panduan Ringkas)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              1. **Matriks Diskon Pintar**: Menjawab *"Berapa harga terbaik hari ini berdasarkan sisa masa kedaluwarsa?"* <br />
              2. **Efek Diskon Silang**: Menjawab *"Jika produk A didiskon, bagaimana dampaknya ke produk B?"* <br />
              3. **Simulasi Keuntungan**: Menjawab *"Bagaimana proyeksi keuntungan kita dalam 30 hari ke depan?"*
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 3 Main Analytics Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Bellman Policy Matrix */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-indigo-500 uppercase font-bold tracking-wider mb-1">Hitung Otomatis</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Matriks Diskon Pintar</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Sistem yang merekomendasikan harga terbaik saat ini agar produk laku sebelum masa kedaluwarsa habis tanpa perlu menebak-nebak.
            </p>
          </div>

          <Link 
            href="/analytics/bellman"
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 group"
          >
            Buka Matriks Diskon
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Module 2: Cross-Price Elasticity */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-2xl flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-cyan-500 uppercase font-bold tracking-wider mb-1">Analisa Pasar</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Efek Diskon Silang</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Menghitung apakah memberikan diskon pada suatu produk akan membuat produk lainnya jadi tidak laku, sehingga Anda tidak salah langkah.
            </p>
          </div>

          <Link 
            href="/analytics/elasticity"
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 group"
          >
            Buka Analisa Diskon Silang
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Module 3: Monte Carlo Simulator */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-5">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-purple-500 uppercase font-bold tracking-wider mb-1">Prediksi Pintar</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Simulasi Keuntungan</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Menebak apa yang akan terjadi pada omzet Anda jika diskon diterapkan, untuk memastikan Anda tetap untung di masa depan.
            </p>
          </div>

          <Link 
            href="/analytics/simulator"
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 group"
          >
            Buka Simulasi Keuntungan
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Summary KPI Performance */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-500" /> Kinerja Sistem Bulan Ini
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-semibold mb-1">Akurasi Prediksi</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">94.8%</div>
            <div className="text-xs text-emerald-500 font-semibold mt-1">↑ +2.1% dari bulan lalu</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-semibold mb-1">Penurunan Kerugian (Limbah)</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">-42.5%</div>
            <div className="text-xs text-emerald-500 font-semibold mt-1">Sangat Efisien</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-semibold mb-1">Penyelamatan Aset</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">81.2%</div>
            <div className="text-xs text-purple-400 font-semibold mt-1">Sangat Tinggi</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-semibold mb-1">Kecepatan Respon Sistem</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">0.8 ms</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Sangat Cepat & Responsif</div>
          </div>
        </div>
      </div>
    </div>
  );
}
