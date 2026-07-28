import { LayoutDashboard, Package, Tag, Activity, Settings, Bell, Search, User, Box } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-6 gap-8">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          YIELDPULSE
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 transition">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/inventory" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 transition">
            <Package className="w-4 h-4" />
            Inventory
          </Link>
          <Link href="/analytics/bellman" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 transition">
            <Tag className="w-4 h-4" />
            Pricing
          </Link>
          <Link href="/analytics/simulator" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 transition">
            <Activity className="w-4 h-4" />
            Simulation
          </Link>
          <Link href="/analytics/elasticity" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 transition">
            <Activity className="w-4 h-4" />
            Analytics
          </Link>
          <Link href="/logs" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 transition">
            <Activity className="w-4 h-4" />
            Logs
          </Link>
          <Link href="/settings" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 transition">
            <Settings className="w-4 h-4" />
            Config
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">

          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute 0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
          </button>
          <button className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}