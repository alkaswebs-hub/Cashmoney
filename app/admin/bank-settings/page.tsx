'use client';

import { useEffect, useState } from 'react';
import { Save, Copy, Building2 } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function BankSettingsPage() {
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
    const keys = ['bank_name', 'account_name', 'account_number'];
    for (const key of keys) {
      if (settings[key] !== undefined) {
        await supabase.from('settings').upsert({ key, value: settings[key] });
      }
    }
    toast.success('Bank settings saved');
    setSaving(false);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied');
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Bank Settings" subtitle="Configure the bank account users deposit to." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-5">Bank Details</h3>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Bank Name</label>
              <input value={settings.bank_name || ''} onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Account Name</label>
              <input value={settings.account_name || ''} onChange={(e) => setSettings({ ...settings, account_name: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Account Number</label>
              <input value={settings.account_number || ''} onChange={(e) => setSettings({ ...settings, account_number: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
            </div>
            <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
            </button>
          </form>
        </GlassCard>

        <GlassCard variant="brand" className="p-6">
          <h3 className="font-display font-bold mb-4">Preview (What Users See)</h3>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-ink-900" strokeWidth={2.5} />
            </div>
            <p className="text-sm text-white/40">Deposit bank details</p>
          </div>
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div><p className="text-xs text-white/40">Bank Name</p><p className="font-display font-semibold mt-0.5">{settings.bank_name || 'Moniepoint'}</p></div>
              <button type="button" onClick={() => copyText(settings.bank_name || '')} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center"><Copy className="w-3.5 h-3.5" /></button>
            </div>
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div><p className="text-xs text-white/40">Account Name</p><p className="font-display font-semibold mt-0.5">{settings.account_name || 'Bukar Dauda'}</p></div>
              <button type="button" onClick={() => copyText(settings.account_name || '')} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center"><Copy className="w-3.5 h-3.5" /></button>
            </div>
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div><p className="text-xs text-white/40">Account Number</p><p className="font-display font-semibold text-lg mt-0.5 tracking-wider">{settings.account_number || '5005723997'}</p></div>
              <button type="button" onClick={() => copyText(settings.account_number || '')} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center"><Copy className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
