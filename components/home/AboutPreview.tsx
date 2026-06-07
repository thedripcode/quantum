'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Award } from 'lucide-react';

const HIGHLIGHTS = [
  'Founded on a tradition of academic excellence and strong values',
  'Ranked among the top 10 schools in Limpopo Province',
  'Fully equipped science labs, computer centre, and sports facilities',
  'Dedicated learner support and counselling services',
  'Active parents–school partnership through the SGB',
];

export default function AboutPreview() {
  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Image Side ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2600&auto=format&fit=crop"
                alt="Sidelile High School classroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-school-blue-950/40 to-transparent" />
            </div>

            {/* Floating award badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -bottom-6 -right-4 lg:-right-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-700"
            >
              <div className="w-12 h-12 bg-school-gold-100 dark:bg-school-gold-900 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-school-gold-500" />
              </div>
              <div>
                <p className="font-bold text-school-blue-900 dark:text-white text-sm">Top 10 School</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Limpopo Province 2024</p>
              </div>
            </motion.div>

            {/* Accent shape */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-school-gold-500/10 dark:bg-school-gold-500/5 rounded-full -z-10" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-school-blue-900/5 rounded-full -z-10" />
          </motion.div>

          {/* ── Text Side ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-school-gold-500 text-xs font-bold uppercase tracking-[0.2em]">Who We Are</span>
            <h2 className="font-display text-4xl font-bold text-school-blue-900 dark:text-white mt-3 mb-6 leading-tight">
              Nurturing Minds,<br />
              <span className="text-school-gold-500">Building Futures</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              Sidelile High School is a beacon of educational excellence in Limpopo Province. Since our founding,
              we have remained committed to providing a holistic education that develops the whole learner —
              academically, socially, physically, and spiritually.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Our dedicated staff, modern infrastructure, and vibrant school community create an environment where
              every learner is seen, heard, and empowered to achieve their full potential. We believe every child
              who walks through our gates deserves a world-class education.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-10">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-school-gold-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-school-blue-900 hover:bg-school-blue-800 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              Discover More About Us
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
