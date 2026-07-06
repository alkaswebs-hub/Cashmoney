'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatNaira } from '@/lib/helpers';
import { toast } from 'sonner';

export default function ReferralSettingsPage() {
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
    await supabase.from('settings').upsert({ key: 'referral_bonus', value: settings.referral_bonus || '10' });
    toast.success('Referral settings saved');
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Referral Settings" subtitle="Configure referral bonus percentage." />
      <GlassCard className="p-6 max-w-lg">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Referral Bonus (%)</label>
            <input type="number" value={settings.referral_bonus || '10'} onChange={(e) => setSettings({ ...settings, referral_bonus: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            <p className="text-xs text-white/40 mt-2">Referrers earn this percentage of their referral's first deposit.</p>
          </div>
          <div className="glass-brand rounded-xl p-4">
            <p className="text-xs text-white/40">Example: If a referral deposits {formatNaira(50000)}, the referrer earns {formatNaira(50000 * parseFloat(settings.referral_bonus || '10') / 100)}.</p>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
