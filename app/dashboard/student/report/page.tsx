'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useStudentData } from '@/lib/useStudentData';
import { Printer, Download, ChevronDown } from 'lucide-react';

// ─── Colour tokens (screen only — print styles override) ─────────────────────
const BG     = '#0C0C0C';
const S1     = '#111111';
const GOLD   = '#C9A84C';
const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT   = '#FFFFFF';
const MUTED  = 'rgba(255,255,255,0.50)';
const FH     = "'Bricolage Grotesque', sans-serif";
const FB     = "'Inter', sans-serif";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function level(pct: number): { num: number; label: string; color: string } {
  if (pct >= 80) return { num: 7, label: 'Outstanding',          color: '#10B981' };
  if (pct >= 70) return { num: 6, label: 'Meritorious',          color: '#3B82F6' };
  if (pct >= 60) return { num: 5, label: 'Substantial',          color: '#6366F1' };
  if (pct >= 50) return { num: 4, label: 'Adequate',             color: '#F59E0B' };
  if (pct >= 40) return { num: 3, label: 'Moderate',             color: '#F97316' };
  if (pct >= 30) return { num: 2, label: 'Elementary',           color: '#EF4444' };
  return              { num: 1, label: 'Not Achieved',           color: '#DC2626' };
}

function promoted(avg: number) {
  if (avg >= 50) return { label: 'Promoted', color: '#10B981' };
  if (avg >= 40) return { label: 'Conditionally Promoted', color: '#F59E0B' };
  return              { label: 'Not Promoted', color: '#EF4444' };
}

