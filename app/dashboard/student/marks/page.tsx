'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, AlertTriangle, Award } from 'lucide-react';
import { SUBJECTS } from '@/data/studentData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E'; const S3 = '#272727';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.20)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.25)';
const RED = '#EF4444'; const GREEN = '#10B981';
const F_HEADING = "'Bricolage Grotesque', sans-serif"; const F_BODY = "'Inter', sans-serif";

// ─── Simple SVG line chart ────────────────────────────────────────────────────
function LineChart({ data, color, width = 200, height = 56 }: { data: { term: number; average: number }[]; color: string; width?: number; height?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 150); }, []);
  if (data.length < 2) return null;
  const min = Math.min(...data.map(d => d.average)) - 5;
  const max = Math.max(...data.map(d => d.average)) + 5;
  const scX = (i: number) => (i / (data.length - 1)) * width;
  const scY = (v: number) => height - ((v - min) / (max - min)) * height;
  const points = data.map((d, i) => `${scX(i)},${scY(d.average)}`).join(' ');
  const area = `${scX(0)},${height} ` + data.map((d, i) => `${scX(i)},${scY(d.average)}`).join(' ') + ` ${scX(data.length - 1)},${height}`;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#g-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={mounted ? undefined : '1000'} strokeDashoffset={mounted ? 0 : 1000}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      {data.map((d, i) => (
        <circle key={i} cx={scX(i)} cy={scY(d.average)} r="3.5" fill={color} stroke={S2} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ─── Overall bar chart comparing all subjects ─────────────────────────────────
function SubjectBarChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);
  const sorted = [...SUBJECTS].sort((a, b) => b.currentMark - a.currentMark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sorted.map(sub => (
        <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: sub.color, width: 36, flexShrink: 0 }}>{sub.short}</span>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: mounted ? `${sub.currentMark}%` : '0%', background: sub.isAtRisk ? RED : sub.color, borderRadius: 4, transition: 'width 1.1s cubic-bezier(0.33,1,0.68,1)' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: sub.isAtRisk ? RED : TEXT, width: 32, textAlign: 'right', flexShrink: 0 }}>{sub.currentMark}%</span>
          <span style={{ fontSize: 10, color: FAINT, width: 28, textAlign: 'right', flexShrink: 0 }}>cls {sub.classAverage}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Task type badge ──────────────────────────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  Test: '#3B82F6', Assignment: '#10B981', Practical: '#F59E0B',
  Project: '#8B5CF6', Essay: '#EC4899', Oral: '#06B6D4', Exam: GOLD,
};

