'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ChevronRight, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SCHOOL_CLASSES, ASSESSMENTS, MARKS, ATTENDANCE, CURRENT_TEACHER_ID,
} from '@/lib/teacher/mockData';
import { useTeacherPortal } from '@/contexts/TeacherPortalContext';
import {
  calculateWeightedAverage, calculateAttendanceRate,
  getRiskLevel, getRiskBadgeStyle, getMarkColor,
} from '@/lib/teacher/helpers';
import AddStudentModal from './AddStudentModal';

type RiskKey = 'all' | 'critical' | 'high' | 'medium' | 'low';
type SortKey  = 'name' | 'avg' | 'att' | 'risk';

const PURPLE = '#7C3AED';

// ─── Risk filter chip colours (dark palette) ──────────────────────────────────
const RISK_FILTER_OPTIONS: { key: RiskKey; label: string; bg: string; color: string; activeBg: string }[] = [
  { key: 'all',      label: 'All',       bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.70)', activeBg: 'rgba(124,58,237,0.25)' },
  { key: 'critical', label: 'Critical',  bg: 'rgba(239,68,68,0.10)',   color: '#f87171',                 activeBg: 'rgba(239,68,68,0.30)'  },
  { key: 'high',     label: 'High Risk', bg: 'rgba(239,68,68,0.08)',   color: '#fca5a5',                 activeBg: 'rgba(239,68,68,0.22)'  },
  { key: 'medium',   label: 'Moderate',  bg: 'rgba(245,158,11,0.10)',  color: '#fbbf24',                 activeBg: 'rgba(245,158,11,0.25)' },
  { key: 'low',      label: 'On Track',  bg: 'rgba(34,197,94,0.10)',   color: '#4ade80',                 activeBg: 'rgba(34,197,94,0.25)'  },
];

const RISK_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 12,
  color: '#fff',
  padding: '8px 16px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
};

export default function StudentsListPage() {
  const { students }  = useTeacherPortal();
  const myClasses     = SCHOOL_CLASSES.filter(c => c.teacherId === CURRENT_TEACHER_ID);
  const myStudents    = students.filter(s => myClasses.some(c => c._id === s.classId));

  const [search,       setSearch]       = useState('');
  const [filterClass,  setFilterClass]  = useState('all');
  const [filterRisk,   setFilterRisk]   = useState<RiskKey>('all');
  const [sortBy,       setSortBy]       = useState<SortKey>('name');
  const [addOpen,      setAddOpen]      = useState(false);

  const enriched = myStudents.map(student => {
    const classId          = student.classId;
    const classAssessments = ASSESSMENTS.filter(a => a.classId === classId && a.conductedDate);
    const sMarks           = MARKS.filter(m => m.studentId === student._id && m.classId === classId);
    const att              = ATTENDANCE.filter(r => r.studentId === student._id && r.classId === classId);
    const avg              = calculateWeightedAverage(sMarks, classAssessments);
    const attRate          = calculateAttendanceRate(att);
    const risk             = getRiskLevel(avg, attRate);
    const cls              = myClasses.find(c => c._id === classId)!;
    return { student, avg, attRate, risk, cls };
  });

  const counts: Record<RiskKey, number> = {
    all:      enriched.length,
    critical: enriched.filter(r => r.risk === 'critical').length,
    high:     enriched.filter(r => r.risk === 'high').length,
    medium:   enriched.filter(r => r.risk === 'medium').length,
    low:      enriched.filter(r => r.risk === 'low').length,
  };

  const filtered = enriched
    .filter(r => {
      if (filterClass !== 'all' && r.student.classId !== filterClass) return false;
      if (filterRisk  !== 'all' && r.risk !== filterRisk)              return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.student.firstName.toLowerCase().includes(q) ||
          r.student.lastName.toLowerCase().includes(q)  ||
          r.student.studentNumber.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.student.lastName.localeCompare(b.student.lastName);
      if (sortBy === 'avg')  return (b.avg ?? -1) - (a.avg ?? -1);
      if (sortBy === 'att')  return b.attRate - a.attRate;
      if (sortBy === 'risk') return (RISK_ORDER[a.risk] ?? 9) - (RISK_ORDER[b.risk] ?? 9);
      return 0;
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Student Profiles</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            {myStudents.length} learners across {myClasses.length} classes
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          style={{ background: PURPLE }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.80)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = PURPLE; }}
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Risk filter chips */}
      <div className="flex flex-wrap gap-2">
        {RISK_FILTER_OPTIONS.map(({ key, label, bg, color, activeBg }) => {
          const active = filterRisk === key;
          return (
            <button
              key={key}
              onClick={() => setFilterRisk(key)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: active ? activeBg : bg,
                color,
                border: active ? `1px solid ${color}` : '1px solid transparent',
                opacity: active ? 1 : 0.75,
              }}
            >
              {label} ({counts[key]})
            </button>
          );
        })}
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or number…"
            style={{ ...INPUT_STYLE, paddingLeft: 36 }}
          />
        </div>
        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          style={{ ...INPUT_STYLE, width: 'auto' }}
        >
          <option value="all">All Classes</option>
          {myClasses.map(c => (
            <option key={c._id} value={c._id}>Grade {c.grade}{c.section}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortKey)}
          style={{ ...INPUT_STYLE, width: 'auto' }}
        >
          <option value="name">Sort: Name</option>
          <option value="avg">Sort: Average (high→low)</option>
          <option value="att">Sort: Attendance</option>
          <option value="risk">Sort: Risk Level</option>
        </select>
      </div>

      {/* Student grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(({ student, avg, attRate, risk, cls }, i) => (
          <motion.div
            key={student._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.6) }}
          >
            <Link
              href={`/dashboard/teacher/students/${student._id}`}
              className="flex items-start gap-4 p-4 rounded-2xl block transition-all group"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.30)';
                (e.currentTarget as HTMLElement).style.background  = 'rgba(124,58,237,0.05)';
                (e.currentTarget as HTMLElement).style.transform   = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.transform   = 'translateY(0)';
              }}
            >
              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.25)' }}
              >
                {student.avatarInitials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                      Grade {student.grade}{cls?.section} · {student.studentNumber}
                    </p>
                  </div>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0 mt-0.5',
                    getRiskBadgeStyle(risk),
                  )}>
                    {risk}
                  </span>
                </div>

                {/* Progress bars */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1">
                    <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Maths Avg</p>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.08)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${avg ?? 0}%`,
                            background: (avg ?? 0) >= 60 ? '#22c55e'
                              : (avg ?? 0) >= 50 ? '#eab308'
                              : (avg ?? 0) >= 40 ? '#f97316'
                              : '#ef4444',
                          }}
                        />
                      </div>
                      <span className={cn('text-xs font-bold', getMarkColor(avg))}>
                        {avg !== null ? `${avg}%` : '—'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Attendance</p>
                    <p className={cn(
                      'text-xs font-bold',
                      attRate >= 85 ? 'text-green-400'
                        : attRate >= 75 ? 'text-yellow-400'
                        : 'text-red-400',
                    )}>
                      {attRate}%
                    </p>
                  </div>
                </div>
              </div>

              <ChevronRight
                className="w-4 h-4 flex-shrink-0 mt-1 transition-colors"
                style={{ color: 'rgba(255,255,255,0.20)' }}
              />
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No students match your search</p>
          {filterRisk !== 'all' && (
            <button
              onClick={() => setFilterRisk('all')}
              className="mt-2 text-xs hover:underline"
              style={{ color: '#a78bfa' }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
