'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Save, Globe, Moon, Bell, Shield } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

export default function WebsiteSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'CASH MONEY',
    tagline: 'Invest • Earn • Grow',
    supportEmail: 'support@cashmoney.ng',
    maintenanceMode: false,
    emailNotifications: true,
    twoFactor: true,
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success('Settings saved');
  };

  return (
    <div>
      <DashboardHeader title="Website Settings" subtitle="Configure platform-wide settings." />
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Globe className="w-5 h-5 text-brand-400" /> General</h3>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Site Name</label>
                  <input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Tagline</label>
                  <input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Support Email</label>
                <input value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                {[
                  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable user access', icon: Shield },
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send system emails to users', icon: Bell },
                  { key: 'twoFactor', label: 'Two-Factor Auth', desc: 'Require 2FA for admin accounts', icon: Moon },
                ].map((s) => (
                  <div key={s.key} className="flex items-center justify-between p-3 glass rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center"><s.icon className="w-4 h-4 text-brand-400" /></div>
                      <div><p className="text-sm font-medium">{s.label}</p><p className="text-xs text-white/40">{s.desc}</p></div>
                    </div>
                    <button type="button" onClick={() => setSettings({ ...settings, [s.key]: !settings[s.key as keyof typeof settings] })} className={`w-11 h-6 rounded-full transition-colors ${settings[s.key as keyof typeof settings] ? 'bg-brand-500' : 'bg-white/10'}`}>
                      <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${settings[s.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={saving} className="bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-glow transition-all disabled:opacity-50">
                {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
