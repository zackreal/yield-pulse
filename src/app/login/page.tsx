'use client';

import { Eye, EyeOff, Lock, Mail, ArrowRight, Star } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      window.location.href = '/';
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-slate-50 p-4 sm:p-8 overflow-hidden -m-4 md:-m-6 lg:-m-8">
      
      {/* Background Aurora Elements (Inspired by LaundryKilo) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-blue-400/30 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px]"
        />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        
        {/* Left Side: Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-600/30">
            <span className="text-3xl font-bold tracking-tight">YP</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-950 leading-tight">
            Tingkatkan Skala <br/>
            Pricing Retail Anda.
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-md leading-relaxed">
            Yield Pulse hadir dengan sistem dynamic pricing berteknologi Bellman Equation dan analitik elastisitas kelas atas.
          </p>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-10 w-10 rounded-full border-2 border-slate-50 bg-slate-200 z-${5-i} shadow-sm overflow-hidden`}>
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">Dipercaya oleh 500+ enterprise</p>
              <div className="flex text-amber-400 mt-1 gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-current text-amber-400" />)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Auth Portal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="w-full max-w-[420px] mx-auto lg:mx-0 lg:ml-auto"
        >
          <div className="relative rounded-[2.5rem] bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-slate-200/50 border border-white">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <span className="font-bold tracking-tight">YP</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-950">Yield Pulse</span>
            </div>

            {/* Login Form */}
            <motion.form 
              onSubmit={handleLogin} 
              className="flex flex-col gap-5"
            >
              <h2 className="text-2xl font-bold text-slate-950 mb-2">Selamat Datang Kembali! 👋</h2>
              
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm text-slate-950 transition focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    placeholder="admin@enterprise.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                    Kata Sandi
                  </label>
                  <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Lupa Sandi?</button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-12 text-sm text-slate-950 transition focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              
              <p className="text-center text-[12px] text-slate-500 font-medium mt-2">
                Belum punya akun enterprise?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700">Daftar Baru</Link>
              </p>
            </motion.form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}