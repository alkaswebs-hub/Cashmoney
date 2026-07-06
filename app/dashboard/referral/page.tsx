'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Gift, Copy, Check, Share2, Users, TrendingUp, MessageCircle, Send } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

const referralLink = 'https://cashmoney.ng/r/ADEBAYO2026';
const referralCode = 'ADEBAYO2026';

const referralHistory = [
  { name: 'Chioma E.', date: 'Jul 4, 2026', bonus: 5000, status: 'paid' },
  { name: 'Ibrahim M.', date: 'Jul 2, 2026', bonus: 3000, status: 'paid' },
  { name: 'Funke A.', date: 'Jun 30, 2026', bonus: 2000, status: 'paid' },
  { name: 'Tunde O.', date: 'Jun 28, 2026', bonus: 10000, status: 'paid' },
];

export default function ReferralPage() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedLink(true);
    toast.success('Referral link copied');
    setTimeout(() => setCopiedLink(false), 2000);
  };
  const copyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedCode(true);
    toast.success('Referral code copied');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on CASH MONEY and earn 10% daily! Use my link: ${referralLink}`)}`, '_blank');
  };
  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me on CASH MONEY and earn 10% daily!')}`, '_blank');
  };

  return (
    <div>
      <DashboardHeader title="Referral Program" subtitle="Earn 10% bonus on every referral's deposit." />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users, label: 'Total Referrals', value: '24', color: 'text-brand-400' },
          { icon: Gift, label: 'Referral Earnings', value: '₦20,000', color: 'text-gold-400' },
          { icon: TrendingUp, label: 'This Month', value: '₦8,500', color: 'text-brand-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-white/40">{s.label}</p>
                  <p className="font-display font-bold text-lg">{s.value}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard variant="brand" className="p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-400" /> Share Your Link
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Referral Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 glass rounded-xl px-4 py-3 text-sm text-brand-400 truncate">{referralLink}</div>
                  <button onClick={copyLink} className="glass-strong rounded-xl px-4 flex items-center gap-1.5 hover:bg-white/15 transition-colors">
                    {copiedLink ? <Check className="w-4 h-4 text-brand-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Referral Code</label>
                <div className="flex gap-2">
                  <div className="flex-1 glass rounded-xl px-4 py-3 text-sm font-mono font-bold text-gold-400">{referralCode}</div>
                  <button onClick={copyCode} className="glass-strong rounded-xl px-4 flex items-center gap-1.5 hover:bg-white/15 transition-colors">
                    {copiedCode ? <Check className="w-4 h-4 text-brand-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={shareWhatsApp} className="bg-brand-500/15 text-brand-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-500/25 transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button onClick={shareTelegram} className="bg-brand-500/15 text-brand-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-500/25 transition-colors">
                  <Send className="w-4 h-4" /> Telegram
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-4">Referral History</h3>
            <div className="space-y-3">
              {referralHistory.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-ink-900 font-bold text-sm">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-white/40">{r.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-brand-400">+₦{r.bonus.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
