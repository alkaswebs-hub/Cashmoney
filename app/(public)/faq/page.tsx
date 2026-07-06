'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';

const faqs = [
  { q: 'What is CASH MONEY?', a: 'CASH MONEY is a Nigerian investment platform that lets you earn 10% daily returns on your investment over 120 days.' },
  { q: 'What is the minimum deposit?', a: 'The minimum deposit is ₦5,000 via Moniepoint bank transfer.' },
  { q: 'What is the minimum withdrawal?', a: 'The minimum withdrawal is ₦1,000.' },
  { q: 'How much can I earn daily?', a: 'You earn 10% of your investment amount every day for 120 days. You can claim once every 24 hours.' },
  { q: 'When can I withdraw my earnings?', a: 'Withdrawals are processed Monday to Friday, between 9:00 AM and 12:00 PM WAT.' },
  { q: 'How do deposits work?', a: 'You make a manual bank transfer to the Moniepoint account shown on your Deposit page, upload your payment receipt, and an admin approves it. Your wallet is then credited automatically.' },
  { q: 'How does the referral bonus work?', a: 'You earn 10% of every deposit made by someone who signs up with your referral link. Share via WhatsApp or Telegram.' },
  { q: 'How long are investment plans?', a: 'All investment plans run for 120 days with daily returns of 10%.' },
  { q: 'Can I claim daily earnings more than once?', a: 'No. Daily claims are limited to once every 24 hours per investment.' },
  { q: 'Is my money safe?', a: 'Yes. We use JWT authentication, encrypted passwords, and role-based admin access. All deposits are manually verified before crediting.' },
  { q: 'How do I contact support?', a: 'You can reach us via the Contact page or the in-app Support section. We respond within 24 hours.' },
  { q: 'What payment method is supported?', a: 'Currently, we accept manual bank transfers via Moniepoint only.' },
];

export default function FAQPage() {
  return (
    <div className="relative">
      <section className="relative py-20">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-500/15 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-400 text-sm font-semibold uppercase tracking-wider"
          >
            Help Center
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-bold mt-4"
          >
            Frequently Asked <span className="text-gradient-brand">Questions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 mt-4"
          >
            Everything you need to know about investing with CASH MONEY.
          </motion.p>
        </div>
      </section>

      <section className="relative py-10 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-3">
          {faqs.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              <summary className="cursor-pointer p-5 flex items-center justify-between list-none">
                <span className="font-medium">{f.q}</span>
                <ChevronRight className="w-5 h-5 text-brand-400 group-open:rotate-90 transition-transform shrink-0" />
              </summary>
              <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{f.a}</div>
            </motion.details>
          ))}
        </div>
      </section>
    </div>
  );
}
