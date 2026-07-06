'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Save, Coins, TrendingUp, Clock } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

export default function InvestmentSettingsPage() {
  const [settings, setSettings] = useState({
    dailyReturn: 10,
    duration: 120,
    minDeposit: 5000,
    minWithdrawal: 1000,
    withdrawStart: '09:00',
    withdrawEnd: '12:00',
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success('Investment settings saved');
  };

  return (
    <div>
      <DashboardHeader title="Investment Settings" subtitle="Configure returns, durations, and limits." />
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Coins className="w-5 h-5 text-brand-400" /> Investment Parameters</h3>
            <form onSubmit={save} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Daily Return (%)</label>
                  <input type="number" value={settings.dailyReturn} onChange={(e) => setSettings({ ...settings, dailyReturn: Number(e.target.value) })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration (days)</label>
                  <input type="number" value={settings.duration} onChange={(e) => setSettings({ ...settings, duration: Number(e.target.value) })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Min Deposit (₦)</label>
                  <input type="number" value={settings.minDeposit} onChange={(e) => setSettings({ ...settings, minDeposit: Number(e.target.value) })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Min Withdrawal (₦)</label>
                  <input type="number" value={settings.minWithdrawal} onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/60 mb-3 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Withdrawal Window (WAT)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Start Time</label>
                    <input type="time" value={settings.withdrawStart} onChange={(e) => setSettings({ ...settings, withdrawStart: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">End Time</label>
                    <input type="time" value={settings.withdrawEnd} onChange={(e) => setSettings({ ...settings, withdrawEnd: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="glass-brand rounded-2xl p-4">
                <p className="text-sm text-brand-400 font-medium">Current Configuration</p>
                <p className="text-xs text-white/60 mt-1">{settings.dailyReturn}% daily for {settings.duration} days • Min deposit ₦{settings.minDeposit.toLocaleString()} • Withdrawals {settings.withdrawStart}–{settings.withdrawEnd} WAT</p>
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
