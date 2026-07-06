'use client';

import { useEffect, useState } from 'react';
import { Check, Clock, X } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDateTime } from '@/lib/helpers';

export default function WithdrawalHistoryPage() {
  const { profile } = useAuth();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data } = await supabase.from('withdrawals').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
      setWithdrawals(data || []);
      setLoading(false);
    })();
  }, [profile]);

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Withdrawal History" subtitle="All your withdrawal transactions." />

      <GlassCard className="p-6">
        {withdrawals.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-12">No withdrawals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/40 border-b border-white/10">
                  <th className="text-left py-3 px-2">Reference</th>
                  <th className="text-right py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Bank</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-center py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 px-2 text-sm font-mono">{w.reference}</td>
                    <td className="py-3 px-2 text-right font-display font-bold text-sm">{formatNaira(Number(w.amount))}</td>
                    <td className="py-3 px-2 text-sm text-white/50">{w.bank_name}<br/><span className="text-xs text-white/30">{w.account_number}</span></td>
                    <td className="py-3 px-2 text-sm text-white/50">{formatDateTime(w.created_at)}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full capitalize ${
                        w.status === 'approved' ? 'bg-brand-500/15 text-brand-400' :
                        w.status === 'pending' ? 'bg-gold-500/15 text-gold-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>
                        {w.status === 'approved' ? <Check className="w-3 h-3" /> : w.status === 'pending' ? <Clock className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {w.status}
                      </span>
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
