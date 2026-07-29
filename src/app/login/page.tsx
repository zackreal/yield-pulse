'use client';

import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Fingerprint, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="flex min-h-screen bg-[#030712] text-slate-200 selection:bg-indigo-500/30 overflow-hidden relative -m-4 md:-m-6 lg:-m-8">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-indigo-900/40 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-violet-900/40 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="flex w-full z-10">
        {/* Left Panel - Visual Hero */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Yield Pulse</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full" />
            <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 leading-tight mb-6">
              Autonomous <br/> Pricing Intelligence
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Enterprise-grade revenue management powered by Bellman Dynamic Programming & Monte Carlo risk engine.
            </p>

            <div className="mt-12 flex gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 border-[#030712] bg-slate-800 flex items-center justify-center z-[${5-i}]`}>
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full rounded-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex text-amber-400 text-sm">
                  {'★'.repeat(5)}
                </div>
                <span className="text-sm text-slate-400">Trusted by 500+ enterprises</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-slate-500 font-medium"
          >
            &copy; 2026 Yield Pulse Inc. All rights reserved.
          </motion.div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md relative"
          >
            {/* Glassmorphic Card */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-slate-800/50 shadow-2xl -z-10" />
            
            <div className="p-8 sm:p-12">
              <div className="mb-10 text-center lg:text-left">
                <div className="lg:hidden w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-400/30 mx-auto mb-6">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Welcome back</h2>
                <p className="text-slate-400 text-sm">Sign in to access your command center.</p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Work Email</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                      <div className="relative flex items-center bg-slate-900/80 rounded-xl border border-slate-700/50 overflow-hidden">
                        <Mail className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent text-white pl-12 pr-4 py-3.5 focus:outline-none placeholder:text-slate-600 font-medium"
                          placeholder="admin@enterprise.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-sm font-medium text-slate-300">Password</label>
                      <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Forgot password?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                      <div className="relative flex items-center bg-slate-900/80 rounded-xl border border-slate-700/50 overflow-hidden">
                        <Lock className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-transparent text-white pl-12 pr-4 py-3.5 focus:outline-none placeholder:text-slate-600 font-medium"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {errorMsg}
                  </motion.div>
                )}

                <div className="flex items-center ml-1">
                  <div className="relative flex items-center cursor-pointer">
                    <input type="checkbox" id="remember" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-slate-600 rounded bg-transparent peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor="remember" className="ml-3 text-sm text-slate-400 cursor-pointer select-none">Remember me for 7 days</label>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full group overflow-hidden rounded-xl disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform duration-300 group-hover:scale-[1.02]" />
                  <div className="relative px-6 py-4 flex items-center justify-center gap-3">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-white font-semibold text-sm uppercase tracking-wider">Sign In to Workspace</span>
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-800/50"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-widest font-semibold">or</span>
                  <div className="flex-grow border-t border-slate-800/50"></div>
                </div>

                <button 
                  type="button" 
                  className="w-full bg-transparent hover:bg-slate-800/50 text-white border border-slate-700/50 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 group"
                >
                  <Fingerprint className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-sm font-semibold">Biometric Login</span>
                </button>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-800/50 bg-slate-900/20 text-center rounded-b-3xl">
              <p className="text-sm text-slate-400">
                Don't have an enterprise account?{' '}
                <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Request access</a>
              </p>
            </div>
          </motion.div>

          {/* Status Indicator */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3 px-4 py-2 bg-slate-900/40 backdrop-blur-md rounded-full border border-slate-800/50 shadow-lg hidden sm:flex">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}