'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock, TrendingUp, AlertTriangle, Users,
  BookOpen, CalendarCheck, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SCHOOL_CLASSES, ASSESSMENTS, NOTIFICATIONS, CURRENT_TEACHER_ID } from '@/lib/teacher/mockData';
import { useTeacherPortal } from '@/contexts/TeacherPortalContext';
import { getMarkColor } from '@/lib/teacher/helpers';

// ─── Today's schedule ─────────────────────────────────────────────────────────

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const TODAY_DOW = new Date().getDay(); // 0=Sun
// Convert to Mon=0 mapping used in ClassSchedule
const SCHED_DOW = TODAY_DOW === 0 ? 0 : TODAY_DOW - 1; // Mon=0,Tue=1,...

export default function RightPanel() {
  const { students, classAverage, atRiskCount, pendingMarks, upcomingCount } = useTeacherPortal();
  const myClasses = SCHOOL_CLASSES.filter(c => c.teacherId === CURRENT_TEACHER_ID);

  // Flatten today's schedule
  const todayClasses = myClasses.flatMap(cls =>
    cls.schedule
      .filter(s => s.dayOfWeek === SCHED_DOW)
      .map(s => ({ cls, ...s }))
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Upcoming assessments
  const upcoming = ASSESSMENTS
    .filter(a => a.teacherId === CURRENT_TEACHER_ID && !a.conductedDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  // Unread notifications
  const notifications = NOTIFICATIONS
    .filter(n => n.teacherId === CURRENT_TEACHER_ID && !n.isRead)
    .slice(0, 3);

  const PURPLE = '#7C3AED';

  const quickStats = [
    { label: 'My Students',   value: students.length,      icon: Users,         iconColor: '#a78bfa' },
    { label: 'At Risk',       value: atRiskCount,          icon: AlertTriangle, iconColor: atRiskCount > 0 ? '#f87171' : '#a78bfa' },
    { label: 'Pending Marks', value: pendingMarks,         icon: BookOpen,      iconColor: pendingMarks > 0 ? '#a78bfa' : '#a78bfa' },
    { label: 'Class Avg',     value: `${classAverage}%`,   icon: TrendingUp,    iconColor: '#a78bfa' },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="hidden xl:flex flex-col w-72 flex-shrink-0 overflow-y-auto"
      style={{ background: '#060f1a', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="p-5 space-y-6">

        {/* Quick stats */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.32)' }}>Quick Stats</p>
          <div className="grid grid-cols-2 gap-2">
            {quickStats.map(({ label, value, icon: Icon, iconColor }) => (
              <div
                key={label}
                className="rounded-xl p-3 flex flex-col gap-1.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
                <p className="text-lg font-bold leading-none text-white">{value}</p>
                <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.40)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Today's schedule */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.32)' }}>
            Today — {DAY_NAMES[TODAY_DOW]}
          </p>
          {todayClasses.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: 'rgba(255,255,255,0.35)' }}>No classes today</p>
          ) : (
            <div className="space-y-2">
              {todayClasses.map(({ cls, startTime, endTime }) => (
                <div
                  key={cls._id + startTime}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.14)' }}
                  >
                    <BookOpen className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-white">
                      Grade {cls.grade}{cls.section} Maths
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                      {startTime}–{endTime} · Room {cls.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming assessments */}
        {upcoming.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.32)' }}>Upcoming</p>
            <div className="space-y-2">
              {upcoming.map(a => {
                const cls = SCHOOL_CLASSES.find(c => c._id === a.classId);
                return (
                  <div
                    key={a._id}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl"
                    style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.20)' }}
                  >
                    <CalendarCheck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#a78bfa' }} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-white leading-tight truncate">{a.title}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>Gr {cls?.grade}{cls?.section} · {a.dueDate}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pending tasks */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.32)' }}>Tasks</p>
          <div className="space-y-1.5">
            {pendingMarks > 0 && (
              <Link
                href="/dashboard/teacher/gradebook"
                className="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.08)'; }}
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#a78bfa' }} />
                <p className="text-[12px] flex-1" style={{ color: 'rgba(255,255,255,0.70)' }}>Capture {pendingMarks} pending marks</p>
                <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.30)' }} />
              </Link>
            )}
            {atRiskCount > 0 && (
              <Link
                href="/dashboard/teacher/students"
                className="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <p className="text-[12px] flex-1" style={{ color: 'rgba(255,255,255,0.70)' }}>Review {atRiskCount} at-risk learners</p>
                <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.30)' }} />
              </Link>
            )}
            {notifications.length > 0 && (
              <div
                className="flex items-center gap-2.5 p-2.5 rounded-xl"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.16)' }}
              >
                <CalendarCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#a78bfa' }} />
                <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.70)' }}>{notifications.length} unread notice{notifications.length > 1 ? 's' : ''}</p>
              </div>
            )}
            {pendingMarks === 0 && atRiskCount === 0 && notifications.length === 0 && (
              <p className="text-[12px] text-center py-2" style={{ color: 'rgba(255,255,255,0.35)' }}>✓ All tasks complete</p>
            )}
          </div>
        </div>

      </div>
    </motion.aside>
  );
}
