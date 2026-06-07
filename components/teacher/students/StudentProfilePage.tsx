'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Phone, Mail, AlertTriangle, CheckCircle,
  Calendar, BookOpen, MessageSquare, Plus, Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  STUDENTS, SCHOOL_CLASSES, ASSESSMENTS, MARKS, ATTENDANCE,
  TEACHER_NOTES, TEACHERS, CURRENT_TEACHER_ID,
} from '@/lib/teacher/mockData';
import {
  calculateWeightedAverage, calculateAttendanceRate,
  getRiskLevel, getRiskBadgeStyle, getMarkColor, getMarkBg,
} from '@/lib/teacher/helpers';
import type { TeacherNote } from '@/types/teacher';

const PURPLE = '#7C3AED';

const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border:     '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
};

interface Props { studentId: string; }

export default function StudentProfilePage({ studentId }: Props) {
  const student = STUDENTS.find(s => s._id === studentId);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20" style={{ color: 'rgba(255,255,255,0.35)' }}>
        <AlertTriangle className="w-10 h-10 mb-3" />
        <p className="font-semibold text-lg">Student not found</p>
        <Link
          href="/dashboard/teacher/students"
          className="mt-4 text-sm hover:underline"
          style={{ color: '#a78bfa' }}
        >
          ← Back to students
        </Link>
      </div>
    );
  }

  const teacher = TEACHERS.find(t => t._id === CURRENT_TEACHER_ID)!;
  const cls     = SCHOOL_CLASSES.find(c => c._id === student.classId)!;

  const classAssessments = ASSESSMENTS.filter(a => a.classId === student.classId && a.conductedDate);
  const marks            = MARKS.filter(m => m.studentId === studentId && m.classId === student.classId);
  const attendance       = ATTENDANCE.filter(r => r.studentId === studentId && r.classId === student.classId);

  const avg      = calculateWeightedAverage(marks, classAssessments);
  const attRate  = calculateAttendanceRate(attendance);
  const risk     = getRiskLevel(avg, attRate);

  const attBreakdown = {
    present: attendance.filter(r => r.status === 'present').length,
    absent:  attendance.filter(r => r.status === 'absent').length,
    late:    attendance.filter(r => r.status === 'late').length,
    excused: attendance.filter(r => r.status === 'excused').length,
  };

  const monthlyAtt = [8, 9, 10, 11].map(month => {
    const monthRec = attendance.filter(r => parseInt(r.date.split('-')[1]) === month);
    const present  = monthRec.filter(r => r.status === 'present' || r.status === 'late').length;
    const rate     = monthRec.length > 0 ? Math.round((present / monthRec.length) * 100) : 0;
    const names    = ['Aug', 'Sep', 'Oct', 'Nov'];
    return { month: names[month - 8], rate, days: monthRec.length };
  });

  const [notes, setNotes]     = useState<TeacherNote[]>(TEACHER_NOTES.filter(n => n.studentId === studentId));
  const [newNote, setNewNote] = useState('');
  const [showNote, setShowNote] = useState(false);

  function addNote() {
    if (!newNote.trim()) return;
    const note: TeacherNote = {
      _id: `tn-new-${Date.now()}`,
      teacherId: CURRENT_TEACHER_ID,
      studentId,
      note: newNote.trim(),
      isPrivate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [note, ...prev]);
    setNewNote('');
    setShowNote(false);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

      {/* Back */}
      <Link
        href="/dashboard/teacher/students"
        className="inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: 'rgba(255,255,255,0.45)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </Link>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl"
        style={CARD}
      >
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.28)' }}
          >
            {student.avatarInitials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  {student.studentNumber} · Grade {student.grade}{cls.section} · Mathematics
                </p>
              </div>
              <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase mt-1', getRiskBadgeStyle(risk))}>
                {risk === 'critical' ? '⚠ Critical' : risk === 'high' ? 'High Risk' : risk === 'medium' ? 'Moderate' : '✓ On Track'}
              </span>
            </div>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-6 mt-4">
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>Maths Average</p>
                <p className={cn('text-xl font-bold', getMarkColor(avg))}>{avg !== null ? `${avg}%` : '—'}</p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>Attendance</p>
                <p className={cn(
                  'text-xl font-bold',
                  attRate >= 85 ? 'text-green-400' : attRate >= 75 ? 'text-yellow-400' : 'text-red-400',
                )}>
                  {attRate}%
                </p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>Total Days</p>
                <p className="text-xl font-bold text-white">{attendance.length}</p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>Absent Days</p>
                <p className={cn('text-xl font-bold', attBreakdown.absent > 5 ? 'text-red-400' : 'text-white')}>
                  {attBreakdown.absent}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <a
              href={`tel:${student.parentPhone}`}
              className="flex items-center gap-2 text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
            >
              <Phone className="w-3.5 h-3.5" />
              {student.parentPhone}
            </a>
            <a
              href={`mailto:${student.parentEmail}`}
              className="flex items-center gap-2 text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
            >
              <Mail className="w-3.5 h-3.5" />
              {student.parentEmail}
            </a>
          </div>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Marks table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-3 p-5 rounded-2xl"
          style={CARD}
        >
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: '#a78bfa' }} />
            Mathematics — Term 3 Results
          </h3>
          <div className="space-y-2">
            {classAssessments.map(assessment => {
              const mark = marks.find(m => m.assessmentId === assessment._id);
              const pct  = mark?.percentage ?? null;
              return (
                <div
                  key={assessment._id}
                  className={cn('p-3 rounded-xl flex items-center gap-4', getMarkBg(pct))}
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{assessment.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                      {assessment.type} · {assessment.weight}% weight
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {mark?.isAbsent ? (
                      <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>ABS</span>
                    ) : mark?.rawMark !== null && mark?.rawMark !== undefined ? (
                      <>
                        <p className={cn('text-sm font-bold', getMarkColor(pct))}>
                          {mark.rawMark}/{assessment.totalMarks}
                        </p>
                        <p className={cn('text-xs font-semibold', getMarkColor(pct))}>{pct}%</p>
                      </>
                    ) : (
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.30)' }}>—</span>
                    )}
                  </div>
                  {pct !== null && (
                    <div
                      className="w-1 h-10 rounded-full flex-shrink-0"
                      style={{ background: pct >= 60 ? '#22c55e' : pct >= 50 ? '#eab308' : pct >= 40 ? '#f97316' : '#ef4444' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Weighted Term Average</p>
            <p className={cn('text-2xl font-bold', getMarkColor(avg))}>
              {avg !== null ? `${avg}%` : '—'}
            </p>
          </div>
        </motion.div>

        {/* Attendance + notes */}
        <div className="lg:col-span-2 space-y-5">

          {/* Monthly attendance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl"
            style={CARD}
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: '#a78bfa' }} />
              Attendance (Aug–Nov)
            </h3>
            <div className="space-y-3">
              {monthlyAtt.map(({ month, rate, days }) => (
                <div key={month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>{month}</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: rate >= 85 ? '#4ade80' : rate >= 75 ? '#fbbf24' : '#f87171' }}
                    >
                      {rate}% ({days} days)
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${rate}%`,
                        background: rate >= 85 ? '#22c55e' : rate >= 75 ? '#eab308' : '#ef4444',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div
              className="mt-4 pt-3 grid grid-cols-2 gap-2 text-xs"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              {[
                { label: 'Present', count: attBreakdown.present, color: '#4ade80'  },
                { label: 'Absent',  count: attBreakdown.absent,  color: '#f87171'  },
                { label: 'Late',    count: attBreakdown.late,    color: '#fbbf24'  },
                { label: 'Excused', count: attBreakdown.excused, color: '#a78bfa'  },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                  <span className="font-bold" style={{ color }}>{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Teacher notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl"
            style={CARD}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: '#a78bfa' }} />
                Teacher Notes
              </h3>
              <button
                onClick={() => setShowNote(v => !v)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(124,58,237,0.18)', color: '#a78bfa' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.30)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.18)'; }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {showNote && (
              <div
                className="mb-4 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Add a note about this student..."
                  rows={3}
                  className="w-full text-sm bg-transparent focus:outline-none resize-none placeholder-white/30"
                  style={{ color: '#fff' }}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowNote(false)}
                    className="text-xs px-2 py-1 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNote}
                    className="text-xs px-3 py-1 rounded-lg font-semibold text-white transition-colors"
                    style={{ background: PURPLE }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.80)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = PURPLE; }}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}

            {notes.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'rgba(255,255,255,0.30)' }}>No notes yet</p>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <div
                    key={note._id}
                    className="p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>{note.note}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.30)' }}>
                        {teacher.title} {teacher.lastName} · {note.createdAt.split('T')[0]}
                      </span>
                      <button
                        onClick={() => setNotes(prev => prev.filter(n => n._id !== note._id))}
                        className="transition-colors"
                        style={{ color: 'rgba(255,255,255,0.25)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'; }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
