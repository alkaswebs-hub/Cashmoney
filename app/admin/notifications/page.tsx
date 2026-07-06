'use client';

import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({ title: '', body: '', target: 'all' });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('notifications').select('*, profiles!notifications_user_id_fkey(full_name)').order('created_at', { ascending: false }).limit(20);
      setNotifications(data || []);
      setLoading(false);
    })();
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);

    if (form.target === 'all') {
      const { data: users } = await supabase.from('profiles').select('id').eq('status', 'active');
      const userIds = (users || []).map((u: any) => u.id);
      const inserts = userIds.map((uid: string) => ({
        user_id: uid, title: form.title, body: form.body, type: 'broadcast' as const,
      }));
      const { error } = await supabase.from('notifications').insert(inserts);
      if (error) {
        toast.error('Failed: ' + error.message);
        setSending(false);
        return;
      }
    } else if (form.target === 'active') {
      const { data: users } = await supabase.from('profiles').select('id').eq('status', 'active');
      const { data: investments } = await supabase.from('investments').select('user_id').eq('status', 'active');
      const invUserIds = new Set((investments || []).map((i: any) => i.user_id));
      const targetIds = (users || []).filter((u: any) => invUserIds.has(u.id)).map((u: any) => u.id);
      const inserts = targetIds.map((uid: string) => ({
        user_id: uid, title: form.title, body: form.body, type: 'broadcast' as const,
      }));
      if (inserts.length > 0) {
        await supabase.from('notifications').insert(inserts);
      }
    }

    toast.success('Notification sent!');
    setForm({ title: '', body: '', target: 'all' });
    const { data } = await supabase.from('notifications').select('*, profiles!notifications_user_id_fkey(full_name)').order('created_at', { ascending: false }).limit(20);
    setNotifications(data || []);
    setSending(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Notifications" subtitle="Broadcast notifications to users." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-5">Send Notification</h3>
          <form onSubmit={send} className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" placeholder="Notification title" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Message</label>
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors resize-none" placeholder="Notification message" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Target Audience</label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All Users' },
                  { value: 'active', label: 'Active Investors' },
                ].map(t => (
                  <button key={t.value} type="button" onClick={() => setForm({ ...form, target: t.value })} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${form.target === t.value ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900' : 'glass text-white/60 hover:bg-white/10'}`}>{t.label}</button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={sending} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Notification</>}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display font-bold mb-4">Recent Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-8">No notifications sent yet.</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 15).map((n) => (
                <div key={n.id} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <span className="text-xs text-white/30">{formatDateTime(n.created_at)}</span>
                  </div>
                  <p className="text-xs text-white/50">{n.body}</p>
                  {n.profiles?.full_name && <p className="text-xs text-white/30 mt-1">To: {n.profiles.full_name}</p>}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
