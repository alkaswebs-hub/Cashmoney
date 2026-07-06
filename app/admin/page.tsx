'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Users, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Check, X } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, totalDeposits: 0, totalWithdrawals: 0, activeInvestments: 0 });
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [claimsData, setClaimsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: deposits } = await supabase.from('deposits').select('amount').eq('status', 'approved');
      const { data: withdrawals } = await supabase.from('withdrawals').select('amount').eq('status', 'approved');
      const { data: investments } = await supabase.from('investments').select('amount').eq('status', 'active');

      setStats({
        users: userCount || 0,
        totalDeposits: (deposits || []).reduce((s, d) => s + Number(d.amount), 0),
        totalWithdrawals: (withdrawals || []).reduce((s, d) => s + Number(d.amount), 0),
        activeInvestments: (investments || []).reduce((s, d) => s + Number(d.amount), 0),
      });

      const { data: pd } = await supabase.from('deposits').select('*, profiles!deposits_user_id_fkey(full_name, phone)').eq('status', 'pending').order('created_at', { ascending: false }).limit(10);
      setPendingDeposits(pd || []);

      const { data: pw } = await supabase.from('withdrawals').select('*, profiles!withdrawals_user_id_fkey(full_name, phone)').eq('status', 'pending').order('created_at', { ascending: false }).limit(10);
      setPendingWithdrawals(pw || []);

      const days: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d.setHours(0, 0, 0, 0));
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
        const { data: dayDep } = await supabase.from('deposits').select('amount').eq('status', 'approved').gte('created_at', dayStart.toISOString()).lte('created_at', dayEnd.toISOString());
        const { data: dayWd } = await supabase.from('withdrawals').select('amount').eq('status', 'approved').gte('created_at', dayStart.toISOString()).lte('created_at', dayEnd.toISOString());
        days.push({
          day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayStart.getDay()],
          deposits: (dayDep || []).reduce((s, d) => s + Number(d.amount), 0),
          withdrawals: (dayWd || []).reduce((s, d) => s + Number(d.amount), 0),
        });
      }
      setChartData(days);

      const claimsByDay: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d.setHours(0, 0, 0, 0));
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
        const { data: dayClaims } = await supabase.from('claims').select('amount').gte('created_at', dayStart.toISOString()).lte('created_at', dayEnd.toISOString());
        claimsByDay.push({
          day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayStart.getDay()],
          claims: (dayClaims || []).reduce((s, d) => s + Number(d.amount), 0),
        });
      }
      setClaimsData(claimsByDay);

      setLoading(false);
    })();
  }, []);

  const approveDeposit = async (dep: any) => {
    setActioning(dep.id);
    const { error } = await supabase.from('deposits').update({
      status: 'approved',
      reviewed_by: (await supabase.auth.getUser()).data.user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', dep.id);

    if (error) {
      toast.error('Failed to approve: ' + error.message);
    } else {
      const { data: w } = await supabase.from('wallets').select('*').eq('user_id', dep.user_id).maybeSingle();
      if (w) {
        await supabase.from('wallets').update({
          balance: Number(w.balance) + Number(dep.amount),
          updated_at: new Date().toISOString(),
        }).eq('user_id', dep.user_id);
      }
      await supabase.from('transactions').insert({
        user_id: dep.user_id,
        type: 'deposit',
        amount: dep.amount,
        direction: 'credit',
        reference: dep.reference,
      });
      await supabase.from('notifications').insert({
        user_id: dep.user_id,
        title: 'Deposit Approved!',
        body: `Your deposit of ${formatNaira(Number(dep.amount))} has been approved and added to your wallet.`,
        type: 'success',
      });

      if (dep.referred_by) {
        const { data: settings } = await supabase.from('settings').select('value').eq('key', 'referral_bonus').maybeSingle();
        const bonusRate = parseFloat(settings?.value || '10');
        const bonus = (Number(dep.amount) * bonusRate) / 100;
        const { data: refWallet } = await supabase.from('wallets').select('*').eq('user_id', dep.referred_by).maybeSingle();
        if (refWallet) {
          await supabase.from('wallets').update({
            balance: Number(refWallet.balance) + bonus,
            referral_earnings: Number(refWallet.referral_earnings) + bonus,
            updated_at: new Date().toISOString(),
          }).eq('user_id', dep.referred_by);
        }
        await supabase.from('transactions').insert({
          user_id: dep.referred_by,
          type: 'referral',
          amount: bonus,
          direction: 'credit',
          reference: `REF-${dep.reference}`,
        });
        await supabase.from('referrals').update({ bonus_amount: bonus, status: 'paid' }).eq('referred_id', dep.user_id);
      }

      toast.success('Deposit approved and wallet credited');
      setPendingDeposits(prev => prev.filter(d => d.id !== dep.id));
    }
    setActioning(null);
  };

  const rejectDeposit = async (dep: any) => {
    setActioning(dep.id);
    const { error } = await supabase.from('deposits').update({
      status: 'rejected',
      reviewed_by: (await supabase.auth.getUser()).data.user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', dep.id);

    if (error) {
      toast.error('Failed to reject: ' + error.message);
    } else {
      await supabase.from('notifications').insert({
        user_id: dep.user_id,
        title: 'Deposit Rejected',
        body: `Your deposit of ${formatNaira(Number(dep.amount))} was rejected. Please contact support if you believe this is an error.`,
        type: 'error',
      });
      toast.success('Deposit rejected');
      setPendingDeposits(prev => prev.filter(d => d.id !== dep.id));
    }
    setActioning(null);
  };

  const approveWithdrawal = async (wd: any) => {
    setActioning(wd.id);
    const { data: w } = await supabase.from('wallets').select('*').eq('user_id', wd.user_id).maybeSingle();
    if (w && Number(w.balance) < Number(wd.amount)) {
      toast.error('User has insufficient balance');
      setActioning(null);
      return;
    }

    const { error } = await supabase.from('withdrawals').update({
      status: 'approved',
      reviewed_by: (await supabase.auth.getUser()).data.user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', wd.id);

    if (error) {
      toast.error('Failed to approve: ' + error.message);
    } else {
      if (w) {
        await supabase.from('wallets').update({
          balance: Number(w.balance) - Number(wd.amount),
          updated_at: new Date().toISOString(),
        }).eq('user_id', wd.user_id);
      }
      await supabase.from('transactions').insert({
        user_id: wd.user_id,
        type: 'withdrawal',
        amount: wd.amount,
        direction: 'debit',
        reference: wd.reference,
      });
      await supabase.from('notifications').insert({
        user_id: wd.user_id,
        title: 'Withdrawal Approved!',
        body: `Your withdrawal of ${formatNaira(Number(wd.amount))} has been approved and will be sent to ${wd.bank_name} (${wd.account_number}).`,
        type: 'success',
      });
      toast.success('Withdrawal approved and wallet debited');
      setPendingWithdrawals(prev => prev.filter(w => w.id !== wd.id));
    }
    setActioning(null);
  };

  const rejectWithdrawal = async (wd: any) => {
    setActioning(wd.id);
    const { error } = await supabase.from('withdrawals').update({
      status: 'rejected',
      reviewed_by: (await supabase.auth.getUser()).data.user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', wd.id);

    if (error) {
      toast.error('Failed to reject: ' + error.message);
    } else {
      await supabase.from('notifications').insert({
        user_id: wd.user_id,
        title: 'Withdrawal Rejected',
        body: `Your withdrawal request of ${formatNaira(Number(wd.amount))} was rejected. Please contact support.`,
        type: 'error',
      });
      toast.success('Withdrawal rejected');
      setPendingWithdrawals(prev => prev.filter(w => w.id !== wd.id));
    }
    setActioning(null);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-brand-400' },
    { label: 'Total Deposits', value: formatNaira(stats.totalDeposits), icon: ArrowDownToLine, color: 'text-brand-400' },
    { label: 'Total Withdrawals', value: formatNaira(stats.totalWithdrawals), icon: ArrowUpFromLine, color: 'text-red-400' },
    { label: 'Active Investments', value: formatNaira(stats.activeInvestments), icon: TrendingUp, color: 'text-gold-400' },
  ];

  return (
    <div>
      <DashboardHeader title="Admin Dashboard" subtitle="Platform overview and pending approvals." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="p-5">
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-xs text-white/40">{s.label}</p>
              <p className="font-display font-bold text-xl mt-0.5">{s.value}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-4">Deposits vs Withdrawals</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(10,15,36,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => formatNaira(v)} />
              <Bar dataKey="deposits" fill="#16C784" radius={[4,4,0,0]} />
              <Bar dataKey="withdrawals" fill="#FACC15" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-4">Daily Claims</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={claimsData}>
              <defs>
                <linearGradient id="claimsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16C784" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(10,15,36,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => formatNaira(v)} />
              <Area type="monotone" dataKey="claims" stroke="#16C784" strokeWidth={2} fill="url(#claimsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-4">Pending Deposits ({pendingDeposits.length})</h3>
          {pendingDeposits.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-8">No pending deposits.</p>
          ) : (
            <div className="space-y-3">
              {pendingDeposits.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{d.profiles?.full_name}</p>
                    <p className="text-xs text-white/40">{formatNaira(Number(d.amount))} • {formatDateTime(d.created_at)}</p>
                    {d.receipt_url && <a href={d.receipt_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-400 hover:underline">View receipt</a>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveDeposit(d)} disabled={actioning === d.id} className="w-8 h-8 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 flex items-center justify-center transition-colors disabled:opacity-50">
                      <Check className="w-4 h-4 text-brand-400" />
                    </button>
                    <button onClick={() => rejectDeposit(d)} disabled={actioning === d.id} className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors disabled:opacity-50">
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-4">Pending Withdrawals ({pendingWithdrawals.length})</h3>
          {pendingWithdrawals.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-8">No pending withdrawals.</p>
          ) : (
            <div className="space-y-3">
              {pendingWithdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{w.profiles?.full_name}</p>
                    <p className="text-xs text-white/40">{formatNaira(Number(w.amount))} • {w.bank_name} ({w.account_number})</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveWithdrawal(w)} disabled={actioning === w.id} className="w-8 h-8 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 flex items-center justify-center transition-colors disabled:opacity-50">
                      <Check className="w-4 h-4 text-brand-400" />
                    </button>
                    <button onClick={() => rejectWithdrawal(w)} disabled={actioning === w.id} className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors disabled:opacity-50">
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
