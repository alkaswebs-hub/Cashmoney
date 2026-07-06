'use client';

import { motion } from 'framer-motion';
import { Search, Ban, CheckCircle2, Users } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { useState } from 'react';
import { toast } from 'sonner';

const users = [
  { name: 'Adebayo Okafor', phone: '0800 000 0000', joined: 'Mar 2026', balance: 248500, status: 'active' },
  { name: 'Chioma Eze', phone: '0801 111 1111', joined: 'Apr 2026', balance: 132000, status: 'active' },
  { name: 'Ibrahim Musa', phone: '0802 222 2222', joined: 'Apr 2026', balance: 89000, status: 'active' },
  { name: 'Funke Adeyemi', phone: '0803 333 3333', joined: 'May 2026', balance: 56000, status: 'suspended' },
  { name: 'Tunde Oyelaran', phone: '0804 444 4444', joined: 'May 2026', balance: 310000, status: 'active' },
  { name: 'Ngozi Obi', phone: '0805 555 5555', joined: 'Jun 2026', balance: 15000, status: 'active' },
];

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const filtered = users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query));

  return (
    <div>
      <DashboardHeader title="Users" subtitle={`${users.length} registered users`} />
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 glass rounded-full px-4 py-2.5 mb-5 max-w-sm">
          <Search className="w-4 h-4 text-white/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/30" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Joined</th>
                <th className="pb-3 font-medium">Balance</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.phone} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-white/5 last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-ink-900 font-bold text-sm">{u.name[0]}</div>
                      <span className="text-sm font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-white/50">{u.phone}</td>
                  <td className="py-4 text-sm text-white/50">{u.joined}</td>
                  <td className="py-4 font-semibold">₦{u.balance.toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-brand-500/15 text-brand-400' : 'bg-red-500/15 text-red-400'}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.status === 'active' ? '#16C784' : '#ef4444' }} /> {u.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button onClick={() => toast.success(`User ${u.status === 'active' ? 'suspended' : 'activated'}`)} className="text-xs glass px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
