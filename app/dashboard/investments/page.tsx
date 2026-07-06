'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Coins, ArrowRight, Check } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

const plans = [
  { name: 'Starter', min: 5000, max: 49999, daily: '10%', duration: 120, popular: false, perks: ['Min ₦5,000', '10% daily return', '120 days', 'Daily claim'] },
  { name: 'Growth', min: 50000, max: 199999, daily: '10%', duration: 120, popular: true, perks: ['Min ₦50,000', '10% daily return', '120 days', 'Priority support', 'Daily claim'] },
  { name: 'Premium', min: 200000, max: 1000000, daily: '10%', duration: 120, popular: false, perks: ['Min ₦200,000', '10% daily return', '120 days', 'VIP support', 'Daily claim'] },
];

export default function InvestmentsPage() {
  const invest = (plan: string) => toast.success(`Investing in ${plan} plan...`);

  return (
    <div>
      <DashboardHeader title="Investment Plans" subtitle="Choose a plan and start earning 10% daily for 120 days." />

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard
              variant={p.popular ? 'brand' : 'default'}
              className={`p-6 h-full relative ${p.popular ? 'shadow-glow' : ''}`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="font-display text-xl font-bold mb-1">{p.name}</h3>
              <p className="text-sm text-white/50 mb-5">₦{p.min.toLocaleString()} – ₦{p.max.toLocaleString()}</p>

              <div className="glass rounded-2xl p-4 mb-5 text-center">
                <p className="text-xs text-white/40 mb-1">Daily Return</p>
                <p className="text-3xl font-display font-bold text-gradient-brand">{p.daily}</p>
                <p className="text-xs text-white/40 mt-1">for {p.duration} days</p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-brand-400 shrink-0" /> {perk}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => invest(p.name)}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all"
              >
                Invest Now <ArrowRight className="w-4 h-4" />
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          { icon: Clock, label: 'Duration', value: '120 Days' },
          { icon: TrendingUp, label: 'Daily Return', value: '10%' },
          { icon: Coins, label: 'Min Investment', value: '₦5,000' },
        ].map((s) => (
          <GlassCard key={s.label} className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <s.icon className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">{s.label}</p>
              <p className="font-display font-bold">{s.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
