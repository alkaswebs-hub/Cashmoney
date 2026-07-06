'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Save, Banknote, Copy, Check } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { toast } from 'sonner';

export default function BankSettingsPage() {
  const [settings, setSettings] = useState({
    bank: 'Moniepoint',
    accountName: 'Bukar Dauda',
    accountNumber: '5005723997',
  });
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success('Bank settings saved');
  };

  const copy = () => {
    navigator.clipboard?.writeText(settings.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <DashboardHeader title="Bank Settings" subtitle="Configure the deposit bank account shown to users." />
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="brand" className="p-6">
            <h3 className="font-display font-semibold mb-5 flex items-center gap-2"><Banknote className="w-5 h-5 text-brand-400" /> Deposit Bank Account</h3>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Bank Name</label>
                <input value={settings.bank} onChange={(e) => setSettings({ ...settings, bank: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Account Name</label>
                <input value={settings.accountName} onChange={(e) => setSettings({ ...settings, accountName: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Account Number</label>
                <div className="flex gap-2">
                  <input value={settings.accountNumber} onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })} className="flex-1 glass rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
                  <button type="button" onClick={copy} className="glass-strong rounded-xl px-4 flex items-center gap-1.5 hover:bg-white/15 transition-colors">
                    {copied ? <Check className="w-4 h-4 text-brand-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-white/40 mb-2">Preview (what users see on Deposit page)</p>
                <div className="glass-brand rounded-xl p-4">
                  <p className="text-xs text-white/40">{settings.bank}</p>
                  <p className="font-semibold">{settings.accountName}</p>
                  <p className="font-display text-xl font-bold text-brand-400 tracking-wider mt-1">{settings.accountNumber}</p>
                </div>
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
