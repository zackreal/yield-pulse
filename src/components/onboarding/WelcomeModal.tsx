'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Coffee, Carrot } from 'lucide-react';

interface WelcomeModalProps {
  onComplete: () => void;
}

const PRESETS = [
  {
    id: 'retail',
    title: 'Retail & Grocery',
    description: 'Optimasi shelf-life & decay pricing untuk produk makanan kemasan.',
    icon: Store,
  },
  {
    id: 'fb',
    title: 'F&B & Fresh Produce',
    description: 'Diskon agresif untuk barang ber-umur simpan harian (roti, susu segar).',
    icon: Coffee,
  },
  {
    id: 'produce',
    title: 'Fresh Produce',
    description: 'Manajemen harga dinamis untuk sayur dan buah.',
    icon: Carrot,
  },
];

export default function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  useEffect(() => {
    const hasCompletedWelcome = localStorage.getItem('yieldpulse_welcome_seen');
    if (!hasCompletedWelcome) {
      setIsOpen(true);
    } else {
        // if already seen, just trigger onComplete so tour can start if needed
        onComplete();
    }
  }, [onComplete]);

  const handleStart = () => {
    if (!selectedPreset) return;
    localStorage.setItem('yieldpulse_welcome_seen', 'true');
    localStorage.setItem('yieldpulse_preset', selectedPreset);
    setIsOpen(false);
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Selamat datang di YieldPulse Enterprise
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl">
              Platform Revenue Management cerdas. Pilih preset industri Anda untuk menyesuaikan model algoritma Bellman DP.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`flex flex-col items-start p-5 rounded-2xl border transition-all text-left ${
                    selectedPreset === preset.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/50 bg-white dark:bg-slate-900'
                  }`}
                >
                  <preset.icon
                    className={`w-8 h-8 mb-4 ${
                      selectedPreset === preset.id
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleStart}
                disabled={!selectedPreset}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  selectedPreset
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25 active:scale-95'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                Mulai Guided Tour
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}