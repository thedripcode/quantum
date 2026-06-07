'use client';

import { useState } from 'react';
import { ADMIN_CLASSES, ADMIN_STUDENTS } from '@/data/adminData';
import type { AdminClass } from '@/data/adminData';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const GRADES = [8, 9, 10, 11, 12];

function avgColor(v: number) {
  if (v >= 75) return GREEN;
  if (v >= 60) return AMBER;
  return RED;
}

const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, color: FAINT,
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
};

export default function ClassesPage() {
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<AdminClass | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /* ── Computed totals ── */
  const totalStudents = ADMIN_CLASSES.reduce((s, c) => s + c.studentCount, 0);
  const schoolAvg = Math.round(ADMIN_CLASSES.reduce((s, c) => s + c.averageMark, 0) / ADMIN_CLASSES.length);
  const topClass = ADMIN_CLASSES.reduce((best, c) => c.averageMark > best.averageMark ? c : best, ADMIN_CLASSES[0]);

  /* ── Filtered classes ── */
  const visibleClasses = gradeFilter === 'all'
    ? ADMIN_CLASSES
    : ADMIN_CLASSES.filter(c => c.grade === gradeFilter);

  /* ── At-risk students for drawer ── */
  const atRiskStudents = selectedClass
    ? ADMIN_STUDENTS.filter(s => s.grade === selectedClass.grade && (s.average < 60 || s.attendance < 85))
    : [];

  /* ── Term performance bars ── */
  const termPerf = selectedClass
    ? [
        { label: 'Term 1', val: selectedClass.averageMark - 4 },
        { label: 'Term 2', val: selectedClass.averageMark - 1 },
        { label: 'Term 3', val: selectedClass.averageMark },
      ]
    : [];

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Classes</h1>
        <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0' }}>
          {ADMIN_CLASSES.length} classes · Grades 8–12
        </p>
      </div>

      {/* ── 4 stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Total Classes',   value: ADMIN_CLASSES.length,      color: BLUE },
          { label: 'Total Students',  value: totalStudents,              color: GREEN },
          { label: 'School Avg',      value: `${schoolAvg}%`,           color: GOLD },
          { label: 'Top Class',       value: topClass?.name ?? '—',     color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Grade filter tabs ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {(['all', ...GRADES] as const).map(g => {
          const active = gradeFilter === g;
          return (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              style={{
                padding: '6px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                fontFamily: FB, cursor: 'pointer',
                background: active ? GOLD_DIM : S2,
                border: `1px solid ${active ? GOLD_B : BORDER}`,
                color: active ? GOLD : MUTED,
                transition: 'all .12s',
              }}
            >
              {g === 'all' ? 'All' : `Grade ${g}`}
            </button>
          );
        })}
      </div>

      {/* ── Classes grouped by grade ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {GRADES.map(g => {
          const gClasses = visibleClasses.filter(c => c.grade === g);
          if (gClasses.length === 0) return null;

          const gAvg = Math.round(gClasses.reduce((s, c) => s + c.averageMark, 0) / gClasses.length);

          return (
            <div key={g}>
              {/* Grade label row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 8, padding: '3px 12px', fontFamily: FH, fontWeight: 700, fontSize: 13, color: GOLD }}>
                  Grade {g}
                </div>
                <span style={{ fontSize: 12, color: MUTED }}>
                  {gClasses.length} class{gClasses.length !== 1 ? 'es' : ''}, avg {gAvg}%
                </span>
              </div>

              {/* Class cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {gClasses.map(c => {
                  const isHovered = hoveredId === c.id;
                  const col = avgColor(c.averageMark);
                  return (
                    <div
                      key={c.id}
                      onMouseEnter={() => setHoveredId(c.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        background: SURFACE,
                        border: `1px solid ${isHovered ? GOLD_B : BORDER}`,
                        borderRadius: 16,
                        padding: '16px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                        transition: 'border-color .15s',
                      }}
                    >
                      {/* Class name */}
                      <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: TEXT, lineHeight: 1.1, marginBottom: 2 }}>
                        {c.name}
                      </div>

                      {/* Stream */}
                      <div style={{ fontSize: 11, fontWeight: 600, color: GOLD, marginBottom: 6 }}>
                        {c.stream}
                      </div>

                      {/* Home teacher */}
                      <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>
                        {c.homeTeacher}
                      </div>

                      {/* Room */}
                      <div style={{ fontSize: 10, color: FAINT, marginBottom: 12 }}>
                        Room {c.room}
                      </div>

                      {/* Two stat boxes */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                        <div style={{ background: S2, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                          <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 800, color: BLUE }}>{c.studentCount}<span style={{ fontSize: 11, fontWeight: 500, color: FAINT }}>/{c.capacity}</span></div>
                          <div style={{ fontSize: 9, color: MUTED, marginTop: 2 }}>Students</div>
                        </div>
                        <div style={{ background: S2, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                          <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 800, color: col }}>{c.averageMark}%</div>
                          <div style={{ fontSize: 9, color: MUTED, marginTop: 2 }}>Avg</div>
                        </div>
                      </div>

                      {/* Subject pills (first 3 + ellipsis) */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                        {c.subjects.slice(0, 3).map(s => (
                          <span key={s} style={{ fontSize: 9, padding: '2px 7px', background: S3, borderRadius: 5, color: FAINT }}>{s}</span>
                        ))}
                        {c.subjects.length > 3 && (
                          <span style={{ fontSize: 9, padding: '2px 7px', background: S3, borderRadius: 5, color: FAINT }}>…</span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
                        <div style={{ height: '100%', width: `${c.averageMark}%`, background: col, borderRadius: 2, transition: 'width 0.6s ease' }} />
                      </div>

                      {/* View Class button */}
                      <button
                        onClick={() => setSelectedClass(c)}
                        style={{ width: '100%', padding: '7px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 9999, color: MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB, transition: 'border-color .12s, color .12s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD_B; (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                      >
                        View Class
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Class Detail Drawer ── */}
      {selectedClass && (
        <>
          <div
            onClick={() => setSelectedClass(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.50)', zIndex: 200 }}
          />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: SURFACE, borderLeft: `1px solid ${BORDER}`, zIndex: 210, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

            {/* Drawer header */}
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: FH, fontSize: 26, fontWeight: 800, color: TEXT, lineHeight: 1.1 }}>{selectedClass.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: GOLD, marginTop: 3 }}>{selectedClass.stream}</div>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: MUTED, fontFamily: FB, fontSize: 12, flexShrink: 0, marginTop: 2 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 22, flex: 1 }}>

              {/* Home teacher card */}
              <div style={{ background: S2, borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                <div style={sectionLabel}>Home Teacher</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{selectedClass.homeTeacher}</div>
              </div>

              {/* Students + Average stat boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ background: S2, borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: FH, fontSize: 26, fontWeight: 800, color: BLUE }}>
                    {selectedClass.studentCount}
                    <span style={{ fontSize: 12, fontWeight: 500, color: FAINT }}>/{selectedClass.capacity}</span>
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Students</div>
                </div>
                <div style={{ background: S2, borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: FH, fontSize: 26, fontWeight: 800, color: avgColor(selectedClass.averageMark) }}>
                    {selectedClass.averageMark}%
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Class Average</div>
                </div>
              </div>

              {/* Room + capacity */}
              <div style={{ background: S2, borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={sectionLabel}>Room</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{selectedClass.room}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={sectionLabel}>Capacity</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{selectedClass.capacity}</div>
                  </div>
                </div>
              </div>

              {/* Subjects list */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                <div style={sectionLabel}>Subjects ({selectedClass.subjects.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {selectedClass.subjects.map(s => (
                    <span key={s} style={{ fontSize: 11, padding: '4px 11px', background: S3, borderRadius: 7, color: MUTED }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Term performance bars */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                <div style={sectionLabel}>Term Performance</div>
                {termPerf.map(t => {
                  const col = avgColor(t.val);
                  return (
                    <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: MUTED, width: 50, flexShrink: 0 }}>{t.label}</span>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${t.val}%`, background: col, borderRadius: 3, transition: 'width 0.6s ease' }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: col, width: 36, textAlign: 'right', flexShrink: 0 }}>
                        {t.val}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* At-risk students */}
              {atRiskStudents.length > 0 && (
                <div style={{ background: 'rgba(239,68,68,0.07)', border: `1px solid rgba(239,68,68,0.20)`, borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: RED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                    ⚠ At-Risk Students ({atRiskStudents.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {atRiskStudents.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0 }}>
                            {s.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{s.firstName} {s.lastName}</div>
                            <div style={{ fontSize: 10, color: FAINT }}>{s.className}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {s.average < 60 && (
                            <div style={{ fontSize: 11, fontWeight: 600, color: RED }}>{s.average}% avg</div>
                          )}
                          {s.attendance < 85 && (
                            <div style={{ fontSize: 11, fontWeight: 600, color: AMBER }}>{s.attendance}% att.</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {atRiskStudents.length === 0 && (
                <div style={{ background: 'rgba(16,185,129,0.07)', border: `1px solid rgba(16,185,129,0.20)`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>✓ No at-risk students in this grade</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
