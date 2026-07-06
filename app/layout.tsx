import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://cashmoney.ng'),
  title: 'CASH MONEY — Invest • Earn • Grow',
  description:
    'CASH MONEY is Nigeria’s premium investment platform. Invest, earn 10% daily returns over 120 days, and grow your wealth with confidence.',
  keywords: ['investment', 'Nigeria', 'fintech', 'daily returns', 'cash money'],
  openGraph: {
    title: 'CASH MONEY — Invest • Earn • Grow',
    description: 'Nigeria’s premium investment platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-[#050816] text-[#E6EDF3]"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
