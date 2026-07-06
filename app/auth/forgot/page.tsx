'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, Mail } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { toast } from 'sonner';

export default function ForgotPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    toast.success('Reset instructions sent.');
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard variant="strong" className="p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Forgot password?</h1>
        <p className="text-sm text-white/50 mb-6">
          {sent ? 'Check your phone for reset instructions.' : 'Enter your phone number and we will send reset instructions.'}
        </p>

        {sent ? (
          <div className="glass-brand rounded-2xl p-6 text-center">
            <Mail className="w-10 h-10 text-brand-400 mx-auto mb-3" />
            <p className="text-sm text-white/70">Instructions sent to <span className="text-brand-400 font-medium">{phone}</span></p>
            <Link href="/auth/login" className="mt-4 inline-block text-sm text-brand-400 hover:underline">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                  placeholder="0800 000 0000"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : <>Send Instructions <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-white/50">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-brand-400 font-medium hover:underline">Login</Link>
        </p>
      </GlassCard>
    </motion.div>
  );
}
