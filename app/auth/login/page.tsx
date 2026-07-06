'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Welcome back!');
    router.push('/dashboard');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard variant="strong" className="p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-white/50 mb-6">Login to your CASH MONEY account.</p>

        <form onSubmit={onSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-white/60">Password</label>
              <Link href="/auth/forgot" className="text-xs text-brand-400 hover:underline">Forgot?</Link>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : <>Login <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-brand-400 font-medium hover:underline">Register</Link>
        </p>
      </GlassCard>
    </motion.div>
  );
}
