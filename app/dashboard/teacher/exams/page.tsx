'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, CalendarCheck, Clock, MapPin, BookOpen } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const inp: React.CSSProperties = {
  background: S2, border: `1px solid ${BORDER}`, borderRadius: 9,
  color: TEXT, fontFamily: FB, fontSize: 13, padding: '9px 12px',
  outline: 'none', width: '100%', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  fontSize: 11, color: MUTED, fontWeight: 600, display: 'block',
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em',
};

const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const TERMS  = [1, 2, 3, 4];
const YEAR   = new Date().getFullYear();

function examStatus(dateStr: string) {
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const t = new Date();        t.setHours(0, 0, 0, 0);
  if (d.getTime() === t.getTime()) return 'today';
  return d > t ? 'upcoming' : 'past';
}
const STATUS_COLOR: Record<string, string> = {
  upcoming: '#C9A84C', today: '#10B981', past: 'rgba(255,255,255,0.30)',
};

export default function TeacherExamsPage() {
  const [exams, setExams]       = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [busy, setBusy]         = useState(false);
  const [toast, setToast]       = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterTerm, setFilterTerm]   = useState('All');
  const [form, setForm] = useState({
    subjectId: '', grade: 'Grade 11', term: 1, year: YEAR,
    date: '', startTime: '09:00', endTime: '11:00',
    venue: '', totalMarks: 100, notes: '',
  });

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 5000); };

  const loadSubjects = useCallback(async () => {
    const r = await fetch('/api/admin/subjects');
    if (r.ok) {
      const d = await r.json();
      const subs = d.subjects ?? [];
      setSubjects(subs);
      if (subs.length > 0) setForm(f => ({ ...f, subjectId: f.subjectId || subs[0].id }));
    }
  }, []);

  const loadExams = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/exams');
    if (r.ok) { const d = await r.json(); setExams(d.exams ?? []); }
    setLoading(false);
  }, []);

  useEffect(() => { loadSubjects(); loadExams(); }, [loadSubjects, loadExams]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectId || !form.date) { flash('Select a subject and date.'); return; }
    setBusy(true);
    const res = await fetch('/api/exams', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!res.ok) { const d = await res.json(); flash(d.error ?? 'Could not create exam.'); return; }
    flash('✓ Exam scheduled.');
    setForm(f => ({ ...f, date: '', venue: '', notes: '' }));
    loadExams();
  };

  const remove = async (exam: any) => {
    if (!confirm(`Delete ${exam.subject?.name ?? 'exam'} on ${new Date(exam.date).toLocaleDateString('en-ZA')}?`)) return;
    const res = await fetch(`/api/exams?id=${exam.id}`, { method: 'DELETE' });
    if (res.ok) { flash('✓ Exam removed.'); loadExams(); }
    else flash('Could not delete exam.');
  };

  const filtered = exams.filter(e =>
    (filterGrade === 'All' || e.grade === filterGrade) &&
    (filterTerm  === 'All' || e.term === Number(filterTerm))
  );

  const grouped: Record<string, any[]> = {};
  for (const e of filtered) {
    const key = new Date(e.date).toISOString().slice(0, 10);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  }
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Exam Timetable</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Schedule exams for your subjects — students see them instantly.</p>
      </div>

      {toast && (
        <div style={{ marginBottom: 16, padding: '11px 16px', borderRadius: 10, fontSize: 13, background: toast.startsWith('✓') ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)', border: `1px solid ${toast.startsWith('✓') ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, color: toast.startsWith('✓') ? GREEN : AMBER }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Form */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarCheck size={15} style={{ color: GOLD }} /> Schedule Exam
          </h3>
          <form onSubmit={create} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={lbl}>Subject</span>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
                {subjects.length === 0 && <option>Loading…</option>}
                {subjects.map(s => <option key={s.id} value={s.id} style={{ background: S2 }}>{s.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={lbl}>Grade</span>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                  {GRADES.map(g => <option key={g} style={{ background: S2 }}>{g}</option>)}
                </select>
              </div>
              <div>
                <span style={lbl}>Term</span>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.term} onChange={e => setForm(f => ({ ...f, term: Number(e.target.value) }))}>
                  {TERMS.map(t => <option key={t} value={t} style={{ background: S2 }}>Term {t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <span style={lbl}>Exam Date</span>
              <input type="date" required style={{ ...inp, colorScheme: 'dark' }} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={lbl}>Start Time</span>
                <input type="time" required style={{ ...inp, colorScheme: 'dark' }} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div>
                <span style={lbl}>End Time</span>
                <input type="time" required style={{ ...inp, colorScheme: 'dark' }} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={lbl}>Venue / Room</span>
                <input style={inp} placeholder="e.g. Hall A" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
              </div>
              <div>
                <span style={lbl}>Total Marks</span>
                <input type="number" min={1} max={300} style={inp} value={form.totalMarks} onChange={e => setForm(f => ({ ...f, totalMarks: Number(e.target.value) }))} />
              </div>
            </div>

            <div>
              <span style={lbl}>Notes (optional)</span>
              <textarea rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="e.g. Open book, bring calculator…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>

            <button type="submit" disabled={busy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 22px', borderRadius: 10, cursor: busy ? 'default' : 'pointer', background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13.5, fontWeight: 700, opacity: busy ? 0.6 : 1 }}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Schedule Exam
            </button>
          </form>
        </div>

        {/* List */}
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <select style={{ ...inp, width: 'auto', cursor: 'pointer' }} value={filterGrade} onChange={e => setFilterGrade(e.target.value)}>
              <option value="All" style={{ background: S2 }}>All Grades</option>
              {GRADES.map(g => <option key={g} style={{ background: S2 }}>{g}</option>)}
            </select>
            <select style={{ ...inp, width: 'auto', cursor: 'pointer' }} value={filterTerm} onChange={e => setFilterTerm(e.target.value)}>
              <option value="All" style={{ background: S2 }}>All Terms</option>
              {TERMS.map(t => <option key={t} value={t} style={{ background: S2 }}>Term {t}</option>)}
            </select>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: FAINT, alignSelf: 'center' }}>{filtered.length} exam{filtered.length !== 1 ? 's' : ''}</div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
              <Loader2 size={22} className="animate-spin" style={{ marginBottom: 10 }} /><div style={{ fontSize: 13 }}>Loading…</div>
            </div>
          ) : sortedDates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}` }}>
              <CalendarCheck size={30} style={{ color: FAINT, marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 6 }}>No exams scheduled</div>
              <div style={{ fontSize: 13, color: MUTED }}>Use the form on the left to add an exam.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {sortedDates.map(dateKey => {
                const dayExams = grouped[dateKey];
                const d = new Date(dateKey + 'T12:00:00');
                const status = examStatus(dateKey);
                return (
                  <div key={dateKey}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[status], textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                        {status === 'today' ? '● Today' : d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <div style={{ flex: 1, height: 1, background: BORDER }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {dayExams.map(exam => (
                        <div key={exam.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: SURFACE, border: `1px solid ${status === 'today' ? 'rgba(16,185,129,0.22)' : BORDER}`, borderRadius: 12 }}>
                          <div style={{ width: 4, borderRadius: 99, background: exam.subject?.color ?? GOLD, alignSelf: 'stretch', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{exam.subject?.name ?? 'Unknown'}</span>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: GOLD_DIM, color: GOLD, border: `1px solid ${GOLD_B}` }}>{exam.grade}</span>
                              <span style={{ fontSize: 10, color: FAINT }}>Term {exam.term}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}><Clock size={11} />{exam.startTime} – {exam.endTime}</span>
                              {exam.venue && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}><MapPin size={11} />{exam.venue}</span>}
                              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}><BookOpen size={11} />{exam.totalMarks} marks</span>
                            </div>
                            {exam.notes && <div style={{ fontSize: 12, color: FAINT, marginTop: 6, fontStyle: 'italic' }}>{exam.notes}</div>}
                          </div>
                          <button onClick={() => remove(exam)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 8, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', color: RED, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
