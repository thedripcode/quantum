'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, BarChart2, Bell, TrendingUp, AlertCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn, getStatusColor } from '@/lib/utils';
import {
  TEACHER_CLASSES,
  TEACHER_STUDENTS,
  TEACHER_NOTICES,
} from '@/lib/mockData';

const COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-100   dark:bg-blue-950   text-blue-700   dark:text-blue-300',
  cyan:   'bg-cyan-100   dark:bg-cyan-950   text-cyan-700   dark:text-cyan-300',
  green:  'bg-green-100  dark:bg-green-950  text-green-700  dark:text-green-300',
  purple: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
};

const PRIORITY_STYLES: Record<string, string> = {
  high:   'border-l-red-500   bg-red-50   dark:bg-red-950/30',
  medium: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/30',
  low:    'border-l-slate-300 bg-slate-50 dark:bg-slate-800/30',
};

export default function TeacherDashboardContent() {
  const [search, setSearch] = useState('');
  const filtered = TEACHER_STUDENTS.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.grade.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = TEACHER_CLASSES.reduce((sum, c) => sum + c.students, 0);

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Header ── */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-school-gold-500 text-xs font-bold uppercase tracking-widest">Teacher Dashboard</p>
          <h1 className="font-display text-2xl font-bold text-school-blue-900 dark:text-white mt-1">
            Good morning, Mr. Nkosi! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Term 4 · Monday, 3 November 2025</p>
        </motion.div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'My Classes',      value: String(TEACHER_CLASSES.length), icon: BookOpen,   color: 'blue',   sub: 'Active classes'     },
          { label: 'Total Students',  value: String(totalStudents),          icon: Users,      color: 'purple', sub: 'Across all classes' },
          { label: 'Avg. Attendance', value: '88%',                          icon: Calendar,   color: 'green',  sub: 'This week'          },
          { label: 'Pending Marks',   value: '12',                           icon: BarChart2,  color: 'gold',   sub: 'To be submitted'    },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card p-5"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', COLOR_MAP[s.color])}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-display text-2xl font-bold text-school-blue-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Classes + Students ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Classes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
            id="classes"
          >
            <h2 className="font-semibold text-slate-800 dark:text-white text-base flex items-center gap-2 mb-5">
              <BookOpen className="w-5 h-5 text-school-blue-600 dark:text-school-blue-400" />
              My Classes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEACHER_CLASSES.map((cls) => (
                <div key={cls.id} className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">{cls.name}</span>
                    <Badge variant={cls.color as 'blue' | 'green' | 'cyan' | 'purple'}>Gr. {cls.grade}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">{cls.subject}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{cls.students} learners</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{cls.schedule.split('–')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Students Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
            id="students"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-800 dark:text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Learners Overview
              </h2>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-school-blue-400 w-36"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {['Name','Grade','Attendance','Average','Status'].map((h) => (
                      <th key={h} className="text-left py-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-school-blue-100 dark:bg-school-blue-950 rounded-full flex items-center justify-center text-school-blue-700 dark:text-school-blue-300 text-xs font-bold shrink-0">
                            {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium text-slate-800 dark:text-white truncate max-w-[120px]">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-500 dark:text-slate-400 text-xs">{s.grade}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${s.attendance >= 90 ? 'bg-green-500' : s.attendance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.attendance}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{s.attendance}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-700 dark:text-slate-200 text-xs">{s.average}%</td>
                      <td className="py-3 px-2">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getStatusColor(s.status))}>
                          {s.status === 'needs-attention' ? 'At Risk' : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-8">No learners found.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">

          {/* Analytics placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
            id="marks"
          >
            <h2 className="font-semibold text-slate-800 dark:text-white text-base flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              Class Performance
            </h2>
            {[
              { name: 'Grade 12A', avg: 82, color: 'bg-blue-500'  },
              { name: 'Grade 11B', avg: 74, color: 'bg-purple-500'},
              { name: 'Grade 10C', avg: 68, color: 'bg-cyan-500'  },
              { name: 'Tech Maths',avg: 77, color: 'bg-green-500' },
            ].map((cls) => (
              <div key={cls.name} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{cls.name}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{cls.avg}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cls.avg}%` }}
                    transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${cls.color}`}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <h2 className="font-semibold text-slate-800 dark:text-white text-base mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Take Attendance', icon: Calendar,   color: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'    },
                { label: 'Enter Marks',     icon: BarChart2,  color: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' },
                { label: 'Add Notice',      icon: Bell,       color: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300' },
                { label: 'View Reports',    icon: TrendingUp, color: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'},
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} className={cn('p-3 rounded-xl flex flex-col items-center gap-2 text-center transition-all hover:scale-105 active:scale-95', a.color)}>
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Notices */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="card p-6"
            id="notices"
          >
            <h2 className="font-semibold text-slate-800 dark:text-white text-base flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-red-500 dark:text-red-400" />
              Staff Notices
            </h2>
            <div className="space-y-3">
              {TEACHER_NOTICES.map((n) => (
                <div key={n.id} className={cn('p-3 rounded-xl border-l-4 text-xs', PRIORITY_STYLES[n.priority])}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {n.priority === 'high' && <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
