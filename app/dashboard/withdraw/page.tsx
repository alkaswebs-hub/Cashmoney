'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpFromLine, Clock, Check } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira, generateReference, isWithinWithdrawWindow, formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const { profile } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ amount: '', bank_name: '', account_name: '', account_number: '' });
  const [submitting, setSubmitting] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowOpen, setWindowOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.from('settings').select('key,value');
      const map: Record<string, string> = {};
      (s || []).forEach((r: any) => { map[r.key] = r.value; });
      setSettings(map);

      const open = isWithinWithdrawWindow(
        map.withdraw_start || '09:00',
        map.withdraw_end || '12:00',
        map.withdraw_days || '1,2,3,4,5'
      );
      setWindowOpen(open);

      if (profile) {
        const { data: w } = await supabase.from('wallets').select('*').eq('user_id', profile.id).maybeSingle();
        setWallet(w);

        if (profile.bank_name) setForm(f => ({ ...f, bank_name: profile.bank_name || '' }));
        if (profile.account_name) setForm(f => ({ ...f, account_name: profile.account_name || '' }));
        if (profile.account_number) setForm(f => ({ ...f, account_number: profile.account_number || '' }));

        const { data: wd } = await supabase.from('withdrawals').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(5);
        setWithdrawals(wd || []);
      }
      setLoading(false);
    })();
  }, [profile]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    const minWd = parseFloat(settings.min_withdrawal || '1000');
    const balance = wallet?.balance || 0;

    if (!amt || amt < minWd) {
      toast.error(`Minimum withdrawal is ${formatNaira(minWd)}`);
      return;
    }
    if (amt > balance) {
      toast.error('Insufficient balance');
      return;
    }
    if (!form.bank_name || !form.account_name || !form.account_number) {
      toast.error('Please fill in all bank details');
      return;
    }

    setSubmitting(true);
    const reference = generateReference('WDR');

    const { error } = await supabase.from('withdrawals').insert({
      user_id: profile!.id,
      reference,
      amount: amt,
      bank_name: form.bank_name,
      account_name: form.account_name,
      account_number: form.account_number,
      status: 'pending',
    });

    if (error) {
      toast.error('Failed to submit withdrawal: ' + error.message);
    } else {
      toast.success('Withdrawal request submitted! Awaiting admin approval.');
      setForm(f => ({ ...f, amount: '' }));
      const { data: wd } = await supabase.from('withdrawals').select('*').eq('user_id', profile!.id).order('created_at', { ascending: false }).limit(5);
      setWithdrawals(wd || []);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const balance = wallet?.balance || 0;
  const minWd = parseFloat(settings.min_withdrawal || '1000');

  return (
    <div>
      <DashboardHeader title="Withdraw" subtitle="Request a withdrawal to your bank account." />

      {!windowOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <GlassCard className="p-4 border-gold-500/30">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gold-400">Withdrawal Window Closed</p>
                <p className="text-xs text-white/50 mt-0.5">
                  Withdrawals are only available Monday–Friday, {settings.withdraw_start || '09:00'}–{settings.withdraw_end || '12:00'} WAT.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="brand" className="p-6">
            <p className="text-sm text-white/50">Available Balance</p>
            <h2 className="font-display text-4xl font-bold mt-2">{formatNaira(balance)}</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Minimum withdrawal</span>
                <span className="font-medium">{formatNaira(minWd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Withdrawal window</span>
                <span className="font-medium">{settings.withdraw_start || '09:00'}–{settings.withdraw_end || '12:00'} WAT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Withdrawal days</span>
                <span className="font-medium">Mon–Fri</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-bold mb-5">Withdrawal Form</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Amount (₦)</label>
                <input
                  type="number"
                  required
                  min={minWd}
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  disabled={!windowOpen}
                  className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors disabled:opacity-50"
                  placeholder={`Minimum ${formatNaira(minWd)}`}
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Bank Name</label>
                <input
                  required
                  value={form.bank_name}
                  onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                  disabled={!windowOpen}
                  className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors disabled:opacity-50"
                  placeholder="e.g. Moniepoint"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Account Name</label>
                <input
                  required
                  value={form.account_name}
                  onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                  disabled={!windowOpen}
                  className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors disabled:opacity-50"
                  placeholder="Account name"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Account Number</label>
                <input
                  required
                  value={form.account_number}
                  onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                  disabled={!windowOpen}
                  className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors disabled:opacity-50"
                  placeholder="Account number"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !windowOpen}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Request Withdrawal'}
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>

      {withdrawals.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
          <GlassCard className="p-6">
            <h3 className="font-display font-bold mb-4">Recent Withdrawals</h3>
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      w.status === 'approved' ? 'bg-brand-500/15' : w.status === 'pending' ? 'bg-gold-500/15' : 'bg-red-500/15'
                    }`}>
                      {w.status === 'approved' ? <Check className="w-4 h-4 text-brand-400" /> : <Clock className="w-4 h-4 text-gold-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium font-mono">{w.reference}</p>
                      <p className="text-xs text-white/40">{w.bank_name} • {formatDateTime(w.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold">{formatNaira(Number(w.amount))}</p>
                    <span className={`text-xs capitalize ${w.status === 'approved' ? 'text-brand-400' : w.status === 'pending' ? 'text-gold-400' : 'text-red-400'}`}>{w.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
