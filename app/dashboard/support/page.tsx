'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MessageCircle, Send, HelpCircle } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function SupportPage() {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [tickets, setTickets] = useState<any[]>([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.from('settings').select('key,value');
      const map: Record<string, string> = {};
      (s || []).forEach((r: any) => { map[r.key] = r.value; });
      setSettings(map);

      if (profile) {
        const { data: t } = await supabase.from('support_tickets').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
        setTickets(t || []);
      }
      setLoading(false);
    })();
  }, [profile]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    const { error } = await supabase.from('support_tickets').insert({
      user_id: profile!.id,
      subject: form.subject,
      message: form.message,
      status: 'open',
    });

    if (error) {
      toast.error('Failed to send: ' + error.message);
    } else {
      toast.success('Support ticket submitted! We will get back to you.');
      setForm({ subject: '', message: '' });
      const { data: t } = await supabase.from('support_tickets').select('*').eq('user_id', profile!.id).order('created_at', { ascending: false });
      setTickets(t || []);
    }
    setSending(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Customer Support" subtitle="We're here to help you 24/7." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <a href={settings.whatsapp_link || '#'} target="_blank" rel="noopener noreferrer">
          <GlassCard className="p-5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5 text-brand-400" />
            </div>
            <p className="font-display font-semibold">WhatsApp</p>
            <p className="text-xs text-white/40 mt-0.5">Chat with us instantly</p>
          </GlassCard>
        </a>
        <a href={settings.telegram_link || '#'} target="_blank" rel="noopener noreferrer">
          <GlassCard className="p-5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5 text-brand-400" />
            </div>
            <p className="font-display font-semibold">Telegram</p>
            <p className="text-xs text-white/40 mt-0.5">Join our support group</p>
          </GlassCard>
        </a>
        <a href={`mailto:${settings.support_email || 'support@cashmoney.ng'}`}>
          <GlassCard className="p-5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-brand-400" />
            </div>
            <p className="font-display font-semibold">Email</p>
            <p className="text-xs text-white/40 mt-0.5">{settings.support_email || 'support@cashmoney.ng'}</p>
          </GlassCard>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-5">Send a Message</h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Subject</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" placeholder="What do you need help with?" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors resize-none" placeholder="Describe your issue..." />
            </div>
            <button type="submit" disabled={sending} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-4">Your Tickets</h3>
          {tickets.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-8">No support tickets yet.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{t.subject}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      t.status === 'open' ? 'bg-gold-500/15 text-gold-400' :
                      t.status === 'resolved' ? 'bg-brand-500/15 text-brand-400' :
                      'bg-white/5 text-white/40'
                    }`}>{t.status}</span>
                  </div>
                  <p className="text-xs text-white/50">{t.message}</p>
                  <p className="text-xs text-white/30 mt-2">{formatDateTime(t.created_at)}</p>
                  {t.admin_response && (
                    <div className="mt-3 glass-brand rounded-lg p-3">
                      <p className="text-xs text-brand-400 font-medium">Admin Response:</p>
                      <p className="text-xs text-white/60 mt-1">{t.admin_response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard className="p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-5 h-5 text-brand-400" />
          <h3 className="font-display font-bold">Quick FAQ</h3>
        </div>
        <div className="space-y-3">
          <div className="glass rounded-xl p-4">
            <p className="text-sm font-medium">How long do deposits take to reflect?</p>
            <p className="text-xs text-white/50 mt-1">Deposits are approved within 1-24 hours after submitting your receipt.</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm font-medium">When can I withdraw?</p>
            <p className="text-xs text-white/50 mt-1">Withdrawals are available Monday-Friday, 9:00 AM - 12:00 PM WAT.</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm font-medium">How much can I earn?</p>
            <p className="text-xs text-white/50 mt-1">You earn 10% daily on your investment for 120 days. Claim your earnings every 24 hours.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
