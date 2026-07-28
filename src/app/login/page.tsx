'use client';

import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Globe } from 'lucide-react';
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

      // Force a hard reload so middleware detects cookie right away
      window.location.href = '/';
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-[#0B0F19] -m-4 md:-m-6 lg:-m-8">
      {/* Left Panel: Visual Hero (Simulated 3D / Particles) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-lg px-8"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
            <span className="text-white font-bold text-2xl tracking-tighter">YP</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Autonomous Pricing Intelligence</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Enterprise-grade revenue management powered by Bellman Dynamic Programming & Monte Carlo risk engine.
          </p>
        </motion.div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#0B0F19] sm:bg-[#111827] border-l border-slate-800">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md px-8 py-12"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400">Sign in to access your command center.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    placeholder="admin@enterprise.com"
                  />
                </div>
              </div>

              {errorMsg && (
                  <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-sm mb-4 border border-rose-200 dark:border-rose-500/20">
                    {errorMsg}
                  </div>
                )}

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900" />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-400">Remember me for 7 days</label>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] flex items-center justify-center gap-2 group"
            >
              Sign In to Workspace
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">or continue with</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button type="button" className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3">
              <Globe className="w-5 h-5" />
              Enterprise SSO
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an enterprise account?{' '}
            <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Request access</a>
          </p>
          
          {/* Status Indicator */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">SYSTEM_STATUS: 100% OPERATIONAL</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}