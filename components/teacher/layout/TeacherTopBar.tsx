'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Bell, Sun, Moon, Check, Search, X,
  ChevronDown, AlertTriangle, User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NOTIFICATIONS, TEACHERS, CURRENT_TEACHER_ID } from '@/lib/teacher/mockData';
import { useThemeMode as useTheme } from '@/components/providers/ThemeProvider';
import { useTeacherPortal } from '@/contexts/TeacherPortalContext';

// ─── Page titles ──────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  '/dashboard/teacher':            'Dashboard',
  '/dashboard/teacher/gradebook':  'Gradebook',
  '/dashboard/teacher/students':   'Students',
  '/dashboard/teacher/school':     'School Browser',
  '/dashboard/teacher/attendance': 'Attendance',
  '/dashboard/teacher/analytics':  'Analytics',
  '/dashboard/teacher/notices':    'Notices',
  '/dashboard/teacher/reports':    'Term Reports',
  '/dashboard/teacher/pdf':        'Generate PDF',
};

interface Props {
  sidebarCollapsed: boolean;
  onMenuClick:       () => void;
  onToggleCollapse:  () => void;
}

export default function TeacherTopBar({ onMenuClick }: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { mode: theme, toggle: toggleTheme } = useTheme();
  const { students } = useTeacherPortal();

  const [notifOpen,   setNotifOpen]   = useState(false);
  const [readIds,     setReadIds]     = useState<Set<string>>(new Set());
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarOpen,  setAvatarOpen]  = useState(false);

  const notifRef  = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const teacher  = TEACHERS.find(t => t._id === CURRENT_TEACHER_ID)!;
  const notifs   = NOTIFICATIONS.filter(n => n.teacherId === CURRENT_TEACHER_ID);
  const unread   = notifs.filter(n => !n.isRead && !readIds.has(n._id)).length;

  const baseRoute  = Object.keys(PAGE_TITLES).find(k =>
    pathname === k || (k !== '/dashboard/teacher' && pathname.startsWith(k))
  );
  const pageTitle  = baseRoute ? PAGE_TITLES[baseRoute] : 'Teacher Portal';

  // Search results
  const searchResults = searchQuery.trim().length >= 2
    ? students.filter(s => {
        const q = searchQuery.toLowerCase();
        return s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q) || s.studentNumber.toLowerCase().includes(q);
      }).slice(0, 6)
    : [];

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setSearchOpen(false); setSearchQuery(''); }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const notifColors: Record<string, string> = {
    urgent:  'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
    warning: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    info:    'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    success: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
  };

  const PURPLE = '#7C3AED';

  return (
    <header
      className="flex-shrink-0 h-16 flex items-center gap-3 px-4 sm:px-5 z-10"
      style={{ background: '#0a1e2e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >

      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
        style={{ color: 'rgba(255,255,255,0.55)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <h1 className="font-bold text-[15px] text-white truncate">{pageTitle}</h1>
        <p className="text-[11px] hidden md:block" style={{ color: 'rgba(255,255,255,0.38)' }}>Term 3 · 2024 · Mathematics</p>
      </div>

      {/* ── Right controls ── */}
      <div className="flex items-center gap-1.5 ml-auto">

        {/* Search */}
        <div ref={searchRef} className="relative">
          <button
            onClick={() => setSearchOpen(v => !v)}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'rgba(255,255,255,0.50)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Search className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, width: 160 }}
                animate={{ opacity: 1, y: 0, width: 280 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-11 rounded-2xl shadow-xl overflow-hidden z-50"
                style={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search students…"
                    className="flex-1 text-sm bg-transparent focus:outline-none"
                    style={{ color: '#ffffff' }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ color: 'rgba(255,255,255,0.35)' }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {searchResults.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {searchResults.map(s => (
                      <button
                        key={s._id}
                        onClick={() => { router.push(`/dashboard/teacher/students/${s._id}`); setSearchOpen(false); setSearchQuery(''); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-white"
                          style={{ background: 'rgba(124,58,237,0.25)' }}
                        >
                          {s.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-white truncate">{s.firstName} {s.lastName}</p>
                          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>Grade {s.grade}{s.classCode}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <p className="text-xs text-center py-4" style={{ color: 'rgba(255,255,255,0.38)' }}>No students found</p>
                ) : (
                  <p className="text-xs text-center py-4" style={{ color: 'rgba(255,255,255,0.38)' }}>Type to search students</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: 'rgba(255,255,255,0.50)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'rgba(255,255,255,0.50)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                style={{ background: PURPLE }}
              >
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 rounded-2xl shadow-xl overflow-hidden z-50"
                style={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="font-semibold text-[13px] text-white">Notifications</p>
                  {unread > 0 && <span className="text-[11px] font-semibold" style={{ color: PURPLE }}>{unread} new</span>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifs.map((n, idx) => {
                    const isUnread = !n.isRead && !readIds.has(n._id);
                    return (
                      <div
                        key={n._id}
                        onClick={() => setReadIds(prev => new Set([...prev, n._id]))}
                        className="px-4 py-3 cursor-pointer transition-colors"
                        style={{
                          background: isUnread ? 'rgba(124,58,237,0.06)' : 'transparent',
                          borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isUnread ? 'rgba(124,58,237,0.06)' : 'transparent'; }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0"
                            style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}
                          >
                            {n.type}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-white leading-snug">{n.title}</p>
                            <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{n.message}</p>
                          </div>
                          {!isUnread && <Check className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: 'rgba(124,58,237,0.70)' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Teacher avatar */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => setAvatarOpen(v => !v)}
            className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-xl transition-colors"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: PURPLE }}
            >
              {teacher.avatarInitials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[12px] font-semibold text-white leading-none">{teacher.title} {teacher.lastName}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{teacher.role === 'hod' ? 'HOD' : 'Educator'}</p>
            </div>
            <ChevronDown className="hidden sm:block w-3 h-3" style={{ color: 'rgba(255,255,255,0.35)' }} />
          </button>

          <AnimatePresence>
            {avatarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-11 w-56 rounded-2xl shadow-xl overflow-hidden z-50"
                style={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="font-semibold text-[13px] text-white">{teacher.title} {teacher.firstName} {teacher.lastName}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{teacher.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    href="/teacher-portal"
                    className="flex items-center gap-2 px-3 py-2 text-[13px] rounded-lg transition-colors"
                    style={{ color: 'rgba(255,255,255,0.60)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.60)'; }}
                  >
                    Sign Out
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
