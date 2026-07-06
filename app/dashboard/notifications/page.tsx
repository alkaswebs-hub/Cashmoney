'use client';

import { motion } from 'framer-motion';
import { Bell, Gift, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';

const notifications = [
  { icon: Gift, title: 'Daily earnings ready', desc: '₦18,000 is ready to claim from your Growth plan.', time: '2 hours ago', unread: true, color: 'text-brand-400', bg: 'bg-brand-500/15' },
  { icon: CheckCircle2, title: 'Deposit approved', desc: 'Your ₦50,000 deposit has been approved and credited.', time: '5 hours ago', unread: true, color: 'text-brand-400', bg: 'bg-brand-500/15' },
  { icon: TrendingUp, title: 'Referral bonus earned', desc: 'You earned ₦5,000 from Chioma E.\'s deposit.', time: '1 day ago', unread: false, color: 'text-gold-400', bg: 'bg-gold-500/15' },
  { icon: CheckCircle2, title: 'Withdrawal processed', desc: '₦20,000 sent to your Access Bank account.', time: '2 days ago', unread: false, color: 'text-brand-400', bg: 'bg-brand-500/15' },
  { icon: AlertCircle, title: 'Withdrawal window reminder', desc: 'Withdrawals open Mon–Fri, 9AM–12PM WAT.', time: '3 days ago', unread: false, color: 'text-gold-400', bg: 'bg-gold-500/15' },
];

export default function NotificationsPage() {
  return (
    <div>
      <DashboardHeader title="Notifications" subtitle="Stay updated on your account activity." />
      <div className="space-y-3 max-w-3xl">
        {notifications.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard className={`p-4 flex items-start gap-4 ${n.unread ? 'glass-brand' : ''}`}>
              <div className={`w-10 h-10 rounded-xl ${n.bg} flex items-center justify-center shrink-0`}>
                <n.icon className={`w-5 h-5 ${n.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                </div>
                <p className="text-sm text-white/50 mt-0.5">{n.desc}</p>
                <p className="text-xs text-white/30 mt-1">{n.time}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
