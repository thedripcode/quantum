'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { X, GraduationCap, User, BookOpen } from 'lucide-react';
import type { NavLink } from '@/types';

interface MobileMenuProps {
  onClose: () => void;
  navLinks: NavLink[];
}

export default function MobileMenu({ onClose, navLinks }: MobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white dark:bg-slate-950 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-school-blue-900 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-school-blue-900 dark:text-white text-sm">Sidelile</p>
              <p className="text-school-gold-500 text-xs font-semibold uppercase tracking-wider">High School</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-1">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:text-school-blue-900 dark:hover:text-white hover:bg-school-blue-50 dark:hover:bg-slate-800 font-medium transition-all"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <Link
              href="/student-portal"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-school-blue-200 dark:border-school-blue-700 text-school-blue-800 dark:text-school-blue-300 hover:bg-school-blue-50 dark:hover:bg-school-blue-950 font-semibold transition-all"
            >
              <User className="w-4 h-4" />
              Student Portal
            </Link>
            <Link
              href="/teacher-portal"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-school-gold-500 hover:bg-school-gold-600 text-white font-semibold transition-all shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              Teacher Portal
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          © 2025 Sidelile High School
        </div>
      </motion.div>
    </>
  );
}
