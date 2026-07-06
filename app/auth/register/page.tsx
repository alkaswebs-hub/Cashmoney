'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, User, Lock, ArrowRight, Check } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirm: '', referral: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Account created! Welcome to CASH MONEY.');
    router.push('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard variant="strong" className="p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-white/50 mb-6">Start earning 10% daily in minutes.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                placeholder="Adebayo Okafor"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                placeholder="0800 000 0000"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                required
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Referral Code (optional)</label>
            <input
              value={form.referral}
              onChange={(e) => setForm({ ...form, referral: e.target.value })}
              className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
              placeholder="Enter referral code"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-5 flex items-center gap-2 text-xs text-white/40">
          <Check className="w-3.5 h-3.5 text-brand-400" />
          By signing up, you agree to our Terms & Privacy Policy.
        </div>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-400 font-medium hover:underline">Login</Link>
        </p>
      </GlassCard>
    </motion.div>
  );
}
