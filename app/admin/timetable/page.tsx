'use client';

import { useState, useEffect } from 'react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const GRADES = [8, 9, 10, 11, 12];
const SECTIONS_BY_GRADE: Record<number, string[]> = {
  8:  ['A','B','C','D','E'],
  9:  ['A','B','C','D','E'],
  10: ['A','B','C','D','E'],
  11: ['A','B','C','D','E'],
  12: ['A','B','C','D','E'],
};
const PERIODS = [
  '07:30–08:15','08:15–09:00','09:00–09:45',
  'Break',
  '10:00–10:45','10:45–11:30','11:30–12:15',
  'Lunch',
  '13:00–13:45','13:45–14:30',
];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics':      '#3B82F6',
  'English':          '#10B981',
  'IsiZulu':          '#8B5CF6',
  'Physics':          '#F59E0B',
  'Life Sciences':    '#22C55E',
  'Geography':        '#14B8A6',
  'History':          '#EC4899',
  'Accounting':       '#F97316',
  'IT':               '#6366F1',
  'LO':               '#64748B',
  'Business':         '#A855F7',
  'Economics':        '#FB923C',
  'Natural Sciences': '#0EA5E9',
  'Social Sciences':  '#84CC16',
  'Technology':       '#EF4444',
  'EMS':              '#FB923C',
  'Consumer Studies': '#FCD34D',
  'Creative Arts':    '#E879F9',
  'Physical Sciences':'#F59E0B',
};

const SUBJECTS_BY_CLASS: Record<string, string[]> = {
  // Grade 8
  '8A':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  '8B':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  '8C':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  '8D':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  '8E':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  // Grade 9
  '9A':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  '9B':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  '9C':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  '9D':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  '9E':  ['Mathematics','English','IsiZulu','Natural Sciences','Social Sciences','Technology','EMS','LO'],
  // Grade 10
  '10A': ['Mathematics','English','IsiZulu','Physical Sciences','Life Sciences','IT','LO'],
  '10B': ['Mathematics','English','IsiZulu','Life Sciences','Business','Geography','LO'],
  '10C': ['Mathematics','English','IsiZulu','Accounting','Business','Economics','LO'],
  '10D': ['Mathematics','English','IsiZulu','History','Geography','Consumer Studies','LO'],
  '10E': ['Mathematics','English','IsiZulu','Consumer Studies','Business','LO'],
  // Grade 11
  '11A': ['Mathematics','English','IsiZulu','Physics','IT','Accounting','LO'],
  '11B': ['Mathematics','English','IsiZulu','Life Sciences','Business','LO'],
  '11C': ['Mathematics','English','IsiZulu','Geography','History','LO'],
  '11D': ['Mathematics','English','IsiZulu','Accounting','Economics','LO'],
  '11E': ['Mathematics','English','IsiZulu','Consumer Studies','LO'],
  // Grade 12
  '12A': ['Mathematics','English','IsiZulu','Physical Sciences','Life Sciences','LO'],
  '12B': ['Mathematics','English','IsiZulu','Accounting','Business','LO'],
  '12C': ['Mathematics','English','IsiZulu','Geography','History','LO'],
  '12D': ['Mathematics','English','IsiZulu','Life Sciences','Geography','LO'],
  '12E': ['Mathematics','English','IsiZulu','Consumer Studies','LO'],
};

function generateTimetable(grade: number, section: string): string[][] {
  const key = `${grade}${section}`;
  const subjects = SUBJECTS_BY_CLASS[key] || SUBJECTS_BY_CLASS['11A'];
  // Returns grid indexed [dayIndex][periodIndex]
  const grid: string[][] = [];
  for (let d = 0; d < 5; d++) {
    const day: string[] = [];
    let idx = d % subjects.length;
    for (let p = 0; p < 10; p++) {
      if (PERIODS[p] === 'Break' || PERIODS[p] === 'Lunch') {
        day.push(PERIODS[p]);
      } else {
        day.push(subjects[idx % subjects.length]);
        idx++;
      }
    }
    grid.push(day);
  }
  return grid;
}

