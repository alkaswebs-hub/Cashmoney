'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

const withdrawals = [
  { ref: 'WD-X2K9P3', amount: 20000, date: 'Jul 4, 2026', bank: 'Access Bank', status: 'approved' },
  { ref: 'WD-Y5M1Q7', amount: 15000, date: 'Jul 2, 2026', bank: 'GTBank', status: 'approved' },
  { ref: 'WD-Z8N3R4', amount: 10000, date: 'Jun 30, 2026', bank: 'UBA', status: 'pending' },
  { ref: 'WD-A1P6S9', amount: 5000, date: 'Jun 28, 2026', bank: 'Zenith Bank', status: 'rejected' },
];

const statusConfig = {
  approved: { icon: CheckCircle2, color: 'text-brand-400', bg: 'bg-brand-500/15', label: 'Approved' },
  pending: { icon: Clock, color: 'text-gold-400', bg: 'bg-gold-500/15', label: 'Pending' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15', label: 'Rejected' },
};

export default function WithdrawalHistoryPage() {
  return (
    <div>
      <DashboardHeader title="Withdrawal History" subtitle="All your withdrawal requests." />
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Bank</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => {
                const s = statusConfig[w.status as keyof typeof statusConfig];
                return (
                  <motion.tr
                    key={w.ref}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-4 font-mono text-sm text-brand-400">{w.ref}</td>
                    <td className="py-4 font-semibold">₦{w.amount.toLocaleString()}</td>
                    <td className="py-4 text-sm text-white/50">{w.bank}</td>
                    <td className="py-4 text-sm text-white/50">{w.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.color} px-3 py-1 rounded-full text-xs font-medium`}>
                        <s.icon className="w-3.5 h-3.5" /> {s.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
