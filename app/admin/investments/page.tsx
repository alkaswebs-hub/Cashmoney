'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDate } from '@/lib/helpers';

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('investments').select('*, profiles!investments_user_id_fkey(full_name, phone)').order('created_at', { ascending: false });
      setInvestments(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const active = investments.filter(i => i.status === 'active');
  const totalInvested = investments.reduce((s, i) => s + Number(i.amount), 0);
  const totalPaidOut = investments.filter(i => i.status === 'completed').reduce((s, i) => s + (Number(i.amount) * Number(i.daily_rate) / 100) * i.duration_days, 0);

  return (
    <div>
      <DashboardHeader title="Investments" subtitle="All user investments." />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-5"><p className="text-xs text-white/40">Active</p><p className="font-display font-bold text-2xl mt-1 text-brand-400">{active.length}</p></GlassCard>
        <GlassCard className="p-5"><p className="text-xs text-white/40">Total Invested</p><p className="font-display font-bold text-2xl mt-1">{formatNaira(totalInvested)}</p></GlassCard>
        <GlassCard className="p-5"><p className="text-xs text-white/40">Total Paid Out</p><p className="font-display font-bold text-2xl mt-1">{formatNaira(totalPaidOut)}</p></GlassCard>
      </div>

      <GlassCard className="p-6">
        {investments.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-12">No investments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/40 border-b border-white/10">
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-left py-3 px-2">Plan</th>
                  <th className="text-right py-3 px-2">Amount</th>
                  <th className="text-center py-3 px-2">Daily</th>
                  <th className="text-center py-3 px-2">Day</th>
                  <th className="text-center py-3 px-2">Progress</th>
                  <th className="text-center py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => {
                  const progress = (Math.min(inv.days_elapsed || 0, inv.duration_days) / inv.duration_days) * 100;
                  return (
                    <tr key={inv.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 px-2 text-sm">{inv.profiles?.full_name}</td>
                      <td className="py-3 px-2 text-sm">{inv.plan_name}</td>
                      <td className="py-3 px-2 text-right font-display font-bold text-sm">{formatNaira(Number(inv.amount))}</td>
                      <td className="py-3 px-2 text-center text-sm text-brand-400">{inv.daily_rate}%</td>
                      <td className="py-3 px-2 text-center text-sm">{inv.days_elapsed}/{inv.duration_days}</td>
                      <td className="py-3 px-2">
                        <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden mx-auto">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${inv.status === 'active' ? 'bg-brand-500/15 text-brand-400' : inv.status === 'completed' ? 'bg-gold-500/15 text-gold-400' : 'bg-red-500/15 text-red-400'}`}>{inv.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
