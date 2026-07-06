'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Heart, Shield, Users, TrendingUp } from 'lucide-react';
import { Particles } from '@/components/shared/particles';
import { GlassCard } from '@/components/shared/glass-card';

const values = [
  { icon: Shield, title: 'Security First', desc: 'Every naira protected with bank-grade encryption and manual verification.' },
  { icon: Heart, title: 'Customer Obsessed', desc: 'We treat your money like ours. Fast support, transparent processes.' },
  { icon: TrendingUp, title: 'Growth Mindset', desc: 'We build tools that help every Nigerian grow wealth, no matter the starting point.' },
  { icon: Users, title: 'Community Driven', desc: 'Referral bonuses, shared success, and a community that lifts each other up.' },
];

export default function AboutPage() {
  return (
    <div className="relative">
      <section className="relative py-20">
        <Particles count={20} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-400 text-sm font-semibold uppercase tracking-wider"
          >
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-bold mt-4 mb-6"
          >
            We&apos;re building Nigeria&apos;s
            <br />
            <span className="text-gradient-brand">most trusted investment platform</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 leading-relaxed"
          >
            CASH MONEY was founded with one mission: to make wealth-building accessible to every Nigerian.
            We combine premium technology, transparent returns, and bank-grade security to help you
            invest, earn, and grow — all from your phone.
          </motion.p>
        </div>
      </section>

      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <GlassCard variant="brand" className="p-8 h-full">
              <Target className="w-10 h-10 text-brand-400 mb-4" />
              <h2 className="font-display text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-white/60 leading-relaxed">
                To democratize investing for Nigerians by offering transparent, high-yield
                investment plans with daily returns — backed by secure technology and real human support.
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <GlassCard className="p-8 h-full">
              <Eye className="w-10 h-10 text-gold-400 mb-4" />
              <h2 className="font-display text-2xl font-bold mb-3">Our Vision</h2>
              <p className="text-white/60 leading-relaxed">
                To become Africa&apos;s most loved fintech platform — where millions build wealth
                confidently, supported by technology that feels premium and people who genuinely care.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
            Our <span className="text-gradient-brand">Core Values</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/15 flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6 text-brand-400" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-white/50">{v.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
