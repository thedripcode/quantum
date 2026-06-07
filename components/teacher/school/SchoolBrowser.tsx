'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, BookOpen, Lock, ChevronRight, Search } from 'lucide-react';
import { SCHOOL_GRADES, SCHOOL_STATS } from '@/lib/school/mockData';
import { CURRENT_TEACHER_ID } from '@/lib/teacher/mockData';
import { SCHOOL_CLASSES } from '@/lib/teacher/mockData';

const MY_CLASS_IDS = new Set(
  SCHOOL_CLASSES.filter(c => c.teacherId === CURRENT_TEACHER_ID).map(c => `${c.grade}${c.section}`)
);

const PURPLE = '#7C3AED';

export default function SchoolBrowser() {
  const [search, setSearch] = useState('');

  const filtered = SCHOOL_GRADES.map(g => ({
    ...g,
    classes: g.classes.filter(c =>
      !search || c.id.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(g => g.classes.length > 0);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">School Browser</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
            {SCHOOL_STATS.totalGrades} grades · {SCHOOL_STATS.totalClasses} classes · ~{SCHOOL_STATS.totalStudents} learners
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search class (e.g. 10B)"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#fff',
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap items-center gap-4 p-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <div
            className="w-4 h-4 rounded"
            style={{ border: '2px solid rgba(124,58,237,0.70)', background: 'rgba(124,58,237,0.12)' }}
          />
          Your assigned class (full edit access)
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
          <Lock className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.30)' }} />
          Other classes (view only)
        </div>
      </div>

      {/* Grade sections */}
      <div className="space-y-6">
        {filtered.map((grade, gi) => {
          const total = grade.classes.reduce((a, c) => a + c.studentCount, 0);

          return (
            <motion.div
              key={grade.level}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.07 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Grade header */}
              <div
                className="px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(124,58,237,0.07)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(124,58,237,0.20)', color: '#a78bfa' }}
                    >
                      Grade {grade.level}
                    </span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>
                      {grade.classes.length} {grade.classes.length === 1 ? 'class' : 'classes'} · ~{total} learners
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
                    {grade.level <= 9 ? '9 compulsory subjects' : '3 compulsory + 4 electives'}
                  </span>
                </div>
              </div>

              {/* Class grid */}
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {grade.classes.map(cls => {
                  const isMine = MY_CLASS_IDS.has(cls.id);
                  return (
                    <Link
                      key={cls.id}
                      href={`/dashboard/teacher/school/${cls.id}`}
                      className="relative flex flex-col gap-2 p-3.5 rounded-xl transition-all duration-200 group"
                      style={isMine
                        ? { background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.45)' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                      }
                      onMouseEnter={e => {
                        if (!isMine) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.35)';
                          (e.currentTarget as HTMLElement).style.background  = 'rgba(124,58,237,0.06)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isMine) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                          (e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.03)';
                        }
                      }}
                    >
                      {/* My class badge */}
                      {isMine && (
                        <span
                          className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase text-white"
                          style={{ background: PURPLE }}
                        >
                          Mine
                        </span>
                      )}

                      {/* Class ID */}
                      <p
                        className="font-bold text-lg leading-none"
                        style={{ color: isMine ? '#a78bfa' : '#fff' }}
                      >
                        {cls.id}
                      </p>

                      {/* Stats */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.35)' }} />
                          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{cls.studentCount} students</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.35)' }} />
                          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{cls.subjectIds.length} subjects</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isMine
                            ? <span className="text-[10px] font-semibold" style={{ color: '#a78bfa' }}>Full Access</span>
                            : <><Lock className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.25)' }} /><span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.30)' }}>View Only</span></>
                          }
                        </div>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 self-end transition-colors" style={{ color: 'rgba(255,255,255,0.20)' }} />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
