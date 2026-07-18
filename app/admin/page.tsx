'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, GraduationCap, FileText, TrendingUp, UserPlus, BarChart2, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

const GRADE_COLORS: Record<string, string> = { 'Grade 8': BLUE, 'Grade 9': '#8B5CF6', 'Grade 10': GREEN, 'Grade 11': AMBER, 'Grade 12': GOLD };

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  Pending:        { label: 'Pending',        color: AMBER, bg: 'rgba(245,158,11,0.12)',   Icon: Clock },
  Approved:       { label: 'Approved',       color: GREEN, bg: 'rgba(16,185,129,0.12)',   Icon: CheckCircle2 },
  Rejected:       { label: 'Rejected',       color: RED,   bg: 'rgba(239,68,68,0.12)',    Icon: XCircle },
  Info_Requested: { label: 'Info Requested', color: BLUE,  bg: 'rgba(59,130,246,0.12)',   Icon: AlertTriangle },
  Waitlisted:     { label: 'Waitlisted',     color: MUTED, bg: 'rgba(255,255,255,0.08)', Icon: Clock },
};

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.max(1, to / 40);
    const t = setInterval(() => { cur = Math.min(cur + step, to); setVal(Math.round(cur)); if (cur >= to) clearInterval(t); }, 30);
    return () => clearInterval(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

export default function AdminDashboard() {
  const [users, setUsers]   = useState<any[]>([]);
  const [apps, setApps]     = useState<any[]>([]);
  const [marks, setMarks]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
      fetch('/api/marks').then(r => r.json()),
    ]).then(([u, a, m]) => {
      setUsers(u.users ?? []);
      setApps(a.applications ?? []);
      setMarks(m.marks ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const pending  = apps.filter(a => a.status === 'Pending').length;

  // School average across all marks
  const schoolAvg = marks.length
    ? Math.round(marks.reduce((s: number, m: any) => s + (m.score / m.total) * 100, 0) / marks.length)
    : 0;

  // At-risk: students with average < 60
  const atRisk = students.map(s => {
    const sm = marks.filter((m: any) => m.studentPortalId === s.portalId);
    const avg = sm.length ? Math.round(sm.reduce((x: number, m: any) => x + (m.score / m.total) * 100, 0) / sm.length) : null;
    return { ...s, avg };
  }).filter(s => s.avg !== null && s.avg < 60);

  // Grade overview
  const gradeGroups = ['Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'].map(grade => {
    const gs = students.filter(s => s.grade === grade);
    const gm = marks.filter((m: any) => gs.find(s => s.portalId === m.studentPortalId));
    const avg = gm.length ? Math.round(gm.reduce((x: number, m: any) => x + (m.score / m.total) * 100, 0) / gm.length) : null;
    return { grade, count: gs.length, avg };
  }).filter(g => g.count > 0);

  const recentApps = apps.slice(0, 5);

  const statCards = [
    { label: 'Total Students',       value: students.length, icon: Users,         color: BLUE,      suffix: '' },
    { label: 'Total Teachers',       value: teachers.length, icon: GraduationCap, color: '#8B5CF6', suffix: '' },
    { label: 'Pending Applications', value: pending,         icon: FileText,      color: AMBER,     suffix: '' },
    { label: 'School Average',       value: schoolAvg,       icon: TrendingUp,    color: GOLD,      suffix: '%' },
  ];

  const quickActions = [
    { label: 'Add Student',       sub: 'Enrol a new learner',    href: '/admin/manage',       color: GREEN,     icon: UserPlus },
    { label: 'Add Teacher',       sub: 'Register new staff',     href: '/admin/manage',       color: BLUE,      icon: GraduationCap },
    { label: 'View Applications', sub: `${pending} pending`,     href: '/admin/applications', color: AMBER,     icon: FileText },
    { label: 'Generate Reports',  sub: 'Export term data',       href: '/admin/reports',      color: '#8B5CF6', icon: BarChart2 },
  ];

  const statusBreakdown = ['Pending','Approved','Rejected','Info_Requested','Waitlisted'].map(k => ({
    key: k,
    label: STATUS_CFG[k]?.label ?? k,
    count: apps.filter(a => a.status === k || (k === 'Info_Requested' && a.status === 'Info Requested')).length,
    color: STATUS_CFG[k]?.color ?? MUTED,
  }));

  return (
    <div style={{ padding: 28, fontFamily: FB, background: BG, minHeight: '100%' }}>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: FH, fontSize: 26, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Welcome back, Admin</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 5 }}>
          {loading ? 'Loading dashboard…' : `${students.length} students · ${teachers.length} teachers · ${pending} pending`}
        </p>
      </div>

      {/* Stat cards */}
      <div className="portal-stats-grid">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{s.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
              </div>
              <div style={{ fontFamily: FH, fontSize: 30, fontWeight: 800, color: TEXT, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {loading ? '—' : <CountUp to={s.value} suffix={s.suffix} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="portal-stats-grid" style={{ marginBottom: 26 }}>
        {quickActions.map(a => {
          const Icon = a.icon;
          return (
            <Link key={a.label} href={a.href} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.color + '55'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}>
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

      {/* Bottom two-col */}
      <div className="portal-main-grid">

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Recent Applications */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>Recent Applications</h3>
              <Link href="/admin/applications" style={{ fontSize: 12, color: GOLD, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>
            {loading ? (
              <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>
            ) : recentApps.length === 0 ? (
              <p style={{ color: MUTED, fontSize: 13 }}>No applications yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 500 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 60px 110px 90px 70px', padding: '0 4px', marginBottom: 6 }}>
                    {['Ref', 'Applicant', 'Grade', 'Status', 'Date', ''].map(h => (
                      <div key={h} style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
                    ))}
                  </div>
                  {recentApps.map(a => {
                    const sc = STATUS_CFG[a.status] ?? STATUS_CFG.Pending;
                    const Icon = sc.Icon;
                    return (
                      <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 60px 110px 90px 70px', alignItems: 'center', padding: '2px 4px', borderTop: `1px solid rgba(255,255,255,0.04)`, borderRadius: 8 }}>
                        <div style={{ padding: '10px 0', fontSize: 11, fontFamily: 'monospace', color: GOLD, fontWeight: 600 }}>{a.ref}</div>
                        <div style={{ padding: '10px 0' }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{a.firstName} {a.lastName}</div>
                          <div style={{ fontSize: 10, color: FAINT }}>{a.previousSchool ?? '—'}</div>
                        </div>
                        <div style={{ fontSize: 13, color: MUTED }}>{a.applyingGrade?.replace('Grade ', 'Gr ')}</div>
                        <div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: sc.bg, color: sc.color }}>
                            <Icon size={9} /> {sc.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: MUTED }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }) : '—'}</div>
                        <div>
                          <Link href="/admin/applications" style={{ fontSize: 11, fontWeight: 700, color: GOLD, textDecoration: 'none', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 6, padding: '4px 10px' }}>
                            Review →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Grade Overview */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>Grade Overview</h3>
              <Link href="/admin/students" style={{ fontSize: 12, color: GOLD, textDecoration: 'none', fontWeight: 600 }}>All students →</Link>
            </div>
            {loading ? (
              <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>
            ) : gradeGroups.length === 0 ? (
              <p style={{ color: MUTED, fontSize: 13 }}>No students enrolled yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {gradeGroups.map(g => {
                  const col = GRADE_COLORS[g.grade] ?? GOLD;
                  const avgColor = g.avg === null ? FAINT : g.avg >= 75 ? GREEN : g.avg >= 60 ? AMBER : RED;
                  return (
                    <div key={g.grade} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', background: S2, borderRadius: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: col + '18', border: `1px solid ${col}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FH, fontWeight: 800, fontSize: 12, color: col, flexShrink: 0, textAlign: 'center' }}>
                        {g.grade.replace('Grade ', 'G')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{g.count} student{g.count !== 1 ? 's' : ''}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: avgColor }}>{g.avg !== null ? `${g.avg}% avg` : 'No marks yet'}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${g.avg ?? 0}%`, background: avgColor, borderRadius: 2, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Applications breakdown */}
          <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: GOLD, margin: '0 0 14px' }}>Applications {new Date().getFullYear()}</h3>
            {statusBreakdown.map(s => (
              <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>{s.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{loading ? '—' : s.count}</span>
              </div>
            ))}
            <Link href="/admin/applications" style={{ display: 'block', marginTop: 14, fontSize: 12, color: GOLD, textDecoration: 'none', fontWeight: 700, textAlign: 'center', padding: '9px 0', background: GOLD_B, borderRadius: 9999 }}>
              Review Applications →
            </Link>
          </div>

          {/* At-risk students */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 12px' }}>
              At Risk {!loading && atRisk.length > 0 && <span style={{ fontSize: 12, color: RED, fontWeight: 600 }}>({atRisk.length})</span>}
            </h3>
            {loading ? (
              <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>
            ) : atRisk.length === 0 ? (
              <div style={{ fontSize: 12, color: GREEN, padding: '10px 0' }}>✓ No students below 60% average</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {atRisk.slice(0, 6).map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: S2, borderRadius: 9, border: '1px solid rgba(239,68,68,0.15)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: RED, flexShrink: 0 }}>
                      {s.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: MUTED }}>{s.grade ?? '—'} · {s.portalId}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: RED, flexShrink: 0 }}>{s.avg}%</div>
                  </div>
                ))}
                {atRisk.length > 6 && (
                  <Link href="/admin/students" style={{ fontSize: 12, color: GOLD, textDecoration: 'none', textAlign: 'center', padding: '6px 0' }}>
                    +{atRisk.length - 6} more →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
