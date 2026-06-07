'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, UserCheck, Globe } from 'lucide-react';

const PILLARS = [
  {
    icon:  BookOpen,
    title: 'Academic Excellence',
    desc:  'Every learner equipped with the knowledge, skills, and confidence to reach their full potential and excel in higher education.',
  },
  {
    icon:  UserCheck,
    title: 'Dedicated Educators',
    desc:  '85 qualified teachers committed to learner success — mentoring, guiding, and inspiring every step of the journey.',
  },
  {
    icon:  Globe,
    title: 'Community & Culture',
    desc:  'A school rooted in Ubuntu and South African identity, celebrating diversity and building a generation of compassionate leaders.',
  },
];

export default function ValuePillars() {
  return (
    <section className="geo-bg py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-14">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.14, ease: [0.22,1,0.36,1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Large gold circle with icon */}
                <motion.div
                  whileHover={{ scale: 1.08, transition: { type: 'spring', stiffness: 380, damping: 18 } }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-lg cursor-default"
                  style={{ background: '#7C3AED' }}
                >
                  <Icon className="w-9 h-9 text-[#0a1e2e]" />
                </motion.div>

                <h3 className="text-white font-bold text-base uppercase tracking-wide mb-3">
                  {p.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed font-light max-w-xs">
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-16 h-px mx-auto mb-10" style={{ background: 'rgba(124,58,237,0.3)' }} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.55 }}
          className="flex justify-center"
        >
          <Link
            href="#about"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border-2 border-white/30 text-white text-sm font-bold uppercase tracking-widest hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all duration-300"
          >
            Explore Our School
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
