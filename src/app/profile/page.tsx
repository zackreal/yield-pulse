"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Briefcase, Mail, Key, Save, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setFullName(data.fullName || '');
        setRole(data.role || '');
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      const payload: any = { id: user.id, fullName, role };
      if (password) payload.password = password;

      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");
      
      const updated = await res.json();
      setUser({ ...user, fullName: updated.fullName, role: updated.role });
      setPassword('');
      setSaveMessage('Profil berhasil diperbarui!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setSaveMessage('Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
      >
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-lg">
            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl uppercase">
              {user?.fullName ? user.fullName[0] : user?.email?.[0]}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {user?.fullName || 'User Profile'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your enterprise account settings and preferences.</p>

          {saveMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold ${saveMessage.includes('berhasil') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'}`}
            >
              {saveMessage.includes('berhasil') && <CheckCircle2 className="w-5 h-5" />}
              {saveMessage}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Personal Info
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">Email Address</span>
                </div>
                <div className="font-medium text-slate-900 dark:text-white ml-7">{user?.email}</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">Workspace</span>
                </div>
                <div className="font-medium text-slate-900 dark:text-white ml-7">{user?.workspaceName || 'Enterprise HQ'}</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-1">
                  <Key className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">User ID</span>
                </div>
                <div className="font-mono text-xs text-slate-900 dark:text-white ml-7">{user?.id}</div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" /> Edit Profile & Role
              </h3>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Nama Lengkap"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1">Peran Akses (Role)</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="STORE_MANAGER">Store Manager</option>
                    <option value="DATA_ANALYST">Data Analyst</option>
                    <option value="POS_CASHIER">POS Cashier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1">Ubah Sandi Baru (Opsional)</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Biarkan kosong jika tidak diubah"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full mt-4 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Simpan Perubahan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}