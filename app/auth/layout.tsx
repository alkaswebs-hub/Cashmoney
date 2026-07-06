import { Particles } from '@/components/shared/particles';
import { Wallet } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold-500/10 rounded-full blur-[100px] animate-glow-pulse" />
      <Particles count={20} />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-ink-900" strokeWidth={2.5} />
            </div>
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">
            CASH<span className="text-gradient-brand"> MONEY</span>
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}
