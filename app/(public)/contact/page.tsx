'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We will respond within 24 hours.');
    setForm({ name: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="relative">
      <section className="relative py-20">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-500/15 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-400 text-sm font-semibold uppercase tracking-wider"
          >
            Get in touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-bold mt-4"
          >
            Contact <span className="text-gradient-brand">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 mt-4"
          >
            Questions, feedback, or need help? We&apos;re here for you.
          </motion.p>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { icon: Mail, label: 'Email', value: 'support@cashmoney.ng' },
              { icon: Phone, label: 'Phone', value: '+234 800 000 0000' },
              { icon: MapPin, label: 'Address', value: 'Lagos, Nigeria' },
              { icon: MessageSquare, label: 'Live Chat', value: 'Available 9AM–6PM WAT' },
            ].map((c) => (
              <GlassCard key={c.label} className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/15 flex items-center justify-center shrink-0">
                  <c.icon className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40">{c.label}</p>
                  <p className="font-medium">{c.value}</p>
                </div>
              </GlassCard>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="strong" className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : <>Send Message <Send className="w-4 h-4" /></>}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
