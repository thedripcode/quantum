'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const GRADE_COLORS: Record<string, string> = {
  'Grade 8': BLUE, 'Grade 9': '#8B5CF6', 'Grade 10': GREEN, 'Grade 11': AMBER, 'Grade 12': GOLD,
};
const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

function avgColor(v: number | null) {
  if (v === null) return FAINT;
  if (v >= 75) return GREEN;
  if (v >= 60) return AMBER;
  return RED;
}

export default function ClassesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks]       = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/marks').then(r => r.json()),
      fetch('/api/admin/subjects').then(r => r.json()),
    ]).then(([u, m, s]) => {
      setStudents((u.users ?? []).filter((x: any) => x.role === 'student'));
      setMarks(m.marks ?? []);
      setSubjects(s.subjects ?? []);
    }).finally(() => setLoading(false));
  }, []);

  // Build grade groups from real student data
  const gradeGroups = GRADES.map(grade => {
    const gs = students.filter(s => s.grade === grade);
    const gm = marks.filter(m => gs.find(s => s.portalId === m.studentPortalId));
    const avg = gm.length
      ? Math.round(gm.reduce((x: number, m: any) => x + (m.score / m.total) * 100, 0) / gm.length)
      : null;
    const gradeSubjects = subjects.filter(s => Array.isArray(s.grades) ? s.grades.includes(grade) : true);
    const atRisk = gs.filter(s => {
      const sm = marks.filter(m => m.studentPortalId === s.portalId);
      if (!sm.length) return false;
      const a = Math.round(sm.reduce((x: number, m: any) => x + (m.score / m.total) * 100, 0) / sm.length);
      return a < 60;
    });
    return { grade, count: gs.length, avg, subjects: gradeSubjects, atRisk, students: gs };
  });

  const visibleGroups = gradeFilter === 'all'
    ? gradeGroups.filter(g => g.count > 0)
    : gradeGroups.filter(g => g.grade === gradeFilter && g.count > 0);

  const totalStudents = students.length;
  const schoolAvg = marks.length
    ? Math.round(marks.reduce((x: number, m: any) => x + (m.score / m.total) * 100, 0) / marks.length)
    : null;
  const topGrade = gradeGroups.filter(g => g.avg !== null).sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0];

  const selectedGroup = selectedGrade ? gradeGroups.find(g => g.grade === selectedGrade) ?? null : null;

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Classes</h1>
        <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0' }}>
          {loading ? 'Loading…' : `${totalStudents} students across Grades 8–12`}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Total Students', value: loading ? '—' : String(totalStudents), color: BLUE },
          { label: 'Grades Active',  value: loading ? '—' : String(gradeGroups.filter(g => g.count > 0).length), color: '#8B5CF6' },
          { label: 'School Avg',     value: loading ? '—' : (schoolAvg !== null ? `${schoolAvg}%` : 'No marks'), color: GOLD },
          { label: 'Top Grade',      value: loading ? '—' : (topGrade?.grade ?? '—'), color: GREEN },
        ].map(s => (
          <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Grade filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {(['all', ...GRADES] as const).map(g => {
          const active = gradeFilter === g;
          return (
            <button key={g} onClick={() => setGradeFilter(g)} style={{
              padding: '6px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
              fontFamily: FB, cursor: 'pointer',
              background: active ? GOLD_DIM : S2,
              border: `1px solid ${active ? GOLD_B : BORDER}`,
              color: active ? GOLD : MUTED, transition: 'all .12s',
            }}>
              {g === 'all' ? 'All Grades' : g}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 14 }}>Loading class data…</p>
      ) : visibleGroups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No students enrolled</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Add students in <Link href="/admin/manage" style={{ color: GOLD }}>Manage Data</Link>.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {visibleGroups.map(g => {
            const col = GRADE_COLORS[g.grade] ?? GOLD;
            const ac = avgColor(g.avg);
            return (
              <div key={g.grade}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 8, padding: '3px 12px', fontFamily: FH, fontWeight: 700, fontSize: 13, color: GOLD }}>
                    {g.grade}
                  </div>
                  <span style={{ fontSize: 12, color: MUTED }}>
                    {g.count} student{g.count !== 1 ? 's' : ''}
                    {g.avg !== null ? ` · avg ${g.avg}%` : ' · no marks yet'}
                    {g.atRisk.length > 0 && <span style={{ color: RED }}> · {g.atRisk.length} at risk</span>}
                  </span>
                </div>

                {/* Grade summary card */}
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
                    <div style={{ background: S2, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Students</div>
                      <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: col }}>{g.count}</div>
                    </div>
                    <div style={{ background: S2, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Average</div>
                      <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: ac }}>
                        {g.avg !== null ? `${g.avg}%` : '—'}
                      </div>
                    </div>
                    <div style={{ background: S2, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>At Risk</div>
                      <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: g.atRisk.length > 0 ? RED : GREEN }}>
                        {g.atRisk.length}
                      </div>
                    </div>
                    <div style={{ background: S2, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Subjects</div>
                      <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: MUTED }}>{g.subjects.length}</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {g.avg !== null && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${g.avg}%`, background: ac, borderRadius: 3, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  )}

                  {/* Subjects */}
                  {g.subjects.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Subjects</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {g.subjects.slice(0, 8).map(s => (
                          <span key={s.id} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: (s.color ?? col) + '18', border: `1px solid ${(s.color ?? col)}44`, color: s.color ?? col }}>
                            {s.short ?? s.code}
                          </span>
                        ))}
                        {g.subjects.length > 8 && (
                          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: S2, color: MUTED }}>+{g.subjects.length - 8} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* At-risk students */}
                  {g.atRisk.length > 0 && (
                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: RED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                        ⚠ At-Risk Students
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {g.atRisk.map(s => {
                          const sm = marks.filter(m => m.studentPortalId === s.portalId);
                          const avg = sm.length ? Math.round(sm.reduce((x: number, m: any) => x + (m.score / m.total) * 100, 0) / sm.length) : null;
                          return (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 7, background: S2, borderRadius: 8, padding: '5px 10px' }}>
                              <span style={{ fontSize: 12, color: TEXT }}>{s.name}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: RED }}>{avg}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedGrade(g.grade)}
                    style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontFamily: FB }}
                  >
                    View All Students →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student list drawer */}
      {selectedGroup && (
        <>
          <div onClick={() => setSelectedGrade(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: SURFACE, borderLeft: `1px solid ${BORDER}`, zIndex: 210, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT }}>{selectedGroup.grade}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{selectedGroup.count} students</div>
              </div>
              <button onClick={() => setSelectedGrade(null)} style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: MUTED, fontFamily: FB, fontSize: 12 }}>✕</button>
            </div>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedGroup.students.map(s => {
                const sm = marks.filter(m => m.studentPortalId === s.portalId);
                const avg = sm.length ? Math.round(sm.reduce((x: number, m: any) => x + (m.score / m.total) * 100, 0) / sm.length) : null;
                const ac = avgColor(avg);
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: S2, borderRadius: 10, border: `1px solid ${avg !== null && avg < 60 ? 'rgba(239,68,68,0.25)' : BORDER}` }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>
                      {s.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: FAINT }}>{s.portalId}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: ac }}>{avg !== null ? `${avg}%` : '—'}</div>
                      <div style={{ fontSize: 10, color: FAINT }}>average</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
