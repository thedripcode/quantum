'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import { useStudentData } from '@/lib/useStudentData';

const BG = '#081420'; const SURFACE = '#0E1E30'; const S2 = '#14283E';
const GOLD = '#60a5fa'; const GOLD_DIM = 'rgba(96,165,250,0.08)'; const GOLD_B = 'rgba(96,165,250,0.20)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const RED = '#EF4444'; const GREEN = '#10B981';
const F_HEADING = "'Roboto Condensed', sans-serif"; const F_BODY = "'Inter', sans-serif";

function Ring({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const [m, setM] = useState(false);
  useEffect(() => { setTimeout(() => setM(true), 100); }, []);
  const s = 5; const r = (size - s) / 2; const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={s} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={s}
        strokeDasharray={c} strokeDashoffset={m ? c * (1 - pct / 100) : c} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.33,1,0.68,1)' }} />
    </svg>
  );
}

export default function SubjectsPage() {
  const { data, loading } = useStudentData();
  const SUBJECTS = data.subjects;

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 14 }}>Loading subjects…</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Overview strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 13, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(96,165,250,0.65)', fontWeight: 500 }}>Total Subjects</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 28, fontWeight: 700, color: GOLD, letterSpacing: '-0.02em', marginTop: 4 }}>{SUBJECTS.length}</div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 13, padding: 16 }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Above 80%</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 28, fontWeight: 700, color: GREEN, letterSpacing: '-0.02em', marginTop: 4 }}>{SUBJECTS.filter(s => s.currentMark >= 80).length}</div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 13, padding: 16 }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>At Risk</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 28, fontWeight: 700, color: RED, letterSpacing: '-0.02em', marginTop: 4 }}>{SUBJECTS.filter(s => s.isAtRisk).length}</div>
        </div>
      </div>

      {/* Subject grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {SUBJECTS.map(sub => {
          const trend = sub.termAverages.length >= 2
            ? sub.currentMark - sub.termAverages[sub.termAverages.length - 2].average
            : 0;
          const vsClass = sub.currentMark - sub.classAverage;
          return (
            <Link
              key={sub.id}
              href={`/dashboard/student/subjects/${sub.id}`}
              style={{ background: SURFACE, border: `1px solid ${sub.isAtRisk ? 'rgba(239,68,68,0.22)' : BORDER}`, borderRadius: 16, padding: '20px 20px', textDecoration: 'none', display: 'block', transition: 'border-color .2s, background .2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = S2; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = SURFACE; }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: sub.color, letterSpacing: '0.06em' }}>{sub.short}</span>
                    {sub.isAtRisk && <AlertTriangle size={12} style={{ color: RED }} />}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginTop: 3, lineHeight: 1.3 }}>{sub.name}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{sub.teacher} · {sub.room}</div>
                </div>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Ring pct={sub.currentMark} color={sub.isAtRisk ? RED : sub.color} size={60} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: sub.isAtRisk ? RED : TEXT }}>
                    {sub.currentMark}%
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'Class Avg', value: `${sub.classAverage}%` },
                  { label: 'Vs Class', value: `${vsClass >= 0 ? '+' : ''}${vsClass}%`, color: vsClass >= 0 ? GREEN : RED },
                  { label: 'Attendance', value: `${sub.attendance}%`, color: sub.attendance >= 90 ? GREEN : sub.attendance >= 80 ? '#F59E0B' : RED },
                ].map(stat => (
                  <div key={stat.label} style={{ background: S2, borderRadius: 8, padding: '7px 10px' }}>
                    <div style={{ fontSize: 9, color: FAINT, fontWeight: 500 }}>{stat.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: stat.color || TEXT, marginTop: 2 }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Term trend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {sub.termAverages.map(t => (
                    <div key={t.term} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{t.average}%</div>
                      <div style={{ fontSize: 9, color: FAINT }}>T{t.term}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {trend > 0 ? <TrendingUp size={13} style={{ color: GREEN }} /> : trend < 0 ? <TrendingDown size={13} style={{ color: RED }} /> : null}
                  <span style={{ fontSize: 11, color: trend >= 0 ? GREEN : RED, fontWeight: 600 }}>
                    {trend >= 0 ? '+' : ''}{trend}%
                  </span>
                  <ChevronRight size={13} style={{ color: FAINT }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
