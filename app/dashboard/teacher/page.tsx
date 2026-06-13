'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Users, BookOpen, BarChart2, UserCheck, PenLine, ChevronRight, AlertTriangle } from 'lucide-react';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const PURPLE = '#7C3AED'; const PURPLE_DIM = 'rgba(124,58,237,0.10)'; const PURPLE_B = 'rgba(124,58,237,0.25)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#10B981'; const RED = '#EF4444'; const AMBER = '#F59E0B';
const FH = "'Bricolage Grotesque', sans-serif"; const FB = "'Inter', sans-serif";

const pctColor = (p: number) => (p >= 60 ? GREEN : p >= 40 ? AMBER : RED);

export default function TeacherDashboardPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [marks, setMarks]       = useState<any[]>([]);
  const [attendance, setAtt]    = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/teacher/roster').then(r => r.json()),
      fetch('/api/marks').then(r => r.json()),
      fetch('/api/attendance').then(r => r.json()),
    ]).then(([r, m, a]) => {
      setStudents(r.students ?? []);
      setSubjects(r.subjects ?? []);
      setMarks(m.marks ?? []);
      setAtt(a.records ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const classAvg = marks.length ? Math.round(marks.reduce((s, m) => s + (m.score / m.total) * 100, 0) / marks.length) : null;
    const today = new Date().toISOString().slice(0, 10);
    const todayAtt = attendance.filter(a => a.date === today);
    const present = todayAtt.filter(a => a.status === 'present' || a.status === 'late').length;

    // At-risk: students whose average is below 60
    const perStudent: Record<string, number[]> = {};
    marks.forEach(m => { (perStudent[m.studentPortalId] ??= []).push((m.score / m.total) * 100); });
    const atRisk = Object.values(perStudent).filter(arr => (arr.reduce((x, y) => x + y, 0) / arr.length) < 60).length;

    return { classAvg, todayPresent: todayAtt.length ? `${present}/${todayAtt.length}` : null, atRisk };
  }, [marks, attendance]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = session?.user?.name ?? 'Teacher';

  const recentMarks = marks.slice(0, 6);

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: FH, fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>
          {greeting}, {name} 👋
        </h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Here's what's happening across your classes.</p>
      </div>

      {/* Stats */}
      <div className="portal-stats-grid">
        {[
          { label: 'Learners',        value: loading ? '…' : String(students.length),                       sub: 'enrolled',                    Icon: Users,     color: '#C4B5FD' },
          { label: 'Subjects',        value: loading ? '…' : String(subjects.length),                        sub: 'on offer',                    Icon: BookOpen,  color: '#60A5FA' },
          { label: 'Class Average',   value: loading ? '…' : stats.classAvg === null ? '—' : `${stats.classAvg}%`, sub: `${marks.length} marks captured`, Icon: BarChart2, color: stats.classAvg === null ? FAINT : pctColor(stats.classAvg) },
          { label: 'Today’s Register', value: loading ? '…' : stats.todayPresent ?? '—',                     sub: stats.todayPresent ? 'present' : 'not taken yet', Icon: UserCheck, color: GREEN },
        ].map(s => (
          <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{s.label}</span>
              <s.Icon size={15} style={{ color: s.color }} />
            </div>
            <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: FAINT, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* At-risk banner */}
      {!loading && stats.atRisk > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 14, padding: '13px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={17} style={{ color: RED, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: '#fff', flex: 1 }}>
            <strong>{stats.atRisk} learner{stats.atRisk > 1 ? 's' : ''}</strong> averaging below 60% — check the Students page.
          </span>
          <Link href="/dashboard/teacher/students" style={{ fontSize: 12, color: RED, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            View →
          </Link>
        </div>
      )}

      <div className="portal-sidebar-grid">
        {/* Recent marks */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: 0 }}>Recently Captured</h3>
            <Link href="/dashboard/teacher/gradebook" style={{ fontSize: 12, color: '#C4B5FD', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Gradebook <ChevronRight size={12} />
            </Link>
          </div>
          {loading ? (
            <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>
          ) : recentMarks.length === 0 ? (
            <p style={{ color: MUTED, fontSize: 13 }}>No marks captured yet — start from the Capture page.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {recentMarks.map(m => {
                const p = Math.round((m.score / m.total) * 100);
                return (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', background: S2, borderRadius: 9, border: `1px solid ${BORDER}` }}>
                    <div style={{ width: 3, height: 32, borderRadius: 2, background: m.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.studentName} — {m.task}
                      </div>
                      <div style={{ fontSize: 11, color: FAINT }}>{m.subject} · {m.date}</div>
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: pctColor(p), flexShrink: 0 }}>{m.score}/{m.total}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/dashboard/teacher/capture" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 14, background: PURPLE, color: '#fff', textDecoration: 'none' }}>
            <PenLine size={18} />
            <div>
              <div style={{ fontFamily: FH, fontSize: 14.5, fontWeight: 700 }}>Capture</div>
              <div style={{ fontSize: 11.5, opacity: 0.8 }}>Marks · attendance · assignments · notices</div>
            </div>
          </Link>
          {[
            { label: 'Gradebook', sub: 'Review and delete marks', href: '/dashboard/teacher/gradebook', Icon: BookOpen },
            { label: 'Students',  sub: 'Averages and attendance', href: '/dashboard/teacher/students',  Icon: Users },
          ].map(x => (
            <Link key={x.href} href={x.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 14, background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, textDecoration: 'none' }}>
              <x.Icon size={18} style={{ color: '#C4B5FD' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 600 }}>{x.label}</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>{x.sub}</div>
              </div>
              <ChevronRight size={15} style={{ color: FAINT }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
