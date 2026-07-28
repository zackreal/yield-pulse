'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, ShieldAlert, ArrowLeft, MoreVertical, Edit2, CheckCircle2, AlertTriangle, ShieldCheck, User, X } from 'lucide-react';
import Link from 'next/link';

interface UserModel {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  STORE_MANAGER: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  DATA_ANALYST: 'bg-blue-100 text-blue-700 border-blue-200',
  POS_CASHIER: 'bg-amber-100 text-amber-700 border-amber-200',
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  STORE_MANAGER: 'Store Manager',
  DATA_ANALYST: 'Data Analyst',
  POS_CASHIER: 'Kasir POS',
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // Notification state
  const [notification, setNotification] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Gagal memuat data pengguna', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleRoleUpdate = async (id: string) => {
    if (!selectedRole) return;
    
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: selectedRole })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u.id === id ? { ...u, role: updatedUser.role } : u));
        setEditingId(null);
        showNotification('Peran pengguna berhasil diperbarui!', 'success');
      } else {
        showNotification('Gagal memperbarui peran.', 'error');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      showNotification('Terjadi kesalahan pada server.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-[76px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group text-slate-500 hover:text-slate-800 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-bold hidden sm:block">Dashboard</span>
            </Link>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg leading-tight">Manajemen Akses</h1>
                <p className="text-xs font-medium text-slate-500">Super Admin Control Panel</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Notification Toast */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-lg border ${
                notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span className="font-bold text-sm">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Daftar Pengguna Sistem</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Atur peran dan hak akses karyawan YieldPulse Mart.</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-indigo-100">
              <Users className="w-5 h-5" />
              <span>{users.length} Total</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-sm">
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Peran (Role)</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      <div className="animate-pulse flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 mb-2 opacity-20" />
                        <div className="font-medium">Memuat data pengguna...</div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center font-medium text-slate-500">
                      Tidak ada pengguna ditemukan.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.fullName}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Terdaftar {new Date(u.createdAt).toLocaleDateString('id-ID')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === u.id ? (
                          <div className="flex items-center gap-2">
                            <select 
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            >
                              {Object.keys(ROLE_LABELS).map(key => (
                                <option key={key} value={key}>{ROLE_LABELS[key]}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => handleRoleUpdate(u.id)}
                              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                              title="Simpan"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-200 transition-colors"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide ${ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-700'}`}>
                            {u.role === 'SUPER_ADMIN' ? <ShieldAlert className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                            {ROLE_LABELS[u.role] || u.role}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId !== u.id && (
                          <button 
                            onClick={() => {
                              setEditingId(u.id);
                              setSelectedRole(u.role);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Edit2 className="w-4 h-4" /> Ubah Akses
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
