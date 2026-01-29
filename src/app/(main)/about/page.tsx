'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Target, Heart, Mail, MapPin } from 'lucide-react';
import Navbar from '@/components/community/Navbar';
import JoinCommunityDialog from '@/components/community/JoinCommunityDialog';

const stats = [
  { value: '10K+', label: 'Community Members' },
  { value: '500+', label: 'AI Tools Shared' },
  { value: '50+', label: 'Countries' },
  { value: '1000+', label: 'Weekly Posts' },
];

const values = [
  {
    icon: Zap,
    title: 'Speed First',
    description:
      'We believe in rapid iteration. Ship fast, learn faster, and let AI accelerate your workflow.',
  },
  {
    icon: Users,
    title: 'Open Sharing',
    description:
      'Knowledge grows when shared. We openly exchange tools, techniques, and hard-earned insights.',
  },
  {
    icon: Target,
    title: 'Real Results',
    description:
      'No fluff, only practical advice. Everything we share has been tested in real-world projects.',
  },
  {
    icon: Heart,
    title: 'Mutual Growth',
    description:
      'We celebrate wins together and support each other through challenges. Rising tides lift all boats.',
  },
];

const timeline = [
  {
    year: '2023',
    title: 'The Beginning',
    description: 'Started as a small Discord group of AI enthusiasts',
  },
  {
    year: '2024',
    title: 'Rapid Growth',
    description: 'Expanded to 10K+ members across multiple platforms',
  },
  {
    year: '2025',
    title: 'Global Community',
    description: 'Builders from 50+ countries sharing daily',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar onToggleSidebar={() => {}} />

      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <section className="border-b border-neutral-800 pb-12 pt-12 md:pb-16 md:pt-16 last:border-b-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6 inline-block border border-neutral-800 bg-white/5 px-4 py-2 text-sm font-medium tracking-[0.1em] text-neutral-400"
              >
                ✦ About BuildFastWithAI
              </motion.span>
              <h1 className="mb-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
                Where builders come to{' '}
                <span className="text-neutral-400">ship faster</span>
              </h1>
              <p className="mx-auto max-w-[600px] text-lg leading-relaxed text-neutral-500">
                We're a global community of developers, founders, and creators who believe AI is
                the ultimate leverage for building great products.
              </p>
            </motion.div>
          </section>

          {/* Stats */}
          <section className="border-b border-neutral-800 pb-12 pt-12 md:pb-16 md:pt-16 last:border-b-0">
            <div className="mx-auto grid max-w-[800px] grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-1 text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-white">{stat.value}</div>
                  <div className="text-sm font-medium text-neutral-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Story */}
          <section className="border-b border-neutral-800 pb-12 pt-12 md:pb-16 md:pt-16 last:border-b-0">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-6 text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.3] text-white">
                  Built by builders,<br />
                  <span className="text-neutral-500">for builders</span>
                </h2>
                <p className="mb-6 leading-relaxed text-neutral-500">
                  BuildFastWithAI started in 2023 when a small group of indie hackers noticed
                  something: AI was transforming how we build software, but knowledge was scattered
                  across Twitter threads, YouTube videos, and private Slack groups.
                </p>
                <p className="leading-relaxed text-neutral-500">
                  We created a single place where builders could share what's actually working—the
                  tools, the prompts, the workflows. No gatekeeping. No paywalls. Just real insights
                  from people in the trenches.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8"
              >
                {timeline.map((item, i) => (
                  <div
                    key={item.year}
                    className={`flex gap-5 ${
                      i < timeline.length - 1
                        ? 'mb-6 border-b border-neutral-800 pb-6'
                        : ''
                    }`}
                  >
                    <div className="shrink-0 text-sm font-semibold text-neutral-400 min-w-[3.125rem]">{item.year}</div>
                    <div>
                      <div className="mb-1 font-semibold text-white">
                        {item.title}
                      </div>
                      <div className="text-sm text-neutral-500">{item.description}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Values */}
          <section className="border-b border-neutral-800 bg-neutral-900/35 pb-12 pt-12 md:pb-16 md:pt-16 last:border-b-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-3 text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.3] text-white">What we believe</h2>
              <p className="mx-auto max-w-[500px] leading-relaxed text-neutral-500">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-6 md:grid-cols-2">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-white/5 [&>svg]:text-neutral-400">
                    <value.icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="border-b border-neutral-800 pb-12 pt-12 md:pb-16 md:pt-16 last:border-b-0">
            <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-4 text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.3] text-white">Get in touch</h2>
                <p className="mb-8 leading-relaxed text-neutral-500">
                  Have questions? Want to partner with us? We'd love to hear from you.
                </p>
                <div className="flex flex-col gap-4">
                  <a
                    href="mailto:hello@buildfastwithai.com"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center gap-3 text-[0.95rem] text-neutral-500 transition-colors hover:text-white"
                  >
                    <Mail size={18} className="shrink-0 text-neutral-400" />
                    hello@buildfastwithai.com
                  </a>
                  <div className="flex items-center gap-3 text-[0.95rem] text-neutral-500">
                    <MapPin size={18} className="shrink-0 text-neutral-400" />
                    Remote-first, worldwide
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center md:p-10"
              >
                <h3 className="mb-3 text-xl font-semibold leading-[1.3] text-white">Ready to join?</h3>
                <p className="mb-6 text-sm leading-relaxed text-neutral-500">
                  Connect with 10K+ builders shipping with AI
                </p>
                <JoinCommunityDialog>
                  <button type="button" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black flex w-full items-center justify-center gap-2 rounded-lg border border-white bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-92 active:scale-[0.98]">
                    Join the Community
                    <ArrowRight size={16} />
                  </button>
                </JoinCommunityDialog>
              </motion.div>
            </div>
          </section>
        </div>

        <footer className="mt-32 flex flex-col items-center justify-between gap-8 border-t border-neutral-800 py-12 sm:flex-row">
          <div className="text-[0.625rem] font-extrabold uppercase tracking-[0.3em] text-neutral-400">
            BuildFastWithAI &copy; {new Date().getFullYear()}
          </div>
          <div className="flex gap-8 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-neutral-500">
            <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white">
              Twitter
            </a>
            <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white">
              GitHub
            </a>
            <a href="mailto:hello@buildfastwithai.com" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white">
              Email
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
