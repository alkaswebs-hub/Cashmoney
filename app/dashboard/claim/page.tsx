'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Gift, Clock, Coins, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

export default function ClaimPage() {
  const [claimed, setClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(18 * 3600 + 23 * 60);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  const claim = async () => {
    if (claimed) return;
    setClaiming(true);
    await new Promise((r) => setTimeout(r, 1000));
    setClaimed(true);
    setClaiming(false);
    toast.success('₦18,000 claimed successfully!');
  };

  return (
    <div>
      <DashboardHeader title="Daily Claim" subtitle="Claim your 10% daily earnings. Once every 24 hours." />

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="strong" className="p-8 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gold-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-brand-500/15 flex items-center justify-center mx-auto mb-5">
                <Gift className="w-8 h-8 text-brand-400" />
              </div>

              <p className="text-sm text-white/50 mb-1">Available to Claim</p>
              <p className="text-4xl sm:text-5xl font-display font-bold text-gradient-brand mb-6">₦18,000</p>

              {claimed ? (
                <div className="glass-brand rounded-2xl p-6">
                  <CheckCircle2 className="w-10 h-10 text-brand-400 mx-auto mb-3" />
                  <p className="font-display font-semibold text-lg">Claimed Successfully!</p>
                  <p className="text-sm text-white/50 mt-1">₦18,000 added to your wallet. Come back in 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="glass rounded-2xl p-4 mb-6">
                    <p className="text-xs text-white/40 mb-2 flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Next claim available in
                    </p>
                    <div className="flex justify-center gap-3">
                      {[{ v: hours, l: 'hrs' }, { v: mins, l: 'min' }, { v: secs, l: 'sec' }].map((t) => (
                        <div key={t.l} className="glass-strong rounded-xl px-4 py-2 min-w-[60px]">
                          <p className="text-2xl font-display font-bold text-brand-400">{String(t.v).padStart(2, '0')}</p>
                          <p className="text-[10px] text-white/40">{t.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={claim}
                    disabled={claiming}
                    className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow-lg transition-all disabled:opacity-50"
                  >
                    {claiming ? 'Claiming...' : <><Gift className="w-5 h-5" /> Claim ₦18,000</>}
                  </button>
                  <p className="text-xs text-white/40 mt-3">You can only claim once every 24 hours.</p>
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          {[
            { icon: Coins, label: 'Total Claimed', value: '₦1,404,000' },
            { icon: Clock, label: 'Streak', value: '78 days' },
            { icon: Gift, label: 'Daily Rate', value: '10%' },
          ].map((s) => (
            <GlassCard key={s.label} className="p-4 text-center">
              <s.icon className="w-5 h-5 text-brand-400 mx-auto mb-2" />
              <p className="text-xs text-white/40">{s.label}</p>
              <p className="font-display font-bold">{s.value}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