const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ReportCardPage() {
  const { data: session }             = useSession();
  const { data, loading }             = useStudentData();
  const [term, setTerm]               = useState(1);

  const user        = session?.user as any;
  const fullName    = user?.name     ?? '—';
  const portalId    = user?.portalId ?? '—';
  const grade       = user?.grade    ?? '—';
  const stream      = user?.stream   ?? '';
  const schoolEmail = portalId !== '—' ? `${portalId.toLowerCase()}@sidelile.edu.za` : '—';
  const year        = new Date().getFullYear();

  // ── Per-term subject marks ──────────────────────────────────────────────────
  const subjectRows = data.subjects.map(s => {
    const termMarks = s.marks.filter(m => m.term === term);
    const avg = termMarks.length
      ? Math.round(termMarks.reduce((sum, m) => sum + m.percentage, 0) / termMarks.length)
      : (s.termAverages.find(t => t.term === term)?.average ?? 0);
    return { ...s, termAvg: avg, lvl: level(avg) };
  });

  const overall = subjectRows.length
    ? Math.round(subjectRows.reduce((s, r) => s + r.termAvg, 0) / subjectRows.length)
    : 0;

  const att  = data.overallAttendance;
  const promo = promoted(overall);

  if (loading) return (
    <div style={{ padding: 40, color: MUTED, fontFamily: FB, textAlign: 'center' }}>
      Loading report card…
    </div>
  );

  return (
    <>
      {/* ── Print styles injected into <head> via <style> ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          .report-shell { background: #fff !important; padding: 0 !important; }
          .report-card  { box-shadow: none !important; border: none !important; max-width: 100% !important; }
          .report-card * { color: #000 !important; border-color: #ccc !important; background: #fff !important; }
          .level-badge  { border: 1px solid #ccc !important; }
          .promo-badge  { border: 1px solid #ccc !important; }
          .school-header { background: #1a1a2e !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .school-header * { color: #fff !important; }
          .gold-bar { background: #C9A84C !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @page { size: A4; margin: 14mm; }
      `}</style>

      <div className="report-shell" style={{ padding: 24, background: BG, minHeight: '100%', fontFamily: FB }}>

        {/* ── Screen controls ── */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>
              Report Card
            </h1>
            <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0' }}>
              Select a term below, then print or save as PDF
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Term selector */}
            <div style={{ position: 'relative' }}>
              <select
                value={term}
                onChange={e => setTerm(Number(e.target.value))}
                style={{ appearance: 'none', background: S1, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 36px 9px 14px', color: TEXT, fontFamily: FB, fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none' }}
              >
                {TERMS.map((t, i) => <option key={t} value={i + 1}>{t}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: MUTED, pointerEvents: 'none' }} />
            </div>
            <button
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, background: 'rgba(201,168,76,0.10)', border: `1px solid ${GOLD_B}`, color: GOLD, fontFamily: FB, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              <Printer size={14} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* ── The actual report card ── */}
        <div className="report-card" style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', color: '#111' }}>

          {/* School header */}
          <div className="school-header" style={{ background: '#12122a', padding: '28px 36px 20px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FH, fontSize: 22, fontWeight: 900, color: '#000' }}>S</span>
              </div>
              <div>
                <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  SIDELILE HIGH SCHOOL
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                  KwaZulu-Natal · Empowering Excellence · Est. 2001
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 800, color: GOLD }}>TERM {term}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>Academic Year {year}</div>
              </div>
            </div>
            {/* Gold bar */}
            <div className="gold-bar" style={{ height: 3, borderRadius: 2, background: GOLD, margin: '0 -36px', marginTop: 4 }} />
          </div>

          <div style={{ padding: '24px 36px' }}>

            {/* Student info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginBottom: 24, fontSize: 13 }}>
              {[
                { label: 'Full Name',      value: fullName },
                { label: 'Student Number', value: portalId },
                { label: 'Grade',          value: `${grade}${stream ? ` ${stream}` : ''}` },
                { label: 'School Email',   value: schoolEmail },
              ].map(({ label, value }, i) => (
                <div key={label} style={{ padding: '10px 16px', background: i % 2 === 0 ? '#f9fafb' : '#fff', borderBottom: i < 2 ? '1px solid #e5e7eb' : 'none', borderRight: i % 2 === 0 ? '1px solid #e5e7eb' : 'none' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontWeight: 600, color: '#111' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Subjects table */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: FH, fontSize: 11, fontWeight: 800, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Academic Results — Term {term}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#12122a' }}>
                    {['Subject', 'Term Mark %', 'Level', 'Achievement', 'Comment'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#fff', fontFamily: FH, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subjectRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '20px 12px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                        No subjects enrolled yet.
                      </td>
                    </tr>
                  ) : subjectRows.map((s, i) => {
                    const { num, label, color } = s.lvl;
                    return (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111' }}>{s.name}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: color }}>{s.termAvg}%</span>
                            <div style={{ flex: 1, height: 4, background: '#e5e7eb', borderRadius: 2, maxWidth: 60 }}>
                              <div style={{ width: `${s.termAvg}%`, height: '100%', background: color, borderRadius: 2 }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="level-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', background: `${color}18`, border: `1px solid ${color}55`, fontWeight: 800, fontSize: 13, color }}>
                            {num}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: color, fontWeight: 600 }}>{label}</td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>
                          {s.termAvg >= 70 ? 'Excellent performance. Keep it up.' :
                           s.termAvg >= 50 ? 'Satisfactory. More practice recommended.' :
                           'Additional support required. See educator.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Overall row */}
                {subjectRows.length > 0 && (
                  <tfoot>
                    <tr style={{ background: '#12122a' }}>
                      <td style={{ padding: '11px 12px', fontFamily: FH, fontWeight: 800, color: '#fff', fontSize: 13 }}>Overall Average</td>
                      <td style={{ padding: '11px 12px', fontWeight: 800, color: GOLD, fontSize: 15 }}>{overall}%</td>
                      <td colSpan={3} style={{ padding: '11px 12px' }}>
                        <span className="promo-badge" style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 6, background: `${promo.color}22`, border: `1px solid ${promo.color}55`, fontWeight: 700, fontSize: 12, color: promo.color }}>
                          {promo.label}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Attendance summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Days Attended',  value: att.attended,                          color: '#10B981' },
                { label: 'Days Absent',    value: att.total - att.attended,              color: '#EF4444' },
                { label: 'Total Days',     value: att.total,                              color: '#6b7280' },
                { label: 'Attendance %',   value: `${att.percentage ?? Math.round(att.total > 0 ? (att.attended / att.total) * 100 : 0)}%`, color: att.percentage >= 80 ? '#10B981' : '#F59E0B' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Level guide */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Achievement Level Scale (CAPS)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { n: 7, l: 'Outstanding',    r: '80–100%', c: '#10B981' },
                  { n: 6, l: 'Meritorious',    r: '70–79%',  c: '#3B82F6' },
                  { n: 5, l: 'Substantial',    r: '60–69%',  c: '#6366F1' },
                  { n: 4, l: 'Adequate',       r: '50–59%',  c: '#F59E0B' },
                  { n: 3, l: 'Moderate',       r: '40–49%',  c: '#F97316' },
                  { n: 2, l: 'Elementary',     r: '30–39%',  c: '#EF4444' },
                  { n: 1, l: 'Not Achieved',   r: '0–29%',   c: '#DC2626' },
                ].map(({ n, l, r, c }) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#374151' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${c}18`, border: `1px solid ${c}55`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 10, color: c }}>{n}</span>
                    <span style={{ fontWeight: 600 }}>{l}</span>
                    <span style={{ color: '#9ca3af' }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 8 }}>
              {['Class Teacher', 'Deputy Principal', 'Principal'].map(role => (
                <div key={role}>
                  <div style={{ borderTop: '1px solid #374151', paddingTop: 8 }}>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>{role}</div>
                    <div style={{ fontSize: 10, color: '#d1d5db', marginTop: 2 }}>Signature & Date</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: '#9ca3af' }}>
              <span>Sidelile High School · KwaZulu-Natal · sidelile-high-school.vercel.app</span>
              <span>Generated {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Bottom padding for screen */}
        <div className="no-print" style={{ height: 40 }} />
      </div>
    </>
  );
}
