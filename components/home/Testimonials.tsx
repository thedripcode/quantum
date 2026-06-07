'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/mockData';
import { SectionHeader } from '@/components/ui/SectionHeader';

export default function Testimonials() {
  return (
    <section className="py-24 bg-school-blue-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-school-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-school-blue-800/30 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          tag="Testimonials"
          title="What Our Community Says"
          subtitle="Hear from the parents, learners, and alumni who make up the heart of Sidelile High School."
          light
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-school-gold-500/40 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-school-gold-400 text-school-gold-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-blue-100 text-sm leading-relaxed flex-1 mb-6 italic">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                <div className="w-11 h-11 bg-school-gold-500 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-blue-300 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-blue-200 text-lg mb-6">Ready to be part of this community?</p>
          <a
            href="/apply"
            className="inline-flex items-center gap-2 px-10 py-4 bg-school-gold-500 hover:bg-school-gold-400 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
          >
            Apply for Admission
          </a>
        </motion.div>
      </div>
    </section>
  );
}
