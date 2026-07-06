'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Users, ArrowDownToLine, ArrowUpFromLine, TrendingUp,
  Gift, FileBarChart, Bell, Settings, Coins, Menu, X, LogOut, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/deposits', label: 'Deposits', icon: ArrowDownToLine },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
  { href: '/admin/investments', label: 'Investments', icon: TrendingUp },
  { href: '/admin/claims', label: 'Claims', icon: Gift },
  { href: '/admin/support', label: 'Support', icon: Bell },
  { href: '/admin/reports', label: 'Reports', icon: FileBarChart },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/website-settings', label: 'Website Settings', icon: Settings },
  { href: '/admin/investment-settings', label: 'Investment Settings', icon: Coins },
  { href: '/admin/referral-settings', label: 'Referral Settings', icon: Gift },
  { href: '/admin/bank-settings', label: 'Bank Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await signOut();
    toast.success('Admin logged out');
    router.push('/');
  };

  const NavList = () => (
    <>
      <div className="px-3 py-2">
        <div className="glass-brand rounded-xl p-3 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-medium text-brand-400">Admin Panel</span>
        </div>
        <p className="text-xs text-white/30 uppercase tracking-wider px-3 mb-2">Management</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative',
                  active ? 'glass-brand text-brand-400 font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                {active && <motion.span layoutId="admin-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-brand-500" />}
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="px-3 mt-auto pb-4">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-strong border-r border-white/10 h-screen sticky top-0">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-ink-900" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display font-extrabold text-sm">CASH MONEY</p>
              <p className="text-[10px] text-gold-400">Admin Console</p>
            </div>
          </Link>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-3"><NavList /></div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-strong border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-ink-900" strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-sm">Admin</span>
        </Link>
        <button onClick={() => setOpen(true)} className="text-white p-1"><Menu className="w-6 h-6" /></button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 z-50" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25 }} className="lg:hidden fixed top-0 left-0 bottom-0 w-72 glass-strong border-r border-white/10 z-50 flex flex-col">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-display font-bold">Admin Menu</span>
                <button onClick={() => setOpen(false)} className="text-white/60"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-3"><NavList /></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
