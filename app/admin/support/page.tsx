'use client';

import { useEffect, useState } from 'react';
import { Send, X } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<any | null>(null);
  const [response, setResponse] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('support_tickets').select('*, profiles!support_tickets_user_id_fkey(full_name, phone)').order('created_at', { ascending: false });
      setTickets(data || []);
      setLoading(false);
    })();
  }, []);

  const respond = async () => {
    if (!response) {
      toast.error('Please enter a response');
      return;
    }
    setSending(true);
    const { error } = await supabase.from('support_tickets').update({
      admin_response: response,
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    }).eq('id', responding.id);

    if (error) {
      toast.error('Failed: ' + error.message);
    } else {
      await supabase.from('notifications').insert({
        user_id: responding.user_id, title: 'Support Ticket Resolved', body: `Your ticket "${responding.subject}" has been resolved.`, type: 'success',
      });
      toast.success('Response sent');
      setTickets(prev => prev.map(t => t.id === responding.id ? { ...t, admin_response: response, status: 'resolved' } : t));
      setResponding(null);
      setResponse('');
    }
    setSending(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Support Tickets" subtitle="Manage user support requests." />

      <GlassCard className="p-6">
        {tickets.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-12">No support tickets.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{t.subject}</p>
                    <p className="text-xs text-white/40">{t.profiles?.full_name} • {formatDateTime(t.created_at)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${t.status === 'open' ? 'bg-gold-500/15 text-gold-400' : t.status === 'resolved' ? 'bg-brand-500/15 text-brand-400' : 'bg-white/5 text-white/40'}`}>{t.status}</span>
                </div>
                <p className="text-sm text-white/50">{t.message}</p>
                {t.admin_response && (
                  <div className="mt-3 glass-brand rounded-lg p-3">
                    <p className="text-xs text-brand-400 font-medium">Admin Response:</p>
                    <p className="text-xs text-white/60 mt-1">{t.admin_response}</p>
                  </div>
                )}
                {t.status === 'open' && (
                  <button onClick={() => setResponding(t)} className="mt-3 text-sm text-brand-400 hover:underline flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Respond
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {responding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setResponding(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold">Respond to: {responding.subject}</h3>
                <button onClick={() => setResponding(null)} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-white/50 mb-4">{responding.message}</p>
              <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={4} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors resize-none mb-4" placeholder="Type your response..." />
              <button onClick={respond} disabled={sending} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Response</>}
              </button>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
