'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building, Camera, Save, Calendar, Users, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', country: 'Nigeria', bank_name: '', account_name: '', account_number: '' });
  const [stats, setStats] = useState({ joined: '', investments: 0, referrals: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: '',
        country: profile.country || 'Nigeria',
        bank_name: profile.bank_name || '',
        account_name: profile.account_name || '',
        account_number: profile.account_number || '',
      });

      const { data: invs } = await supabase.from('investments').select('id').eq('user_id', profile.id);
      const { data: refs } = await supabase.from('referrals').select('id').eq('referrer_id', profile.id);
      setStats({
        joined: formatDate(profile.created_at),
        investments: invs?.length || 0,
        referrals: refs?.length || 0,
      });
      setLoading(false);
    })();
  }, [profile]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      phone: form.phone,
      country: form.country,
      bank_name: form.bank_name,
      account_name: form.account_name,
      account_number: form.account_number,
    }).eq('id', profile!.id);

    if (error) {
      toast.error('Failed to update profile: ' + error.message);
    } else {
      toast.success('Profile updated successfully');
      await refreshProfile();
    }
    setSaving(false);
  };

  const onAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) {
      toast.error('Upload failed: ' + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.from('profiles').update({ avatar_url: pub.publicUrl }).eq('id', profile.id);
    await refreshProfile();
    toast.success('Profile picture updated');
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Profile" subtitle="Manage your account and bank details." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-ink-900 font-display font-bold text-3xl mx-auto">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  profile?.full_name?.charAt(0) || '?'
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center cursor-pointer hover:bg-brand-400 transition-colors">
                <Camera className="w-4 h-4 text-ink-900" />
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} />
              </label>
            </div>
            <h3 className="font-display font-bold text-lg mt-4">{profile?.full_name}</h3>
            <p className="text-sm text-white/40">{profile?.phone}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Active
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="glass rounded-xl p-3">
                <Calendar className="w-4 h-4 text-white/40 mx-auto mb-1" />
                <p className="text-xs text-white/40">Joined</p>
                <p className="text-xs font-medium mt-0.5">{stats.joined}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <TrendingUp className="w-4 h-4 text-white/40 mx-auto mb-1" />
                <p className="text-xs text-white/40">Plans</p>
                <p className="text-xs font-medium mt-0.5">{stats.investments}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <Users className="w-4 h-4 text-white/40 mx-auto mb-1" />
                <p className="text-xs text-white/40">Referrals</p>
                <p className="text-xs font-medium mt-0.5">{stats.referrals}</p>
              </div>
            </div>

            <div className="mt-4 glass-brand rounded-xl p-3">
              <p className="text-xs text-white/40">Referral Code</p>
              <p className="font-display font-bold text-brand-400 tracking-wider mt-0.5">{profile?.referral_code}</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="font-display font-bold mb-5">Personal Information</h3>
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={form.email} readOnly className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none border border-white/10 text-white/40" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Country</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-400" /> Bank Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block">Bank Name</label>
                    <input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" placeholder="Bank name" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block">Account Name</label>
                    <input value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" placeholder="Account name" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block">Account Number</label>
                    <input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" placeholder="Account number" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
