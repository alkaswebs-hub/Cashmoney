'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, Gift } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

export default function ReferralPage() {
  const { profile } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [bonusRate, setBonusRate] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data: refs } = await supabase
        .from('referrals')
        .select(`
          id, bonus_amount, status, created_at,
          referred_id
        `)
        .eq('referrer_id', profile.id)
        .order('created_at', { ascending: false });

      const refIds = (refs || []).map((r: any) => r.referred_id);
      let userMap: Record<string, any> = {};
      if (refIds.length > 0) {
        const { data: users } = await supabase.from('profiles').select('id, full_name, created_at').in('id', refIds);
        (users || []).forEach((u: any) => { userMap[u.id] = u; });
      }

      const enriched = (refs || []).map((r: any) => ({
        ...r,
        referred_user: userMap[r.referred_id],
      }));
      setReferrals(enriched);

      const { data: refTxns } = await supabase.from('transactions').select('amount').eq('user_id', profile.id).eq('type', 'referral').eq('direction', 'credit');
      setTotalEarnings((refTxns || []).reduce((s, t) => s + Number(t.amount), 0));

      const { data: s } = await supabase.from('settings').select('value').eq('key', 'referral_bonus').maybeSingle();
      setBonusRate(parseFloat(s?.value || '10'));

      setLoading(false);
    })();
  }, [profile]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const referralCode = profile?.referral_code || '';
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/auth/register?ref=${referralCode}` : '';

  return (
    <div>
      <DashboardHeader title="Referral Program" subtitle={`Earn ${bonusRate}% bonus on every referral's deposits.`} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-5">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-brand-400" />
            </div>
            <p className="text-xs text-white/40">Total Referrals</p>
            <p className="font-display font-bold text-2xl mt-0.5">{referrals.length}</p>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <GlassCard className="p-5">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-3">
              <Gift className="w-5 h-5 text-gold-400" />
            </div>
            <p className="text-xs text-white/40">Referral Earnings</p>
            <p className="font-display font-bold text-2xl mt-0.5 text-gold-400">{formatNaira(totalEarnings)}</p>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-5">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-3">
              <Share2 className="w-5 h-5 text-brand-400" />
            </div>
            <p className="text-xs text-white/40">Bonus Rate</p>
            <p className="font-display font-bold text-2xl mt-0.5">{bonusRate}%</p>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <GlassCard variant="brand" className="p-6">
          <h3 className="font-display font-bold mb-4">Share Your Referral Link</h3>
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs text-white/40">Referral Code</p>
                <p className="font-display font-bold text-lg tracking-wider truncate">{referralCode}</p>
              </div>
              <button onClick={() => copyText(referralCode, 'Referral code')} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs text-white/40">Referral Link</p>
                <p className="text-sm font-medium truncate">{referralLink}</p>
              </div>
              <button onClick={() => copyText(referralLink, 'Referral link')} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/?text=Join%20CASH%20MONEY%20and%20start%20earning%20daily!%20${encodeURIComponent(referralLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 glass rounded-xl py-3 text-sm font-medium text-center hover:bg-white/10 transition-colors"
              >
                Share on WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20CASH%20MONEY`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 glass rounded-xl py-3 text-sm font-medium text-center hover:bg-white/10 transition-colors"
              >
                Share on Telegram
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <GlassCard className="p-6">
        <h3 className="font-display font-bold mb-4">Referral History</h3>
        {referrals.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-8">No referrals yet. Share your link to start earning!</p>
        ) : (
          <div className="space-y-3">
            {referrals.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-ink-900 font-bold text-sm">
                    {r.referred_user?.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.referred_user?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-white/40">Joined {r.referred_user ? formatDate(r.referred_user.created_at) : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-sm">{formatNaira(Number(r.bonus_amount))}</p>
                  <span className={`text-xs capitalize ${r.status === 'paid' ? 'text-brand-400' : 'text-gold-400'}`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
