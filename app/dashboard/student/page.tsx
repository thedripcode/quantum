'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AlertTriangle, TrendingUp, Flame, Target, ChevronRight, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { STUDENT, SUBJECTS, ASSIGNMENTS, OVERALL_AVERAGE, AT_RISK_SUBJECTS, CURRENT_STREAK, TIMETABLE } from '@/data/studentData';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BG      = '#0C0C0C';
const SURFACE = '#161616';
const S2      = '#1E1E1E';
const GOLD    = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.10)';
const GOLD_B  = 'rgba(201,168,76,0.22)';
const BORDER  = 'rgba(255,255,255,0.07)';
const TEXT    = '#FFFFFF';
const MUTED   = 'rgba(255,255,255,0.50)';
const FAINT   = 'rgba(255,255,255,0.25)';
const RED     = '#EF4444';
const F_HEADING = "'Bricolage Grotesque', sans-serif";
const F_BODY    = "'Inter', sans-serif";

// ─── SVG Ring ─────────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 64, stroke = 5 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = mounted ? circ * (1 - pct / 100) : circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.33,1,0.68,1)' }} />
    </svg>
  );
}

// ─── Mini bar chart ────────────────────────────────────────────────────────────
function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW((value / max) * 100), 200); }, [value, max]);
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 2, transition: 'width 1.1s cubic-bezier(0.33,1,0.68,1)' }} />
    </div>
  );
}

// ─── Today's timetable ─────────────────────────────────────────────────────────
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const todayName = DAYS[new Date().getDay()] || 'Monday';
const todaySlots = TIMETABLE.filter(t => t.day === todayName && t.type === 'Lesson').slice(0, 5);
const displayDay = todaySlots.length > 0 ? todayName : 'Monday';
const displaySlots = (todaySlots.length > 0 ? todaySlots : TIMETABLE.filter(t => t.day === 'Monday' && t.type === 'Lesson')).slice(0, 5);

