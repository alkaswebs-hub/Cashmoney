'use client';

import { motion } from 'framer-motion';
import { Users, Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Gift } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const stats = [
  { label: 'Total Users', value: '48,200', change: '+12.5%', icon: Users, color: 'text-brand-400', bg: 'bg-brand-500/15' },
  { label: 'Total Deposits', value: '₦2.4B', change: '+8.2%', icon: ArrowDownToLine, color: 'text-gold-400', bg: 'bg-gold-500/15' },
  { label: 'Total Withdrawals', value: '₦1.8B', change: '+5.1%', icon: ArrowUpFromLine, color: 'text-brand-400', bg: 'bg-brand-500/15' },
  { label: 'Active Investments', value: '₦620M', change: '+15.3%', icon: TrendingUp, color: 'text-brand-400', bg: 'bg-brand-500/15' },
];

const depositData = [
  { month: 'Jan', deposits: 120, withdrawals: 80 },
  { month: 'Feb', deposits: 150, withdrawals: 95 },
  { month: 'Mar', deposits: 180, withdrawals: 110 },
  { month: 'Apr', deposits: 220, withdrawals: 140 },
  { month: 'May', deposits: 280, withdrawals: 170 },
  { month: 'Jun', deposits: 320, withdrawals: 200 },
  { month: 'Jul', deposits: 380, withdrawals: 240 },
];

const claimsData = [
  { day: 'Mon', claims: 420 }, { day: 'Tue', claims: 510 },
  { day: 'Wed', claims: 480 }, { day: 'Thu', claims: 590 },
  { day: 'Fri', claims: 620 }, { day: 'Sat', claims: 380 },
  { day: 'Sun', claims: 290 },
];

const pendingItems = [
  { type: 'Deposit', user: 'Adebayo O.', amount: 50000, ref: 'CM-A8K2P9' },
  { type: 'Withdrawal', user: 'Chioma E.', amount: 20000, ref: 'WD-X2K9P3' },
  { type: 'Deposit', user: 'Ibrahim M.', amount: 30000, ref: 'CM-B3M7X1' },
];

export default function AdminDashboard() {
  return (
    <div>
      <DashboardHeader title="Admin Dashboard" subtitle="Platform overview and metrics." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <span className="text-xs text-brand-400 font-medium">{s.change}</span>
              </div>
              <p className="text-xs text-white/40">{s.label}</p>
              <p className="text-2xl font-display font-bold mt-0.5">{s.value}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-4">Deposits vs Withdrawals</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depositData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0A0F24', border: '1px solid rgba(22,199,132,0.3)', borderRadius: 12 }} />
                  <Bar dataKey="deposits" fill="#16C784" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withdrawals" fill="#FACC15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-4">Daily Claims This Week</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={claimsData}>
                  <defs>
                    <linearGradient id="claims" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16C784" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0A0F24', border: '1px solid rgba(22,199,132,0.3)', borderRadius: 12 }} />
                  <Area type="monotone" dataKey="claims" stroke="#16C784" strokeWidth={2} fill="url(#claims)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard className="p-6">
          <h3 className="font-display font-semibold mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {pendingItems.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${p.type === 'Deposit' ? 'bg-brand-500/15' : 'bg-gold-500/15'}`}>
                    {p.type === 'Deposit' ? <ArrowDownToLine className="w-4 h-4 text-brand-400" /> : <ArrowUpFromLine className="w-4 h-4 text-gold-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.type} • {p.user}</p>
                    <p className="text-xs text-white/40 font-mono">{p.ref}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">₦{p.amount.toLocaleString()}</span>
                  <button className="bg-brand-500 text-ink-900 text-xs font-semibold px-3 py-1.5 rounded-full hover:shadow-glow transition-all">Approve</button>
                  <button className="bg-red-500/15 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-500/25 transition-colors">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
