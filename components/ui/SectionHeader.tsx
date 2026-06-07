'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionHeader({ tag, title, subtitle, centered = true, light = false, className }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(centered && 'text-center', className)}
    >
      {tag && (
        <span className={cn(
          'inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3',
          light ? 'text-school-gold-400' : 'text-school-gold-500'
        )}>
          {tag}
        </span>
      )}
      <h2 className={cn(
        'font-display text-3xl md:text-4xl font-bold leading-tight',
        light ? 'text-white' : 'text-school-blue-900 dark:text-white'
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'mt-4 text-base md:text-lg max-w-2xl leading-relaxed',
          centered && 'mx-auto',
          light ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
        )}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
