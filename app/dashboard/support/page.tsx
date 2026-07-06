'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MessageSquare, Mail, Phone, Send, LifeBuoy, Clock } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

const faqs = [
  { q: 'When can I withdraw?', a: 'Withdrawals are processed Monday to Friday, 9:00 AM – 12:00 PM WAT.' },
  { q: 'How long do deposits take?', a: 'Deposits are credited after admin approval, usually within minutes.' },
  { q: 'How often can I claim?', a: 'You can claim your daily earnings once every 24 hours.' },
];

export default function SupportPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent. We will respond within 24 hours.');
    setMessage('');
    setLoading(false);
  };

  return (
    <div>
      <DashboardHeader title="Support" subtitle="We're here to help. Reach out anytime." />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Mail, label: 'Email', value: 'support@cashmoney.ng' },
          { icon: Phone, label: 'Phone', value: '+234 800 000 0000' },
          { icon: Clock, label: 'Hours', value: '9AM – 6PM WAT' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
                <c.icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-white/40">{c.label}</p>
                <p className="text-sm font-medium">{c.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-400" /> Send a Message
            </h3>
            <form onSubmit={send} className="space-y-4">
              <input required placeholder="Subject" className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
              <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue..." className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors resize-none" />
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50">
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-brand-400" /> Quick Answers
            </h3>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <p className="text-sm font-medium mb-1">{f.q}</p>
                  <p className="text-xs text-white/50">{f.a}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
