'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Calendar, AlertCircle, ChevronRight, Megaphone } from 'lucide-react';
import { ANNOUNCEMENTS } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatDate } from '@/lib/utils';
import type { Announcement } from '@/types';

const CATEGORY_COLORS: Record<Announcement['category'], 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'slate'> = {
  Academic: 'blue',
  Sports:   'green',
  Events:   'purple',
  Admin:    'slate',
  Urgent:   'red',
};

export default function AnnouncementsSection() {
  const featured   = ANNOUNCEMENTS[0];
  const rest       = ANNOUNCEMENTS.slice(1, 5);

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          tag="Latest News"
          title="School Announcements"
          subtitle="Stay up to date with the latest news, events, and important notices from Sidelile High School."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Featured Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 card p-6 flex flex-col bg-gradient-to-br from-school-blue-900 to-school-blue-950 text-white border-0"
          >
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-school-gold-400" />
              <span className="text-school-gold-400 text-xs font-bold uppercase tracking-wider">Featured</span>
            </div>
            {featured.urgent && (
              <div className="flex items-center gap-2 mb-3 text-red-300 text-xs font-semibold">
                <AlertCircle className="w-4 h-4" />
                URGENT NOTICE
              </div>
            )}
            <Badge variant={CATEGORY_COLORS[featured.category]} className="self-start mb-4">
              {featured.category}
            </Badge>
            <h3 className="font-display text-xl font-bold text-white mb-3 leading-snug flex-1">
              {featured.title}
            </h3>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-blue-300 text-xs">
                <Calendar className="w-4 h-4" />
                {formatDate(featured.date)}
              </div>
              <button className="text-school-gold-400 hover:text-school-gold-300 text-xs font-semibold flex items-center gap-1 transition-colors">
                Read more <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* ── Remaining Cards ── */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -3 }}
                className="card p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={CATEGORY_COLORS[item.category]}>{item.category}</Badge>
                  {item.urgent && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm leading-snug mb-2 flex-1">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.date)}
                  </div>
                  <button className="text-school-blue-600 dark:text-school-blue-400 hover:text-school-blue-800 dark:hover:text-school-blue-200 text-xs font-semibold flex items-center gap-0.5 transition-colors">
                    Read <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-school-blue-700 dark:text-school-blue-400 hover:text-school-blue-900 dark:hover:text-white font-semibold text-sm transition-colors group"
          >
            <Bell className="w-4 h-4" />
            View all announcements
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
