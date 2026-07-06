'use client';

import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

const withdrawals = [
  { ref: 'WD-X2K9P3', user: 'Adebayo Okafor', amount: 20000, bank: 'Access Bank', account: '0123456789', date: 'Jul 4, 2026', status: 'pending' },
  { ref: 'WD-Y5M1Q7', user: 'Chioma Eze', amount: 15000, bank: 'GTBank', account: '0987654321', date: 'Jul 2, 2026', status: 'pending' },
  { ref: 'WD-Z8N3R4', user: 'Ibrahim Musa', amount: 10000, bank: 'UBA', account: '0555544444', date: 'Jun 30, 2026', status: 'approved' },
  { ref: 'WD-A1P6S9', user: 'Funke Adeyemi', amount: 5000, bank: 'Zenith Bank', account: '0111122223', date: 'Jun 28, 2026', status: 'rejected' },
];

const cfg = {
  pending: { icon: Clock, color: 'text-gold-400', bg: 'bg-gold-500/15', label: 'Pending' },
  approved: { icon: Check, color: 'text-brand-400', bg: 'bg-brand-500/15', label: 'Approved' },
  rejected: { icon: X, color: 'text-red-400', bg: 'bg-red-500/15', label: 'Rejected' },
};

export default function AdminWithdrawalsPage() {
  return (
    <div>
      <DashboardHeader title="Withdrawals" subtitle="Process user withdrawal requests." />
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Bank</th>
                <th className="pb-3 font-medium">Account</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => {
                const s = cfg[w.status as keyof typeof cfg];
                return (
                  <motion.tr key={w.ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-white/5 last:border-0">
                    <td className="py-4 font-mono text-sm text-brand-400">{w.ref}</td>
                    <td className="py-4 text-sm">{w.user}</td>
                    <td className="py-4 font-semibold">₦{w.amount.toLocaleString()}</td>
                    <td className="py-4 text-sm text-white/50">{w.bank}</td>
                    <td className="py-4 text-sm text-white/50 font-mono">{w.account}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.color} px-3 py-1 rounded-full text-xs font-medium`}>
                        <s.icon className="w-3.5 h-3.5" /> {s.label}
                      </span>
                    </td>
                    <td className="py-4">
                      {w.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => toast.success('Withdrawal approved')} className="bg-brand-500 text-ink-900 text-xs font-semibold px-3 py-1.5 rounded-full hover:shadow-glow transition-all">Approve</button>
                          <button onClick={() => toast.error('Withdrawal rejected')} className="bg-red-500/15 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-500/25 transition-colors">Reject</button>
                        </div>
                      ) : <span className="text-xs text-white/30">—</span>}
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
