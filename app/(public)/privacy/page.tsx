'use client';

import { motion } from 'framer-motion';

const sections = [
  { title: '1. Information We Collect', body: 'We collect your phone number, name, and transaction data (deposits, withdrawals, investments, referrals). We also collect device and usage information for security and analytics.' },
  { title: '2. How We Use Your Information', body: 'We use your information to operate your account, process deposits and withdrawals, calculate returns, manage referrals, provide support, and prevent fraud.' },
  { title: '3. Data Security', body: 'We protect your data with JWT-based authentication, encrypted passwords, and role-based access control. Sensitive financial data is never shared with third parties.' },
  { title: '4. Data Retention', body: 'We retain your account and transaction data for as long as your account is active. You may request deletion of your account and personal data at any time.' },
  { title: '5. Sharing of Information', body: 'We do not sell your personal data. We may share limited information with payment processors (Moniepoint) solely to facilitate deposits and withdrawals.' },
  { title: '6. Cookies', body: 'We use essential cookies to maintain your session and authentication state. We do not use advertising cookies.' },
  { title: '7. Your Rights', body: 'You have the right to access, correct, or delete your personal data. Contact support@cashmoney.ng to exercise these rights.' },
  { title: '8. Children\'s Privacy', body: 'CASH MONEY is not available to anyone under 18. We do not knowingly collect data from minors.' },
  { title: '9. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via the platform.' },
  { title: '10. Contact', body: 'For privacy questions, contact us at support@cashmoney.ng.' },
];

export default function PrivacyPage() {
  return (
    <div className="relative">
      <section className="relative py-20">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-500/15 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-400 text-sm font-semibold uppercase tracking-wider"
          >
            Legal
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-2"
          >
            Privacy <span className="text-gradient-brand">Policy</span>
          </motion.h1>
          <p className="text-sm text-white/40 mb-10">Last updated: July 2026</p>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <h2 className="font-display font-semibold text-lg mb-2 text-brand-400">{s.title}</h2>
                <p className="text-sm text-white/60 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
