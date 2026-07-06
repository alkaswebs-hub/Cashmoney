'use client';

import Link from 'next/link';
import { Wallet, Mail, Phone, MapPin, Send } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-900/10 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-ink-900" strokeWidth={2.5} />
              </div>
              <span className="font-display font-extrabold text-lg">
                CASH<span className="text-gradient-brand"> MONEY</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Nigeria&apos;s premium investment platform. Invest • Earn • Grow
              with confidence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="/about" className="hover:text-brand-400 transition-colors">About</Link></li>
              <li><Link href="/faq" className="hover:text-brand-400 transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Legal</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Get in touch</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@cashmoney.ng</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +234 800 000 0000</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lagos, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} CASH MONEY. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1.5">
            <Send className="w-3 h-3" /> Invest • Earn • Grow
          </p>
        </div>
      </div>
    </footer>
  );
}
