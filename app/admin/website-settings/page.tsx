'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function WebsiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('settings').select('key,value');
      const map: Record<string, string> = {};
      (data || []).forEach((r: any) => { map[r.key] = r.value; });
      setSettings(map);
      setLoading(false);
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const keys = ['site_name', 'tagline', 'support_email', 'support_phone', 'telegram_link', 'whatsapp_link', 'maintenance_mode', 'email_notifications'];
    for (const key of keys) {
      if (settings[key] !== undefined) {
        await supabase.from('settings').upsert({ key, value: settings[key] });
      }
    }
    toast.success('Settings saved');
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Website Settings" subtitle="Configure your platform." />
      <GlassCard className="p-6 max-w-2xl">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Site Name</label>
            <input value={settings.site_name || ''} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Tagline</label>
            <input value={settings.tagline || ''} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Support Email</label>
            <input value={settings.support_email || ''} onChange={(e) => setSettings({ ...settings, support_email: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Support Phone</label>
            <input value={settings.support_phone || ''} onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Telegram Link</label>
            <input value={settings.telegram_link || ''} onChange={(e) => setSettings({ ...settings, telegram_link: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">WhatsApp Link</label>
            <input value={settings.whatsapp_link || ''} onChange={(e) => setSettings({ ...settings, whatsapp_link: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between glass rounded-xl p-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-white/40">Block user access to the platform</p>
              </div>
              <input type="checkbox" checked={settings.maintenance_mode === 'true'} onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked ? 'true' : 'false' })} className="w-5 h-5 accent-brand-500" />
            </label>
            <label className="flex items-center justify-between glass rounded-xl p-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-white/40">Send email notifications to users</p>
              </div>
              <input type="checkbox" checked={settings.email_notifications === 'true'} onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked ? 'true' : 'false' })} className="w-5 h-5 accent-brand-500" />
            </label>
          </div>
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 px-6 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 flex items-center gap-2">
            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
