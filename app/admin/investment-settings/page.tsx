'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatNaira } from '@/lib/helpers';
import { toast } from 'sonner';

export default function InvestmentSettingsPage() {
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
    const keys = ['daily_return', 'duration_days', 'min_deposit', 'min_withdrawal', 'withdraw_start', 'withdraw_end', 'withdraw_days'];
    for (const key of keys) {
      if (settings[key] !== undefined) {
        await supabase.from('settings').upsert({ key, value: settings[key] });
      }
    }
    toast.success('Investment settings saved');
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Investment Settings" subtitle="Configure investment plans and withdrawal rules." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-5">Investment Configuration</h3>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Daily Return (%)</label>
              <input type="number" value={settings.daily_return || '10'} onChange={(e) => setSettings({ ...settings, daily_return: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Duration (days)</label>
              <input type="number" value={settings.duration_days || '120'} onChange={(e) => setSettings({ ...settings, duration_days: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Minimum Deposit (₦)</label>
              <input type="number" value={settings.min_deposit || '5000'} onChange={(e) => setSettings({ ...settings, min_deposit: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Minimum Withdrawal (₦)</label>
              <input type="number" value={settings.min_withdrawal || '1000'} onChange={(e) => setSettings({ ...settings, min_withdrawal: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-5">Withdrawal Window</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Withdrawal Start Time</label>
              <input type="time" value={settings.withdraw_start || '09:00'} onChange={(e) => setSettings({ ...settings, withdraw_start: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Withdrawal End Time</label>
              <input type="time" value={settings.withdraw_end || '12:00'} onChange={(e) => setSettings({ ...settings, withdraw_end: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Allowed Days (0=Sun, 1=Mon, ..., 6=Sat)</label>
              <input value={settings.withdraw_days || '1,2,3,4,5'} onChange={(e) => setSettings({ ...settings, withdraw_days: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" placeholder="e.g. 1,2,3,4,5" />
            </div>
          </div>
          <div className="mt-6 glass-brand rounded-xl p-4">
            <p className="text-xs text-white/40 mb-2">Current Configuration</p>
            <div className="space-y-1 text-sm">
              <p>Daily Return: <span className="text-brand-400 font-medium">{settings.daily_return || '10'}%</span></p>
              <p>Duration: <span className="text-brand-400 font-medium">{settings.duration_days || '120'} days</span></p>
              <p>Min Deposit: <span className="text-brand-400 font-medium">{formatNaira(parseFloat(settings.min_deposit || '5000'))}</span></p>
              <p>Min Withdrawal: <span className="text-brand-400 font-medium">{formatNaira(parseFloat(settings.min_withdrawal || '1000'))}</span></p>
              <p>Window: <span className="text-brand-400 font-medium">{settings.withdraw_start || '09:00'}–{settings.withdraw_end || '12:00'} WAT</span></p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
