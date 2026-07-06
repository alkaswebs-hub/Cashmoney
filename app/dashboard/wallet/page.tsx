'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, Gift, Coins, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import Link from 'next/link';

const balances = [
  { label: 'Wallet Balance', value: 248500, icon: Wallet, color: 'text-brand-400', bg: 'bg-brand-500/15' },
  { label: 'Pending Deposits', value: 0, icon: Clock, color: 'text-gold-400', bg: 'bg-gold-500/15' },
  { label: 'Referral Earnings', value: 20000, icon: Gift, color: 'text-brand-400', bg: 'bg-brand-500/15' },
  { label: "Today's Earnings", value: 24850, icon: TrendingUp, color: 'text-brand-400', bg: 'bg-brand-500/15' },
  { label: 'Withdrawable Balance', value: 48500, icon: Coins, color: 'text-gold-400', bg: 'bg-gold-500/15' },
];

export default function WalletPage() {
  return (
    <div>
      <DashboardHeader title="My Wallet" subtitle="Manage your balances and funds." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass-strong rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm text-white/50 mb-2">Total Wallet Balance</p>
          <p className="text-4xl sm:text-5xl font-display font-bold text-gradient-brand">₦248,500</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/dashboard/deposit" className="bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold px-5 py-2.5 rounded-full text-sm hover:shadow-glow transition-all flex items-center gap-2">
              Add Funds <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard/withdraw" className="glass-strong px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-all">
              Withdraw
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard className="p-5 hover:-translate-y-1 transition-transform">
              <div className={`w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center mb-3`}>
                <b.icon className={`w-5 h-5 ${b.color}`} />
              </div>
              <p className="text-xs text-white/50">{b.label}</p>
              <p className="text-2xl font-display font-bold mt-1">₦{b.value.toLocaleString()}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
