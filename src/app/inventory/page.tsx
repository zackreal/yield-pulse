"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowUpRight, 
  HelpCircle,
  RefreshCw,
  Zap,
  Info,
  X
} from 'lucide-react';

interface BatchItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  daysLeft: number;
  originalPrice: number;
  recommendedPrice: number;
  status: 'CRITICAL' | 'WARNING' | 'OPTIMAL';
  reason: string;
  expectedLossPrevention: number;
}

const mockBatches: BatchItem[] = [
  {
    id: 'BATCH-1021',
    name: 'Susu UHT Full Cream 1L',
    category: 'Dairy & Milk',
    stock: 120,
    daysLeft: 2,
    originalPrice: 20000,
    recommendedPrice: 16000,
    status: 'CRITICAL',
    reason: 'Sisa 2 hari sebelum expired. Diskon 20% menaikkan kecepatan penjualan hingga 3.4x lipat untuk mencegah kerugian total Rp 2.400.000.',
    expectedLossPrevention: 1920000
  },
  {
    id: 'BATCH-1015',
    name: 'Roti Tawar Premium',
    category: 'Bakery',
    stock: 45,
    daysLeft: 1,
    originalPrice: 15000,
    recommendedPrice: 10500,
    status: 'CRITICAL',
    reason: 'Sisa 1 hari sebelum expired. Diskon 30% memaksimalkan pemulihan modal dasar.',
    expectedLossPrevention: 472500
  },
  {
    id: 'BATCH-1008',
    name: 'Keju Cheddar Slice 200g',
    category: 'Dairy & Milk',
    stock: 80,
    daysLeft: 5,
    originalPrice: 24000,
    recommendedPrice: 21500,
    status: 'WARNING',
    reason: 'Laju penjualan sedikit melambat. Pemotongan harga ringan 10% menjaga velocity produk.',
    expectedLossPrevention: 1720000
  },
  {
    id: 'BATCH-1044',
    name: 'Daging Sapi Slice 500g',
    category: 'Meat & Seafood',
    stock: 30,
    daysLeft: 4,
    originalPrice: 75000,
    recommendedPrice: 65000,
    status: 'WARNING',
    reason: 'Stok terbatas, tapi mendekati batas segar 4 hari. Diskon moderat direkomendasikan.',
    expectedLossPrevention: 1950000
  },
  {
    id: 'BATCH-1052',
    name: 'Yogurt Drink Strawberry',
    category: 'Dairy & Milk',
    stock: 200,
    daysLeft: 14,
    originalPrice: 10000,
    recommendedPrice: 10000,
    status: 'OPTIMAL',
    reason: 'Penjualan stabil dan sisa masa simpan sangat aman (14 hari). Tidak diperlukan diskon.',
    expectedLossPrevention: 2000000
  },
  {
    id: 'BATCH-1060',
    name: 'Sosis Ayam Premium',
    category: 'Frozen Food',
    stock: 150,
    daysLeft: 22,
    originalPrice: 32000,
    recommendedPrice: 32000,
    status: 'OPTIMAL',
    reason: 'Masa kedaluwarsa panjang. Algoritma menyarankan pertahankan harga normal.',
    expectedLossPrevention: 4800000
  }
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'OPTIMAL'>('ALL');
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredBatches = mockBatches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          batch.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApplyMarkdown = (batch: BatchItem) => {
    setActionSuccess(`Diskon untuk ${batch.name} berhasil diterapkan & dikirim ke Kasir POS!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Banner & Simple Explanation for User */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-semibold mb-2">
              <Package className="w-4 h-4" /> Real-time Batch & Shelf Tracking
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Manajemen Stok & Penyelamatan Kedaluwarsa
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
              Sistem secara otomatis memantau tanggal kedaluwarsa setiap batch produk. 
              Sistem menyarankan diskon optimal secara dinamis agar produk habis terjual **sebelum kedaluwarsa** tanpa merusak keuntungan Anda.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Potensi Kerugian Dicegah</div>
              <div className="text-xl font-black text-emerald-400 font-mono">Rp 4.312.500</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold text-sm">{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Batch Aktif</span>
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">68 Batch</div>
          <div className="text-xs text-slate-500 mt-1">Tersebar di 4 Rak Utama</div>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-rose-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Risiko Tinggi (Kritis)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-500 font-mono">2 Batch</div>
          <div className="text-xs text-rose-400/80 mt-1">Sisa Hari ≤ 2 Hari (Butuh Diskon)</div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-amber-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Peringatan Sedang</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500 font-mono">2 Batch</div>
          <div className="text-xs text-amber-400/80 mt-1">Sisa Hari ≤ 5 Hari</div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Status Optimal</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-500 font-mono">64 Batch</div>
          <div className="text-xs text-emerald-400/80 mt-1">Penjualan Lancar & Aman</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama produk, batch ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Status Pills Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button 
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              statusFilter === 'ALL' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua Batch
          </button>
          <button 
            onClick={() => setStatusFilter('CRITICAL')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'CRITICAL' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' 
                : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Kritis (2)
          </button>
          <button 
            onClick={() => setStatusFilter('WARNING')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'WARNING' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20' 
                : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Warning (2)
          </button>
          <button 
            onClick={() => setStatusFilter('OPTIMAL')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'OPTIMAL' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Optimal (64)
          </button>
        </div>
      </div>

      {/* Main Interactive Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase">
                <th className="py-4 px-6 font-semibold">ID & Nama Produk</th>
                <th className="py-4 px-4 font-semibold">Kategori</th>
                <th className="py-4 px-4 font-semibold">Sisa Stok</th>
                <th className="py-4 px-4 font-semibold">Sisa Kedaluwarsa</th>
                <th className="py-4 px-4 font-semibold">Harga Normal</th>
                <th className="py-4 px-4 font-semibold">Rekomendasi Harga ($P^*$)</th>
                <th className="py-4 px-4 font-semibold">Status Risk</th>
                <th className="py-4 px-6 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {batch.name}
                    </div>
                    <div className="font-mono text-xs text-slate-400">{batch.id}</div>
                  </td>

                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                      {batch.category}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {batch.stock} pcs
                  </td>

                  <td className="py-4 px-4">
                    <div className={`font-mono font-bold text-sm flex items-center gap-1.5 ${
                      batch.daysLeft <= 2 ? 'text-rose-500 animate-pulse' :
                      batch.daysLeft <= 5 ? 'text-amber-500' :
                      'text-emerald-500'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {batch.daysLeft} Hari Lagi
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-400 line-through">
                    Rp {batch.originalPrice.toLocaleString()}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-base flex items-center gap-1">
                      Rp {batch.recommendedPrice.toLocaleString()}
                      {batch.recommendedPrice < batch.originalPrice && (
                        <span className="text-[10px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded font-sans font-bold">
                          -{Math.round(((batch.originalPrice - batch.recommendedPrice) / batch.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    {batch.status === 'CRITICAL' && (
                      <span className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" /> Kritis
                      </span>
                    )}
                    {batch.status === 'WARNING' && (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> Warning
                      </span>
                    )}
                    {batch.status === 'OPTIMAL' && (
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Optimal
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button 
                      onClick={() => setSelectedBatch(batch)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Mengapa?
                    </button>

                    {batch.recommendedPrice < batch.originalPrice && (
                      <button 
                        onClick={() => handleApplyMarkdown(batch)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-500/20 inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Diskon
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation Modal (Simplifying Complex Bellman Math to Plain Indonesian) */}
      <AnimatePresence>
        {selectedBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedBatch(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Penjelasan Rekomendasi Harga
                  </h3>
                  <p className="text-xs font-mono text-slate-400">{selectedBatch.id} • {selectedBatch.name}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl">
                  <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                    Logika Bisnis Sistem
                  </div>
                  <p className="leading-relaxed">
                    {selectedBatch.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-sans">Harga Normal</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white">Rp {selectedBatch.originalPrice.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-indigo-400 text-[10px] uppercase font-sans font-bold">Rekomendasi Sistem ($P^*$)</div>
                    <div className="text-base font-bold text-indigo-500">Rp {selectedBatch.recommendedPrice.toLocaleString()}</div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex justify-between items-center font-semibold">
                  <span>Proyeksi Modal Ter-penyelamatkan:</span>
                  <span className="font-mono text-sm font-bold">Rp {selectedBatch.expectedLossPrevention.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedBatch(null)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Tutup
                </button>
                {selectedBatch.recommendedPrice < selectedBatch.originalPrice && (
                  <button 
                    onClick={() => {
                      handleApplyMarkdown(selectedBatch);
                      setSelectedBatch(null);
                    }}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 transition"
                  >
                    Eksekusi Diskon Sekarang
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}