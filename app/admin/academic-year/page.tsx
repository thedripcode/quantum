'use client';

import { useState } from 'react';
import { CheckCircle2, Edit2 } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

interface Term { id: number; label: string; start: string; end: string; weeks: number; status: 'completed' | 'active' | 'upcoming'; events: string[] }
interface KeyDate { date: string; event: string; type: 'term' | 'academic' | 'assessment' | 'event' | 'holiday' }

const INITIAL_TERMS: Term[] = [
  { id: 1, label: 'Term 1', start: '15 Jan 2025', end: '28 Mar 2025', weeks: 10, status: 'completed', events: ['School opens', 'Cultural Week', 'Term 1 Exams', 'Reports issued'] },
  { id: 2, label: 'Term 2', start: '22 Apr 2025', end: '27 Jun 2025', weeks: 10, status: 'completed', events: ['School opens', 'Youth Day (16 Jun)', 'Mid-Year Exams', 'Reports issued'] },
  { id: 3, label: 'Term 3', start: '15 Jul 2025', end: '26 Sep 2025', weeks: 10, status: 'active',    events: ['School opens', 'Heritage Day (24 Sep)', 'Term 3 Tests', 'Reports issued'] },
  { id: 4, label: 'Term 4', start: '13 Oct 2025', end: '05 Dec 2025', weeks: 8,  status: 'upcoming',  events: ['School opens', 'Final Exams', 'Matric farewell', 'Graduation Ceremony'] },
];

const KEY_DATES: KeyDate[] = [
  { date: '15 Jul 2025', event: 'Term 3 Opens',                   type: 'term'       },
  { date: '01 Aug 2025', event: 'Stream Selection Deadline',       type: 'academic'   },
  { date: '15 Aug 2025', event: 'Subject Change Deadline',         type: 'academic'   },
  { date: '02 Sep 2025', event: 'Term 3 Assessments Begin',        type: 'assessment' },
  { date: '15 Sep 2025', event: 'Parent-Teacher Evening',          type: 'event'      },
  { date: '24 Sep 2025', event: 'Heritage Day (Public Holiday)',   type: 'holiday'    },
  { date: '26 Sep 2025', event: 'Term 3 Closes',                   type: 'term'       },
  { date: '13 Oct 2025', event: 'Term 4 Opens',                   type: 'term'       },
  { date: '03 Nov 2025', event: 'Final Exams Begin',               type: 'assessment' },
  { date: '05 Dec 2025', event: 'School Year Closes',              type: 'term'       },
];

const DATE_TYPE_COLORS: Record<string, string> = {
  term: GOLD, academic: BLUE, assessment: AMBER, event: GREEN, holiday: MUTED,
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: 'Completed', color: GREEN, bg: 'rgba(16,185,129,0.12)' },
  active:    { label: 'Active',    color: GOLD,  bg: GOLD_DIM                },
  upcoming:  { label: 'Upcoming',  color: MUTED, bg: 'rgba(255,255,255,0.06)'},
};

export default function AcademicYearPage() {
  const [terms, setTerms] = useState<Term[]>(INITIAL_TERMS);
  const [editing, setEditing] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const totalWeeks = terms.reduce((s, t) => s + t.weeks, 0);
  const completedWeeks = terms.filter(t => t.status === 'completed').reduce((s, t) => s + t.weeks, 0) + Math.floor(terms.find(t => t.status === 'active')?.weeks ?? 0 * 0.6);
  const progressPct = Math.round((completedWeeks / totalWeeks) * 100);

  const handleSaveTerm = (id: number) => {
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateTerm = (id: number, field: keyof Term, value: string) => {
    setTerms(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Academic Year 2025</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>4 terms · {totalWeeks} school weeks · Currently in Term 3</p>
        </div>
        {saved && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: GREEN }}><CheckCircle2 size={13} /> Changes saved</div>}
      </div>

      {/* Year progress card */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 22px', marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>School Year Progress</span>
          <span style={{ fontFamily: FH, fontSize: 18, fontWeight: 800, color: GOLD }}>{progressPct}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${GREEN}, ${GOLD})`, borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
        {/* Mini term tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8 }}>
          {terms.map(t => {
            const sc = STATUS_CFG[t.status];
            return (
              <div key={t.id} style={{ background: t.status === 'active' ? GOLD_DIM : S2, border: `1px solid ${t.status === 'active' ? GOLD_B : BORDER}`, borderRadius: 9, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.status === 'active' ? GOLD : MUTED, marginBottom: 3 }}>{t.label}</div>
                <div style={{ fontSize: 9, color: FAINT, marginBottom: 6 }}>{t.weeks} weeks</div>
                <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 6px', borderRadius: 4, background: sc.bg, color: sc.color }}>{sc.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="portal-main-grid" style={{ gap: 20 }}>
        {/* Left: Term details */}
        <div>
          <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Term Details</div>
          {terms.map(t => {
            const sc = STATUS_CFG[t.status];
            const isEditing = editing === t.id;
            return (
              <div key={t.id} style={{ background: SURFACE, border: `1px solid ${t.status === 'active' ? GOLD_B : BORDER}`, borderRadius: 14, padding: '16px 18px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: TEXT }}>{t.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: sc.bg, color: sc.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sc.label}</span>
                  </div>
                  {t.status !== 'completed' && (
                    <button onClick={() => setEditing(isEditing ? null : t.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: MUTED, fontSize: 11, fontFamily: FB }}>
                      <Edit2 size={10} /> {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 12, marginBottom: 12 }}>
                  {[{ label: 'Start Date', field: 'start' as const }, { label: 'End Date', field: 'end' as const }].map(({ label, field }) => (
                    <div key={field}>
                      <div style={{ fontSize: 10, color: FAINT, marginBottom: 4 }}>{label}</div>
                      {isEditing ? (
                        <input defaultValue={t[field] as string} onChange={e => updateTerm(t.id, field, e.target.value)}
                          style={{ background: S2, border: `1px solid ${GOLD_B}`, borderRadius: 7, padding: '6px 10px', fontSize: 12, color: TEXT, fontFamily: FB, outline: 'none', width: '100%', boxSizing: 'border-box' as const }} />
                      ) : (
                        <div style={{ fontSize: 13, color: TEXT }}>{t[field] as string}</div>
                      )}
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 10, color: FAINT, marginBottom: 4 }}>Weeks</div>
                    <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: GOLD }}>{t.weeks}</div>
                  </div>
                </div>

                {/* Events */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {t.events.map(ev => (
                    <span key={ev} style={{ fontSize: 10, padding: '3px 9px', background: S2, borderRadius: 5, color: MUTED }}>{ev}</span>
                  ))}
                </div>

                {isEditing && (
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleSaveTerm(t.id)}
                      style={{ background: GOLD, color: '#000', borderRadius: 9999, padding: '7px 20px', fontWeight: 700, fontFamily: FB, fontSize: 12, border: 'none', cursor: 'pointer' }}>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Key dates */}
        <div>
          <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Key Dates</div>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            {KEY_DATES.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 16px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)`, alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: DATE_TYPE_COLORS[d.type], flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.event}</div>
                  <div style={{ fontSize: 10, color: FAINT, marginTop: 1 }}>{d.date}</div>
                </div>
                <span style={{ fontSize: 9, padding: '2px 6px', background: DATE_TYPE_COLORS[d.type] + '18', borderRadius: 4, color: DATE_TYPE_COLORS[d.type], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>{d.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
