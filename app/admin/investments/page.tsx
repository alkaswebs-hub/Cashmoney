'use client';

import { motion } from 'framer-motion';
import { Coins, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';

const investments = [
  { user: 'Adebayo Okafor', plan: 'Growth', amount: 100000, daily: 10000, day: 78, status: 'active' },
  { user: 'Chioma Eze', plan: 'Starter', amount: 50000, daily: 5000, day: 120, status: 'completed' },
  { user: 'Ibrahim Musa', plan: 'Premium', amount: 30000, daily: 3000, day: 15, status: 'active' },
  { user: 'Tunde Oyelaran', plan: 'Growth', amount: 80000, daily: 8000, day: 45, status: 'active' },
];

export default function AdminInvestmentsPage() {
  return (
    <div>
      <DashboardHeader title="Investments" subtitle="All user investments across the platform." />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Investments', value: '3', icon: TrendingUp },
          { label: 'Total Invested', value: '₦260,000', icon: Coins },
          { label: 'Total Paid Out', value: '₦1,404,000', icon: TrendingUp },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center"><s.icon className="w-5 h-5 text-brand-400" /></div>
              <div><p className="text-xs text-white/40">{s.label}</p><p className="font-display font-bold">{s.value}</p></div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">User</th><th className="pb-3 font-medium">Plan</th><th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Daily</th><th className="pb-3 font-medium">Day</th><th className="pb-3 font-medium">Progress</th><th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv, i) => (
                <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-white/5 last:border-0">
                  <td className="py-4 text-sm font-medium">{inv.user}</td>
                  <td className="py-4 text-sm text-white/50">{inv.plan}</td>
                  <td className="py-4 font-semibold">₦{inv.amount.toLocaleString()}</td>
                  <td className="py-4 text-sm text-brand-400">₦{inv.daily.toLocaleString()}</td>
                  <td className="py-4 text-sm">{inv.day}/120</td>
                  <td className="py-4 w-32">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-gold-500 rounded-full" style={{ width: `${(inv.day / 120) * 100}%` }} />
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${inv.status === 'active' ? 'bg-brand-500/15 text-brand-400' : 'bg-white/10 text-white/50'}`}>{inv.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
