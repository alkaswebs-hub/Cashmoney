'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass-strong border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-ink-900" strokeWidth={2.5} />
            </div>
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight">
            CASH<span className="text-gradient-brand"> MONEY</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 px-5 py-2.5 rounded-full hover:shadow-glow transition-all duration-300"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass-strong border-t border-white/10 mt-3"
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2 border-t border-white/10">
              <Link
                href="/auth/login"
                className="flex-1 text-center py-2.5 rounded-full border border-white/15 text-white"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex-1 text-center py-2.5 rounded-full bg-brand-500 text-ink-900 font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
