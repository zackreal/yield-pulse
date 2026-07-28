'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'voxel-grid-3d',
    title: '3D Spatial Inventory Grid',
    description: 'Visualisasi rak gudang interaktif. Warna kubus menunjukkan tingkat krisis masa kadaluarsa batch.',
    placement: 'bottom',
  },
  {
    targetId: 'bellman-policy-matrix',
    title: 'Optimal Pricing Policy Map',
    description: 'Hasil kalkulasi Bellman Dynamic Programming. Menampilkan harga terbaik untuk setiap kombinasi stok & sisa hari.',
    placement: 'right',
  },
  {
    targetId: 'monte-carlo-simulator',
    title: 'Monte Carlo Profit Simulator',
    description: 'Geser slider parameter untuk mensimulasikan 10.000 skenario statistik dalam hitungan milidetik.',
    placement: 'left',
  },
];

export default function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Cek apakah user sudah pernah menyelesaikan onboarding
    const hasCompleted = localStorage.getItem('yieldpulse_onboarded');
    if (!hasCompleted) {
      setIsActive(true);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStep];
    const element = document.getElementById(step.targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTargetRect(element.getBoundingClientRect());
    } else {
        // Fallback if element not found, just center on screen roughly
        setTargetRect({
            top: window.innerHeight / 2 - 100,
            left: window.innerWidth / 2 - 150,
            width: 300,
            height: 200,
            bottom: window.innerHeight / 2 + 100,
            right: window.innerWidth / 2 + 150,
            x: window.innerWidth / 2 - 150,
            y: window.innerHeight / 2 - 100,
            toJSON: () => {}
        });
    }
  }, [isActive, currentStep]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem('yieldpulse_onboarded', 'true');
  };

  if (!isActive || !targetRect) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Layer Dimmed Overlay dengan lubang cutout (Spotlight effect) */}
        <svg className="w-full h-full absolute inset-0 pointer-events-auto">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.75)"
            mask="url(#spotlight-mask)"
            onClick={handleComplete}
          />
        </svg>

        {/* Ring Pendaran pada Target Selector */}
        <div
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
          className="absolute border-2 border-indigo-500 dark:border-indigo-400 rounded-xl pointer-events-none shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300"
        />

        {/* Tooltip Popover Box */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            top: targetRect.bottom + 20,
            left: Math.max(20, Math.min(targetRect.left, window.innerWidth - 340)),
          }}
          className="absolute z-50 pointer-events-auto w-80 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Petunjuk {currentStep + 1} dari {TOUR_STEPS.length}
            </span>
            <button
              onClick={handleComplete}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Lewati
            </button>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            {step.title}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            {step.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                      : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl transition-all shadow-md active:scale-95"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Selesai' : 'Lanjut'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}