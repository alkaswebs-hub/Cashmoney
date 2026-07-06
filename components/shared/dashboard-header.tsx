'use client';

import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';

export function DashboardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 glass rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-white/40" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-40 placeholder:text-white/30"
          />
        </div>
        <button className="relative glass rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500" />
        </button>
      </div>
    </motion.div>
  );
}
