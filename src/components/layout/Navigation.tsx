"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PackageSearch, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown,
  User,
  LogOut,
  Tag
} from 'lucide-react';
import Link from 'next/link';

export function Navigation() {
  const pathname = usePathname();
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState<{ email: string; role: string; workspaceName: string; } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/v1/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  // Do not render navigation on public auth pages or POS page
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/pos')) {
    return null;
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 flex justify-center pt-4 px-4 pb-4 pointer-events-none transition-all duration-300">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className={`pointer-events-auto flex items-center justify-between px-4 py-2.5 mx-auto max-w-[1920px] w-full lg:w-[90%] transition-all duration-500 rounded-full border ${
          scrolled 
            ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-white/40 dark:border-slate-700/50' 
            : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg shadow-sm border-white/20 dark:border-slate-800/50'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-6">
          <Link href={user?.role === 'POS_CASHIER' ? '/pos' : '/'} className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-black text-xs tracking-tighter">YP</span>
            </div>
            <span className="font-bold tracking-tight text-slate-900 dark:text-white text-base">
              YieldPulse
            </span>
          </Link>
          
          {/* Main Navigation Links */}
          {user?.role !== 'POS_CASHIER' && (
            <nav className="hidden lg:flex items-center gap-1.5 p-1">
              <NavItem href="/" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active={pathname === '/'} />
              <NavItem href="/inventory" icon={<PackageSearch className="w-4 h-4" />} label="Inventaris" active={pathname === '/inventory'} />
            
            {/* Analytics Dropdown */}
            <div className="relative" onMouseEnter={() => setIsAnalyticsOpen(true)} onMouseLeave={() => setIsAnalyticsOpen(false)}>
              <button 
                className={`px-3 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all duration-300 ${
                  pathname.startsWith('/analytics') 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analitik Pintar
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isAnalyticsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isAnalyticsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden py-2"
                  >
                    <DropdownItem href="/analytics" label="Ringkasan Analitik" />
                    <DropdownItem href="/analytics/bellman" label="Matriks Diskon Pintar" />
                    <DropdownItem href="/analytics/elasticity" label="Efek Diskon Silang" />
                    <DropdownItem href="/analytics/simulator" label="Simulasi Keuntungan" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

              {user?.role === 'SUPER_ADMIN' && (
                <NavItem href="/admin/users" icon={<User className="w-4 h-4" />} label="Pengguna" active={pathname === '/admin/users'} />
              )}
              <NavItem href="/settings" icon={<Settings className="w-4 h-4" />} label="Pengaturan" active={pathname === '/settings'} />
            </nav>
          )}
        </div>

        {/* Right Section (Search & Profile) */}
        <div className="flex items-center gap-3">
          <div className="relative hidden xl:block group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="w-56 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-500"
            />
          </div>

          <button className="relative p-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse"></span>
          </button>

          <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden">
              <span className="text-sm font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">AD</span>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden py-2"
                >
                  <div className="px-5 py-3 border-b border-slate-100/50 dark:border-slate-700/50">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {user?.role?.replace('_', ' ') || 'Guest'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'Not logged in'}</p>
                  </div>
                  <div className="py-2">
                    <DropdownItem icon={<User className="w-4 h-4" />} href="/profile" label="Profil Saya" />
                    <DropdownItem icon={<Settings className="w-4 h-4" />} href="/settings" label="Pengaturan Akun" />
                  </div>
                  <div className="border-t border-slate-100/50 dark:border-slate-700/50 py-2">
                    <button 
                      onClick={async () => {
                        try {
                          await fetch('/api/v1/auth/logout', { method: 'POST' });
                          window.location.href = '/login';
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all duration-300 ${
        active 
          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20' 
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-transparent'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function DropdownItem({ href, label, icon }: { href: string, label: string, icon?: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      {icon && <span className="text-slate-400">{icon}</span>}
      {label}
    </Link>
  );
}
