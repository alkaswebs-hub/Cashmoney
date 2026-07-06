'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Phone, Mail, MapPin, Lock, Camera, Save } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: 'Adebayo Okafor',
    phone: '0800 000 0000',
    email: 'adebayo@email.com',
    location: 'Lagos, Nigeria',
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success('Profile updated');
  };

  return (
    <div>
      <DashboardHeader title="My Profile" subtitle="Manage your account information." />

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <GlassCard variant="strong" className="p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-ink-900 font-display font-bold text-3xl mx-auto">
                A
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full glass-strong flex items-center justify-center hover:bg-white/15 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-display font-semibold text-lg mt-4">{form.name}</h3>
            <p className="text-sm text-white/40">{form.phone}</p>
            <div className="glass-brand rounded-full px-3 py-1 inline-block mt-3 text-xs text-brand-400 font-medium">
              Verified Member
            </div>
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/10">
              <div><p className="text-xs text-white/40">Joined</p><p className="text-sm font-semibold">Mar 2026</p></div>
              <div><p className="text-xs text-white/40">Plans</p><p className="text-sm font-semibold">3</p></div>
              <div><p className="text-xs text-white/40">Referrals</p><p className="text-sm font-semibold">24</p></div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-5">Personal Information</h3>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-brand-400" /> Change Password</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="password" placeholder="New password" className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  <input type="password" placeholder="Confirm password" className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-glow transition-all disabled:opacity-50">
                {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
