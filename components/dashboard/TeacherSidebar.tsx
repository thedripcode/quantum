'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, LayoutDashboard, BookOpen, Users,
  Calendar, BarChart2, Bell, UserCircle, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href:  string;
  icon:  React.ElementType;
  badge?: string;
}

const ITEMS: SidebarItem[] = [
  { label: 'Dashboard',     href: '/dashboard/teacher',             icon: LayoutDashboard },
  { label: 'My Classes',    href: '/dashboard/teacher#classes',     icon: BookOpen        },
  { label: 'Students',      href: '/dashboard/teacher#students',    icon: Users           },
  { label: 'Attendance',    href: '/dashboard/teacher#attendance',  icon: Calendar        },
  { label: 'Marks',         href: '/dashboard/teacher#marks',       icon: BarChart2       },
  { label: 'Announcements', href: '/dashboard/teacher#announce',    icon: Bell, badge: '1'},
  { label: 'Profile',       href: '/dashboard/teacher#profile',     icon: UserCircle      },
];

interface TeacherSidebarProps {
  activeItem?: string;
}

export default function TeacherSidebar({ activeItem = 'Dashboard' }: TeacherSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-school-gold-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-school-blue-900 dark:text-white text-sm leading-none">Sidelile</p>
            <p className="text-school-gold-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Teacher Portal</p>
          </div>
        </Link>
      </div>

      {/* Teacher Badge */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-school-gold-100 dark:bg-school-gold-950 rounded-full flex items-center justify-center font-bold text-school-gold-700 dark:text-school-gold-400 text-sm">
            MN
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white text-sm">Mr. Nkosi</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">TCH001 · Mathematics HOD</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {ITEMS.map((item) => {
          const Icon   = item.icon;
          const active = activeItem === item.label;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-item ${active ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {active && <ChevronRight className="w-4 h-4 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link href="/" className="sidebar-item text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950">
          <LogOut className="w-5 h-5 shrink-0" />
          Sign Out
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen sticky top-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-30 w-12 h-12 bg-school-gold-500 text-white rounded-2xl shadow-xl flex items-center justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl lg:hidden overflow-y-auto"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
