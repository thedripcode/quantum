'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const STEPS = [
  {
    num:   '01',
    title: 'Apply Online',
    desc:  'Submit your application through our secure online admissions portal — anytime, from anywhere.',
  },
  {
    num:   '02',
    title: 'Receive Placement',
    desc:  'Our admissions team reviews your application and assigns you to the correct grade and class.',
  },
  {
    num:   '03',
    title: 'Access Your Portal',
    desc:  'Log in to track your marks, assignments, attendance, and important school notices in real time.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 lg:py-32" style={{ background: '#060f1a' }}>
      {/* Subtle geo pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Ccircle cx='110' cy='110' r='100' fill='none' stroke='rgba(255%2C255%2C255%2C0.025)' stroke-width='1'/%3E%3Ccircle cx='110' cy='110' r='68' fill='none' stroke='rgba(255%2C255%2C255%2C0.02)' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">

          {/* ── Left: rounded image ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, ease: [0.22,1,0.36,1] }}
            className="relative"
          >
            <div className="rounded-[28px] overflow-hidden shadow-2xl aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop"
                alt="Students in classroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(6,15,26,0.5) 0%, transparent 60%)' }}
              />
            </div>
            {/* Small inset rounded image — breaks grid intentionally */}
            <div className="absolute -top-6 -right-4 lg:-right-10 w-36 h-36 rounded-[20px] overflow-hidden shadow-xl border-4 border-[#060f1a]">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&auto=format&fit=crop"
                alt="Students studying"
                fill
                className="object-cover"
                sizes="144px"
              />
            </div>
            <p className="absolute bottom-4 left-5 text-[10px] text-white/40 italic">
              Sidelile learners in the science lab, 2024
            </p>
          </motion.div>

          {/* ── Right: numbered steps ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <span
                className="block text-[11px] font-bold uppercase tracking-[0.28em] mb-4"
                style={{ color: '#7C3AED' }}
              >
                How It Works
              </span>
              <h2
                className="text-white font-extrabold leading-tight mb-12"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
              >
                Getting Started
                <br />
                <span className="font-light italic opacity-50">is Simple.</span>
              </h2>
            </motion.div>

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: 36 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.6, ease: [0.22,1,0.36,1] }}
                  className="flex gap-6 items-start"
                >
                  {/* Number circle */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 border-2"
                    style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
                  >
                    {step.num}
                  </div>

                  <div className="pt-1">
                    <h3 className="text-white font-bold text-base uppercase tracking-wide mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
