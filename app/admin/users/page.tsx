'use client';

import { useEffect, useState } from 'react';
import { Search, Ban, Check, Trash2, Wallet, X } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState<any | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustingAction, setAdjustingAction] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const userIds = (profiles || []).map((p: any) => p.id);
      const { data: wallets } = await supabase.from('wallets').select('*').in('user_id', userIds);
      const walletMap: Record<string, any> = {};
      (wallets || []).forEach((w: any) => { walletMap[w.user_id] = w; });
      setUsers((profiles || []).map((p: any) => ({ ...p, wallet: walletMap[p.id] })));
      setLoading(false);
    })();
  }, []);

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search) ||
    u.referral_code?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (user: any) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', user.id);
    if (error) {
      toast.error('Failed to update: ' + error.message);
    } else {
      toast.success(`User ${newStatus}`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    }
  };

  const deleteUser = async (user: any) => {
    if (!confirm(`Delete ${user.full_name}? This will permanently remove their account and all data.`)) return;
    const { error } = await supabase.from('profiles').delete().eq('id', user.id);
    if (error) {
      toast.error('Failed to delete: ' + error.message);
    } else {
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const adjustWallet = async () => {
    const amt = parseFloat(adjustAmount);
    if (!amt) {
      toast.error('Enter a valid amount');
      return;
    }
    setAdjustingAction(true);
    const w = adjusting.wallet;
    const newBalance = Number(w.balance) + amt;
    const { error } = await supabase.from('wallets').update({
      balance: newBalance,
      updated_at: new Date().toISOString(),
    }).eq('user_id', adjusting.id);

    if (error) {
      toast.error('Failed: ' + error.message);
    } else {
      await supabase.from('transactions').insert({
        user_id: adjusting.id,
        type: 'admin_adjustment',
        amount: Math.abs(amt),
        direction: amt > 0 ? 'credit' : 'debit',
        reference: `ADJ-${Date.now().toString(36).toUpperCase()}`,
      });
      toast.success(`Wallet ${amt > 0 ? 'credited' : 'debited'} ${formatNaira(Math.abs(amt))}`);
      setUsers(prev => prev.map(u => u.id === adjusting.id ? { ...u, wallet: { ...w, balance: newBalance } } : u));
      setAdjusting(null);
      setAdjustAmount('');
    }
    setAdjustingAction(false);
  };

  if (loading) return <div className="flex justify-center min-h-[60vh] items-center"><div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" /></div>;

  return (
    <div>
      <DashboardHeader title="Users" subtitle={`${users.length} registered users`} />

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone, or code..." className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors" />
      </div>

      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/40 border-b border-white/10">
                <th className="text-left py-3 px-2">User</th>
                <th className="text-left py-3 px-2">Phone</th>
                <th className="text-right py-3 px-2">Balance</th>
                <th className="text-left py-3 px-2">Joined</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-ink-900 font-bold text-sm">
                        {u.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.full_name}</p>
                        <p className="text-xs text-white/30">{u.referral_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-white/50">{u.phone}</td>
                  <td className="py-3 px-2 text-right font-display font-bold text-sm">{formatNaira(u.wallet?.balance || 0)}</td>
                  <td className="py-3 px-2 text-sm text-white/50">{formatDate(u.created_at)}</td>
                  <td className="py-3 px-2 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${u.status === 'active' ? 'bg-brand-500/15 text-brand-400' : 'bg-red-500/15 text-red-400'}`}>{u.status}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setAdjusting(u)} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-colors" title="Adjust wallet">
                        <Wallet className="w-4 h-4 text-gold-400" />
                      </button>
                      <button onClick={() => toggleStatus(u)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${u.status === 'active' ? 'bg-red-500/15 hover:bg-red-500/25' : 'bg-brand-500/15 hover:bg-brand-500/25'}`} title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                        {u.status === 'active' ? <Ban className="w-4 h-4 text-red-400" /> : <Check className="w-4 h-4 text-brand-400" />}
                      </button>
                      <button onClick={() => deleteUser(u)} className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-sm text-white/40 text-center py-8">No users found.</p>}
      </GlassCard>

      {adjusting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAdjusting(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold">Adjust Wallet — {adjusting.full_name}</h3>
                <button onClick={() => setAdjusting(null)} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-white/50 mb-4">Current balance: {formatNaira(adjusting.wallet?.balance || 0)}</p>
              <p className="text-xs text-white/40 mb-2">Enter amount (positive to credit, negative to debit)</p>
              <input type="number" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 border border-white/10 transition-colors mb-4" placeholder="e.g. 5000 or -2000" />
              <button onClick={adjustWallet} disabled={adjustingAction} className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3.5 rounded-xl hover:shadow-glow transition-all disabled:opacity-50">
                {adjustingAction ? 'Processing...' : 'Confirm Adjustment'}
              </button>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
