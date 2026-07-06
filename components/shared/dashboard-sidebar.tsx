'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Wallet, ArrowDownToLine, ArrowUpFromLine,
  TrendingUp, Gift, Bell, User, LifeBuoy, LogOut, Menu, X,
  ChevronRight, Coins, History, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownToLine },
  { href: '/dashboard/deposit-history', label: 'Deposit History', icon: History },
  { href: '/dashboard/investments', label: 'Investment Plans', icon: TrendingUp },
  { href: '/dashboard/active-investments', label: 'Active Investments', icon: Coins },
  { href: '/dashboard/claim', label: 'Daily Claim', icon: Gift },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
  { href: '/dashboard/withdrawal-history', label: 'Withdrawal History', icon: History },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowDownToLine },
  { href: '/dashboard/referral', label: 'Referral Program', icon: Gift },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    toast.success('Logged out');
    router.push('/');
  };

  const NavList = () => (
    <>
      <div className="px-3 py-2">
        <p className="text-xs text-white/30 uppercase tracking-wider px-3 mb-2">Menu</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative',
                  active
                    ? 'glass-brand text-brand-400 font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-brand-500"
                  />
                )}
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 mt-auto pb-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-strong border-r border-white/10 h-screen sticky top-0">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-ink-900" strokeWidth={2.5} />
            </div>
            <span className="font-display font-extrabold text-base">
              CASH<span className="text-gradient-brand"> MONEY</span>
            </span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-3">
          <NavList />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-strong border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-ink-900" strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-sm">
            CASH<span className="text-gradient-brand"> MONEY</span>
          </span>
        </Link>
        <button onClick={() => setOpen(true)} className="text-white p-1">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-50"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 glass-strong border-r border-white/10 z-50 flex flex-col"
            >
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-display font-bold">Menu</span>
                <button onClick={() => setOpen(false)} className="text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-3">
                <NavList />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
