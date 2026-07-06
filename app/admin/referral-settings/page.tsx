'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Save, Gift, Users } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

export default function ReferralSettingsPage() {
  const [settings, setSettings] = useState({
    bonusRate: 10,
    minPayout: 1000,
    autoCredit: true,
    maxReferrals: 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success('Referral settings saved');
  };

  return (
    <div>
      <DashboardHeader title="Referral Settings" subtitle="Configure the referral program." />
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Gift className="w-5 h-5 text-brand-400" /> Referral Program</h3>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Bonus Rate (%)</label>
                  <input type="number" value={settings.bonusRate} onChange={(e) => setSettings({ ...settings, bonusRate: Number(e.target.value) })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  <p className="text-xs text-white/40 mt-1.5">Percentage of referral's deposit</p>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Min Payout (₦)</label>
                  <input type="number" value={settings.minPayout} onChange={(e) => setSettings({ ...settings, minPayout: Number(e.target.value) })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Max Referrals (0 = unlimited)</label>
                <input type="number" value={settings.maxReferrals} onChange={(e) => setSettings({ ...settings, maxReferrals: Number(e.target.value) })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
              </div>
              <div className="flex items-center justify-between p-3 glass rounded-xl">
                <div><p className="text-sm font-medium">Auto-credit bonus</p><p className="text-xs text-white/40">Automatically credit referral bonuses on deposit</p></div>
                <button type="button" onClick={() => setSettings({ ...settings, autoCredit: !settings.autoCredit })} className={`w-11 h-6 rounded-full transition-colors ${settings.autoCredit ? 'bg-brand-500' : 'bg-white/10'}`}>
                  <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${settings.autoCredit ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
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
