'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Users, AlertTriangle } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const GRADES = ['All', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const pctColor = (p: number) => (p >= 60 ? GREEN : p >= 40 ? AMBER : RED);

export default function AdminStudentsPage() {
  const [users, setUsers]     = useState<any[]>([]);
  const [marks, setMarks]     = useState<any[]>([]);
  const [att, setAtt]         = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ]             = useState('');
  const [grade, setGrade]     = useState('All');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/marks').then(r => r.json()),
      fetch('/api/attendance').then(r => r.json()),
    ]).then(([u, m, a]) => {
      setUsers((u.users ?? []).filter((x: any) => x.role === 'student'));
      setMarks(m.marks ?? []);
      setAtt(a.records ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => users.map(s => {
    const sm = marks.filter(m => m.studentPortalId === s.portalId);
    const avg = sm.length ? Math.round(sm.reduce((x, m) => x + (m.score / m.total) * 100, 0) / sm.length) : null;
    const sa = att.filter(a => a.studentPortalId === s.portalId);
    const present = sa.filter(a => a.status === 'present' || a.status === 'late').length;
    const attPct = sa.length ? Math.round((present / sa.length) * 100) : null;
    return { ...s, avg, attPct, atRisk: avg !== null && avg < 60 };
  })
    .filter(s => grade === 'All' || s.grade === grade)
    .filter(s => !q.trim() || s.name.toLowerCase().includes(q.toLowerCase()) || s.portalId?.toLowerCase().includes(q.toLowerCase()) || s.email?.toLowerCase().includes(q.toLowerCase())),
  [users, marks, att, q, grade]);

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Students</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
            {loading ? 'Loading…' : `${rows.length} learners · ${rows.filter(r => r.atRisk).length} at risk`}
          </p>
        </div>
        <Link href="/admin/manage" style={{ padding: '10px 18px', borderRadius: 10, background: GOLD, color: '#000', textDecoration: 'none', fontFamily: FH, fontSize: 13, fontWeight: 700 }}>
          + Add / Remove
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: FAINT }} />
          <input
            value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, number or email…"
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 34px', borderRadius: 10, background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, fontFamily: FB, fontSize: 13, outline: 'none' }}
          />
        </div>
        {GRADES.map(g => (
          <button key={g} onClick={() => setGrade(g)} style={{
            padding: '8px 13px', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: grade === g ? GOLD_DIM : 'transparent',
            border: `1px solid ${grade === g ? GOLD_B : BORDER}`,
            color: grade === g ? GOLD : MUTED,
          }}>
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 14 }}>Loading students…</p>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <Users size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No students found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Students appear here when they register or you add them in Manage Data.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: SURFACE, borderRadius: 12, border: `1px solid ${s.atRisk ? 'rgba(239,68,68,0.25)' : BORDER}`, opacity: s.active ? 1 : 0.45 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: GOLD, flexShrink: 0 }}>
                {s.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{s.name}</span>
                  {!s.active && <span style={{ fontSize: 10, color: RED, fontWeight: 700 }}>INACTIVE</span>}
                  {s.atRisk && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: RED, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 5, padding: '2px 7px' }}>
                      <AlertTriangle size={10} /> AT RISK
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: FAINT, marginTop: 2 }}>{s.portalId}{s.grade ? ` · ${s.grade}` : ''} · {s.email}</div>
              </div>
              <div style={{ textAlign: 'right', width: 80, flexShrink: 0 }}>
                <div style={{ fontSize: 10.5, color: FAINT, fontWeight: 600 }}>AVERAGE</div>
                <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: s.avg === null ? FAINT : pctColor(s.avg) }}>{s.avg === null ? '—' : `${s.avg}%`}</div>
              </div>
              <div style={{ textAlign: 'right', width: 100, flexShrink: 0 }}>
                <div style={{ fontSize: 10.5, color: FAINT, fontWeight: 600 }}>ATTENDANCE</div>
                <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: s.attPct === null ? FAINT : pctColor(s.attPct) }}>{s.attPct === null ? '—' : `${s.attPct}%`}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
