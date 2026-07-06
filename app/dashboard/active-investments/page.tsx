'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Clock, Check, X, Gift } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

export default function ActiveInvestmentsPage() {
  const { profile } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [claims, setClaims] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data: invs } = await supabase.from('investments').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
      setInvestments(invs || []);

      const claimMap: Record<string, string | null> = {};
      for (const inv of invs || []) {
        const { data: lastClaim } = await supabase.from('claims').select('created_at').eq('investment_id', inv.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
        claimMap[inv.id] = lastClaim?.created_at || null;
      }
      setClaims(claimMap);
      setLoading(false);
    })();
  }, [profile]);

  const canClaim = (lastClaim: string | null) => {
    if (!lastClaim) return true;
    const diff = Date.now() - new Date(lastClaim).getTime();
    return diff >= 24 * 60 * 60 * 1000;
  };

  const timeUntilClaim = (lastClaim: string | null) => {
    if (!lastClaim) return null;
    const diff = Date.now() - new Date(lastClaim).getTime();
    const remaining = 24 * 60 * 60 * 1000 - diff;
    if (remaining <= 0) return null;
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  const claimEarnings = async (inv: any) => {
    setClaiming(inv.id);
    const lastClaim = claims[inv.id];
    if (!canClaim(lastClaim)) {
      toast.error('You can only claim once every 24 hours');
      setClaiming(null);
      return;
    }

    const earnings = (Number(inv.amount) * Number(inv.daily_rate)) / 100;

    const { error: claimError } = await supabase.from('claims').insert({
      user_id: profile!.id,
      investment_id: inv.id,
      amount: earnings,
    });

    if (claimError) {
      toast.error('Failed to claim: ' + claimError.message);
      setClaiming(null);
      return;
    }

    const { data: w } = await supabase.from('wallets').select('*').eq('user_id', profile!.id).maybeSingle();
    if (w) {
      await supabase.from('wallets').update({
        balance: Number(w.balance) + earnings,
        today_earnings: Number(w.today_earnings) + earnings,
        updated_at: new Date().toISOString(),
      }).eq('user_id', profile!.id);
    }

    await supabase.from('transactions').insert({
      user_id: profile!.id,
      type: 'claim',
      amount: earnings,
      direction: 'credit',
      reference: `CLM-${Date.now().toString(36).toUpperCase()}`,
    });

    const newDaysElapsed = (inv.days_elapsed || 0) + 1;
    const isComplete = newDaysElapsed >= inv.duration_days;
    await supabase.from('investments').update({
      days_elapsed: newDaysElapsed,
      status: isComplete ? 'completed' : 'active',
      completed_at: isComplete ? new Date().toISOString() : null,
    }).eq('id', inv.id);

    toast.success(`Claimed ${formatNaira(earnings)}!`);

    const { data: invs } = await supabase.from('investments').select('*').eq('user_id', profile!.id).order('created_at', { ascending: false });
    setInvestments(invs || []);

    const { data: lastClaim2 } = await supabase.from('claims').select('created_at').eq('investment_id', inv.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
    setClaims(prev => ({ ...prev, [inv.id]: lastClaim2?.created_at || null }));

    setClaiming(null);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const active = investments.filter(i => i.status === 'active');
  const completed = investments.filter(i => i.status === 'completed');
  const cancelled = investments.filter(i => i.status === 'cancelled');

  return (
    <div>
      <DashboardHeader title="Active Investments" subtitle="Track your investments and claim daily earnings." />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-4">
          <p className="text-xs text-white/40">Active</p>
          <p className="font-display font-bold text-2xl mt-1 text-brand-400">{active.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-white/40">Completed</p>
          <p className="font-display font-bold text-2xl mt-1">{completed.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-white/40">Total Invested</p>
          <p className="font-display font-bold text-2xl mt-1">{formatNaira(investments.reduce((s, i) => s + Number(i.amount), 0))}</p>
        </GlassCard>
      </div>

      {active.length === 0 && completed.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Coins className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No investments yet. Choose a plan to get started.</p>
        </GlassCard>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {active.map((inv, i) => {
              const elapsed = Math.min(inv.days_elapsed || 0, inv.duration_days);
              const progress = (elapsed / inv.duration_days) * 100;
              const waitTime = timeUntilClaim(claims[inv.id]);
              const claimable = canClaim(claims[inv.id]);
              const dailyEarnings = (Number(inv.amount) * Number(inv.daily_rate)) / 100;

              return (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <GlassCard variant="brand" className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-display font-bold text-lg">{inv.plan_name}</h3>
                        <p className="text-xs text-white/40 mt-0.5">Started {formatDate(inv.started_at)} • {inv.daily_rate}% daily</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-2xl">{formatNaira(Number(inv.amount))}</p>
                        <p className="text-xs text-brand-400">+{formatNaira(dailyEarnings)}/day</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/40 mb-2">
                        <span>Day {elapsed} of {inv.duration_days}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={() => claimEarnings(inv)}
                      disabled={!claimable || claiming === inv.id}
                      className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {claiming === inv.id ? 'Claiming...' : claimable ? (
                        <><Gift className="w-4 h-4" /> Claim {formatNaira(dailyEarnings)}</>
                      ) : (
                        <><Clock className="w-4 h-4" /> Next claim in {waitTime}</>
                      )}
                    </button>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          {completed.length > 0 && (
            <div>
              <h3 className="font-display font-bold mb-4 text-white/60">Completed Investments</h3>
              <div className="space-y-3">
                {completed.map((inv) => {
                  const totalEarned = (Number(inv.amount) * Number(inv.daily_rate) / 100) * inv.duration_days;
                  return (
                    <GlassCard key={inv.id} className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                            <Check className="w-5 h-5 text-brand-400" />
                          </div>
                          <div>
                            <p className="font-medium">{inv.plan_name}</p>
                            <p className="text-xs text-white/40">Completed {inv.completed_at ? formatDate(inv.completed_at) : ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold">{formatNaira(Number(inv.amount))}</p>
                          <p className="text-xs text-brand-400">Earned {formatNaira(totalEarned)}</p>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          )}

          {cancelled.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display font-bold mb-4 text-white/60">Cancelled Investments</h3>
              <div className="space-y-3">
                {cancelled.map((inv) => (
                  <GlassCard key={inv.id} className="p-5 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                          <X className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium">{inv.plan_name}</p>
                          <p className="text-xs text-white/40">Cancelled</p>
                        </div>
                      </div>
                      <p className="font-display font-bold">{formatNaira(Number(inv.amount))}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
