'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ArrowDownToLine, TrendingUp, Gift, ArrowUpFromLine, Wallet, Users, Coins, Bell } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira, timeAgo } from '@/lib/helpers';

const quickActions = [
  { href: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownToLine, color: 'from-brand-500 to-brand-600' },
  { href: '/dashboard/investments', label: 'Invest', icon: TrendingUp, color: 'from-gold-400 to-gold-600' },
  { href: '/dashboard/claim', label: 'Claim Daily', icon: Gift, color: 'from-brand-400 to-brand-500' },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: ArrowUpFromLine, color: 'from-brand-600 to-brand-700' },
];

export default function DashboardPage() {
  const { profile } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [stats, setStats] = useState({ totalDeposits: 0, totalWithdrawals: 0, referralEarnings: 0, investmentEarnings: 0 });
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeInvestments, setActiveInvestments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const uid = profile.id;

      const { data: w } = await supabase.from('wallets').select('*').eq('user_id', uid).maybeSingle();
      setWallet(w);

      const { data: deposits } = await supabase.from('deposits').select('amount').eq('user_id', uid).eq('status', 'approved');
      const totalDeposits = (deposits || []).reduce((s, d) => s + Number(d.amount), 0);

      const { data: withdrawals } = await supabase.from('withdrawals').select('amount').eq('user_id', uid).eq('status', 'approved');
      const totalWithdrawals = (withdrawals || []).reduce((s, d) => s + Number(d.amount), 0);

      const { data: referralTxns } = await supabase.from('transactions').select('amount').eq('user_id', uid).eq('type', 'referral').eq('direction', 'credit');
      const referralEarnings = (referralTxns || []).reduce((s, d) => s + Number(d.amount), 0);

      const { data: claimTxns } = await supabase.from('transactions').select('amount').eq('user_id', uid).eq('type', 'claim').eq('direction', 'credit');
      const investmentEarnings = (claimTxns || []).reduce((s, d) => s + Number(d.amount), 0);

      setStats({ totalDeposits, totalWithdrawals, referralEarnings, investmentEarnings });

      const { data: txns } = await supabase.from('transactions').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5);
      setRecentTxns(txns || []);

      const { data: notifs } = await supabase.from('notifications').select('*').or(`user_id.eq.${uid},user_id.is.null`).order('created_at', { ascending: false }).limit(5);
      setNotifications(notifs || []);

      const { data: invs } = await supabase.from('investments').select('*').eq('user_id', uid).eq('status', 'active').order('started_at', { ascending: false }).limit(3);
      setActiveInvestments(invs || []);

      const days: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d.setHours(0, 0, 0, 0));
        const dayEnd = new Date(d.setHours(23, 59, 59, 999));
        const { data: dayTxns } = await supabase.from('transactions').select('amount,direction').eq('user_id', uid).eq('type', 'claim').gte('created_at', dayStart.toISOString()).lte('created_at', dayEnd.toISOString());
        const earnings = (dayTxns || []).reduce((s, t) => s + (t.direction === 'credit' ? Number(t.amount) : -Number(t.amount)), 0);
        days.push({ day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayStart.getDay()], earnings });
      }
      setChartData(days);

      setLoading(false);
    };
    load();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  const balance = wallet?.balance || 0;
  const allocationData = [
    { name: 'Wallet', value: balance, color: '#16C784' },
    { name: 'Invested', value: (activeInvestments || []).reduce((s, i) => s + Number(i.amount), 0), color: '#FACC15' },
    { name: 'Withdrawn', value: stats.totalWithdrawals, color: '#0FA06B' },
  ];

  return (
    <div>
      <DashboardHeader title={`Welcome, ${profile?.full_name?.split(' ')[0] || 'User'}`} subtitle="Here's your investment overview." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard variant="brand" glow className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-white/50">Wallet Balance</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">{formatNaira(balance)}</h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Wallet className="w-7 h-7 text-ink-900" strokeWidth={2.5} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div>
                <p className="text-xs text-white/40">Today's Earnings</p>
                <p className="font-display font-bold text-brand-400 mt-0.5">{formatNaira(wallet?.today_earnings || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-white/40">Total Deposits</p>
                <p className="font-display font-bold mt-0.5">{formatNaira(stats.totalDeposits)}</p>
              </div>
              <div>
                <p className="text-xs text-white/40">Total Withdrawals</p>
                <p className="font-display font-bold mt-0.5">{formatNaira(stats.totalWithdrawals)}</p>
              </div>
              <div>
                <p className="text-xs text-white/40">Referral Earnings</p>
                <p className="font-display font-bold text-gold-400 mt-0.5">{formatNaira(stats.referralEarnings)}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 h-full">
            <h3 className="font-display font-bold mb-4">Earnings (7 days)</h3>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16C784" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="earnings" stroke="#16C784" strokeWidth={2} fill="url(#earningsGrad)" />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,15,36,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatNaira(v)}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {quickActions.map((a, i) => (
          <motion.div key={a.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={a.href}>
              <GlassCard className="p-4 hover:bg-white/10 transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <a.icon className="w-5 h-5 text-ink-900" strokeWidth={2.5} />
                </div>
                <p className="font-display font-semibold text-sm">{a.label}</p>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">Recent Transactions</h3>
              <Link href="/dashboard/transactions" className="text-xs text-brand-400 hover:underline">View all</Link>
            </div>
            {recentTxns.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {recentTxns.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.direction === 'credit' ? 'bg-brand-500/15' : 'bg-red-500/15'}`}>
                        {t.direction === 'credit' ? <ArrowDownToLine className="w-4 h-4 text-brand-400" /> : <ArrowUpFromLine className="w-4 h-4 text-red-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{t.type.replace('_', ' ')}</p>
                        <p className="text-xs text-white/40">{timeAgo(t.created_at)}</p>
                      </div>
                    </div>
                    <p className={`font-display font-bold text-sm ${t.direction === 'credit' ? 'text-brand-400' : 'text-red-400'}`}>
                      {t.direction === 'credit' ? '+' : '-'}{formatNaira(Number(t.amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">Notifications</h3>
              <Link href="/dashboard/notifications" className="text-xs text-brand-400 hover:underline">View all</Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">No notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-white/20' : 'bg-brand-500'}`} />
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {activeInvestments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">Active Investments</h3>
              <Link href="/dashboard/active-investments" className="text-xs text-brand-400 hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeInvestments.map((inv) => {
                const elapsed = Math.min(inv.days_elapsed || 0, inv.duration_days);
                const progress = (elapsed / inv.duration_days) * 100;
                return (
                  <div key={inv.id} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{inv.plan_name}</span>
                      <span className="text-xs text-white/40">{elapsed}/{inv.duration_days} days</span>
                    </div>
                    <p className="font-display font-bold text-lg mb-2">{formatNaira(Number(inv.amount))}</p>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
