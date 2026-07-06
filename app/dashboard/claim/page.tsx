'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, Check } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira, timeAgo } from '@/lib/helpers';
import { toast } from 'sonner';

export default function ClaimPage() {
  const { profile } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [claims, setClaims] = useState<Record<string, string | null>>({});
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data: invs } = await supabase.from('investments').select('*').eq('user_id', profile.id).eq('status', 'active');
      setInvestments(invs || []);

      const claimMap: Record<string, string | null> = {};
      for (const inv of invs || []) {
        const { data: lastClaim } = await supabase.from('claims').select('created_at').eq('investment_id', inv.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
        claimMap[inv.id] = lastClaim?.created_at || null;
      }
      setClaims(claimMap);

      const { data: claimTxns } = await supabase.from('transactions').select('amount').eq('user_id', profile.id).eq('type', 'claim').eq('direction', 'credit');
      setTotalClaimed((claimTxns || []).reduce((s, t) => s + Number(t.amount), 0));

      setLoading(false);
    })();
  }, [profile]);

  const canClaim = (lastClaim: string | null) => {
    if (!lastClaim) return true;
    return Date.now() - new Date(lastClaim).getTime() >= 24 * 60 * 60 * 1000;
  };

  const timeUntilClaim = (lastClaim: string | null) => {
    if (!lastClaim) return null;
    const remaining = 24 * 60 * 60 * 1000 - (Date.now() - new Date(lastClaim).getTime());
    if (remaining <= 0) return null;
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const claimAll = async () => {
    const claimable = investments.filter(inv => canClaim(claims[inv.id]));
    if (claimable.length === 0) {
      toast.error('No claims available right now. Please wait 24 hours between claims.');
      return;
    }

    setClaiming(true);
    let totalEarnings = 0;

    for (const inv of claimable) {
      const earnings = (Number(inv.amount) * Number(inv.daily_rate)) / 100;
      totalEarnings += earnings;

      await supabase.from('claims').insert({
        user_id: profile!.id,
        investment_id: inv.id,
        amount: earnings,
      });

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
    }

    const { data: w } = await supabase.from('wallets').select('*').eq('user_id', profile!.id).maybeSingle();
    if (w) {
      await supabase.from('wallets').update({
        balance: Number(w.balance) + totalEarnings,
        today_earnings: Number(w.today_earnings) + totalEarnings,
        updated_at: new Date().toISOString(),
      }).eq('user_id', profile!.id);
    }

    await supabase.from('notifications').insert({
      user_id: profile!.id,
      title: 'Daily Claim Successful!',
      body: `You claimed ${formatNaira(totalEarnings)} from ${claimable.length} investment(s).`,
      type: 'success',
    });

    toast.success(`Claimed ${formatNaira(totalEarnings)} from ${claimable.length} investments!`);

    const { data: invs } = await supabase.from('investments').select('*').eq('user_id', profile!.id).eq('status', 'active');
    setInvestments(invs || []);

    const claimMap: Record<string, string | null> = {};
    for (const inv of invs || []) {
      const { data: lastClaim } = await supabase.from('claims').select('created_at').eq('investment_id', inv.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      claimMap[inv.id] = lastClaim?.created_at || null;
    }
    setClaims(claimMap);

    setTotalClaimed(prev => prev + totalEarnings);
    setClaiming(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const claimableNow = investments.filter(inv => canClaim(claims[inv.id]));
  const totalClaimable = claimableNow.reduce((s, inv) => s + (Number(inv.amount) * Number(inv.daily_rate) / 100), 0);
  const nextClaimTime = investments.length > 0
    ? timeUntilClaim(investments.map(inv => claims[inv.id]).filter(Boolean).sort()[0])
    : null;

  return (
    <div>
      <DashboardHeader title="Daily Claim" subtitle="Claim your daily investment earnings." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard variant="brand" glow className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center mx-auto mb-5">
              <Gift className="w-10 h-10 text-ink-900" strokeWidth={2.5} />
            </div>
            <p className="text-sm text-white/50">Available to Claim</p>
            <h2 className="font-display text-5xl font-bold mt-2 text-gradient-brand">{formatNaira(totalClaimable)}</h2>
            <p className="text-xs text-white/40 mt-2">{claimableNow.length} investment(s) ready</p>

            <button
              onClick={claimAll}
              disabled={claimableNow.length === 0 || claiming}
              className="mt-6 w-full sm:w-auto bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold px-8 py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {claiming ? 'Claiming...' : claimableNow.length > 0 ? (
                <><Gift className="w-5 h-5" /> Claim All</>
              ) : (
                <><Clock className="w-5 h-5" /> {nextClaimTime ? `Next claim in ${nextClaimTime}` : 'No active investments'}</>
              )}
            </button>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 h-full">
            <h3 className="font-display font-bold mb-4">Claim Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-white/40">Total Claimed</p>
                <p className="font-display font-bold text-xl mt-0.5">{formatNaira(totalClaimed)}</p>
              </div>
              <div>
                <p className="text-xs text-white/40">Active Investments</p>
                <p className="font-display font-bold text-xl mt-0.5">{investments.length}</p>
              </div>
              <div>
                <p className="text-xs text-white/40">Claim Frequency</p>
                <p className="font-display font-bold text-xl mt-0.5">Every 24h</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {investments.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-4">Your Active Investments</h3>
          <div className="space-y-3">
            {investments.map((inv) => {
              const claimable = canClaim(claims[inv.id]);
              const waitTime = timeUntilClaim(claims[inv.id]);
              const earnings = (Number(inv.amount) * Number(inv.daily_rate)) / 100;
              return (
                <div key={inv.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${claimable ? 'bg-brand-500/15' : 'bg-white/5'}`}>
                      {claimable ? <Check className="w-4 h-4 text-brand-400" /> : <Clock className="w-4 h-4 text-white/40" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{inv.plan_name}</p>
                      <p className="text-xs text-white/40">{formatNaira(Number(inv.amount))} • Day {inv.days_elapsed}/{inv.duration_days}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-sm text-brand-400">{formatNaira(earnings)}</p>
                    <p className="text-xs text-white/40">{claimable ? 'Ready' : waitTime}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
