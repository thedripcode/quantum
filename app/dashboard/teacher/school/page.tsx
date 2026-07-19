'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, BookOpen, Loader2, ChevronRight, Building2 } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

export default function TeacherSchoolPage() {
  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/teacher/school');
      if (r.ok) setData(await r.json());
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>School Browser</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
          {data ? `${data.grades.filter((g: any) => g.total > 0).length} grades · ${data.totalClasses} class section${data.totalClasses === 1 ? '' : 's'} · ${data.totalStudents} enrolled learner${data.totalStudents === 1 ? '' : 's'}` : 'Live enrolment across the school'}
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: MUTED, padding: 30 }}>
          <Loader2 size={16} className="animate-spin" /> Loading school…
        </div>
      ) : !data ? (
        <div style={{ color: MUTED, padding: 30 }}>Could not load school data.</div>
      ) : data.totalStudents === 0 ? (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 40, textAlign: 'center', color: MUTED }}>
          <Building2 size={28} style={{ color: FAINT, margin: '0 auto 10px' }} />
          <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>No enrolled learners yet</div>
          <div style={{ fontSize: 13 }}>Classes appear here as students are enrolled.</div>
        </div>
      ) : (
        data.grades.filter((g: any) => g.total > 0).map((g: any) => (
          <div key={g.grade} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: FH, fontSize: 17, fontWeight: 700, color: TEXT }}>{g.grade}</span>
              <span style={{ fontSize: 12, color: MUTED }}>
                {g.sections.length} class{g.sections.length === 1 ? '' : 'es'} · {g.total} learner{g.total === 1 ? '' : 's'} · {g.subjectCount} subject{g.subjectCount === 1 ? '' : 's'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
              {g.sections.map((sec: any) => {
                const graded = sec.students.filter((s: any) => s.avg !== null);
                const avg = graded.length ? Math.round(graded.reduce((a: number, s: any) => a + s.avg, 0) / graded.length) : null;
                return (
                  <Link key={sec.id} href={`/dashboard/teacher/school/${sec.id}`}
                    style={{ display: 'block', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 18px', textDecoration: 'none', transition: 'border-color 0.15s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD_B)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontFamily: FH, fontSize: 20, fontWeight: 800, color: GOLD }}>{sec.label}</span>
                      <ChevronRight size={16} style={{ color: FAINT }} />
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: MUTED }}>
                        <Users size={12} /> {sec.students.length} learner{sec.students.length === 1 ? '' : 's'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: MUTED }}>
                        <BookOpen size={12} /> {avg === null ? 'no marks yet' : `${avg}% avg`}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
