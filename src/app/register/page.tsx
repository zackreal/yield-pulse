'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Store, ShieldCheck, Mail, Lock, Building, DollarSign, UserCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    industry: 'Grocery',
    currency: 'IDR',
    role: 'Store Manager',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    } 

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Automatically redirect to login page upon success
      window.location.href = '/login';
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                  placeholder="Sarah Connor"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                  placeholder="sarah@enterprise.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              {/* Password Strength Meter */}
              <div className="flex gap-1 mt-2">
                <div className={`h-1.5 flex-1 rounded-full ${formData.password.length > 0 ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full ${formData.password.length > 5 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full ${formData.password.length > 8 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full ${formData.password.length > 12 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Enterprise / Store Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                  placeholder="FreshMart HQ"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Industry Category</label>
              <select 
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white appearance-none"
              >
                <option value="Grocery">Supermarket & Grocery</option>
                <option value="F&B">F&B / Bakery / Cafe</option>
                <option value="Retail">General Retail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Base Currency</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white appearance-none"
                >
                  <option value="IDR">IDR (Indonesian Rupiah)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select Initial Role</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'Super Admin', desc: 'Full access to all settings and guardrails.' },
                  { id: 'Store Manager', desc: 'Manage physical stock, inventory, and price overrides.' },
                  { id: 'Data Analyst', desc: 'Tune Bellman parameters and run Monte Carlo simulations.' }
                ].map((role) => (
                  <div 
                    key={role.id}
                    onClick={() => setFormData({...formData, role: role.id})}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.role === role.id 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.role === role.id ? 'border-indigo-600' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {formData.role === role.id && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                      </div>
                      <div>
                        <p className={`font-semibold ${formData.role === role.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>{role.id}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{role.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 flex items-start gap-3 mt-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                By creating this workspace, Bellman DP Engine and Cross-Elasticity matrix will be automatically initialized for your tenant.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 -m-4 md:-m-6 lg:-m-8">
      
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Setup Workspace</h1>
          <p className="text-slate-500 mt-2">Initialize your autonomous pricing engine in 3 steps.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  step >= i ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {i}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium uppercase tracking-wider ${
                  step >= i ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                }`}>
                  {i === 1 ? 'Account' : i === 2 ? 'Store' : 'Role'}
                </span>
              </div>
            ))}
            <div className="absolute left-8 right-8 top-[3.25rem] h-0.5 bg-slate-200 dark:bg-slate-800 z-0">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {errorMsg && (
              <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-sm mb-6 border border-rose-200 dark:border-rose-500/20 text-center">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    step === 1 
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-500/20 active:scale-95"
                >
                  {isLoading ? 'Processing...' : (step === 3 ? 'Create Workspace' : 'Continue')}
                  {!isLoading && step !== 3 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign in here</a>
        </p>
      </div>
    </div>
  );
}