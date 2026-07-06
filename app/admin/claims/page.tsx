'use client';

import { motion } from 'framer-motion';
import { Gift, Check } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';

const claims = [
  { user: 'Adebayo Okafor', plan: 'Growth', amount: 18000, date: 'Jul 5, 2026 10:32 AM', status: 'paid' },
  { user: 'Chioma Eze', plan: 'Starter', amount: 5000, date: 'Jul 5, 2026 9:15 AM', status: 'paid' },
  { user: 'Ibrahim Musa', plan: 'Premium', amount: 3000, date: 'Jul 4, 2026 8:45 PM', status: 'paid' },
  { user: 'Tunde Oyelaran', plan: 'Growth', amount: 8000, date: 'Jul 4, 2026 3:20 PM', status: 'paid' },
  { user: 'Ngozi Obi', plan: 'Starter', amount: 1500, date: 'Jul 4, 2026 11:00 AM', status: 'paid' },
];

export default function AdminClaimsPage() {
  return (
    <div>
      <DashboardHeader title="Claims" subtitle="All daily earnings claims by users." />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Claims', value: '1,240' },
          { label: 'Today\'s Claims', value: '186' },
          { label: 'Total Claimed', value: '₦18.6M' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center"><Gift className="w-5 h-5 text-brand-400" /></div>
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
                <th className="pb-3 font-medium">User</th><th className="pb-3 font-medium">Plan</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c, i) => (
                <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-white/5 last:border-0">
                  <td className="py-4 text-sm font-medium">{c.user}</td>
                  <td className="py-4 text-sm text-white/50">{c.plan}</td>
                  <td className="py-4 font-semibold text-brand-400">₦{c.amount.toLocaleString()}</td>
                  <td className="py-4 text-sm text-white/50">{c.date}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 bg-brand-500/15 text-brand-400 px-3 py-1 rounded-full text-xs font-medium">
                      <Check className="w-3.5 h-3.5" /> {c.status}
                    </span>
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
