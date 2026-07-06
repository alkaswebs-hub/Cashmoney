'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Copy, Check, Upload, Banknote, FileText, Clock, CheckCircle2,
  AlertCircle, ArrowRight, Info,
} from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

const bankDetails = {
  bank: 'Moniepoint',
  accountName: 'Bukar Dauda',
  accountNumber: '5005723997',
};

type Stage = 'form' | 'pending' | 'approved';

export default function DepositPage() {
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [reference] = useState(() => `CM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('form');

  const copyAccount = () => {
    navigator.clipboard?.writeText(bankDetails.accountNumber);
    setCopied(true);
    toast.success('Account number copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setReceipt(f.name);
      toast.success('Receipt uploaded');
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 5000) {
      toast.error('Minimum deposit is ₦5,000');
      return;
    }
    if (!receipt) {
      toast.error('Please upload your payment receipt');
      return;
    }
    setStage('pending');
    toast.success('Deposit submitted. Awaiting admin approval.');
  };

  return (
    <div>
      <DashboardHeader title="Deposit Funds" subtitle="Minimum deposit: ₦5,000 via Moniepoint transfer." />

      <AnimatePresence mode="wait">
        {stage === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Bank details */}
            <GlassCard variant="brand" className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Banknote className="w-5 h-5 text-brand-400" />
                <h3 className="font-display font-semibold">Bank Transfer Details</h3>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-2xl p-4">
                  <p className="text-xs text-white/40 mb-1">Bank</p>
                  <p className="font-semibold">{bankDetails.bank}</p>
                </div>
                <div className="glass rounded-2xl p-4">
                  <p className="text-xs text-white/40 mb-1">Account Name</p>
                  <p className="font-semibold">{bankDetails.accountName}</p>
                </div>
                <div className="glass-brand rounded-2xl p-4">
                  <p className="text-xs text-white/40 mb-1">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl font-bold tracking-wider text-brand-400">{bankDetails.accountNumber}</p>
                    <button
                      onClick={copyAccount}
                      className="glass-strong rounded-full px-3 py-2 text-xs font-medium flex items-center gap-1.5 hover:bg-white/15 transition-colors"
                    >
                      {copied ? <><Check className="w-3.5 h-3.5 text-brand-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 glass rounded-2xl p-4 flex gap-3">
                <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white/60 leading-relaxed">
                  Transfer exactly the amount you want to deposit. Then upload your receipt below and submit.
                  Your wallet will be credited after admin approval.
                </p>
              </div>
            </GlassCard>

            {/* Deposit form */}
            <GlassCard className="p-6">
              <h3 className="font-display font-semibold mb-5">Submit Deposit</h3>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Deposit Amount (₦)</label>
                  <input
                    type="number"
                    min={5000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                  />
                  <p className="text-xs text-white/40 mt-1.5">Minimum: ₦5,000</p>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Reference Number</label>
                  <div className="glass rounded-xl px-4 py-3 text-sm font-mono text-brand-400">{reference}</div>
                  <p className="text-xs text-white/40 mt-1.5">Use this as transfer narration.</p>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Upload Payment Receipt</label>
                  <label className="block cursor-pointer">
                    <div className="glass rounded-xl border-2 border-dashed border-white/15 p-6 text-center hover:border-brand-500/50 transition-colors">
                      {receipt ? (
                        <div className="flex items-center justify-center gap-2 text-brand-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">{receipt}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-white/40 mx-auto mb-2" />
                          <p className="text-sm text-white/50">Click to upload receipt</p>
                          <p className="text-xs text-white/30 mt-1">PNG, JPG, PDF up to 5MB</p>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={onFile} />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all"
                >
                  Submit Deposit <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {stage === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-lg mx-auto"
          >
            <GlassCard variant="strong" className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-5">
                <Clock className="w-8 h-8 text-gold-400 animate-pulse" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Deposit Pending Approval</h3>
              <p className="text-sm text-white/50 mb-6">
                Your deposit of <span className="text-brand-400 font-semibold">₦{amount.toLocaleString()}</span> is being reviewed by our admin team.
                This usually takes a few minutes.
              </p>
              <div className="glass rounded-2xl p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/40">Reference</span><span className="font-mono text-brand-400">{reference}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Amount</span><span>₦{amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Status</span><span className="text-gold-400">Pending</span></div>
              </div>
              <button
                onClick={() => setStage('approved')}
                className="mt-6 text-sm text-brand-400 hover:underline"
              >
                Simulate approval (demo)
              </button>
            </GlassCard>
          </motion.div>
        )}

        {stage === 'approved' && (
          <motion.div
            key="approved"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto"
          >
            <GlassCard variant="brand" className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle2 className="w-8 h-8 text-brand-400" />
              </motion.div>
              <h3 className="font-display text-xl font-bold mb-2">Deposit Approved!</h3>
              <p className="text-sm text-white/50 mb-6">
                Your wallet has been credited with <span className="text-brand-400 font-semibold">₦{amount.toLocaleString()}</span>.
              </p>
              <div className="glass rounded-2xl p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/40">Amount</span><span>₦{amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Status</span><span className="text-brand-400">Approved</span></div>
                <div className="flex justify-between"><span className="text-white/40">New Balance</span><span className="text-brand-400 font-semibold">₦{(248500 + amount).toLocaleString()}</span></div>
              </div>
              <button
                onClick={() => { setStage('form'); setReceipt(null); }}
                className="mt-6 w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-xl"
              >
                Make Another Deposit
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