export default function MarksPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const overall = Math.round(SUBJECTS.reduce((s, sub) => s + sub.currentMark, 0) / SUBJECTS.length);

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Header stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 14, padding: 20, gridColumn: '1 / 2' }}>
          <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.70)', fontWeight: 500, marginBottom: 6 }}>Overall Average</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 36, fontWeight: 800, color: GOLD, letterSpacing: '-0.03em', lineHeight: 1 }}>{overall}%</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Term 3 · 2024 · Grade 11A</div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 500, marginBottom: 6 }}>Best Subject</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 22, fontWeight: 700, color: TEXT, letterSpacing: '-0.02em' }}>
            {[...SUBJECTS].sort((a, b) => b.currentMark - a.currentMark)[0].short}
          </div>
          <div style={{ fontSize: 14, color: GREEN, fontWeight: 600, marginTop: 4 }}>
            {[...SUBJECTS].sort((a, b) => b.currentMark - a.currentMark)[0].currentMark}%
          </div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 500, marginBottom: 6 }}>Needs Attention</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 22, fontWeight: 700, color: RED, letterSpacing: '-0.02em' }}>
            {SUBJECTS.filter(s => s.isAtRisk).length} subject{SUBJECTS.filter(s => s.isAtRisk).length !== 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Below 60% threshold</div>
        </div>
      </div>

      {/* Comparison bar chart */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px', marginBottom: 20 }}>
        <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Subject Comparison</h3>
        <SubjectBarChart />
      </div>

      {/* Subject cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: 0 }}>Detailed Marks</h3>
        {SUBJECTS.map(sub => {
          const isOpen = expanded === sub.id;
          const trend  = sub.termAverages.length >= 2 ? sub.currentMark - sub.termAverages[sub.termAverages.length - 2].average : 0;
          return (
            <div key={sub.id} style={{ background: SURFACE, border: `1px solid ${sub.isAtRisk ? 'rgba(239,68,68,0.22)' : BORDER}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color .2s' }}>
              {/* Header row */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : sub.id)}
              >
                <div style={{ width: 4, height: 44, borderRadius: 2, background: sub.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{sub.name}</span>
                    {sub.isAtRisk && <AlertTriangle size={13} style={{ color: RED }} />}
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{sub.teacher} · {sub.room}</div>
                </div>
                {/* Spark line */}
                <div style={{ opacity: 0.8 }}>
                  <LineChart data={sub.termAverages} color={sub.isAtRisk ? RED : sub.color} width={80} height={32} />
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ fontFamily: F_HEADING, fontSize: 22, fontWeight: 700, color: sub.isAtRisk ? RED : TEXT, letterSpacing: '-0.02em' }}>{sub.currentMark}%</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 2 }}>
                    {trend > 0 ? <TrendingUp size={11} style={{ color: GREEN }} /> : trend < 0 ? <TrendingDown size={11} style={{ color: RED }} /> : <Minus size={11} style={{ color: FAINT }} />}
                    <span style={{ fontSize: 11, color: trend > 0 ? GREEN : trend < 0 ? RED : FAINT, fontWeight: 500 }}>
                      {trend > 0 ? '+' : ''}{trend}% vs T{sub.termAverages[sub.termAverages.length - 2]?.term}
                    </span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} style={{ color: MUTED, flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: MUTED, flexShrink: 0 }} />}
              </div>

              {/* Expanded: marks table */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${BORDER}`, padding: '16px 18px', background: S2 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', gap: 0, marginBottom: 8 }}>
                    {['Task', 'Type', 'Mark', 'Total', '%'].map(h => (
                      <div key={h} style={{ fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 6px' }}>{h}</div>
                    ))}
                  </div>
                  {sub.marks.map((m, i) => {
                    const pct = Math.round((m.mark / m.total) * 100);
                    return (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                        <div style={{ padding: '8px 6px', fontSize: 13, color: TEXT }}>{m.task}</div>
                        <div style={{ padding: '8px 6px' }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: (TYPE_COLORS[m.type] || MUTED) + '22', color: TYPE_COLORS[m.type] || MUTED }}>
                            {m.type}
                          </span>
                        </div>
                        <div style={{ padding: '8px 6px', fontSize: 13, color: TEXT, fontWeight: 600 }}>{m.mark}</div>
                        <div style={{ padding: '8px 6px', fontSize: 13, color: MUTED }}>{m.total}</div>
                        <div style={{ padding: '8px 6px', fontSize: 13, fontWeight: 600, color: pct >= 60 ? GREEN : RED }}>{pct}%</div>
                      </div>
                    );
                  })}

                  {/* Class stats */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                    {[
                      { label: 'Class Avg', value: `${sub.classAverage}%`, color: MUTED },
                      { label: 'Class High', value: `${sub.highestInClass}%`, color: GREEN },
                      { label: 'Class Low', value: `${sub.lowestInClass}%`, color: RED },
                      { label: 'Vs Class', value: `${sub.currentMark > sub.classAverage ? '+' : ''}${sub.currentMark - sub.classAverage}%`, color: sub.currentMark >= sub.classAverage ? GREEN : RED },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: S3, borderRadius: 8, padding: '8px 12px' }}>
                        <div style={{ fontSize: 10, color: FAINT }}>{stat.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: stat.color, marginTop: 2 }}>{stat.value}</div>
                      </div>
                    ))}
                    {sub.nextAssessment && (
                      <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 8, padding: '8px 12px', marginLeft: 'auto' }}>
                        <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.70)' }}>Next: {sub.nextAssessment.task}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: GOLD, marginTop: 2 }}>{sub.nextAssessment.date} · {sub.nextAssessment.weight}%</div>
                      </div>
                    )}
                  </div>

                  {/* Term progression */}
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 11, color: FAINT, marginBottom: 8 }}>Term Progression</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
                      {sub.termAverages.map(t => (
                        <div key={t.term} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{t.average}%</span>
                          <div style={{ width: '100%', height: (t.average / 100) * 40, background: sub.color + '88', borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                          <span style={{ fontSize: 10, color: FAINT }}>T{t.term}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