// pending assignments
const pendingAssignments = ASSIGNMENTS.filter(a => a.status === 'pending' || a.status === 'overdue');

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const hour  = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = session?.user?.name?.split(' ')[0] ?? STUDENT.firstName;

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: F_HEADING, fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>
          {greeting}, {firstName} 👋
        </h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
          Here's your academic overview for Term 3, 2024.
        </p>
      </div>

      {/* At-risk banner */}
      {AT_RISK_SUBJECTS.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 14, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <AlertTriangle size={18} style={{ color: RED, flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
              You are at risk in {AT_RISK_SUBJECTS.length} subject{AT_RISK_SUBJECTS.length > 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)', marginTop: 2 }}>
              {AT_RISK_SUBJECTS.map(s => `${s.name} (${s.currentMark}%)`).join(' · ')} — attend extra classes to improve before the term exam.
            </div>
          </div>
          <Link href="/dashboard/student/marks" style={{ fontSize: 12, color: RED, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
            View Marks <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Overall Average', value: `${OVERALL_AVERAGE}%`, sub: 'Term 3 · 7 subjects', icon: <TrendingUp size={16} style={{ color: GOLD }} />, accent: GOLD },
          { label: 'Attendance', value: '95.7%', sub: '154 / 161 days', icon: <BookOpen size={16} style={{ color: '#10B981' }} />, accent: '#10B981' },
          { label: 'Study Streak', value: `${CURRENT_STREAK} days`, sub: 'Keep it going!', icon: <Flame size={16} style={{ color: '#F59E0B' }} />, accent: '#F59E0B' },
          { label: 'Pending Tasks', value: `${pendingAssignments.length}`, sub: `${ASSIGNMENTS.filter(a => a.status === 'overdue').length} overdue`, icon: <Target size={16} style={{ color: pendingAssignments.length > 0 ? RED : '#10B981' }} />, accent: pendingAssignments.length > 0 ? RED : '#10B981' },
        ].map(stat => (
          <div key={stat.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{stat.label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: stat.accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
            </div>
            <div style={{ fontFamily: F_HEADING, fontSize: 22, fontWeight: 700, color: TEXT, letterSpacing: '-0.02em' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: FAINT, marginTop: 3 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left: subjects + assignments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Subjects grid */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: 0 }}>My Subjects</h3>
              <Link href="/dashboard/student/marks" style={{ fontSize: 12, color: GOLD, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {SUBJECTS.map(sub => (
                <Link
                  key={sub.id}
                  href={`/dashboard/student/subjects/${sub.id}`}
                  style={{ background: S2, border: `1px solid ${sub.isAtRisk ? 'rgba(239,68,68,0.25)' : BORDER}`, borderRadius: 12, padding: '12px 14px', textDecoration: 'none', display: 'block', transition: 'border-color .15s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: sub.color, letterSpacing: '0.06em' }}>{sub.short}</div>
                      <div style={{ fontSize: 12, color: TEXT, fontWeight: 500, marginTop: 2 }}>{sub.name.length > 22 ? sub.name.slice(0, 22) + '…' : sub.name}</div>
                    </div>
                    {sub.isAtRisk && <AlertTriangle size={12} style={{ color: RED, flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: sub.isAtRisk ? RED : TEXT, fontFamily: F_HEADING, letterSpacing: '-0.02em' }}>{sub.currentMark}%</div>
                  <MiniBar value={sub.currentMark} color={sub.isAtRisk ? RED : sub.color} />
                  <div style={{ fontSize: 10, color: FAINT, marginTop: 5 }}>{sub.teacher}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: 0 }}>Upcoming Assignments</h3>
              <Link href="/dashboard/student/assignments" style={{ fontSize: 12, color: GOLD, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingAssignments.slice(0, 5).map(a => {
                const due    = new Date(a.dueDate);
                const today  = new Date();
                const diff   = Math.ceil((due.getTime() - today.getTime()) / 86400000);
                const isOver = a.status === 'overdue';
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: S2, borderRadius: 10, border: `1px solid ${isOver ? 'rgba(239,68,68,0.20)' : BORDER}` }}>
                    <div style={{ width: 3, height: 36, borderRadius: 2, background: isOver ? RED : a.subjectColor, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{a.subject} · {a.type}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isOver ? RED : diff <= 3 ? '#F59E0B' : MUTED }}>
                        {isOver ? 'Overdue' : diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${diff}d left`}
                      </div>
                      <div style={{ fontSize: 10, color: FAINT, marginTop: 1 }}>/{a.total} marks</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Today's classes */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: 0 }}>{displayDay}'s Classes</h3>
              <Link href="/dashboard/student/timetable" style={{ fontSize: 12, color: GOLD, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                Full <ChevronRight size={11} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {displaySlots.map(period => (
                <div key={`${period.day}-${period.period}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: S2, borderRadius: 9, border: `1px solid ${BORDER}` }}>
                  <div style={{ width: 3, height: 30, borderRadius: 2, background: period.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{period.subject}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>Room {period.room}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <Clock size={10} style={{ color: FAINT }} />
                    <span style={{ fontSize: 10, color: FAINT }}>{period.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance prediction */}
          <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: GOLD, margin: '0 0 12px' }}>Performance Prediction</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SUBJECTS.filter(s => s.nextAssessment).slice(0, 4).map(sub => {
                const goal = 60;
                const termContr = sub.currentMark * (1 - sub.termAverages[2]?.average / 100 || 0.6);
                const needed = Math.max(0, Math.min(100, Math.round((goal - sub.currentMark * 0.6) / 0.4)));
                return (
                  <div key={sub.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.70)', fontWeight: 500 }}>{sub.short}</span>
                      <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>
                        {needed <= sub.currentMark ? '✓ On track' : `Need ${needed}% in exam`}
                      </span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.10)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${sub.currentMark}%`, background: GOLD, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/dashboard/student/goals" style={{ display: 'block', marginTop: 14, fontSize: 12, color: GOLD, textDecoration: 'none', fontWeight: 600, textAlign: 'center' }}>
              Set Goals →
            </Link>
          </div>

          {/* Quick links */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 12px' }}>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'View Attendance Report', href: '/dashboard/student/attendance' },
                { label: 'Check Term Results', href: '/dashboard/student/marks' },
                { label: 'Messages (1 unread)', href: '/dashboard/student/messages' },
                { label: 'Ask AI Assistant', href: '/dashboard/student/assistant' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', borderRadius: 9, fontSize: 13, color: MUTED, textDecoration: 'none', transition: 'color .15s, background .15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = MUTED; el.style.background = 'transparent'; }}
                >
                  {item.label}
                  <ChevronRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
