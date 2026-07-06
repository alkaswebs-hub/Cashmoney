'use client';

import { motion } from 'framer-motion';

const sections = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using CASH MONEY, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.' },
  { title: '2. Eligibility', body: 'You must be at least 18 years old and a resident of Nigeria to use CASH MONEY. By registering, you confirm you meet these requirements.' },
  { title: '3. Investment Plans', body: 'CASH MONEY offers 120-day investment plans with a daily return of 10%. Returns are claimable once every 24 hours per investment. Investment durations and rates may be updated at our discretion.' },
  { title: '4. Deposits', body: 'The minimum deposit is ₦5,000. Deposits are made via manual bank transfer to our Moniepoint account. You must upload a payment receipt. Wallets are credited only after admin approval of your deposit.' },
  { title: '5. Withdrawals', body: 'The minimum withdrawal is ₦1,000. Withdrawals are processed Monday to Friday between 9:00 AM and 12:00 PM WAT only. Withdrawal requests outside this window will not be processed.' },
  { title: '6. Referral Program', body: 'You earn a 10% referral bonus on deposits made by users who sign up with your referral link. Bonus earnings are credited to your referral balance and are subject to the same withdrawal rules.' },
  { title: '7. Account Security', body: 'You are responsible for keeping your account credentials secure. We use JWT authentication and encrypted passwords. We are not liable for losses due to compromised credentials you control.' },
  { title: '8. Prohibited Activities', body: 'You may not create multiple accounts, manipulate the referral system, or engage in fraudulent deposits. Violations result in account suspension and forfeiture of balances.' },
  { title: '9. Limitation of Liability', body: 'CASH MONEY is not liable for indirect, incidental, or consequential damages arising from your use of the platform. Our maximum liability is limited to your account balance.' },
  { title: '10. Changes to Terms', body: 'We may update these Terms at any time. Continued use of CASH MONEY after changes constitutes acceptance of the updated Terms.' },
  { title: '11. Contact', body: 'For questions about these Terms, contact us at support@cashmoney.ng.' },
];

export default function TermsPage() {
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
            Terms of <span className="text-gradient-brand">Service</span>
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
