'use client';

import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Monitor, Palette, Globe, Trophy, ChevronRight } from 'lucide-react';
import { PROGRAMS } from '@/lib/mockData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  Calculator, TrendingUp, Monitor, Palette, Globe, Trophy,
};

const COLOR_STYLES: Record<string, { card: string; icon: string; badge: string; hover: string }> = {
  blue:   { card: 'border-blue-100   dark:border-blue-900',  icon: 'bg-blue-100   dark:bg-blue-950   text-blue-600   dark:text-blue-400',  badge: 'bg-blue-50   dark:bg-blue-950  text-blue-600',  hover: 'hover:border-blue-300   dark:hover:border-blue-700'  },
  gold:   { card: 'border-amber-100  dark:border-amber-900', icon: 'bg-amber-100  dark:bg-amber-950  text-amber-600  dark:text-amber-400', badge: 'bg-amber-50  dark:bg-amber-950 text-amber-600', hover: 'hover:border-amber-300  dark:hover:border-amber-700' },
  cyan:   { card: 'border-cyan-100   dark:border-cyan-900',  icon: 'bg-cyan-100   dark:bg-cyan-950   text-cyan-600   dark:text-cyan-400',  badge: 'bg-cyan-50   dark:bg-cyan-950  text-cyan-600',  hover: 'hover:border-cyan-300   dark:hover:border-cyan-700'  },
  purple: { card: 'border-purple-100 dark:border-purple-900', icon: 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400', badge: 'bg-purple-50 dark:bg-purple-950 text-purple-600', hover: 'hover:border-purple-300 dark:hover:border-purple-700' },
  green:  { card: 'border-green-100  dark:border-green-900',  icon: 'bg-green-100  dark:bg-green-950  text-green-600  dark:text-green-400',  badge: 'bg-green-50  dark:bg-green-950  text-green-600',  hover: 'hover:border-green-300  dark:hover:border-green-700'  },
  orange: { card: 'border-orange-100 dark:border-orange-900', icon: 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400', badge: 'bg-orange-50 dark:bg-orange-950 text-orange-600', hover: 'hover:border-orange-300 dark:hover:border-orange-700' },
};

export default function ProgramsSection() {
  return (
    <section id="academics" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          tag="Academics"
          title="Our Programmes & Subjects"
          subtitle="A comprehensive curriculum designed to unlock potential, foster critical thinking, and prepare learners for higher education and life."
        />

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((program, i) => {
            const Icon   = ICON_MAP[program.icon];
            const styles = COLOR_STYLES[program.color];

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={cn(
                  'card p-6 border-2 cursor-pointer transition-all duration-300 group',
                  styles.card,
                  styles.hover,
                )}
              >
                {/* Icon */}
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', styles.icon)}>
                  {Icon && <Icon className="w-7 h-7" />}
                </div>

                {/* Title & Description */}
                <h3 className="font-display font-bold text-lg text-school-blue-900 dark:text-white mb-2 group-hover:text-school-blue-700 dark:group-hover:text-school-blue-300 transition-colors">
                  {program.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {program.description}
                </p>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {program.subjects.map((subject) => (
                    <span
                      key={subject}
                      className={cn('text-xs px-2 py-0.5 rounded-md font-medium', styles.badge)}
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-school-blue-700 dark:group-hover:text-school-blue-400 transition-colors mt-auto">
                  Learn more
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
