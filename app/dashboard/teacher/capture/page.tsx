'use client';

import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, UserCheck, CheckCircle2, XCircle, Clock, MinusCircle, Save, Loader2, BookOpen, Bell } from 'lucide-react';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const PURPLE = '#7C3AED'; const PURPLE_DIM = 'rgba(124,58,237,0.10)'; const PURPLE_B = 'rgba(124,58,237,0.25)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#10B981'; const RED = '#EF4444'; const AMBER = '#F59E0B';
const FH = "'Bricolage Grotesque', sans-serif"; const FB = "'Inter', sans-serif";

interface Student { portalId: string; name: string; grade: string | null }
interface Subject { code: string; name: string; short: string; color: string }

const inputStyle: React.CSSProperties = {
  background: S2, border: `1px solid ${BORDER}`, borderRadius: 9,
  color: TEXT, fontFamily: FB, fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box',
};

const ATT_STATUSES = [
  { key: 'present', label: 'Present', color: GREEN, Icon: CheckCircle2 },
  { key: 'absent',  label: 'Absent',  color: RED,   Icon: XCircle },
  { key: 'late',    label: 'Late',    color: AMBER, Icon: Clock },
  { key: 'excused', label: 'Excused', color: '#8B5CF6', Icon: MinusCircle },
] as const;

