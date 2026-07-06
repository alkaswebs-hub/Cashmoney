'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Gift, Users } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira } from '@/lib/helpers';

export default function WalletPage() {
  const { profile } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [stats, setStats] = useState({ totalDeposits: 0, totalWithdrawals: 0, referralEarnings: 0, investmentEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const uid = profile.id;
      const { data: w } = await supabase.from('wallets').select('*').eq('user_id', uid).maybeSingle();
      setWallet(w);

      const { data: deposits } = await supabase.from('deposits').select('amount').eq('user_id', uid).eq('status', 'approved');
      const { data: withdrawals } = await supabase.from('withdrawals').select('amount').eq('user_id', uid).eq('status', 'approved');
      const { data: refTxns } = await supabase.from('transactions').select('amount').eq('user_id', uid).eq('type', 'referral').eq('direction', 'credit');
      const { data: claimTxns } = await supabase.from('transactions').select('amount').eq('user_id', uid).eq('type', 'claim').eq('direction', 'credit');

      setStats({
        totalDeposits: (deposits || []).reduce((s, d) => s + Number(d.amount), 0),
        totalWithdrawals: (withdrawals || []).reduce((s, d) => s + Number(d.amount), 0),
        referralEarnings: (refTxns || []).reduce((s, d) => s + Number(d.amount), 0),
        investmentEarnings: (claimTxns || []).reduce((s, d) => s + Number(d.amount), 0),
      });
      setLoading(false);
    })();
  }, [profile]);

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const cards = [
    { label: 'Total Deposits', value: stats.totalDeposits, icon: ArrowDownToLine, color: 'text-brand-400' },
    { label: 'Total Withdrawals', value: stats.totalWithdrawals, icon: ArrowUpFromLine, color: 'text-red-400' },
    { label: 'Investment Earnings', value: stats.investmentEarnings, icon: TrendingUp, color: 'text-brand-400' },
    { label: 'Referral Earnings', value: stats.referralEarnings, icon: Users, color: 'text-gold-400' },
    { label: 'Today\'s Earnings', value: wallet?.today_earnings || 0, icon: Gift, color: 'text-brand-400' },
  ];

  return (
    <div>
      <DashboardHeader title="Wallet" subtitle="Your balance and earnings overview." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <GlassCard variant="brand" glow className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/50">Available Balance</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mt-2">{formatNaira(wallet?.balance || 0)}</h2>
              <p className="text-xs text-white/40 mt-2">Withdrawable: {formatNaira(wallet?.balance || 0)}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/deposit" className="bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold px-5 py-2.5 rounded-full text-sm hover:shadow-glow transition-all flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4" /> Add Funds
              </Link>
              <Link href="/dashboard/withdraw" className="glass-strong px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                <ArrowUpFromLine className="w-4 h-4" /> Withdraw
              </Link>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>
              <p className="text-xs text-white/40">{c.label}</p>
              <p className="font-display font-bold text-xl mt-1">{formatNaira(c.value)}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
