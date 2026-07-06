'use client';

import { useEffect, useState } from 'react';
import { Check, X, Clock, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('deposits').select('*, profiles!deposits_user_id_fkey(full_name, phone, referred_by)').order('created_at', { ascending: false });
      setDeposits(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === 'all' ? deposits : deposits.filter(d => d.status === filter);

  const approve = async (dep: any) => {
    setActioning(dep.id);
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('deposits').update({
      status: 'approved',
      reviewed_by: user.user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', dep.id);

    if (error) {
      toast.error('Failed: ' + error.message);
    } else {
      const { data: w } = await supabase.from('wallets').select('*').eq('user_id', dep.user_id).maybeSingle();
      if (w) {
        await supabase.from('wallets').update({
          balance: Number(w.balance) + Number(dep.amount),
          updated_at: new Date().toISOString(),
        }).eq('user_id', dep.user_id);
      }
      await supabase.from('transactions').insert({
        user_id: dep.user_id, type: 'deposit', amount: dep.amount, direction: 'credit', reference: dep.reference,
      });
      await supabase.from('notifications').insert({
        user_id: dep.user_id, title: 'Deposit Approved!', body: `Your deposit of ${formatNaira(Number(dep.amount))} has been approved.`, type: 'success',
      });

      if (dep.profiles?.referred_by) {
        const { data: settings } = await supabase.from('settings').select('value').eq('key', 'referral_bonus').maybeSingle();
        const bonusRate = parseFloat(settings?.value || '10');
        const bonus = (Number(dep.amount) * bonusRate) / 100;
        const { data: refWallet } = await supabase.from('wallets').select('*').eq('user_id', dep.profiles.referred_by).maybeSingle();
        if (refWallet) {
          await supabase.from('wallets').update({
            balance: Number(refWallet.balance) + bonus, referral_earnings: Number(refWallet.referral_earnings) + bonus, updated_at: new Date().toISOString(),
          }).eq('user_id', dep.profiles.referred_by);
        }
        await supabase.from('transactions').insert({
          user_id: dep.profiles.referred_by, type: 'referral', amount: bonus, direction: 'credit', reference: `REF-${dep.reference}`,
        });
        await supabase.from('referrals').update({ bonus_amount: bonus, status: 'paid' }).eq('referred_id', dep.user_id);
      }

      toast.success('Deposit approved');
      setDeposits(prev => prev.map(d => d.id === dep.id ? { ...d, status: 'approved' } : d));
    }
    setActioning(null);
  };

  const reject = async (dep: any) => {
    setActioning(dep.id);
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('deposits').update({
      status: 'rejected', reviewed_by: user.user?.id, reviewed_at: new Date().toISOString(),
    }).eq('id', dep.id);

    if (error) {
      toast.error('Failed: ' + error.message);
    } else {
      await supabase.from('notifications').insert({
        user_id: dep.user_id, title: 'Deposit Rejected', body: `Your deposit of ${formatNaira(Number(dep.amount))} was rejected.`, type: 'error',
      });
      toast.success('Deposit rejected');
      setDeposits(prev => prev.map(d => d.id === dep.id ? { ...d, status: 'rejected' } : d));
    }
    setActioning(null);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Deposits" subtitle="Review and approve user deposits." />

      <div className="flex gap-2 mb-4">
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900' : 'glass text-white/60 hover:bg-white/10'}`}>{f}</button>
        ))}
      </div>

      <GlassCard className="p-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-12">No deposits found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/40 border-b border-white/10">
                  <th className="text-left py-3 px-2">Reference</th>
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-right py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-center py-3 px-2">Receipt</th>
                  <th className="text-center py-3 px-2">Status</th>
                  <th className="text-center py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 px-2 text-sm font-mono">{d.reference}</td>
                    <td className="py-3 px-2 text-sm">{d.profiles?.full_name}</td>
                    <td className="py-3 px-2 text-right font-display font-bold text-sm">{formatNaira(Number(d.amount))}</td>
                    <td className="py-3 px-2 text-sm text-white/50">{formatDateTime(d.created_at)}</td>
                    <td className="py-3 px-2 text-center">
                      {d.receipt_url ? <a href={d.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-400 hover:underline"><ExternalLink className="w-3 h-3" /> View</a> : <span className="text-xs text-white/30">N/A</span>}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${d.status === 'approved' ? 'bg-brand-500/15 text-brand-400' : d.status === 'pending' ? 'bg-gold-500/15 text-gold-400' : 'bg-red-500/15 text-red-400'}`}>{d.status}</span>
                    </td>
                    <td className="py-3 px-2">
                      {d.status === 'pending' && (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => approve(d)} disabled={actioning === d.id} className="w-8 h-8 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 flex items-center justify-center transition-colors disabled:opacity-50"><Check className="w-4 h-4 text-brand-400" /></button>
                          <button onClick={() => reject(d)} disabled={actioning === d.id} className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors disabled:opacity-50"><X className="w-4 h-4 text-red-400" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
