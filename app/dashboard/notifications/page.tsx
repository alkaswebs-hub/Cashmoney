'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/helpers';

const typeIcons: Record<string, any> = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  broadcast: Bell,
};

export default function NotificationsPage() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${profile.id},user_id.is.null`)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setLoading(false);
    })();
  }, [profile]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await supabase.from('notifications').update({ read: true }).eq('id', n.id);
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <DashboardHeader title="Notifications" subtitle={unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'You\'re all caught up.'} />

      {unreadCount > 0 && (
        <div className="mb-4">
          <button onClick={markAllRead} className="text-sm text-brand-400 hover:underline flex items-center gap-2">
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No notifications yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <GlassCard key={n.id} className={`p-5 ${!n.read ? 'border-brand-500/30' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    n.type === 'success' ? 'bg-brand-500/15' :
                    n.type === 'warning' ? 'bg-gold-500/15' :
                    n.type === 'error' ? 'bg-red-500/15' :
                    'bg-white/5'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      n.type === 'success' ? 'text-brand-400' :
                      n.type === 'warning' ? 'text-gold-400' :
                      n.type === 'error' ? 'text-red-400' :
                      'text-white/60'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-white/50 mt-1">{n.body}</p>
                    <p className="text-xs text-white/30 mt-2">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="text-xs text-brand-400 hover:underline flex-shrink-0">
                      Mark read
                    </button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
