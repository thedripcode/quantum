'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

const PORTALS = [
  {
    icon:    GraduationCap,
    role:    'Student Portal',
    desc:    'Access your marks, assignments, timetable, and school notices — all in one place.',
    cta:     'Student Login',
    href:    '/student-portal',
  },
  {
    icon:     BookOpen,
    role:     'Teacher Portal',
    desc:     'Manage gradebooks, learner records, attendance, and classroom resources with ease.',
    cta:      'Teacher Login',
    href:     '/teacher-portal',
    featured: true,
  },
  {
    icon:  Users,
    role:  'Parent Portal',
    desc:  "Stay connected — monitor your child's academic progress, fees, and school communications.",
    cta:   'Parent Login',
    href:  '/parent-portal',
  },
];

export default function PortalAccessSection() {
  return (
    <section
      id="portals"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: '#060f1a' }}
    >
      {/* Geo overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Ccircle cx='110' cy='110' r='100' fill='none' stroke='rgba(255%2C255%2C255%2C0.03)' stroke-width='1'/%3E%3Ccircle cx='110' cy='110' r='68' fill='none' stroke='rgba(255%2C255%2C255%2C0.025)' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="block text-[11px] font-bold uppercase tracking-[0.28em] mb-4"
            style={{ color: '#7C3AED' }}
          >
            Digital Campus
          </span>
          <h2
            className="text-white font-extrabold leading-tight"
            style={{ fontSize: 'clamp(30px, 4.5vw, 56px)' }}
          >
            Access Your Portal
            <br />
            <span className="font-light italic opacity-50">Anytime, Anywhere.</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {PORTALS.map((portal, i) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.role}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: i * 0.13, ease: [0.22,1,0.36,1] }}
                whileHover={{
                  y: -10,
                  boxShadow: portal.featured
                    ? '0 28px 64px rgba(124,58,237,0.18)'
                    : '0 24px 60px rgba(0,0,0,0.45)',
                  transition: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                className="relative rounded-[24px] p-8 lg:p-10 flex flex-col border"
                style={{
                  background:   portal.featured ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.04)',
                  borderColor:  portal.featured ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.07)',
                }}
              >
                {portal.featured && (
                  <div
                    className="absolute top-5 right-5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: '#7C3AED', color: '#ffffff' }}
                  >
                    Most Used
                  </div>
                )}

                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-7 flex-shrink-0"
                  style={{ background: portal.featured ? '#7C3AED' : 'rgba(124,58,237,0.12)' }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: portal.featured ? '#0a1e2e' : '#7C3AED' }}
                  />
                </div>

                <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-3">
                  {portal.role}
                </h3>

                <p className="text-white/45 text-sm leading-relaxed font-light flex-1 mb-8">
                  {portal.desc}
                </p>

                <Link
                  href={portal.href}
                  className="inline-flex items-center justify-center w-full py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200"
                  style={
                    portal.featured
                      ? { background: '#7C3AED', color: '#ffffff' }
                      : { border: '1.5px solid rgba(124,58,237,0.45)', color: '#7C3AED' }
                  }
                >
                  {portal.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/25 text-[11px] mt-10 font-light"
        >
          Secure login protected by industry-standard encryption. Contact the school office for access credentials.
        </motion.p>
      </div>
    </section>
  );
}
