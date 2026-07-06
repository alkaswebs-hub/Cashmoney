'use client';

import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

const deposits = [
  { ref: 'CM-A8K2P9', user: 'Adebayo Okafor', amount: 50000, date: 'Jul 5, 2026 10:32 AM', status: 'pending' },
  { ref: 'CM-B3M7X1', user: 'Chioma Eze', amount: 25000, date: 'Jul 3, 2026 2:15 PM', status: 'pending' },
  { ref: 'CM-C9N4Q8', user: 'Ibrahim Musa', amount: 100000, date: 'Jul 1, 2026 9:00 AM', status: 'approved' },
  { ref: 'CM-D1P5R2', user: 'Funke Adeyemi', amount: 5000, date: 'Jun 28, 2026 4:45 PM', status: 'approved' },
  { ref: 'CM-E6S8T3', user: 'Tunde Oyelaran', amount: 15000, date: 'Jun 25, 2026 11:20 AM', status: 'rejected' },
];

const cfg = {
  pending: { icon: Clock, color: 'text-gold-400', bg: 'bg-gold-500/15', label: 'Pending' },
  approved: { icon: Check, color: 'text-brand-400', bg: 'bg-brand-500/15', label: 'Approved' },
  rejected: { icon: X, color: 'text-red-400', bg: 'bg-red-500/15', label: 'Rejected' },
};

export default function AdminDepositsPage() {
  return (
    <div>
      <DashboardHeader title="Deposits" subtitle="Review and approve user deposits." />
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((d, i) => {
                const s = cfg[d.status as keyof typeof cfg];
                return (
                  <motion.tr key={d.ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-white/5 last:border-0">
                    <td className="py-4 font-mono text-sm text-brand-400">{d.ref}</td>
                    <td className="py-4 text-sm">{d.user}</td>
                    <td className="py-4 font-semibold">₦{d.amount.toLocaleString()}</td>
                    <td className="py-4 text-sm text-white/50">{d.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.color} px-3 py-1 rounded-full text-xs font-medium`}>
                        <s.icon className="w-3.5 h-3.5" /> {s.label}
                      </span>
                    </td>
                    <td className="py-4">
                      {d.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => toast.success('Deposit approved')} className="bg-brand-500 text-ink-900 text-xs font-semibold px-3 py-1.5 rounded-full hover:shadow-glow transition-all">Approve</button>
                          <button onClick={() => toast.error('Deposit rejected')} className="bg-red-500/15 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-500/25 transition-colors">Reject</button>
                        </div>
                      ) : (
                        <span className="text-xs text-white/30">—</span>
                      )}
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
