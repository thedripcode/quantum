'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, AlertTriangle, Search } from 'lucide-react';

const BG = '#081420'; const SURFACE = '#0E1E30'; const S2 = '#14283E';
const PURPLE_DIM = 'rgba(124,58,237,0.10)'; const PURPLE_B = 'rgba(124,58,237,0.25)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#10B981'; const RED = '#EF4444'; const AMBER = '#F59E0B';
const FH = "'Roboto Condensed', sans-serif"; const FB = "'Inter', sans-serif";

const pctColor = (p: number) => (p >= 60 ? GREEN : p >= 40 ? AMBER : RED);

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks]       = useState<any[]>([]);
  const [attendance, setAtt]    = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [q, setQ]               = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/teacher/roster').then(r => r.json()),
      fetch('/api/marks').then(r => r.json()),
      fetch('/api/attendance').then(r => r.json()),
    ]).then(([r, m, a]) => {
      setStudents(r.students ?? []);
      setMarks(m.marks ?? []);
      setAtt(a.records ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => students.map(s => {
    const sm = marks.filter(m => m.studentPortalId === s.portalId);
    const avg = sm.length ? Math.round(sm.reduce((x, m) => x + (m.score / m.total) * 100, 0) / sm.length) : null;
    const sa = attendance.filter(a => a.studentPortalId === s.portalId);
    const present = sa.filter(a => a.status === 'present' || a.status === 'late').length;
    const attPct = sa.length ? Math.round((present / sa.length) * 100) : null;
    return { ...s, avg, attPct, markCount: sm.length, atRisk: avg !== null && avg < 60 };
  }).filter(s => !q.trim() || s.name.toLowerCase().includes(q.toLowerCase()) || s.portalId?.toLowerCase().includes(q.toLowerCase())),
  [students, marks, attendance, q]);

  const atRiskCount = rows.filter(r => r.atRisk).length;

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Students</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
          {loading ? 'Loading…' : `${rows.length} learners · ${atRiskCount} at risk`}
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 340, marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: FAINT }} />
        <input
          value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or student number…"
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 34px', borderRadius: 10, background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, fontFamily: FB, fontSize: 13, outline: 'none' }}
        />
      </div>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 14 }}>Loading students…</p>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <Users size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No students found</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map(s => (
            <div key={s.portalId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: SURFACE, borderRadius: 12, border: `1px solid ${s.atRisk ? 'rgba(239,68,68,0.25)' : BORDER}` }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: PURPLE_DIM, border: `1px solid ${PURPLE_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#C4B5FD', flexShrink: 0 }}>
                {s.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{s.name}</span>
                  {s.atRisk && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: RED, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 5, padding: '2px 7px' }}>
                      <AlertTriangle size={10} /> AT RISK
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: FAINT, marginTop: 2 }}>{s.portalId}{s.grade ? ` · ${s.grade}` : ''} · {s.markCount} mark{s.markCount !== 1 ? 's' : ''}</div>
              </div>
              <div style={{ textAlign: 'right', width: 90, flexShrink: 0 }}>
                <div style={{ fontSize: 10.5, color: FAINT, fontWeight: 600 }}>AVERAGE</div>
                <div style={{ fontFamily: FH, fontSize: 17, fontWeight: 700, color: s.avg === null ? FAINT : pctColor(s.avg) }}>
                  {s.avg === null ? '—' : `${s.avg}%`}
                </div>
              </div>
              <div style={{ textAlign: 'right', width: 100, flexShrink: 0 }}>
                <div style={{ fontSize: 10.5, color: FAINT, fontWeight: 600 }}>ATTENDANCE</div>
                <div style={{ fontFamily: FH, fontSize: 17, fontWeight: 700, color: s.attPct === null ? FAINT : pctColor(s.attPct) }}>
                  {s.attPct === null ? '—' : `${s.attPct}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
