'use client';

import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpFromLine, Gift, Coins } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';

const txns = [
  { type: 'Daily Claim', amount: 18000, time: 'Jul 5, 2026 10:32 AM', positive: true, icon: Gift },
  { type: 'Deposit', amount: 50000, time: 'Jul 5, 2026 9:00 AM', positive: true, icon: ArrowDownToLine },
  { type: 'Referral Bonus', amount: 5000, time: 'Jul 4, 2026 3:15 PM', positive: true, icon: Gift },
  { type: 'Withdrawal', amount: 20000, time: 'Jul 4, 2026 11:00 AM', positive: false, icon: ArrowUpFromLine },
  { type: 'Daily Claim', amount: 18000, time: 'Jul 4, 2026 10:30 AM', positive: true, icon: Gift },
  { type: 'Investment', amount: 100000, time: 'Jul 3, 2026 2:00 PM', positive: false, icon: Coins },
  { type: 'Deposit', amount: 25000, time: 'Jul 3, 2026 1:00 PM', positive: true, icon: ArrowDownToLine },
  { type: 'Daily Claim', amount: 18000, time: 'Jul 3, 2026 10:00 AM', positive: true, icon: Gift },
];

export default function TransactionsPage() {
  return (
    <div>
      <DashboardHeader title="All Transactions" subtitle="Your complete transaction history." />
      <GlassCard className="p-6">
        <div className="space-y-2">
          {txns.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-3 glass rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.positive ? 'bg-brand-500/15' : 'bg-red-500/15'}`}>
                  <t.icon className={`w-4 h-4 ${t.positive ? 'text-brand-400' : 'text-red-400'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{t.type}</p>
                  <p className="text-xs text-white/40">{t.time}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${t.positive ? 'text-brand-400' : 'text-red-400'}`}>
                {t.positive ? '+' : '-'}₦{t.amount.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
