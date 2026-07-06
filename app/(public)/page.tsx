'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Wallet, TrendingUp, Shield, Zap, ArrowRight, Check, Star,
  Coins, Lock, Clock, Users, Award, ChevronRight, Calculator,
} from 'lucide-react';
import { Particles } from '@/components/shared/particles';
import { GlassCard } from '@/components/shared/glass-card';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip,
} from 'recharts';

const stats = [
  { label: 'Active Investors', value: '48,200+', icon: Users },
  { label: 'Total Paid Out', value: '₦2.4B', icon: Wallet },
  { label: 'Daily Return', value: '10%', icon: TrendingUp },
  { label: 'Uptime', value: '99.9%', icon: Shield },
];

const features = [
  { icon: Zap, title: 'Daily 10% Returns', desc: 'Earn 10% returns every single day for 120 days. Claim once every 24 hours.' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'JWT authentication, encrypted passwords, and role-based access keep your funds safe.' },
  { icon: Wallet, title: 'Manual Bank Transfer', desc: 'Deposit via Moniepoint with full control. Upload receipt, admin approves, wallet credits.' },
  { icon: Users, title: '10% Referral Bonus', desc: 'Invite friends and earn 10% of their deposits instantly. Share via WhatsApp or Telegram.' },
  { icon: Clock, title: 'Scheduled Withdrawals', desc: 'Withdraw Monday–Friday, 9AM–12PM WAT. Minimum withdrawal ₦1,000.' },
  { icon: Award, title: '120-Day Plans', desc: 'Transparent investment plans with live progress tracking and countdown timers.' },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Register with your phone number in seconds.', icon: Wallet },
  { num: '02', title: 'Fund Your Wallet', desc: 'Deposit from ₦5,000 via Moniepoint bank transfer.', icon: Coins },
  { num: '03', title: 'Invest & Earn', desc: 'Pick a plan, earn 10% daily, claim every 24 hours.', icon: TrendingUp },
  { num: '04', title: 'Withdraw', desc: 'Cash out weekdays 9AM–12PM WAT. Straight to your bank.', icon: ArrowRight },
];

const testimonials = [
  { name: 'Adebayo O.', role: 'Lagos', text: 'I started with ₦50,000 and the daily claims are real. CASH MONEY changed how I think about investing.', rating: 5 },
  { name: 'Chioma E.', role: 'Abuja', text: 'The cleanest investment app in Nigeria. Withdrawals hit my bank every weekday without fail.', rating: 5 },
  { name: 'Ibrahim M.', role: 'Kano', text: 'Referral bonus alone pays my rent. I have invited 30+ people and earned 10% on each.', rating: 5 },
  { name: 'Funke A.', role: 'Port Harcourt', text: 'Transparent, fast, and beautiful. The 120-day plan progress tracker keeps me motivated.', rating: 5 },
];

const faqs = [
  { q: 'What is the minimum deposit?', a: 'The minimum deposit is ₦5,000 via Moniepoint bank transfer to the account shown on your Deposit page.' },
  { q: 'How much can I earn daily?', a: 'You earn 10% of your investment amount every day for 120 days. You can claim once every 24 hours.' },
  { q: 'When can I withdraw?', a: 'Withdrawals are processed Monday to Friday, between 9:00 AM and 12:00 PM WAT. Minimum withdrawal is ₦1,000.' },
  { q: 'How does the referral bonus work?', a: 'You earn 10% of every deposit made by someone you refer. Share your link via WhatsApp or Telegram.' },
  { q: 'Is my money safe?', a: 'Yes. We use JWT authentication, encrypted passwords, and role-based admin access. Deposits are manually verified.' },
  { q: 'How long are investment plans?', a: 'All investment plans run for 120 days with daily returns of 10%.' },
];

