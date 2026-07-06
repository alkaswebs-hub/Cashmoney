'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

const deposits = [
  { ref: 'CM-A8K2P9', amount: 50000, date: 'Jul 5, 2026 10:32 AM', status: 'approved' },
  { ref: 'CM-B3M7X1', amount: 25000, date: 'Jul 3, 2026 2:15 PM', status: 'approved' },
  { ref: 'CM-C9N4Q8', amount: 100000, date: 'Jul 1, 2026 9:00 AM', status: 'approved' },
  { ref: 'CM-D1P5R2', amount: 5000, date: 'Jun 28, 2026 4:45 PM', status: 'pending' },
  { ref: 'CM-E6S8T3', amount: 15000, date: 'Jun 25, 2026 11:20 AM', status: 'rejected' },
];

const statusConfig = {
  approved: { icon: CheckCircle2, color: 'text-brand-400', bg: 'bg-brand-500/15', label: 'Approved' },
  pending: { icon: Clock, color: 'text-gold-400', bg: 'bg-gold-500/15', label: 'Pending' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15', label: 'Rejected' },
};

export default function DepositHistoryPage() {
  return (
    <div>
      <DashboardHeader title="Deposit History" subtitle="All your deposit transactions." />
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((d, i) => {
                const s = statusConfig[d.status as keyof typeof statusConfig];
                return (
                  <motion.tr
                    key={d.ref}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-4 font-mono text-sm text-brand-400">{d.ref}</td>
                    <td className="py-4 font-semibold">₦{d.amount.toLocaleString()}</td>
                    <td className="py-4 text-sm text-white/50">{d.date}</td>
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
