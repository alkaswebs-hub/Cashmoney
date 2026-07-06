'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const growthData = [
  { month: 'Jan', users: 12000, revenue: 180 },
  { month: 'Feb', users: 18500, revenue: 240 },
  { month: 'Mar', users: 24000, revenue: 320 },
  { month: 'Apr', users: 31000, revenue: 410 },
  { month: 'May', users: 38500, revenue: 520 },
  { month: 'Jun', users: 44000, revenue: 610 },
  { month: 'Jul', users: 48200, revenue: 680 },
];

const breakdown = [
  { name: 'Deposits', value: 2400, color: '#16C784' },
  { name: 'Withdrawals', value: 1800, color: '#FACC15' },
  { name: 'Claims', value: 1860, color: '#2DE7A4' },
  { name: 'Referrals', value: 240, color: '#FBBF24' },
];

export default function AdminReportsPage() {
  return (
    <div>
      <DashboardHeader title="Reports" subtitle="Platform analytics and insights." />

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-4">User Growth & Revenue</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(250,204,21,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v}M`} />
                  <Tooltip contentStyle={{ background: '#0A0F24', border: '1px solid rgba(22,199,132,0.3)', borderRadius: 12 }} />
                  <Line yAxisId="left" type="monotone" dataKey="users" stroke="#16C784" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#FACC15" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 h-full">
            <h3 className="font-display font-semibold mb-4">Transaction Breakdown</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {breakdown.map((d) => <Cell key={d.name} fill={d.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0A0F24', border: '1px solid rgba(22,199,132,0.3)', borderRadius: 12 }} formatter={(v: number) => `₦${v}M`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {breakdown.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /><span className="text-white/60">{d.name}</span></span>
                  <span className="font-medium">₦{d.value}M</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Deposit', value: '₦49,800' },
          { label: 'Avg. Withdrawal', value: '₦22,500' },
          { label: 'Conversion Rate', value: '68.5%' },
          { label: 'User Retention', value: '92.3%' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="p-5"><p className="text-xs text-white/40">{s.label}</p><p className="text-xl font-display font-bold mt-1">{s.value}</p></GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
