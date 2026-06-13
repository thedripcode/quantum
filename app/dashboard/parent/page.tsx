'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  GraduationCap, BarChart2, CheckSquare, Bell, AlertTriangle,
  TrendingUp, TrendingDown, Minus, ArrowRight, Link as LinkIcon,
} from 'lucide-react';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981'; const RED = '#EF4444'; const YELLOW = '#F59E0B';
const F_H = "'Bricolage Grotesque', sans-serif"; const F_B = "'Inter', sans-serif";

function capsLevel(pct: number) {
  if (pct >= 80) return { num: 7, label: 'Outstanding',  color: GREEN };
  if (pct >= 70) return { num: 6, label: 'Meritorious',  color: '#3B82F6' };
  if (pct >= 60) return { num: 5, label: 'Substantial',  color: '#8B5CF6' };
  if (pct >= 50) return { num: 4, label: 'Adequate',     color: YELLOW };
  if (pct >= 40) return { num: 3, label: 'Moderate',     color: '#F97316' };
  if (pct >= 30) return { num: 2, label: 'Elementary',   color: RED };
  return              { num: 1, label: 'Not Achieved',   color: RED };
}

interface ChildData {
  linked: boolean;
  student: { id: string; name: string; portalId: string; grade: string; stream: string; schoolEmail: string } | null;
  subjects: { id: string; name: string; short: string; color: string; average: number | null; markCount: number }[];
  overallAvg: number | null;
  marks: { id: string; task: string; type: string; score: number; total: number; pct: number; term: number; date: string; subjectName: string; subjectShort: string; subjectColor: string }[];
  attendance: { totalDays: number; presentDays: number; attendancePct: number | null };
  notices: { id: string; title: string; body: string; category: string; pinned: boolean; createdAt: string }[];
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
          {icon}
        </div>
        <span style={{ fontSize: 11, color: MUTED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: color ?? TEXT, fontFamily: F_H, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: MUTED }}>{sub}</div>}
    </div>
  );
}

export default function ParentDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/parent/child')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ fontSize: 14, color: MUTED }}>Loading child's data…</div>
      </div>
    );
  }

  if (!data?.linked || !data.student) {
    return (
      <div style={{ padding: 32, fontFamily: F_B }}>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, textAlign: 'center', maxWidth: 480, margin: '60px auto' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: GOLD }}>
            <LinkIcon size={22} />
          </div>
          <h2 style={{ fontFamily: F_H, fontSize: 20, fontWeight: 700, color: TEXT, margin: '0 0 8px' }}>Not linked to a student yet</h2>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: '0 0 20px' }}>
            Your account hasn't been linked to a student yet. Please contact the school office and ask the admin to link your account to your child.
          </p>
          <div style={{ padding: '12px 16px', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>Your Portal ID: {(session?.user as any)?.portalId ?? '—'}</div>
            <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.65)', marginTop: 2 }}>Give this to the admin so they can link your account</div>
          </div>
        </div>
      </div>
    );
  }

  const { student, subjects, overallAvg, marks, attendance, notices } = data;
  const atRisk = subjects.filter(s => s.average !== null && s.average < 50);
  const recentMarks = marks.slice(0, 5);
  const recentNotices = notices.slice(0, 3);
  const level = overallAvg !== null ? capsLevel(overallAvg) : null;

  return (
    <div style={{ padding: '28px 24px', fontFamily: F_B, background: BG, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: F_H, fontSize: 26, fontWeight: 800, color: TEXT, margin: '0 0 4px', letterSpacing: '-0.03em' }}>
          Parent Dashboard
        </h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Monitoring {student.name}'s progress</p>
      </div>

      {/* Student card */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: GOLD_DIM, border: `2px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: GOLD, flexShrink: 0 }}>
          {student.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F_H, fontSize: 18, fontWeight: 700, color: TEXT, letterSpacing: '-0.02em' }}>{student.name}</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
            {student.grade}{student.stream ? ` ${student.stream}` : ''} · {student.portalId} · {student.schoolEmail}
          </div>
        </div>
        {level && (
          <div style={{ padding: '8px 14px', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 10, flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>Overall Average</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: level.color, fontFamily: F_H }}>{overallAvg}%</div>
            <div style={{ fontSize: 10, color: level.color, marginTop: 1 }}>Level {level.num} · {level.label}</div>
          </div>
        )}
      </div>

      {/* At-risk alert */}
      {atRisk.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 12, padding: '14px 16px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertTriangle size={16} style={{ color: RED, flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: RED, marginBottom: 4 }}>Subjects requiring attention</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              {student.name} is below 50% in: <strong style={{ color: 'rgba(255,255,255,0.80)' }}>{atRisk.map(s => s.name).join(', ')}</strong>. Please consider reaching out to the relevant teachers.
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard icon={<BarChart2 size={14} />} label="Overall Avg" value={overallAvg !== null ? `${overallAvg}%` : '—'} sub={level?.label} color={level?.color} />
        <StatCard icon={<CheckSquare size={14} />} label="Attendance" value={attendance.attendancePct !== null ? `${attendance.attendancePct}%` : '—'} sub={`${attendance.presentDays} / ${attendance.totalDays} days`} color={attendance.attendancePct !== null && attendance.attendancePct < 80 ? RED : GREEN} />
        <StatCard icon={<GraduationCap size={14} />} label="Subjects" value={subjects.length} sub="enrolled" />
        <StatCard icon={<Bell size={14} />} label="Notices" value={notices.length} sub="for parents" />
      </div>

      {/* Two-column content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        {/* Subject performance */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: F_H, fontSize: 14, fontWeight: 700, color: TEXT }}>Subject Performance</span>
            <button onClick={() => router.push('/dashboard/parent/marks')} style={{ fontSize: 11, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {subjects.map(s => {
              const pct = s.average ?? 0;
              const lv  = capsLevel(pct);
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: TEXT, flex: 1 }}>{s.name}</span>
                  {s.average !== null ? (
                    <>
                      <div style={{ width: 80, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: lv.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: lv.color, width: 34, textAlign: 'right' }}>{pct}%</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: FAINT }}>No marks</span>
                  )}
                </div>
              );
            })}
            {subjects.length === 0 && <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>No subjects enrolled yet.</p>}
          </div>
        </div>

        {/* Recent marks */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: F_H, fontSize: 14, fontWeight: 700, color: TEXT }}>Recent Assessments</span>
            <button onClick={() => router.push('/dashboard/parent/marks')} style={{ fontSize: 11, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentMarks.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: S2, borderRadius: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.subjectColor, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: TEXT, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.task}</div>
                  <div style={{ fontSize: 10, color: MUTED }}>{m.subjectShort} · Term {m.term}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: capsLevel(m.pct).color }}>{m.pct}%</span>
              </div>
            ))}
            {recentMarks.length === 0 && <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>No marks recorded yet.</p>}
          </div>
        </div>

        {/* Notices */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: F_H, fontSize: 14, fontWeight: 700, color: TEXT }}>School Notices</span>
            <button onClick={() => router.push('/dashboard/parent/notices')} style={{ fontSize: 11, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentNotices.map(n => (
              <div key={n.id} style={{ padding: '10px 12px', background: S2, borderRadius: 10, borderLeft: `3px solid ${n.category === 'Urgent' ? RED : GOLD}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.body}</div>
              </div>
            ))}
            {recentNotices.length === 0 && <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>No notices yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
