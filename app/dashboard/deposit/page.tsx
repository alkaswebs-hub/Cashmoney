'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Upload, Check, Clock, X, Building2, FileText } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira, generateReference, formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function DepositPage() {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [amount, setAmount] = useState('');
  const [reference] = useState(generateReference('DEP'));
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.from('settings').select('key,value');
      const map: Record<string, string> = {};
      (s || []).forEach((r: any) => { map[r.key] = r.value; });
      setSettings(map);

      if (profile) {
        const { data: d } = await supabase.from('deposits').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(5);
        setDeposits(d || []);
      }
      setLoading(false);
    })();
  }, [profile]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    const minDeposit = parseFloat(settings.min_deposit || '5000');

    if (!amt || amt < minDeposit) {
      toast.error(`Minimum deposit is ${formatNaira(minDeposit)}`);
      return;
    }
    if (!receipt) {
      toast.error('Please upload your payment receipt');
      return;
    }

    setSubmitting(true);

    let receiptUrl: string | null = null;
    if (receipt && profile) {
      const ext = receipt.name.split('.').pop();
      const fileName = `${profile.id}/${reference}.${ext}`;
      const { error: upErr } = await supabase.storage.from('receipts').upload(fileName, receipt);
      if (upErr) {
        toast.error('Failed to upload receipt: ' + upErr.message);
        setSubmitting(false);
        return;
      }
      const { data: pub } = supabase.storage.from('receipts').getPublicUrl(fileName);
      receiptUrl = pub.publicUrl;
    }

    const { error } = await supabase.from('deposits').insert({
      user_id: profile!.id,
      reference,
      amount: amt,
      receipt_url: receiptUrl,
      status: 'pending',
    });

    if (error) {
      toast.error('Failed to submit deposit: ' + error.message);
    } else {
      toast.success('Deposit submitted! Awaiting admin approval.');
      setAmount('');
      setReceipt(null);
      const { data: d } = await supabase.from('deposits').select('*').eq('user_id', profile!.id).order('created_at', { ascending: false }).limit(5);
      setDeposits(d || []);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const bankName = settings.bank_name || 'Moniepoint';
  const accountName = settings.account_name || 'Bukar Dauda';
  const accountNumber = settings.account_number || '5005723997';
  const minDeposit = parseFloat(settings.min_deposit || '5000');

  return (
    <div>
      <DashboardHeader title="Deposit" subtitle="Make a bank transfer and upload your receipt." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="brand" className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-ink-900" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-display font-bold">Bank Details</h3>
                <p className="text-xs text-white/40">Transfer to this account</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">Bank Name</p>
                  <p className="font-display font-semibold mt-0.5">{bankName}</p>
                </div>
                <button onClick={() => copyText(bankName, 'Bank name')} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">Account Name</p>
                  <p className="font-display font-semibold mt-0.5">{accountName}</p>
                </div>
                <button onClick={() => copyText(accountName, 'Account name')} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">Account Number</p>
                  <p className="font-display font-semibold text-lg mt-0.5 tracking-wider">{accountNumber}</p>
                </div>
                <button onClick={() => copyText(accountNumber, 'Account number')} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-5 glass-brand rounded-xl p-4">
              <p className="text-xs text-white/40 mb-1">Your Reference Number</p>
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-brand-400 tracking-wider">{reference}</p>
                <button onClick={() => copyText(reference, 'Reference')} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-white/30 mt-2">Use this as the transfer description/narration.</p>
            </div>

            <div className="mt-4 text-xs text-white/40 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Minimum deposit: {formatNaira(minDeposit)}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-bold mb-5">Submit Deposit Proof</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Amount (₦)</label>
                <input
                  type="number"
                  required
                  min={minDeposit}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                  placeholder={`Minimum ${formatNaira(minDeposit)}`}
                />
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Reference Number</label>
                <input
                  readOnly
                  value={reference}
                  className="w-full glass rounded-xl px-4 py-3 text-sm outline-none border border-white/10 text-brand-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Upload Receipt</label>
                <label className="block">
                  <div className="glass rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/50 p-6 text-center cursor-pointer transition-colors">
                    {receipt ? (
                      <div className="flex items-center justify-center gap-2 text-brand-400">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">{receipt.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/40">
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Click to upload receipt image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Deposit'}
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>

      {deposits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
          <GlassCard className="p-6">
            <h3 className="font-display font-bold mb-4">Recent Deposits</h3>
            <div className="space-y-3">
              {deposits.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      d.status === 'approved' ? 'bg-brand-500/15' : d.status === 'pending' ? 'bg-gold-500/15' : 'bg-red-500/15'
                    }`}>
                      {d.status === 'approved' ? <Check className="w-4 h-4 text-brand-400" /> : d.status === 'pending' ? <Clock className="w-4 h-4 text-gold-400" /> : <X className="w-4 h-4 text-red-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium font-mono">{d.reference}</p>
                      <p className="text-xs text-white/40">{formatDateTime(d.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold">{formatNaira(Number(d.amount))}</p>
                    <span className={`text-xs capitalize ${d.status === 'approved' ? 'text-brand-400' : d.status === 'pending' ? 'text-gold-400' : 'text-red-400'}`}>{d.status}</span>
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
