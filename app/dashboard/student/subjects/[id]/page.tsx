'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, MapPin, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useStudentData } from '@/lib/useStudentData';

const BG = '#081420'; const SURFACE = '#0E1E30'; const S2 = '#14283E'; const S3 = '#1A3049';
const GOLD = '#60a5fa'; const GOLD_DIM = 'rgba(96,165,250,0.08)'; const GOLD_B = 'rgba(96,165,250,0.20)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const RED = '#EF4444'; const GREEN = '#10B981';
const F_HEADING = "'Roboto Condensed', sans-serif"; const F_BODY = "'Inter', sans-serif";

const TYPE_COLORS: Record<string, string> = {
  Test: '#3B82F6', Assignment: '#10B981', Practical: '#F59E0B',
  Project: '#8B5CF6', Essay: '#EC4899', Oral: '#06B6D4', Exam: GOLD,
};

function Ring({ pct, color, size = 100 }: { pct: number; color: string; size?: number }) {
  const [m, setM] = useState(false);
  useEffect(() => { setTimeout(() => setM(true), 150); }, []);
  const s = 8; const r = (size - s) / 2; const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={s} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={s}
        strokeDasharray={c} strokeDashoffset={m ? c * (1 - pct / 100) : c} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.33,1,0.68,1)' }} />
    </svg>
  );
}

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading } = useStudentData();
  const sub = data.subjects.find(s => s.id === id);

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: F_BODY }}>Loading subject…</div>
  );

  if (!sub) return (
    <div style={{ padding: 40, textAlign: 'center', color: MUTED }}>
      <p>Subject not found.</p>
      <button onClick={() => router.push('/dashboard/student/subjects')} style={{ color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>← Back to Subjects</button>
    </div>
  );

  const vsClass = sub.currentMark - sub.classAverage;
  const color   = sub.isAtRisk ? RED : sub.color;

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Back */}
      <button onClick={() => router.push('/dashboard/student/subjects')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: MUTED, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={14} /> Back to Subjects
      </button>

      {/* Hero card */}
      <div style={{ background: SURFACE, border: `1px solid ${sub.isAtRisk ? 'rgba(239,68,68,0.22)' : BORDER}`, borderRadius: 18, padding: '24px 26px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Ring pct={sub.currentMark} color={color} size={100} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: F_HEADING, fontSize: 22, fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{sub.currentMark}%</div>
              <div style={{ fontSize: 9, color: FAINT, marginTop: 2 }}>Term 3</div>
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: sub.color, letterSpacing: '0.06em' }}>{sub.short}</span>
              {sub.isAtRisk && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: RED, background: 'rgba(239,68,68,0.10)', padding: '2px 7px', borderRadius: 5 }}><AlertTriangle size={11} /> At Risk</span>}
            </div>
            <h2 style={{ fontFamily: F_HEADING, fontSize: 22, fontWeight: 700, color: TEXT, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{sub.name}</h2>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: sub.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: sub.color }}>{sub.teacherInitials}</div>
                {sub.teacher}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}><MapPin size={12} /> Room {sub.room}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}><Mail size={12} /> {sub.teacherEmail}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, flexShrink: 0 }}>
            {[
              { label: 'Class Avg', value: `${sub.classAverage}%`, color: MUTED },
              { label: 'Vs Class', value: `${vsClass >= 0 ? '+' : ''}${vsClass}%`, color: vsClass >= 0 ? GREEN : RED },
              { label: 'Class High', value: `${sub.highestInClass}%`, color: GREEN },
              { label: 'Attendance', value: `${sub.attendance}%`, color: sub.attendance >= 90 ? GREEN : '#F59E0B' },
            ].map(stat => (
              <div key={stat.label} style={{ background: S2, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: FAINT }}>{stat.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: stat.color, marginTop: 3 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Term progression */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
        <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 14px' }}>Term Progression</h3>
        <div style={{ display: 'flex', gap: 14 }}>
          {sub.termAverages.map((t, i) => {
            const prev = sub.termAverages[i - 1];
            const change = prev ? t.average - prev.average : null;
            return (
              <div key={t.term} style={{ flex: 1, background: t.term === 3 ? GOLD_DIM : S2, border: `1px solid ${t.term === 3 ? GOLD_B : BORDER}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: t.term === 3 ? 'rgba(96,165,250,0.65)' : FAINT, fontWeight: 600 }}>TERM {t.term}</div>
                <div style={{ fontFamily: F_HEADING, fontSize: 24, fontWeight: 800, color: t.term === 3 ? GOLD : TEXT, letterSpacing: '-0.02em', marginTop: 6 }}>{t.average}%</div>
                {change !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 4 }}>
                    {change > 0 ? <TrendingUp size={11} style={{ color: GREEN }} /> : <TrendingDown size={11} style={{ color: RED }} />}
                    <span style={{ fontSize: 11, color: change > 0 ? GREEN : RED, fontWeight: 600 }}>{change > 0 ? '+' : ''}{change}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next assessment */}
      {sub.nextAssessment && (
        <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(96,165,250,0.65)', fontWeight: 500, marginBottom: 4 }}>Next Assessment</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: GOLD }}>{sub.nextAssessment.task}</div>
            <div style={{ fontSize: 12, color: 'rgba(96,165,250,0.70)' }}>{sub.nextAssessment.date} · {sub.nextAssessment.weight}% weight</div>
          </div>
        </div>
      )}

      {/* Marks table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
        <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Assessment Results</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 2fr', gap: 0 }}>
          {['Task', 'Type', 'Mark', 'Total', '%', 'Date'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 8px', borderBottom: `1px solid ${BORDER}` }}>{h}</div>
          ))}
          {sub.marks.map((m, i) => {
            const pct = Math.round((m.mark / m.total) * 100);
            return (
              <>
                <div key={`${i}-task`} style={{ padding: '10px 8px', fontSize: 13, color: TEXT, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{m.task}</div>
                <div key={`${i}-type`} style={{ padding: '10px 8px', borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: (TYPE_COLORS[m.type] || MUTED) + '22', color: TYPE_COLORS[m.type] || MUTED }}>{m.type}</span>
                </div>
                <div key={`${i}-mark`} style={{ padding: '10px 8px', fontSize: 13, fontWeight: 700, color: TEXT, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{m.mark}</div>
                <div key={`${i}-total`} style={{ padding: '10px 8px', fontSize: 13, color: MUTED, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{m.total}</div>
                <div key={`${i}-pct`} style={{ padding: '10px 8px', fontSize: 13, fontWeight: 700, color: pct >= 60 ? GREEN : RED, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{pct}%</div>
                <div key={`${i}-date`} style={{ padding: '10px 8px', fontSize: 12, color: FAINT, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{m.date}</div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
