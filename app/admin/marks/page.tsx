'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { ADMIN_CLASSES, ADMIN_STUDENTS } from '@/data/adminData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E'; const S3 = '#272727';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981'; const RED = '#EF4444'; const AMBER = '#F59E0B'; const BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif"; const FB = "'Inter', sans-serif";

const SUBJECTS_DATA = [
  { subject: 'Mathematics',       avg: 68, passRate: 82, highest: 96, lowest: 34, classes: 5 },
  { subject: 'Physical Sciences', avg: 65, passRate: 78, highest: 94, lowest: 28, classes: 4 },
  { subject: 'English',           avg: 74, passRate: 91, highest: 98, lowest: 45, classes: 5 },
  { subject: 'Afrikaans',         avg: 70, passRate: 88, highest: 95, lowest: 40, classes: 5 },
  { subject: 'Life Sciences',     avg: 72, passRate: 87, highest: 97, lowest: 38, classes: 3 },
  { subject: 'Geography',         avg: 75, passRate: 90, highest: 99, lowest: 42, classes: 3 },
  { subject: 'History',           avg: 77, passRate: 93, highest: 100, lowest: 47, classes: 2 },
  { subject: 'Accounting',        avg: 63, passRate: 76, highest: 92, lowest: 30, classes: 2 },
  { subject: 'Economics',         avg: 71, passRate: 85, highest: 96, lowest: 36, classes: 2 },
  { subject: 'Life Orientation',  avg: 82, passRate: 97, highest: 100, lowest: 55, classes: 5 },
];

const GRADE_PERFORMANCE = [8, 9, 10, 11, 12].map(g => {
  const classes = ADMIN_CLASSES.filter(c => c.grade === g);
  const avg = Math.round(classes.reduce((s, c) => s + c.averageMark, 0) / (classes.length || 1));
  const students = classes.reduce((s, c) => s + c.studentCount, 0);
  return { grade: g, avg, students, classes: classes.length, passRate: Math.min(99, avg + 10) };
});

const TERM_TREND = [
  { term: 'T1', avg: 68 },
  { term: 'T2', avg: 71 },
  { term: 'T3', avg: 72 },
];

function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
    </div>
  );
}

function SVGLineChart({ data }: { data: { term: string; avg: number }[] }) {
  const W = 260; const H = 60; const pad = 20;
  const maxY = 100; const minY = 50;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((d.avg - minY) / (maxY - minY)) * (H - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <polyline points={points.join(' ')} fill="none" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [x, y] = points[i].split(',').map(Number);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill={GOLD} />
            <text x={x} y={H - 2} textAnchor="middle" fill={FAINT} fontSize={9}>{d.term}</text>
            <text x={x} y={y - 8} textAnchor="middle" fill={GOLD} fontSize={9} fontWeight="bold">{d.avg}%</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function MarksPage() {
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'subject' | 'avg' | 'passRate'>('avg');

  const schoolAvg = Math.round(SUBJECTS_DATA.reduce((s, d) => s + d.avg, 0) / SUBJECTS_DATA.length);
  const overallPassRate = Math.round(SUBJECTS_DATA.reduce((s, d) => s + d.passRate, 0) / SUBJECTS_DATA.length);
  const topSubject = SUBJECTS_DATA.reduce((prev, cur) => cur.avg > prev.avg ? cur : prev, SUBJECTS_DATA[0]);
  const weakSubject = SUBJECTS_DATA.reduce((prev, cur) => cur.avg < prev.avg ? cur : prev, SUBJECTS_DATA[0]);
  const atRisk = ADMIN_STUDENTS.filter(s => s.average < 60).length;

  const sorted = [...SUBJECTS_DATA].sort((a, b) => {
    if (sortBy === 'avg') return b.avg - a.avg;
    if (sortBy === 'passRate') return b.passRate - a.passRate;
    return a.subject.localeCompare(b.subject);
  });

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Marks Overview</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>School-wide academic performance · Term 3, 2025</p>
      </div>

      {/* Top stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'School Average', value: `${schoolAvg}%`,       color: GOLD,  icon: BarChart2 },
          { label: 'Overall Pass Rate', value: `${overallPassRate}%`, color: GREEN, icon: TrendingUp },
          { label: 'Top Subject', value: topSubject.subject.split(' ')[0], color: BLUE,  icon: TrendingUp },
          { label: 'At Risk Students', value: `${atRisk}`,           color: RED,   icon: TrendingDown },
        ].map(c => {
          const Icon = c.icon;
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18 }}>
        {/* Left — subject breakdown */}
        <div>
          {/* Sort controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 600, color: TEXT }}>Subject Breakdown</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ key: 'avg', label: 'By Average' }, { key: 'passRate', label: 'By Pass Rate' }, { key: 'subject', label: 'Alphabetical' }].map(s => (
                <button key={s.key} onClick={() => setSortBy(s.key as typeof sortBy)} style={{ padding: '5px 10px', borderRadius: 7, background: sortBy === s.key ? GOLD_DIM : S2, border: `1px solid ${sortBy === s.key ? GOLD_B : BORDER}`, color: sortBy === s.key ? GOLD : MUTED, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 90px 80px', padding: '10px 16px', borderBottom: `1px solid ${BORDER}` }}>
              {['Subject', 'Average', 'Pass Rate', 'Highest', 'Lowest'].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {sorted.map((s, i) => (
              <div key={s.subject} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 90px 80px', alignItems: 'center', padding: '0 16px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)` }}>
                <div style={{ padding: '12px 0' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{s.subject}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <MiniBar value={s.avg} color={s.avg >= 75 ? GREEN : s.avg >= 60 ? AMBER : RED} />
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.avg >= 75 ? GREEN : s.avg >= 60 ? AMBER : RED }}>{s.avg}%</div>
                <div style={{ fontSize: 13, color: s.passRate >= 80 ? GREEN : AMBER }}>{s.passRate}%</div>
                <div style={{ fontSize: 13, color: GREEN }}>{s.highest}%</div>
                <div style={{ fontSize: 13, color: s.lowest < 40 ? RED : AMBER }}>{s.lowest}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Term trend */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 12 }}>Term Trend</div>
            <SVGLineChart data={TERM_TREND} />
          </div>

          {/* Grade performance */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 12 }}>Grade Performance</div>
            {GRADE_PERFORMANCE.map(g => (
              <div key={g.grade} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: TEXT }}>Grade {g.grade}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: g.avg >= 75 ? GREEN : g.avg >= 60 ? AMBER : RED }}>{g.avg}%</span>
                </div>
                <MiniBar value={g.avg} color={g.avg >= 75 ? GREEN : g.avg >= 60 ? AMBER : RED} />
              </div>
            ))}
          </div>

          {/* Flagged subjects */}
          <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 600, color: RED, marginBottom: 10 }}>⚠️ Needs Attention</div>
            {SUBJECTS_DATA.filter(s => s.avg < 70).map(s => (
              <div key={s.subject} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: TEXT }}>{s.subject}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.avg < 60 ? RED : AMBER }}>{s.avg}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
