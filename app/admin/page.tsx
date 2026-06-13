'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, GraduationCap, FileText, TrendingUp, UserPlus, BookOpen, LayoutList, BarChart2, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { SCHOOL_STATS, APPLICATIONS, ADMIN_CLASSES, ADMIN_STUDENTS } from '@/data/adminData';

const BG = '#0C0C0C';
const SURFACE = '#161616';
const S2 = '#1E1E1E';
const S3 = '#272727';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.10)';
const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.50)';
const FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981';
const RED = '#EF4444';
const AMBER = '#F59E0B';
const BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif";
const FB = "'Inter', sans-serif";

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, to / 40);
    const t = setInterval(() => {
      current = Math.min(current + step, to);
      setVal(Math.round(current));
      if (current >= to) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:        { label: 'Pending',        color: AMBER, bg: 'rgba(245,158,11,0.12)',   icon: Clock },
  approved:       { label: 'Approved',       color: GREEN, bg: 'rgba(16,185,129,0.12)',   icon: CheckCircle2 },
  rejected:       { label: 'Rejected',       color: RED,   bg: 'rgba(239,68,68,0.12)',    icon: XCircle },
  info_requested: { label: 'Info Requested', color: BLUE,  bg: 'rgba(59,130,246,0.12)',  icon: AlertTriangle },
  waitlisted:     { label: 'Waitlisted',     color: MUTED, bg: 'rgba(255,255,255,0.08)', icon: Clock },
};

const GRADE_COLORS: Record<number, string> = { 8: BLUE, 9: '#8B5CF6', 10: GREEN, 11: AMBER, 12: GOLD };

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Students',       value: SCHOOL_STATS.totalStudents,       icon: Users,         color: BLUE,      suffix: '' },
    { label: 'Total Teachers',       value: SCHOOL_STATS.totalTeachers,       icon: GraduationCap, color: '#8B5CF6', suffix: '' },
    { label: 'Pending Applications', value: SCHOOL_STATS.pendingApplications, icon: FileText,      color: AMBER,     suffix: '' },
    { label: 'School Average',       value: SCHOOL_STATS.schoolAverage,       icon: TrendingUp,    color: GOLD,      suffix: '%' },
  ];

  const quickActions = [
    { label: 'Add Student',        sub: 'Enrol a new learner',       href: '/admin/students',     color: GREEN,     icon: UserPlus },
    { label: 'Add Teacher',        sub: 'Register new staff',        href: '/admin/teachers',     color: BLUE,      icon: GraduationCap },
    { label: 'View Applications',  sub: `${SCHOOL_STATS.pendingApplications} pending`,   href: '/admin/applications', color: AMBER,     icon: FileText },
    { label: 'Generate Reports',   sub: 'Export term data',          href: '/admin/reports',      color: '#8B5CF6', icon: BarChart2 },
  ];

  const gradeGroups = [8, 9, 10, 11, 12].map(g => {
    const cls = ADMIN_CLASSES.filter(c => c.grade === g);
    const students = cls.reduce((s, c) => s + c.studentCount, 0);
    const avg = cls.length ? Math.round(cls.reduce((s, c) => s + c.averageMark, 0) / cls.length) : 0;
    return { grade: g, classes: cls.length, students, avg };
  });

  const recentApps = APPLICATIONS.slice(0, 5);

  return (
    <div style={{ padding: 28, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: FH, fontSize: 26, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>
          Welcome back, Admin 👋
        </h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 5 }}>Term 3, 2025 · Sidelile High School</p>
      </div>

      {/* Stat cards — 4 col */}
      <div className="portal-stats-grid">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: MUTED, fontWeight: 500, letterSpacing: '0.01em' }}>{s.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
              </div>
              <div style={{ fontFamily: FH, fontSize: 30, fontWeight: 800, color: TEXT, letterSpacing: '-0.04em', lineHeight: 1 }}>
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick action cards — 4 col */}
      <div className="portal-stats-grid" style={{ marginBottom: 26 }}>
        {quickActions.map(a => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.color + '55'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color: a.color }} />
              </div>
              <div>
                <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: TEXT }}>{a.label}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{a.sub}</div>
              </div>
              <div style={{ fontSize: 13, color: a.color, fontWeight: 600, marginTop: 'auto' }}>→</div>
            </Link>
          );
        })}
      </div>

      {/* Bottom two-col layout */}
      <div className="portal-main-grid">

        {/* LEFT — recent applications + grade overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Recent Applications table */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>Recent Applications</h3>
              <Link href="/admin/applications" style={{ fontSize: 12, color: GOLD, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>

            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px 100px 90px 80px', padding: '0 4px', marginBottom: 6 }}>
              {['Reference', 'Applicant', 'Grade', 'Status', 'Date', ''].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>

            {recentApps.map((a, i) => {
              const sc = STATUS_CONFIG[a.status];
              const Icon = sc.icon;
              return (
                <div
                  key={a.id}
                  style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px 100px 90px 80px', alignItems: 'center', padding: '2px 4px', borderTop: `1px solid rgba(255,255,255,0.04)`, borderRadius: 8, transition: 'background .1s', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div style={{ padding: '10px 0' }}>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: GOLD, fontWeight: 600 }}>{a.ref}</div>
                  </div>
                  <div style={{ padding: '10px 0' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{a.firstName} {a.lastName}</div>
                    <div style={{ fontSize: 10, color: FAINT }}>{a.currentSchool}</div>
                  </div>
                  <div style={{ fontSize: 13, color: MUTED }}>Gr {a.gradeApplying}</div>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: sc.bg, color: sc.color }}>
                      <Icon size={9} /> {sc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: MUTED }}>{a.dateSubmitted}</div>
                  <div>
                    <Link href="/admin/applications" style={{ fontSize: 11, fontWeight: 700, color: GOLD, textDecoration: 'none', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 6, padding: '4px 10px' }}>
                      Review →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grade Overview */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>Grade Overview</h3>
              <Link href="/admin/classes" style={{ fontSize: 12, color: GOLD, textDecoration: 'none', fontWeight: 600 }}>All classes →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gradeGroups.map(g => {
                const col = GRADE_COLORS[g.grade] ?? GOLD;
                const avgColor = g.avg >= 75 ? GREEN : g.avg >= 60 ? AMBER : RED;
                return (
                  <div key={g.grade} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', background: S2, borderRadius: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: col + '18', border: `1px solid ${col}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FH, fontWeight: 800, fontSize: 14, color: col, flexShrink: 0 }}>
                      G{g.grade}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{g.classes} classes · {g.students} students</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: avgColor }}>{g.avg}% avg</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${g.avg}%`, background: avgColor, borderRadius: 2, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Applications summary */}
          <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: GOLD, margin: '0 0 14px' }}>Applications 2025</h3>
            {[
              { label: 'Pending',        count: APPLICATIONS.filter(a => a.status === 'pending').length,        color: AMBER },
              { label: 'Approved',       count: APPLICATIONS.filter(a => a.status === 'approved').length,       color: GREEN },
              { label: 'Rejected',       count: APPLICATIONS.filter(a => a.status === 'rejected').length,       color: RED },
              { label: 'Info Requested', count: APPLICATIONS.filter(a => a.status === 'info_requested').length, color: BLUE },
              { label: 'Waitlisted',     count: APPLICATIONS.filter(a => a.status === 'waitlisted').length,     color: MUTED },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>{s.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.count}</span>
              </div>
            ))}
            <Link href="/admin/applications" style={{ display: 'block', marginTop: 14, fontSize: 12, color: GOLD, textDecoration: 'none', fontWeight: 700, textAlign: 'center', padding: '9px 0', background: GOLD_B, borderRadius: 9999 }}>
              Review Applications →
            </Link>
          </div>

          {/* At-risk students */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 12px' }}>At Risk</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ADMIN_STUDENTS.filter(s => s.average < 60 || s.attendance < 85).slice(0, 6).map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: S2, borderRadius: 9, border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0 }}>
                    {s.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.firstName} {s.lastName}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>Gr {s.grade} · {s.className}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {s.average < 60 && <div style={{ fontSize: 11, fontWeight: 700, color: RED }}>{s.average}%</div>}
                    {s.attendance < 85 && <div style={{ fontSize: 10, color: AMBER }}>{s.attendance}% att.</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stream selection shortcut */}
          <Link
            href="/admin/stream-selection"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color .15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD + '55'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 9, background: GOLD_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LayoutList size={16} style={{ color: GOLD }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Stream Selection</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>Grade 9 → 10 assignment</div>
            </div>
            <span style={{ fontSize: 13, color: GOLD }}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
