'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Users } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

function avgColor(avg: number | null) {
  if (avg === null) return FAINT;
  if (avg >= 70) return GREEN;
  if (avg >= 60) return AMBER;
  return RED;
}

export default function ClassDetailPage() {
  const params = useParams<{ classId: string }>();
  const classId = decodeURIComponent(params.classId ?? '');

  const [section, setSection] = useState<any>(null);
  const [grade, setGrade]     = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/teacher/school');
      if (r.ok) {
        const d = await r.json();
        for (const g of d.grades) {
          const sec = g.sections.find((s: any) => s.id === classId);
          if (sec) { setSection(sec); setGrade(g); break; }
        }
      }
      setLoading(false);
    })();
  }, [classId]);

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <Link href="/dashboard/teacher/school" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: MUTED, textDecoration: 'none', marginBottom: 18 }}>
        <ArrowLeft size={14} /> All classes
      </Link>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: MUTED, padding: 30 }}>
          <Loader2 size={16} className="animate-spin" /> Loading class…
        </div>
      ) : !section ? (
        <div style={{ color: MUTED, padding: 30 }}>Class not found.</div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>
              Class {section.label}
            </h2>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
              {grade.grade} · {section.students.length} learner{section.students.length === 1 ? '' : 's'} · {grade.subjectCount} subject{grade.subjectCount === 1 ? '' : 's'}
            </p>
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
            <div className="table-scroll">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: S2 }}>
                    {['Learner', 'Student No.', 'Average', 'Graded Tasks', 'Attendance'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.students.map((s: any) => (
                    <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ padding: '12px 16px', color: TEXT, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ width: 30, height: 30, borderRadius: '50%', background: S2, border: `1px solid ${BORDER}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: GOLD, fontFamily: FH, fontWeight: 800 }}>
                            {s.name.split(' ').map((p: string) => p[0]).slice(0, 2).join('')}
                          </span>
                          {s.name}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{s.portalId ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontFamily: FH, fontWeight: 800, color: avgColor(s.avg), whiteSpace: 'nowrap' }}>
                        {s.avg === null ? 'no marks' : `${s.avg}%`}
                      </td>
                      <td style={{ padding: '12px 16px', color: MUTED }}>{s.gradedCount}</td>
                      <td style={{ padding: '12px 16px', color: s.attendanceRate === null ? FAINT : s.attendanceRate >= 90 ? GREEN : s.attendanceRate >= 80 ? AMBER : RED, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {s.attendanceRate === null ? 'no register' : `${s.attendanceRate}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {section.students.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: MUTED, marginTop: 16 }}>
              <Users size={14} /> No learners in this section yet.
            </div>
          )}
        </>
      )}
    </div>
  );
}
