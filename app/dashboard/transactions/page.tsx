'use client';

import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Gift, Users, Wallet } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDateTime } from '@/lib/helpers';

const typeIcons: Record<string, any> = {
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  claim: Gift,
  referral: Users,
  investment: TrendingUp,
  wallet_adjustment: Wallet,
  admin_adjustment: Wallet,
};

export default function TransactionsPage() {
  const { profile } = useAuth();
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data } = await supabase.from('transactions').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
      setTxns(data || []);
      setLoading(false);
    })();
  }, [profile]);

  const filtered = filter === 'all' ? txns : txns.filter(t => t.type === filter);

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Transaction History" subtitle="All your money movements in one place." />

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {['all', 'deposit', 'withdrawal', 'claim', 'referral', 'investment'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900' : 'glass text-white/60 hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <GlassCard className="p-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-12">No transactions found.</p>
        ) : (
          <div className="space-y-1">
            {filtered.map((t) => {
              const Icon = typeIcons[t.type] || Wallet;
              const isCredit = t.direction === 'credit';
              return (
                <div key={t.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCredit ? 'bg-brand-500/15' : 'bg-red-500/15'}`}>
                      <Icon className={`w-5 h-5 ${isCredit ? 'text-brand-400' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{t.type.replace('_', ' ')}</p>
                      <p className="text-xs text-white/40">{formatDateTime(t.created_at)}</p>
                      {t.reference && <p className="text-xs text-white/30 font-mono mt-0.5">{t.reference}</p>}
                    </div>
                  </div>
                  <p className={`font-display font-bold ${isCredit ? 'text-brand-400' : 'text-red-400'}`}>
                    {isCredit ? '+' : '-'}{formatNaira(Number(t.amount))}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