function periodLabel(period: string, pIdx: number): { main: string; sub: string } {
  if (period === 'Break') return { main: 'BREAK', sub: '' };
  if (period === 'Lunch') return { main: 'LUNCH', sub: '' };
  // Count non-break periods before this index
  let num = 0;
  for (let i = 0; i <= pIdx; i++) {
    if (PERIODS[i] !== 'Break' && PERIODS[i] !== 'Lunch') num++;
  }
  return { main: `Period ${num}`, sub: period };
}

export default function TimetablePage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(11);
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [timetable, setTimetable] = useState<string[][]>([]);
  const [editCell, setEditCell] = useState<{ day: number; period: number } | null>(null);
  const [dbSubjects, setDbSubjects] = useState<{ code: string; name: string; color: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/subjects').then(r => r.json()).then(d => {
      setDbSubjects(d.subjects ?? []);
    });
  }, []);

  useEffect(() => {
    const grade = `Grade ${selectedGrade}`;
    fetch(`/api/admin/timetable?grade=${encodeURIComponent(grade)}`).then(r => r.json()).then(d => {
      const slots: any[] = d.slots ?? [];
      if (slots.length > 0) {
        // Build grid from DB slots
        const grid: string[][] = Array.from({ length: 5 }, () => Array(10).fill(''));
        slots.forEach(s => {
          const dIdx = DAYS.indexOf(s.day);
          // period is 1-indexed non-break period; map back to row index
          let p1count = 0;
          for (let i = 0; i < PERIODS.length; i++) {
            if (PERIODS[i] !== 'Break' && PERIODS[i] !== 'Lunch') p1count++;
            if (p1count === s.period) { if (dIdx >= 0) grid[dIdx][i] = s.subjectName; break; }
          }
        });
        setTimetable(grid);
        setPublished(true);
      } else {
        setTimetable(generateTimetable(selectedGrade, selectedSection));
        setPublished(false);
      }
    }).catch(() => {
      setTimetable(generateTimetable(selectedGrade, selectedSection));
      setPublished(false);
    });
    setEditCell(null);
  }, [selectedGrade, selectedSection]);

  const classKey = `${selectedGrade}${selectedSection}`;
  const subjects = SUBJECTS_BY_CLASS[classKey] || SUBJECTS_BY_CLASS['11A'];

  const handleCellChange = (day: number, period: number, value: string) => {
    setTimetable(prev => {
      const next = prev.map(d => [...d]);
      next[day][period] = value;
      return next;
    });
    setPublished(false);
    setEditCell(null);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: S2,
    border: `1px solid ${GOLD_B}`,
    borderRadius: 6,
    padding: '4px 6px',
    fontSize: 11,
    color: TEXT,
    fontFamily: FB,
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: 28, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>
            Timetable
          </h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4, margin: '4px 0 0' }}>
            Grade &amp; class selector · Term 3 2025
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {published && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: GREEN, fontWeight: 600 }}>
              <span style={{ fontSize: 15 }}>✓</span> Published
            </div>
          )}
          <button
            onClick={async () => {
              setSaving(true);
              setSaveMsg('');
              const grade = `Grade ${selectedGrade}`;
              const slots: any[] = [];
              let p1count = 0;
              for (let pIdx = 0; pIdx < PERIODS.length; pIdx++) {
                if (PERIODS[pIdx] === 'Break' || PERIODS[pIdx] === 'Lunch') continue;
                p1count++;
                DAYS.forEach((day, dIdx) => {
                  const subjectName = timetable[dIdx]?.[pIdx];
                  if (!subjectName) return;
                  // Find subject code from DB subjects or use name as code
                  const sub = dbSubjects.find(s => s.name === subjectName);
                  if (sub) slots.push({ day, period: p1count, time: PERIODS[pIdx].split('–')[0], endTime: PERIODS[pIdx].split('–')[1] ?? '', subjectCode: sub.code });
                });
              }
              const res = await fetch('/api/admin/timetable', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grade, slots }),
              });
              setSaving(false);
              if (res.ok) { setPublished(true); setSaveMsg('Saved!'); setTimeout(() => setSaveMsg(''), 3000); }
              else setSaveMsg('Save failed — check subject codes match DB.');
            }}
            disabled={saving}
            style={{ background: GOLD, color: '#000', borderRadius: 9999, padding: '9px 20px', fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: FB, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Publish Timetable'}
          </button>
          {saveMsg && <span style={{ fontSize: 12, color: saveMsg.includes('failed') ? '#EF4444' : GREEN }}>{saveMsg}</span>}
        </div>
      </div>

      {/* Grade tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {GRADES.map(g => (
          <button
            key={g}
            onClick={() => { setSelectedGrade(g); setSelectedSection('A'); }}
            style={{
              padding: '7px 18px',
              borderRadius: 9999,
              background: selectedGrade === g ? GOLD_DIM : S2,
              border: `1px solid ${selectedGrade === g ? GOLD_B : BORDER}`,
              color: selectedGrade === g ? GOLD : MUTED,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: FB,
              transition: 'all 0.12s',
            }}
          >
            Grade {g}
          </button>
        ))}
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {SECTIONS_BY_GRADE[selectedGrade].map(sec => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            style={{
              padding: '5px 14px',
              borderRadius: 9999,
              background: selectedSection === sec ? GOLD_DIM : 'transparent',
              border: `1px solid ${selectedSection === sec ? GOLD_B : BORDER}`,
              color: selectedSection === sec ? GOLD : FAINT,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: FB,
            }}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Subject color legend */}
      <div style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: '10px 16px',
        marginBottom: 18,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 4 }}>
          Legend
        </span>
        {subjects.map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: 3, background: SUBJECT_COLORS[s] || GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: MUTED }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Timetable grid */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: 12 }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', minWidth: 680 }}>

        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '128px repeat(5, 1fr)', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ padding: '11px 14px', background: S3 }} />
          {DAYS.map(d => (
            <div
              key={d}
              style={{
                padding: '11px 12px',
                fontSize: 11,
                fontWeight: 700,
                color: GOLD,
                textAlign: 'center',
                borderLeft: `1px solid ${BORDER}`,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                background: S2,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Period rows */}
        {PERIODS.map((period, pIdx) => {
          const isBreak = period === 'Break' || period === 'Lunch';
          const { main, sub } = periodLabel(period, pIdx);
          return (
            <div
              key={pIdx}
              style={{
                display: 'grid',
                gridTemplateColumns: '128px repeat(5, 1fr)',
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              {/* Period label cell */}
              <div style={{
                padding: '8px 14px',
                background: isBreak ? S3 : S2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: isBreak ? 30 : 46,
              }}>
                <div style={{
                  fontSize: isBreak ? 10 : 10,
                  fontWeight: 700,
                  color: isBreak ? GOLD : FAINT,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {main}
                </div>
                {!isBreak && sub && (
                  <div style={{ fontSize: 9, color: FAINT, marginTop: 2, opacity: 0.8 }}>{sub}</div>
                )}
              </div>

              {/* Day cells */}
              {DAYS.map((_, dIdx) => {
                const cellVal = timetable[dIdx]?.[pIdx] || '';
                const isEditing = editCell?.day === dIdx && editCell?.period === pIdx;
                const color = SUBJECT_COLORS[cellVal] || GOLD;

                if (isBreak) {
                  return (
                    <div
                      key={dIdx}
                      style={{
                        borderLeft: `1px solid ${BORDER}`,
                        background: S3,
                        minHeight: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 11, color: FAINT }}>—</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={dIdx}
                    onClick={() => !isEditing && setEditCell({ day: dIdx, period: pIdx })}
                    style={{
                      padding: '6px 8px',
                      borderLeft: `1px solid ${BORDER}`,
                      minHeight: 46,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      background: 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {isEditing ? (
                      <select
                        autoFocus
                        defaultValue={cellVal}
                        onChange={e => handleCellChange(dIdx, pIdx, e.target.value)}
                        onBlur={() => setEditCell(null)}
                        style={inputStyle}
                      >
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : cellVal ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%' }}>
                        <div style={{ width: 3, minHeight: 28, borderRadius: 2, background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: TEXT, lineHeight: 1.35 }}>{cellVal}</span>
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: 28,
                        border: `1px dashed ${BORDER}`,
                        borderRadius: 5,
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      </div>

      <p style={{ fontSize: 11, color: FAINT, marginTop: 8 }}>
        Click any cell to edit. Publish to make visible to students.
      </p>
    </div>
  );
}
