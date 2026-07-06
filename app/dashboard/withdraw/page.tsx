'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpFromLine, Clock, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const [amount, setAmount] = useState(1000);
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Simulate WAT time check: Mon-Fri 9AM-12PM
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isWeekday = day >= 1 && day <= 5;
  const isWindow = hour >= 9 && hour < 12;
  const canWithdraw = isWeekday && isWindow;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 1000) { toast.error('Minimum withdrawal is ₦1,000'); return; }
    if (!bank || !account) { toast.error('Please enter bank details'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDone(true);
    setLoading(false);
    toast.success('Withdrawal request submitted!');
  };

  return (
    <div>
      <DashboardHeader title="Withdraw Funds" subtitle="Withdrawals: Mon–Fri, 9:00 AM – 12:00 PM WAT." />

      <div className="max-w-2xl mx-auto">
        {/* Status banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-2xl p-4 mb-6 flex items-center gap-3 ${canWithdraw ? 'glass-brand' : 'border-gold-500/30'}`}
        >
          {canWithdraw ? (
            <><CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" /><p className="text-sm text-brand-400">Withdrawal window is open! Submit your request now.</p></>
          ) : (
            <><Clock className="w-5 h-5 text-gold-400 shrink-0" /><p className="text-sm text-white/60">Withdrawals are only processed Mon–Fri, 9AM–12PM WAT. Please come back during the window.</p></>
          )}
        </motion.div>

        {done ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard variant="brand" className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-brand-400" />
              </motion.div>
              <h3 className="font-display text-xl font-bold mb-2">Withdrawal Submitted!</h3>
              <p className="text-sm text-white/50 mb-6">₦{amount.toLocaleString()} will be sent to {bank} ••••{account.slice(-4)} within 24 hours.</p>
              <button onClick={() => setDone(false)} className="text-sm text-brand-400 hover:underline">Make another withdrawal</button>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-6">
              <div className="glass rounded-2xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">Withdrawable Balance</p>
                  <p className="text-2xl font-display font-bold text-gold-400">₦48,500</p>
                </div>
                <ArrowUpFromLine className="w-8 h-8 text-white/20" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Amount (₦)</label>
                  <input
                    type="number"
                    min={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                  />
                  <p className="text-xs text-white/40 mt-1.5">Minimum: ₦1,000</p>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Bank Name</label>
                  <input
                    required
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                    placeholder="e.g. Access Bank"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Account Number</label>
                  <input
                    required
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                    placeholder="0123456789"
                  />
                </div>

                <div className="glass rounded-2xl p-3 flex gap-2">
                  <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/50">Withdrawals are processed within 24 hours during business days.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !canWithdraw}
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : <><ArrowUpFromLine className="w-4 h-4" /> Withdraw ₦{amount.toLocaleString()}</>}
                </button>
                {!canWithdraw && <p className="text-xs text-center text-gold-400/80">Withdrawal window closed. Available Mon–Fri, 9AM–12PM WAT.</p>}
              </form>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
