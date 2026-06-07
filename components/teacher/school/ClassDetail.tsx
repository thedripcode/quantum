'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Lock, Users, BookOpen, MapPin,
  Search, AlertTriangle, TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getClass, getStudentsForClass } from '@/lib/school/mockData';
import { getSubjectName, SUBJECT_MAP } from '@/lib/school/subjects';
import { SCHOOL_CLASSES, CURRENT_TEACHER_ID } from '@/lib/teacher/mockData';
import { getRiskBadgeStyle, getMarkColor } from '@/lib/teacher/helpers';

const MY_CLASS_IDS = new Set(
  SCHOOL_CLASSES.filter(c => c.teacherId === CURRENT_TEACHER_ID).map(c => `${c.grade}${c.section}`)
);

const PURPLE = '#7C3AED';

const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border:     '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
};

interface Props { classId: string; }

export default function ClassDetail({ classId }: Props) {
  const cls      = getClass(classId);
  const students = getStudentsForClass(classId);
  const isMine   = MY_CLASS_IDS.has(classId);
  const [search, setSearch] = useState('');

  if (!cls) {
    return (
      <div className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.40)' }}>
        <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p className="font-semibold">Class not found: {classId}</p>
        <Link
          href="/dashboard/teacher/school"
          className="mt-3 inline-block text-sm hover:underline"
          style={{ color: '#a78bfa' }}
        >
          ← Back to School Browser
        </Link>
      </div>
    );
  }

  const subjects = cls.subjectIds.map(id => SUBJECT_MAP.get(id)).filter(Boolean);

  const filtered = students.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q)  ||
      s.studentNumber.toLowerCase().includes(q)
    );
  });

  const avgMark  = students.length > 0
    ? Math.round(students.reduce((a, s) => a + s.averageMark, 0) / students.length)
    : 0;
  const atRisk   = students.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const excelling = students.filter(s => s.riskLevel === 'excelling').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">

      {/* Back */}
      <Link
        href="/dashboard/teacher/school"
        className="inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: 'rgba(255,255,255,0.45)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to School Browser
      </Link>

      {/* Class header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl"
        style={CARD}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold text-white">Grade {cls.grade}{cls.section}</h2>
              {isMine ? (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(124,58,237,0.20)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.40)' }}
                >
                  ✓ Your Class — Full Access
                </span>
              ) : (
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
                >
                  <Lock className="w-3 h-3" /> View Only
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{students.length} learners</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{subjects.length} subjects</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />Room {cls.room}</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3">
            <div
              className="text-center p-3 rounded-xl min-w-[72px]"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <p className={cn('text-2xl font-bold', getMarkColor(avgMark))}>{avgMark}%</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Class Avg</p>
            </div>
            <div
              className="text-center p-3 rounded-xl min-w-[72px]"
              style={{ background: 'rgba(239,68,68,0.10)' }}
            >
              <p className="text-2xl font-bold text-red-400">{atRisk}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>At Risk</p>
            </div>
            <div
              className="text-center p-3 rounded-xl min-w-[72px]"
              style={{ background: 'rgba(124,58,237,0.12)' }}
            >
              <p className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{excelling}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Excelling</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Not assigned notice */}
      {!isMine && (
        <div
          className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
        >
          <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-amber-300">View Only Mode</p>
            <p className="text-xs text-amber-400 mt-0.5">
              You are not assigned to this class. Contact admin to request edit access.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl"
          style={CARD}
        >
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: '#a78bfa' }} />
            Subjects ({subjects.length})
          </h3>
          <div className="space-y-2">
            {subjects.map(sub => (
              <div
                key={sub!.id}
                className="flex items-center gap-2.5 p-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: sub!.isCompulsory ? '#a78bfa' : 'rgba(255,255,255,0.30)' }}
                />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{sub!.name}</span>
                <span
                  className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={sub!.isCompulsory
                    ? { background: 'rgba(124,58,237,0.18)', color: '#a78bfa' }
                    : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }
                  }
                >
                  {sub!.isCompulsory ? 'Compulsory' : 'Elective'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Student list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 p-5 rounded-2xl"
          style={CARD}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: '#a78bfa' }} />
              Learners ({students.length})
            </h3>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-8 py-1.5 text-xs w-44 rounded-xl focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-1">
            {filtered.map(student => (
              <div
                key={student.id}
                className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                style={isMine
                  ? { borderColor: 'transparent', cursor: 'pointer' }
                  : { borderColor: 'transparent', background: 'rgba(255,255,255,0.03)' }
                }
                onMouseEnter={isMine ? e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.30)';
                  (e.currentTarget as HTMLElement).style.background  = 'rgba(124,58,237,0.07)';
                } : undefined}
                onMouseLeave={isMine ? e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.background  = 'transparent';
                } : undefined}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.25)' }}
                >
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{student.studentNumber}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn('text-xs font-bold', getMarkColor(student.averageMark))}>
                    {student.averageMark}%
                  </span>
                  <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase', getRiskBadgeStyle(student.riskLevel))}>
                    {student.riskLevel}
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm py-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
                No students match your search
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
