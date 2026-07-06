'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDateTime } from '@/lib/helpers';

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('claims').select('*, profiles!claims_user_id_fkey(full_name, phone)').order('created_at', { ascending: false });
      setClaims(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const totalClaims = claims.length;
  const todayClaims = claims.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length;
  const totalAmount = claims.reduce((s, c) => s + Number(c.amount), 0);

  return (
    <div>
      <DashboardHeader title="Claims" subtitle="All user daily claims." />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-5"><p className="text-xs text-white/40">Total Claims</p><p className="font-display font-bold text-2xl mt-1">{totalClaims}</p></GlassCard>
        <GlassCard className="p-5"><p className="text-xs text-white/40">Today's Claims</p><p className="font-display font-bold text-2xl mt-1 text-brand-400">{todayClaims}</p></GlassCard>
        <GlassCard className="p-5"><p className="text-xs text-white/40">Total Claimed</p><p className="font-display font-bold text-2xl mt-1">{formatNaira(totalAmount)}</p></GlassCard>
      </div>

      <GlassCard className="p-6">
        {claims.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-12">No claims found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/40 border-b border-white/10">
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-right py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 px-2 text-sm">{c.profiles?.full_name}</td>
                    <td className="py-3 px-2 text-right font-display font-bold text-sm text-brand-400">{formatNaira(Number(c.amount))}</td>
                    <td className="py-3 px-2 text-sm text-white/50">{formatDateTime(c.created_at)}</td>
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
