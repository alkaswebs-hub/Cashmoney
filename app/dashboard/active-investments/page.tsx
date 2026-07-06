'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Coins, Clock, TrendingUp, Gift, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

const investments = [
  { id: 1, plan: 'Growth', amount: 100000, daily: 10000, startDay: 78, totalDays: 120, status: 'active' },
  { id: 2, plan: 'Starter', amount: 50000, daily: 5000, startDay: 120, totalDays: 120, status: 'completed' },
  { id: 3, plan: 'Premium', amount: 30000, daily: 3000, startDay: 15, totalDays: 120, status: 'active' },
];

function Countdown({ days, hours }: { days: number; hours: number }) {
  return (
    <div className="flex gap-2">
      <div className="glass rounded-lg px-2 py-1 text-center min-w-[40px]">
        <p className="text-sm font-bold">{days}</p>
        <p className="text-[9px] text-white/40">days</p>
      </div>
      <div className="glass rounded-lg px-2 py-1 text-center min-w-[40px]">
        <p className="text-sm font-bold">{hours}</p>
        <p className="text-[9px] text-white/40">hrs</p>
      </div>
    </div>
  );
}

export default function ActiveInvestmentsPage() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const active = investments.filter((i) => i.status === 'active');
  const completed = investments.filter((i) => i.status === 'completed');

  return (
    <div>
      <DashboardHeader title="Active Investments" subtitle="Track your investments in real time." />

      <div className="space-y-4 mb-8">
        {active.map((inv, i) => {
          const progress = (inv.startDay / inv.totalDays) * 100;
          const remainingDays = inv.totalDays - inv.startDay;
          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard variant="brand" className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/15 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">{inv.plan} Plan</h3>
                      <p className="text-xs text-white/40">Invested ₦{inv.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-white/40">Daily Earning</p>
                      <p className="font-display font-bold text-brand-400">₦{inv.daily.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Remaining</p>
                      <Countdown days={remainingDays} hours={now.getHours()} />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/50 mb-2">
                    <span>Day {inv.startDay} of {inv.totalDays}</span>
                    <span>{progress.toFixed(0)}% complete</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-brand-500 to-gold-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
                    Total earned: ₦{(inv.daily * inv.startDay).toLocaleString()}
                  </div>
                  <button
                    onClick={() => toast.success('Redirecting to claim...')}
                    className="bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold px-5 py-2 rounded-full text-sm flex items-center gap-2 hover:shadow-glow transition-all"
                  >
                    <Gift className="w-4 h-4" /> Claim
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {completed.length > 0 && (
        <>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-400" /> Completed Investments
          </h2>
          <div className="space-y-3">
            {completed.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-medium">{inv.plan} Plan</p>
                      <p className="text-xs text-white/40">₦{inv.amount.toLocaleString()} • Completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40">Total Earned</p>
                    <p className="font-bold text-brand-400">₦{(inv.daily * inv.totalDays).toLocaleString()}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
