'use client';

import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.08)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
    </div>
  );
}

const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const pColor = (v: number) => v >= 75 ? GREEN : v >= 60 ? AMBER : RED;

export default function MarksPage() {
  const [marks,    setMarks]    = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [sortBy,   setSortBy]   = useState<'avg' | 'name'>('avg');

  useEffect(() => {
    Promise.all([
      fetch('/api/marks').then(r => r.json()),
      fetch('/api/admin/subjects').then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json()),
    ]).then(([m, s, u]) => {
      setMarks(m.marks ?? []);
      setSubjects(s.subjects ?? []);
      setStudents((u.users ?? []).filter((x: any) => x.role === 'student'));
    }).finally(() => setLoading(false));
  }, []);

  // Per-subject stats from real marks
  const subjectStats = useMemo(() => subjects.map(sub => {
    const sm = marks.filter(m => m.subjectId === sub.id);
    if (!sm.length) return null;
    const pcts = sm.map(m => (m.score / m.total) * 100);
    const avg  = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    const pass = Math.round((pcts.filter(p => p >= 40).length / pcts.length) * 100);
    const high = Math.round(Math.max(...pcts));
    const low  = Math.round(Math.min(...pcts));
    return { id: sub.id, name: sub.name, color: sub.color, avg, pass, high, low };
  }).filter(Boolean) as { id: string; name: string; color: string; avg: number; pass: number; high: number; low: number }[],
  [marks, subjects]);

  const sorted = [...subjectStats].sort((a, b) =>
    sortBy === 'avg' ? b.avg - a.avg : a.name.localeCompare(b.name));

  const schoolAvg = subjectStats.length
    ? Math.round(subjectStats.reduce((s, x) => s + x.avg, 0) / subjectStats.length) : 0;
  const overallPass = subjectStats.length
    ? Math.round(subjectStats.reduce((s, x) => s + x.pass, 0) / subjectStats.length) : 0;
  const topSub  = subjectStats.reduce((a, b) => b.avg > a.avg ? b : a, subjectStats[0]);
  const weakSub = subjectStats.reduce((a, b) => b.avg < a.avg ? b : a, subjectStats[0]);

  const atRisk = useMemo(() => students.filter(s => {
    const sm = marks.filter(m => m.studentPortalId === s.portalId);
    if (!sm.length) return false;
    const avg = sm.reduce((x, m) => x + (m.score / m.total) * 100, 0) / sm.length;
    return avg < 60;
  }), [students, marks]);

  // Grade breakdown from real data
  const gradeStats = GRADES.map(grade => {
    const gs = students.filter(s => s.grade === grade);
    const gm = marks.filter(m => gs.find(s => s.portalId === m.studentPortalId));
    if (!gm.length) return { grade, avg: null, count: gs.length };
    const avg = Math.round(gm.reduce((x, m) => x + (m.score / m.total) * 100, 0) / gm.length);
    return { grade, avg, count: gs.length };
  }).filter(g => g.count > 0);

  // Term trend from real marks grouped by term
  const termTrend = [1, 2, 3].map(term => {
    const tm = marks.filter(m => m.term === term);
    if (!tm.length) return null;
    const avg = Math.round(tm.reduce((x, m) => x + (m.score / m.total) * 100, 0) / tm.length);
    return { term: `T${term}`, avg };
  }).filter(Boolean) as { term: string; avg: number }[];

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Marks Overview</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
          {loading ? 'Loading…' : `${marks.length} marks recorded across ${subjectStats.length} subjects`}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'School Average',    value: loading ? '—' : subjectStats.length ? `${schoolAvg}%` : '—',         color: GOLD,  Icon: BarChart2   },
          { label: 'Overall Pass Rate', value: loading ? '—' : subjectStats.length ? `${overallPass}%` : '—',        color: GREEN, Icon: TrendingUp  },
          { label: 'Top Subject',       value: loading ? '—' : topSub ? topSub.name.split(' ')[0] : '—',             color: BLUE,  Icon: TrendingUp  },
          { label: 'At Risk Students',  value: loading ? '—' : String(atRisk.length),                                color: RED,   Icon: TrendingDown },
        ].map(c => {
          const Icon = c.Icon;
          return (
            <div key={c.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontFamily: FH, fontSize: 20, fontWeight: 800, color: c.color }}>{c.value}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: c.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={14} style={{ color: c.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 14 }}>Loading marks data…</p>
      ) : marks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <BarChart2 size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No marks recorded yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Teachers capture marks in their portal under Mark Capture.</div>
        </div>
      ) : (
        <div className="portal-main-grid" style={{ gap: 18 }}>
          {/* Subject breakdown */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 600, color: TEXT }}>Subject Breakdown</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ key: 'avg', label: 'By Average' }, { key: 'name', label: 'Alphabetical' }].map(s => (
                  <button key={s.key} onClick={() => setSortBy(s.key as typeof sortBy)} style={{ padding: '5px 10px', borderRadius: 7, background: sortBy === s.key ? GOLD_DIM : S2, border: `1px solid ${sortBy === s.key ? GOLD_B : BORDER}`, color: sortBy === s.key ? GOLD : MUTED, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', minWidth: 480 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 80px 80px', padding: '10px 16px', borderBottom: `1px solid ${BORDER}` }}>
                {['Subject', 'Average', 'Pass Rate', 'Highest', 'Lowest'].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>
              {sorted.map((s, i) => (
                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 80px 80px', alignItems: 'center', padding: '0 16px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)` }}>
                  <div style={{ padding: '12px 0' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{s.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <MiniBar value={s.avg} color={pColor(s.avg)} />
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: pColor(s.avg) }}>{s.avg}%</div>
                  <div style={{ fontSize: 13, color: s.pass >= 80 ? GREEN : AMBER }}>{s.pass}%</div>
                  <div style={{ fontSize: 13, color: GREEN }}>{s.high}%</div>
                  <div style={{ fontSize: 13, color: s.low < 40 ? RED : AMBER }}>{s.low}%</div>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Term trend */}
            {termTrend.length > 1 && (
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 12 }}>Term Trend</div>
                {termTrend.map(t => (
                  <div key={t.term} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: MUTED, width: 28, flexShrink: 0 }}>{t.term}</span>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${t.avg}%`, background: GOLD, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, width: 36, textAlign: 'right' }}>{t.avg}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Grade performance */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 12 }}>Grade Performance</div>
              {gradeStats.map(g => (
                <div key={g.grade} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: TEXT }}>{g.grade}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: g.avg !== null ? pColor(g.avg) : FAINT }}>
                      {g.avg !== null ? `${g.avg}%` : 'No marks'}
                    </span>
                  </div>
                  <MiniBar value={g.avg ?? 0} color={g.avg !== null ? pColor(g.avg) : FAINT} />
                </div>
              ))}
            </div>

            {/* Needs attention */}
            {subjectStats.filter(s => s.avg < 70).length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 600, color: RED, marginBottom: 10 }}>⚠ Needs Attention</div>
                {subjectStats.filter(s => s.avg < 70).sort((a, b) => a.avg - b.avg).map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: TEXT }}>{s.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.avg < 60 ? RED : AMBER }}>{s.avg}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
