'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/shared/admin-sidebar';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, loading, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (loading) return;
    if (isLogin) {
      if (session && profile?.role === 'admin') router.replace('/admin');
      return;
    }
    if (!session) {
      router.replace('/admin/login');
      return;
    }
    if (profile && profile.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [loading, session, profile, router, isLogin]);

  if (isLogin) return <>{children}</>;

  if (loading || !session || (profile && profile.role !== 'admin')) {
    return (
      <div className="flex min-h-screen bg-[#050816] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
          <p className="text-sm text-white/50">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050816]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
