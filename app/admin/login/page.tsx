'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    if (error) {
      toast.error('Invalid credentials');
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      toast.success('Welcome, Admin');
      router.push('/admin');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <GlassCard variant="strong" className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Shield className="w-7 h-7 text-ink-900" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold mb-1 text-center">Admin Panel</h1>
          <p className="text-sm text-white/50 mb-6 text-center">Authorized personnel only.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors"
                  placeholder="admin@cashmoney.ng"
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : <>Login to Admin <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
