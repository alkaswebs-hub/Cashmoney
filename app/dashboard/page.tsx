'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Gift,
  Coins, Clock, ArrowRight,
} from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const earningsData = [
  { day: 'Mon', value: 18500 }, { day: 'Tue', value: 22000 },
  { day: 'Wed', value: 19500 }, { day: 'Thu', value: 24850 },
  { day: 'Fri', value: 21000 }, { day: 'Sat', value: 26500 },
  { day: 'Sun', value: 24850 },
];

const allocationData = [
  { name: 'Active Investments', value: 180000, color: '#16C784' },
  { name: 'Withdrawable', value: 48500, color: '#FACC15' },
  { name: 'Referral Earnings', value: 20000, color: '#2DE7A4' },
];

const recentTxns = [
  { type: 'Daily Claim', amount: 24850, time: '2 hours ago', positive: true },
  { type: 'Deposit', amount: 50000, time: '5 hours ago', positive: true },
  { type: 'Referral Bonus', amount: 5000, time: '1 day ago', positive: true },
  { type: 'Withdrawal', amount: 20000, time: '2 days ago', positive: false },
];

const quickActions = [
  { href: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownToLine, color: 'from-brand-500 to-brand-600' },
  { href: '/dashboard/investments', label: 'Invest', icon: TrendingUp, color: 'from-gold-400 to-gold-600' },
  { href: '/dashboard/claim', label: 'Claim Daily', icon: Gift, color: 'from-brand-400 to-brand-500' },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: ArrowUpFromLine, color: 'from-brand-600 to-brand-700' },
];

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader title="Welcome back, Adebayo" subtitle="Here's your investment overview." />

      {/* Wallet card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass-strong rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-white/50 mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Total Wallet Balance
            </p>
            <p className="text-4xl sm:text-5xl font-display font-bold text-gradient-brand">₦248,500</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                <span className="text-sm text-brand-400">+₦24,850 today</span>
              </div>
              <span className="text-sm text-white/40">|</span>
              <span className="text-sm text-white/50">10% daily return</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-64">
            <div className="glass rounded-2xl p-3">
              <p className="text-xs text-white/40">Withdrawable</p>
              <p className="text-lg font-bold text-gold-400">₦48,500</p>
            </div>
            <div className="glass rounded-2xl p-3">
              <p className="text-xs text-white/40">Referral</p>
              <p className="text-lg font-bold text-brand-400">₦20,000</p>
            </div>
            <div className="glass rounded-2xl p-3">
              <p className="text-xs text-white/40">Pending</p>
              <p className="text-lg font-bold text-white/70">₦0</p>
            </div>
            <div className="glass rounded-2xl p-3">
              <p className="text-xs text-white/40">Today</p>
              <p className="text-lg font-bold text-brand-400">₦24,850</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {quickActions.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={a.href}>
              <GlassCard className="p-4 hover:-translate-y-1 transition-transform group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3`}>
                  <a.icon className="w-5 h-5 text-ink-900" />
                </div>
                <p className="text-sm font-medium flex items-center gap-1">
                  {a.label} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold">Earnings This Week</h3>
                <p className="text-xs text-white/40">Daily claimed earnings</p>
              </div>
              <span className="text-sm text-brand-400 font-medium">+18.5%</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16C784" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#0A0F24', border: '1px solid rgba(22,199,132,0.3)', borderRadius: 12 }} formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Earnings']} />
                  <Area type="monotone" dataKey="value" stroke="#16C784" strokeWidth={2} fill="url(#earn)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 h-full">
            <h3 className="font-display font-semibold mb-4">Portfolio Allocation</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocationData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {allocationData.map((d) => (
                      <Cell key={d.name} fill={d.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0A0F24', border: '1px solid rgba(22,199,132,0.3)', borderRadius: 12 }} formatter={(v: number) => `₦${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {allocationData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-white/60">{d.name}</span>
                  </span>
                  <span className="font-medium">₦{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Active investment + recent transactions */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard variant="brand" className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Coins className="w-5 h-5 text-brand-400" /> Active Investment
              </h3>
              <Link href="/dashboard/active-investments" className="text-xs text-brand-400 hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">Invested Amount</p>
                  <p className="text-2xl font-bold">₦180,000</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/50">Daily Earning</p>
                  <p className="text-2xl font-bold text-brand-400">₦18,000</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/50 mb-2">
                  <span>Day 78 of 120</span>
                  <span>65% complete</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-brand-500 to-gold-500 rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Clock className="w-3.5 h-3.5" />
                Next claim available in 18 hours
              </div>
              <Link href="/dashboard/claim" className="block w-full text-center bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-xl hover:shadow-glow transition-all">
                Claim Daily Earnings
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Recent Transactions</h3>
              <Link href="/dashboard/transactions" className="text-xs text-brand-400 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentTxns.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.positive ? 'bg-brand-500/15' : 'bg-red-500/15'}`}>
                      {t.positive ? <ArrowDownToLine className="w-4 h-4 text-brand-400" /> : <ArrowUpFromLine className="w-4 h-4 text-red-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.type}</p>
                      <p className="text-xs text-white/40">{t.time}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${t.positive ? 'text-brand-400' : 'text-red-400'}`}>
                    {t.positive ? '+' : '-'}₦{t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