const chartData = [
  { day: 'Day 1', value: 5000 },
  { day: 'Day 20', value: 15000 },
  { day: 'Day 40', value: 35000 },
  { day: 'Day 60', value: 65000 },
  { day: 'Day 80', value: 105000 },
  { day: 'Day 100', value: 155000 },
  { day: 'Day 120', value: 215000 },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const [calcAmount, setCalcAmount] = useState(50000);
  const dailyEarning = useMemo(() => calcAmount * 0.1, [calcAmount]);
  const totalReturn = useMemo(() => dailyEarning * 120, [dailyEarning]);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <Particles count={40} />

        <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs font-medium text-white/80">Nigeria&apos;s #1 Investment Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight"
            >
              Invest. Earn.
              <br />
              <span className="text-gradient-brand">Grow wealth.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed"
            >
              Earn <span className="text-brand-400 font-semibold">10% daily returns</span> over 120 days.
              Start from just ₦5,000. Built for Nigerians who want their money to work harder.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold px-7 py-4 rounded-full hover:shadow-glow-lg transition-all duration-300"
              >
                Start Investing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 glass-strong text-white font-medium px-7 py-4 rounded-full hover:bg-white/10 transition-all"
              >
                Login to Dashboard
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex items-center gap-6 text-sm text-white/50"
            >
              <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-brand-400" /> Bank-grade security</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-400" /> Min. ₦5,000</div>
            </motion.div>
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative animate-float">
              <div className="absolute -inset-8 bg-brand-500/20 blur-3xl rounded-full" />
              <div className="relative w-[300px] h-[600px] glass-strong rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full rounded-[2.5rem] bg-ink-900 overflow-hidden relative">
                  {/* notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-ink-900 rounded-b-2xl z-10" />
                  {/* screen content */}
                  <div className="pt-10 px-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs text-white/50">Wallet</span>
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-brand-400" />
                      </div>
                    </div>
                    <div className="glass-brand rounded-2xl p-4 mb-4">
                      <p className="text-xs text-white/50 mb-1">Total Balance</p>
                      <p className="text-3xl font-display font-bold text-gradient-brand">₦248,500</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3 text-brand-400" />
                        <span className="text-xs text-brand-400">+₦24,850 today</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="glass rounded-xl p-3">
                        <p className="text-[10px] text-white/50">Daily</p>
                        <p className="text-sm font-bold text-white">10%</p>
                      </div>
                      <div className="glass rounded-xl p-3">
                        <p className="text-[10px] text-white/50">Days</p>
                        <p className="text-sm font-bold text-white">120</p>
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-3 flex-1">
                      <p className="text-[10px] text-white/50 mb-2">Investment Progress</p>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          transition={{ duration: 1.5, delay: 1 }}
                          className="h-full bg-gradient-to-r from-brand-500 to-gold-500 rounded-full"
                        />
                      </div>
                      <p className="text-[10px] text-white/50 mt-2">Day 78 of 120</p>
                    </div>
                    <button className="mt-4 mb-6 w-full bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold py-3 rounded-full text-sm">
                      Claim Daily Earnings
                    </button>
                  </div>
                </div>
              </div>
              {/* floating coins */}
              <motion.div
                className="absolute -top-6 -left-10 w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Coins className="w-7 h-7 text-gold-900" />
              </motion.div>
              <motion.div
                className="absolute top-1/3 -right-8 w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              >
                <Wallet className="w-5 h-5 text-ink-900" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard className="p-6 text-center hover:shadow-glow transition-shadow">
                  <s.icon className="w-6 h-6 text-brand-400 mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl font-display font-bold text-gradient-brand">{s.value}</p>
                  <p className="text-sm text-white/50 mt-1">{s.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-wider">Why CASH MONEY</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3">
              Built for <span className="text-gradient-brand">serious investors</span>
            </h2>
            <p className="text-white/50 mt-4">Everything you need to grow your wealth, in one premium platform.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <GlassCard className="p-6 h-full hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/15 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-brand-400" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-brand-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Investment Calculator
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4">
                See your <span className="text-gradient-gold">money grow</span>
              </h2>
              <p className="text-white/50 mb-8">
                Drag the slider to see how much you can earn. At 10% daily for 120 days, your returns compound fast.
              </p>

              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/60">Investment Amount</span>
                  <span className="text-2xl font-display font-bold text-gradient-brand">
                    ₦{calcAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={1000000}
                  step={5000}
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs text-white/40 mt-2">
                  <span>₦5,000</span><span>₦1,000,000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-brand rounded-2xl p-5">
                  <p className="text-xs text-white/50 mb-1">Daily Earning</p>
                  <p className="text-2xl font-display font-bold text-brand-400">₦{dailyEarning.toLocaleString()}</p>
                </div>
                <div className="glass rounded-2xl p-5 border-gold-500/30">
                  <p className="text-xs text-white/50 mb-1">Total after 120 days</p>
                  <p className="text-2xl font-display font-bold text-gradient-gold">₦{totalReturn.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-strong rounded-3xl p-6"
            >
              <p className="text-sm text-white/60 mb-4">Projected Growth (120 days)</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16C784" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#0A0F24', border: '1px solid rgba(22,199,132,0.3)', borderRadius: 12, color: '#fff' }}
                      formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#16C784" strokeWidth={2} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-wider">How It Works</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3">Start in <span className="text-gradient-brand">4 simple steps</span></h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <GlassCard className="p-6 h-full hover:-translate-y-1 transition-transform">
                  <span className="text-5xl font-display font-extrabold text-brand-500/20">{s.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-3 -mt-4">
                    <s.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-white/50">{s.desc}</p>
                </GlassCard>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-brand-500/40 -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3">Loved by <span className="text-gradient-brand">Nigerians</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-ink-900 font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-wider">FAQ</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3">Questions? <span className="text-gradient-brand">Answered.</span></h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.details
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden group"
              >
                <summary className="cursor-pointer p-5 flex items-center justify-between list-none">
                  <span className="font-medium">{f.q}</span>
                  <ChevronRight className="w-5 h-5 text-brand-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{f.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative glass-strong rounded-[2rem] p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-brand-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gold-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Ready to <span className="text-gradient-brand">grow your wealth?</span>
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                Join 48,000+ Nigerians already earning 10% daily with CASH MONEY.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-400 text-ink-900 font-semibold px-8 py-4 rounded-full hover:shadow-glow-lg transition-all"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
