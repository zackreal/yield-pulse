"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Briefcase, Mail, Key, Activity } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
      >
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-lg">
            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
              {user?.email?.[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">User Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your enterprise account settings and preferences.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Key className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">User ID</span>
                </div>
                <div className="font-mono text-xs text-slate-900 dark:text-white ml-7">{user?.id}</div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" /> Access & Roles
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">Workspace</span>
                </div>
                <div className="font-medium text-slate-900 dark:text-white ml-7">{user?.workspaceName || 'Enterprise HQ'}</div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/30">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">System Role</span>
                </div>
                <div className="font-mono font-bold text-indigo-700 dark:text-indigo-300 ml-7">{user?.role}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}