export default function CapturePage() {
  const [tab, setTab] = useState<'marks' | 'attendance' | 'assignment' | 'notice'>('marks');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');

  // Marks form
  const [subjectCode, setSubjectCode] = useState('');
  const [task, setTask]   = useState('');
  const [type, setType]   = useState('Test');
  const [total, setTotal] = useState('50');
  const [term, setTerm]   = useState('2');
  const [scores, setScores] = useState<Record<string, string>>({});

  // Attendance form
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  // Assignment form
  const [asgnSubject, setAsgnSubject] = useState('');
  const [asgnTitle, setAsgnTitle]     = useState('');
  const [asgnDesc, setAsgnDesc]       = useState('');
  const [asgnType, setAsgnType]       = useState('Assignment');
  const [asgnDue, setAsgnDue]         = useState('');
  const [asgnTotal, setAsgnTotal]     = useState('100');
  const [asgnPriority, setAsgnPriority] = useState('medium');

  // Notice form
  const [ntcTitle, setNtcTitle]       = useState('');
  const [ntcBody, setNtcBody]         = useState('');
  const [ntcCategory, setNtcCategory] = useState('Academic');
  const [ntcPinned, setNtcPinned]     = useState(false);

  useEffect(() => {
    fetch('/api/teacher/roster')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setStudents(d.students); setSubjects(d.subjects); if (d.subjects[0]) { setSubjectCode(d.subjects[0].code); setAsgnSubject(d.subjects[0].code); } })
      .catch(() => setToast('Could not load students — check your connection.'))
      .finally(() => setLoading(false));
  }, []);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const filledScores = useMemo(() => Object.entries(scores).filter(([, v]) => v.trim() !== ''), [scores]);

  const saveMarks = async () => {
    if (!subjectCode || !task.trim() || !total || filledScores.length === 0) {
      flash('Fill in the task name, total and at least one student score.');
      return;
    }
    setSaving(true);
    let ok = 0, failed = 0;
    for (const [portalId, score] of filledScores) {
      const res = await fetch('/api/marks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentPortalId: portalId, subjectCode, task: task.trim(), type, score: Number(score), total: Number(total), term: Number(term) }),
      });
      res.ok ? ok++ : failed++;
    }
    setSaving(false);
    setScores({});
    flash(failed ? `Saved ${ok}, failed ${failed}.` : `✓ Saved ${ok} mark${ok !== 1 ? 's' : ''} for ${task.trim()}.`);
    if (!failed) setTask('');
  };

  const saveAttendance = async () => {
    const entries = Object.entries(statuses);
    if (!date || entries.length === 0) { flash('Pick a date and mark at least one student.'); return; }
    setSaving(true);
    let ok = 0, failed = 0;
    for (const [portalId, status] of entries) {
      const res = await fetch('/api/attendance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentPortalId: portalId, date, status }),
      });
      res.ok ? ok++ : failed++;
    }
    setSaving(false);
    flash(failed ? `Saved ${ok}, failed ${failed}.` : `✓ Register saved for ${ok} student${ok !== 1 ? 's' : ''} (${date}).`);
    if (!failed) setStatuses({});
  };

  const markAll = (status: string) =>
    setStatuses(Object.fromEntries(students.map(s => [s.portalId, status])));

  const saveAssignment = async () => {
    if (!asgnSubject || !asgnTitle.trim() || !asgnDue) { flash('Fill in the subject, title and due date.'); return; }
    setSaving(true);
    const res = await fetch('/api/assignments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectCode: asgnSubject, title: asgnTitle, description: asgnDesc, type: asgnType, dueDate: asgnDue, total: Number(asgnTotal || 100), priority: asgnPriority }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { flash(data.error ?? 'Could not create assignment.'); return; }
    flash(`✓ Assignment "${asgnTitle.trim()}" posted.`);
    setAsgnTitle(''); setAsgnDesc(''); setAsgnDue('');
  };

  const saveNotice = async () => {
    if (!ntcTitle.trim() || !ntcBody.trim()) { flash('Fill in the notice title and body.'); return; }
    setSaving(true);
    const res = await fetch('/api/notices', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: ntcTitle, body: ntcBody, category: ntcCategory, pinned: ntcPinned }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { flash(data.error ?? 'Could not post notice.'); return; }
    flash(`✓ Notice "${ntcTitle.trim()}" posted.`);
    setNtcTitle(''); setNtcBody(''); setNtcPinned(false);
  };

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 14 }}>Loading students…</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Capture</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Enter real marks and attendance — students see them instantly.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {([['marks', 'Marks', ClipboardList], ['attendance', 'Attendance', UserCheck], ['assignment', 'Assignment', BookOpen], ['notice', 'Notice', Bell]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
              fontFamily: FB, fontSize: 13, fontWeight: 600,
              background: tab === key ? PURPLE_DIM : 'transparent',
              border: `1px solid ${tab === key ? PURPLE_B : BORDER}`,
              color: tab === key ? '#C4B5FD' : MUTED,
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ marginBottom: 16, padding: '11px 16px', borderRadius: 10, background: toast.startsWith('✓') ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)', border: `1px solid ${toast.startsWith('✓') ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, fontSize: 13, color: toast.startsWith('✓') ? GREEN : AMBER }}>
          {toast}
        </div>
      )}

      {tab === 'marks' && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22 }}>
          {/* Assessment details */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>SUBJECT</label>
              <select value={subjectCode} onChange={e => setSubjectCode(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {subjects.map(s => <option key={s.code} value={s.code} style={{ background: S2 }}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>TASK NAME</label>
              <input value={task} onChange={e => setTask(e.target.value)} placeholder="e.g. Trigonometry Test 2" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>TYPE</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['Test', 'Assignment', 'Exam', 'Project', 'Practical', 'Essay', 'Oral'].map(t => <option key={t} style={{ background: S2 }}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>OUT OF</label>
              <input value={total} onChange={e => setTotal(e.target.value.replace(/\D/g, ''))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>TERM</label>
              <select value={term} onChange={e => setTerm(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['1', '2', '3', '4'].map(t => <option key={t} style={{ background: S2 }}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Student scores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {students.map(s => {
              const v = scores[s.portalId] ?? '';
              const num = Number(v); const tot = Number(total) || 1;
              const pct = v.trim() !== '' && !isNaN(num) ? Math.round((num / tot) * 100) : null;
              return (
                <div key={s.portalId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: S2, borderRadius: 10, border: `1px solid ${BORDER}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: FAINT }}>{s.portalId}{s.grade ? ` · ${s.grade}` : ''}</div>
                  </div>
                  {pct !== null && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 60 ? GREEN : pct >= 40 ? AMBER : RED }}>{pct}%</span>
                  )}
                  <input
                    value={v}
                    onChange={e => setScores(p => ({ ...p, [s.portalId]: e.target.value.replace(/[^\d.]/g, '') }))}
                    placeholder={`/ ${total}`}
                    style={{ ...inputStyle, width: 90, textAlign: 'center' }}
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={saveMarks}
            disabled={saving}
            style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 26px', borderRadius: 10, cursor: saving ? 'default' : 'pointer', background: PURPLE, border: 'none', color: '#fff', fontFamily: FH, fontSize: 14, fontWeight: 700, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : `Save ${filledScores.length || ''} Mark${filledScores.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {tab === 'attendance' && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22 }}>
          {/* Date + bulk actions */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>DATE</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inputStyle, width: 170, colorScheme: 'dark' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => markAll('present')} style={{ padding: '9px 14px', borderRadius: 9, cursor: 'pointer', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.30)', color: GREEN, fontSize: 12, fontWeight: 600 }}>
                All Present
              </button>
              <button onClick={() => setStatuses({})} style={{ padding: '9px 14px', borderRadius: 9, cursor: 'pointer', background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontSize: 12, fontWeight: 600 }}>
                Clear
              </button>
            </div>
          </div>

          {/* Register */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {students.map(s => {
              const current = statuses[s.portalId];
              return (
                <div key={s.portalId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: S2, borderRadius: 10, border: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: FAINT }}>{s.portalId}{s.grade ? ` · ${s.grade}` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {ATT_STATUSES.map(({ key, label, color, Icon }) => (
                      <button
                        key={key}
                        onClick={() => setStatuses(p => ({ ...p, [s.portalId]: key }))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 8, cursor: 'pointer',
                          fontSize: 11.5, fontWeight: 600,
                          background: current === key ? color + '22' : 'transparent',
                          border: `1px solid ${current === key ? color + '66' : BORDER}`,
                          color: current === key ? color : MUTED,
                        }}
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={saveAttendance}
            disabled={saving}
            style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 26px', borderRadius: 10, cursor: saving ? 'default' : 'pointer', background: PURPLE, border: 'none', color: '#fff', fontFamily: FH, fontSize: 14, fontWeight: 700, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Register'}
          </button>
        </div>
      )}

      {tab === 'assignment' && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22, maxWidth: 720 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>SUBJECT</label>
              <select value={asgnSubject} onChange={e => setAsgnSubject(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {subjects.map(s => <option key={s.code} value={s.code} style={{ background: S2 }}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>TYPE</label>
              <select value={asgnType} onChange={e => setAsgnType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['Assignment', 'Project', 'Essay', 'Practical', 'Test', 'Exam'].map(t => <option key={t} style={{ background: S2 }}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>TITLE</label>
            <input value={asgnTitle} onChange={e => setAsgnTitle(e.target.value)} placeholder="e.g. Map Skills Research Project" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>DESCRIPTION (optional)</label>
            <textarea value={asgnDesc} onChange={e => setAsgnDesc(e.target.value)} rows={3} placeholder="Instructions for learners…" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 18 }}>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>DUE DATE</label>
              <input type="date" value={asgnDue} onChange={e => setAsgnDue(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>OUT OF</label>
              <input value={asgnTotal} onChange={e => setAsgnTotal(e.target.value.replace(/\D/g, ''))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>PRIORITY</label>
              <select value={asgnPriority} onChange={e => setAsgnPriority(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['low', 'medium', 'high'].map(p => <option key={p} value={p} style={{ background: S2 }}>{p}</option>)}
              </select>
            </div>
          </div>
          <button onClick={saveAssignment} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 26px', borderRadius: 10, cursor: saving ? 'default' : 'pointer', background: PURPLE, border: 'none', color: '#fff', fontFamily: FH, fontSize: 14, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Posting…' : 'Post Assignment'}
          </button>
        </div>
      )}

      {tab === 'notice' && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22, maxWidth: 720 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>TITLE</label>
              <input value={ntcTitle} onChange={e => setNtcTitle(e.target.value)} placeholder="e.g. Term 2 Exam Timetable Released" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>CATEGORY</label>
              <select value={ntcCategory} onChange={e => setNtcCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['Academic', 'Sport', 'Event', 'Admin', 'Urgent'].map(c => <option key={c} style={{ background: S2 }}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>BODY</label>
            <textarea value={ntcBody} onChange={e => setNtcBody(e.target.value)} rows={5} placeholder="Write the notice…" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, cursor: 'pointer', fontSize: 13, color: MUTED }}>
            <input type="checkbox" checked={ntcPinned} onChange={e => setNtcPinned(e.target.checked)} style={{ accentColor: PURPLE }} />
            Pin to top
          </label>
          <button onClick={saveNotice} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 26px', borderRadius: 10, cursor: saving ? 'default' : 'pointer', background: PURPLE, border: 'none', color: '#fff', fontFamily: FH, fontSize: 14, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Posting…' : 'Post Notice'}
          </button>
        </div>
      )}
    </div>
  );
}
