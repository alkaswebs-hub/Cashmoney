'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Check, Star } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira } from '@/lib/helpers';
import { toast } from 'sonner';

export default function InvestmentsPage() {
  const { profile } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [wallet, setWallet] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from('investment_plans').select('*').eq('is_active', true).order('min_amount', { ascending: true });
      setPlans(p || []);

      const { data: s } = await supabase.from('settings').select('key,value');
      const map: Record<string, string> = {};
      (s || []).forEach((r: any) => { map[r.key] = r.value; });
      setSettings(map);

      if (profile) {
        const { data: w } = await supabase.from('wallets').select('*').eq('user_id', profile.id).maybeSingle();
        setWallet(w);
      }
      setLoading(false);
    })();
  }, [profile]);

  const invest = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < selectedPlan.min_amount || amt > selectedPlan.max_amount) {
      toast.error(`Amount must be between ${formatNaira(selectedPlan.min_amount)} and ${formatNaira(selectedPlan.max_amount)}`);
      return;
    }
    const balance = wallet?.balance || 0;
    if (amt > balance) {
      toast.error('Insufficient wallet balance. Please deposit first.');
      return;
    }

    setSubmitting(true);
    const { error: invError } = await supabase.from('investments').insert({
      user_id: profile!.id,
      plan_name: selectedPlan.name,
      amount: amt,
      daily_rate: selectedPlan.daily_rate,
      duration_days: selectedPlan.duration_days,
      days_elapsed: 0,
      status: 'active',
    });

    if (invError) {
      toast.error('Failed to create investment: ' + invError.message);
      setSubmitting(false);
      return;
    }

    await supabase.from('wallets').update({
      balance: balance - amt,
      updated_at: new Date().toISOString(),
    }).eq('user_id', profile!.id);

    await supabase.from('transactions').insert({
      user_id: profile!.id,
      type: 'investment',
      amount: amt,
      direction: 'debit',
      reference: `INV-${Date.now().toString(36).toUpperCase()}`,
    });

    await supabase.from('notifications').insert({
      user_id: profile!.id,
      title: 'Investment Active!',
      body: `Your ${selectedPlan.name} investment of ${formatNaira(amt)} is now active. Earn ${selectedPlan.daily_rate}% daily for ${selectedPlan.duration_days} days.`,
      type: 'success',
    });

    toast.success('Investment created successfully!');
    setSelectedPlan(null);
    setAmount('');
    const { data: w } = await supabase.from('wallets').select('*').eq('user_id', profile!.id).maybeSingle();
    setWallet(w);
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Investment Plans" subtitle="Choose a plan and start earning daily." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard variant={i === 1 ? 'brand' : 'default'} glow={i === 1} className="p-6 relative">
              {i === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Most Popular
                </div>
              )}
              <h3 className="font-display font-bold text-xl">{plan.name}</h3>
              <p className="text-xs text-white/40 mt-1">{formatNaira(plan.min_amount)} – {formatNaira(plan.max_amount)}</p>

              <div className="my-5">
                <p className="font-display text-4xl font-bold text-gradient-brand">{plan.daily_rate}%</p>
                <p className="text-xs text-white/40 mt-1">Daily return</p>
              </div>

              <div className="space-y-2 text-sm mb-5">
                <div className="flex items-center gap-2 text-white/60">
                  <Check className="w-4 h-4 text-brand-400" /> {plan.duration_days} days duration
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Check className="w-4 h-4 text-brand-400" /> Daily claims available
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Check className="w-4 h-4 text-brand-400" /> Min: {formatNaira(plan.min_amount)}
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan(plan)}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-xl hover:shadow-glow transition-all"
              >
                Invest Now
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5 text-brand-400" />
          <h3 className="font-display font-bold">How It Works</h3>
        </div>
        <p className="text-sm text-white/50">
          Choose a plan, enter your investment amount (deducted from your wallet), and start earning {settings.daily_return || '10'}% daily.
          You can claim your earnings once every 24 hours. After {settings.duration_days || '120'} days, your investment completes.
        </p>
      </GlassCard>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPlan(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <GlassCard variant="strong" className="p-6">
              <h3 className="font-display font-bold text-xl mb-1">{selectedPlan.name} Plan</h3>
              <p className="text-sm text-white/50 mb-5">Enter the amount you want to invest.</p>

              <div className="glass rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/40">Wallet Balance</span>
                  <span className="font-medium">{formatNaira(wallet?.balance || 0)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/40">Daily Return</span>
                  <span className="font-medium text-brand-400">{selectedPlan.daily_rate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Duration</span>
                  <span className="font-medium">{selectedPlan.duration_days} days</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-white/60 mb-1.5 block">Investment Amount (₦)</label>
                <input
                  type="number"
                  min={selectedPlan.min_amount}
                  max={selectedPlan.max_amount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                  placeholder={`Min ${formatNaira(selectedPlan.min_amount)}`}
                />
                {amount && (
                  <p className="text-xs text-brand-400 mt-2">
                    Daily earnings: {formatNaira((parseFloat(amount) * selectedPlan.daily_rate) / 100)}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedPlan(null)} className="flex-1 glass rounded-xl py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={invest}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-xl hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
