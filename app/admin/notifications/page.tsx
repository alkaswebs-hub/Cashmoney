'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Bell, Send, Users } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Notification sent to all users');
    setTitle(''); setBody('');
    setLoading(false);
  };

  return (
    <div>
      <DashboardHeader title="Notifications" subtitle="Send announcements to users." />
      <div className="max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Bell className="w-5 h-5 text-brand-400" /> New Notification</h3>
            <form onSubmit={send} className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" placeholder="Notification title" />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Message</label>
                <textarea required rows={4} value={body} onChange={(e) => setBody(e.target.value)} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors resize-none" placeholder="Notification message" />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Target Audience</label>
                <div className="flex gap-2">
                  {[{ v: 'all', l: 'All Users' }, { v: 'active', l: 'Active Only' }, { v: 'investors', l: 'Investors' }].map((t) => (
                    <button key={t.v} type="button" onClick={() => setTarget(t.v)} className={`px-4 py-2 rounded-full text-sm transition-all ${target === t.v ? 'bg-brand-500 text-ink-900 font-semibold' : 'glass text-white/60 hover:bg-white/10'}`}>{t.l}</button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50">
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Notification</>}
              </button>
            </form>
          </GlassCard>
        </motion.div>

        <div className="mt-6">
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Users className="w-5 h-5 text-brand-400" /> Recent Notifications</h3>
          <div className="space-y-3">
            {[
              { title: 'Withdrawal window open', time: '2 hours ago', target: 'All Users' },
              { title: 'New investment plan available', time: '1 day ago', target: 'All Users' },
              { title: 'Maintenance scheduled', time: '3 days ago', target: 'Active Only' },
            ].map((n, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="p-4 flex items-center justify-between">
                  <div><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-white/40">{n.time} • {n.target}</p></div>
                  <span className="text-xs text-brand-400">Delivered</span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
