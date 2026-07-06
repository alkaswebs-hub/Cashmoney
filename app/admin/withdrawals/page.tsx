'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('withdrawals').select('*, profiles!withdrawals_user_id_fkey(full_name, phone)').order('created_at', { ascending: false });
      setWithdrawals(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter);

  const approve = async (wd: any) => {
    setActioning(wd.id);
    const { data: w } = await supabase.from('wallets').select('*').eq('user_id', wd.user_id).maybeSingle();
    if (w && Number(w.balance) < Number(wd.amount)) {
      toast.error('User has insufficient balance');
      setActioning(null);
      return;
    }
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('withdrawals').update({
      status: 'approved', reviewed_by: user.user?.id, reviewed_at: new Date().toISOString(),
    }).eq('id', wd.id);

    if (error) {
      toast.error('Failed: ' + error.message);
    } else {
      if (w) {
        await supabase.from('wallets').update({
          balance: Number(w.balance) - Number(wd.amount), updated_at: new Date().toISOString(),
        }).eq('user_id', wd.user_id);
      }
      await supabase.from('transactions').insert({
        user_id: wd.user_id, type: 'withdrawal', amount: wd.amount, direction: 'debit', reference: wd.reference,
      });
      await supabase.from('notifications').insert({
        user_id: wd.user_id, title: 'Withdrawal Approved!', body: `Your withdrawal of ${formatNaira(Number(wd.amount))} has been approved.`, type: 'success',
      });
      toast.success('Withdrawal approved');
      setWithdrawals(prev => prev.map(w => w.id === wd.id ? { ...w, status: 'approved' } : w));
    }
    setActioning(null);
  };

  const reject = async (wd: any) => {
    setActioning(wd.id);
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('withdrawals').update({
      status: 'rejected', reviewed_by: user.user?.id, reviewed_at: new Date().toISOString(),
    }).eq('id', wd.id);

    if (error) {
      toast.error('Failed: ' + error.message);
    } else {
      await supabase.from('notifications').insert({
        user_id: wd.user_id, title: 'Withdrawal Rejected', body: `Your withdrawal of ${formatNaira(Number(wd.amount))} was rejected.`, type: 'error',
      });
      toast.success('Withdrawal rejected');
      setWithdrawals(prev => prev.map(w => w.id === wd.id ? { ...w, status: 'rejected' } : w));
    }
    setActioning(null);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Withdrawals" subtitle="Review and approve withdrawal requests." />

      <div className="flex gap-2 mb-4">
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900' : 'glass text-white/60 hover:bg-white/10'}`}>{f}</button>
        ))}
      </div>

      <GlassCard className="p-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-12">No withdrawals found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/40 border-b border-white/10">
                  <th className="text-left py-3 px-2">Reference</th>
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-right py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Bank</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-center py-3 px-2">Status</th>
                  <th className="text-center py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 px-2 text-sm font-mono">{w.reference}</td>
                    <td className="py-3 px-2 text-sm">{w.profiles?.full_name}</td>
                    <td className="py-3 px-2 text-right font-display font-bold text-sm">{formatNaira(Number(w.amount))}</td>
                    <td className="py-3 px-2 text-sm text-white/50">{w.bank_name}<br/><span className="text-xs text-white/30">{w.account_name} • {w.account_number}</span></td>
                    <td className="py-3 px-2 text-sm text-white/50">{formatDateTime(w.created_at)}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${w.status === 'approved' ? 'bg-brand-500/15 text-brand-400' : w.status === 'pending' ? 'bg-gold-500/15 text-gold-400' : 'bg-red-500/15 text-red-400'}`}>{w.status}</span>
                    </td>
                    <td className="py-3 px-2">
                      {w.status === 'pending' && (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => approve(w)} disabled={actioning === w.id} className="w-8 h-8 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 flex items-center justify-center transition-colors disabled:opacity-50"><Check className="w-4 h-4 text-brand-400" /></button>
                          <button onClick={() => reject(w)} disabled={actioning === w.id} className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors disabled:opacity-50"><X className="w-4 h-4 text-red-400" /></button>
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
