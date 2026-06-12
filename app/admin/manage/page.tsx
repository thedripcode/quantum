'use client';

import { useCallback, useEffect, useState } from 'react';
import { Users, BookOpen, Calendar, Bell, ClipboardList, BarChart2, Trash2, Plus, Save, Loader2, Power } from 'lucide-react';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.10)'; const GOLD_B = 'rgba(201,168,76,0.30)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#10B981'; const RED = '#EF4444'; const AMBER = '#F59E0B';
const FH = "'Bricolage Grotesque', sans-serif"; const FB = "'Inter', sans-serif";

const input: React.CSSProperties = {
  background: S2, border: `1px solid ${BORDER}`, borderRadius: 9,
  color: TEXT, fontFamily: FB, fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box',
};
const label: React.CSSProperties = { fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: '0.05em' };
const card: React.CSSProperties = { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22 };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: S2, borderRadius: 10, border: `1px solid ${BORDER}` };

const delBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: RED, fontSize: 11.5, fontWeight: 600, flexShrink: 0,
};
const goldBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 10, cursor: 'pointer',
  background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13.5, fontWeight: 700,
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIOD_TIMES = [
  { period: 1, time: '07:30', endTime: '08:30' },
  { period: 2, time: '08:30', endTime: '09:30' },
  { period: 3, time: '10:00', endTime: '11:00' },
  { period: 4, time: '11:00', endTime: '12:00' },
];
const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

type Tab = 'people' | 'subjects' | 'timetable' | 'notices' | 'assignments' | 'marks';

export default function AdminManagePage() {
  const [tab, setTab]     = useState<Tab>('people');
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState('');
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 4500); };
  const ok = toast.startsWith('✓');

  // ── People ──
  const [users, setUsers] = useState<any[]>([]);
  const [uForm, setUForm] = useState({ name: '', email: '', password: '', role: 'student', grade: 'Grade 8' });
  const loadUsers = useCallback(() => fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d.users ?? [])), []);

  // ── Subjects ──
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sForm, setSForm] = useState({ code: '', name: '', short: '', color: '#3B82F6', room: '', teacherPortalId: '' });
  const loadSubjects = useCallback(() => fetch('/api/admin/subjects').then(r => r.json()).then(d => setSubjects(d.subjects ?? [])), []);

  // ── Timetable ──
  const [grade, setGrade] = useState('Grade 11');
  const [grid, setGrid]   = useState<Record<string, string>>({}); // "Monday-1" -> subjectCode
  const loadTimetable = useCallback((g: string) =>
    fetch(`/api/admin/timetable?grade=${encodeURIComponent(g)}`).then(r => r.json()).then(d => {
      const next: Record<string, string> = {};
      (d.slots ?? []).forEach((s: any) => {
        const p = PERIOD_TIMES.find(pt => pt.time === s.time)?.period ?? s.period;
        next[`${s.day}-${p}`] = s.subjectCode;
      });
      setGrid(next);
    }), []);

  // ── Notices / assignments / marks ──
  const [notices, setNotices]         = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [marks, setMarks]             = useState<any[]>([]);
  const loadNotices     = useCallback(() => fetch('/api/notices').then(r => r.json()).then(d => setNotices(d.notices ?? [])), []);
  const loadAssignments = useCallback(() => fetch('/api/assignments').then(r => r.json()).then(d => setAssignments(d.assignments ?? [])), []);
  const loadMarks       = useCallback(() => fetch('/api/marks').then(r => r.json()).then(d => setMarks(d.marks ?? [])), []);

  useEffect(() => { loadUsers(); loadSubjects(); }, [loadUsers, loadSubjects]);
  useEffect(() => {
    if (tab === 'timetable') loadTimetable(grade);
    if (tab === 'notices') loadNotices();
    if (tab === 'assignments') loadAssignments();
    if (tab === 'marks') loadMarks();
  }, [tab, grade, loadTimetable, loadNotices, loadAssignments, loadMarks]);

  // ── Actions ──
  const api = async (url: string, init?: RequestInit) => {
    setBusy(true);
    const res = await fetch(url, init);
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { flash(data.error ?? 'Something went wrong.'); return null; }
    return data;
  };

  const createUser = async () => {
    if (!uForm.name.trim() || !uForm.email.trim() || !uForm.password) { flash('Fill in name, email and password.'); return; }
    const d = await api('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(uForm) });
    if (d) { flash(`✓ Created — portal ID ${d.portalId}`); setUForm({ name: '', email: '', password: '', role: 'student', grade: 'Grade 8' }); loadUsers(); }
  };
  const toggleUser = async (u: any) => {
    const d = await api('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, active: !u.active }) });
    if (d) { flash(`✓ ${u.name} ${u.active ? 'deactivated' : 'reactivated'}.`); loadUsers(); }
  };
  const deleteUser = async (u: any) => {
    if (!confirm(`Delete ${u.name} (${u.portalId})? Their marks and attendance are removed too. This cannot be undone.`)) return;
    const d = await api(`/api/admin/users?id=${u.id}`, { method: 'DELETE' });
    if (d) { flash(`✓ ${u.name} deleted.`); loadUsers(); }
  };

  const createSubject = async () => {
    if (!sForm.code.trim() || !sForm.name.trim() || !sForm.short.trim()) { flash('Fill in code, name and short label.'); return; }
    const d = await api('/api/admin/subjects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sForm) });
    if (d) { flash(`✓ Subject "${sForm.name}" created and all students enrolled.`); setSForm({ code: '', name: '', short: '', color: '#3B82F6', room: '', teacherPortalId: '' }); loadSubjects(); }
  };
  const deleteSubject = async (s: any) => {
    if (!confirm(`Delete ${s.name}? This removes its ${s.marks} marks, assignments and timetable slots. This cannot be undone.`)) return;
    const d = await api(`/api/admin/subjects?id=${s.id}`, { method: 'DELETE' });
    if (d) { flash(`✓ ${s.name} deleted.`); loadSubjects(); }
  };

  const saveTimetable = async () => {
    const slots = Object.entries(grid)
      .filter(([, code]) => code)
      .map(([key, code]) => {
        const [day, p] = key.split('-');
        const pt = PERIOD_TIMES.find(x => x.period === Number(p))!;
        return { day, period: Number(p), time: pt.time, endTime: pt.endTime, subjectCode: code };
      });
    const d = await api('/api/admin/timetable', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ grade, slots }) });
    if (d) flash(`✓ ${grade} timetable saved (${d.count} lessons).`);
  };

  const deleteNotice = async (n: any) => {
    if (!confirm(`Delete notice "${n.title}"?`)) return;
    const d = await api(`/api/notices?id=${n.id}`, { method: 'DELETE' });
    if (d) { flash('✓ Notice deleted.'); loadNotices(); }
  };
  const deleteAssignment = async (a: any) => {
    if (!confirm(`Delete assignment "${a.title}"?`)) return;
    const d = await api(`/api/assignments?id=${a.id}`, { method: 'DELETE' });
    if (d) { flash('✓ Assignment deleted.'); loadAssignments(); }
  };
  const deleteMark = async (m: any) => {
    if (!confirm(`Delete ${m.studentName}'s mark for "${m.task}" (${m.score}/${m.total})?`)) return;
    const d = await api(`/api/marks?id=${m.id}`, { method: 'DELETE' });
    if (d) { flash('✓ Mark deleted.'); loadMarks(); }
  };

  const TABS: { id: Tab; label: string; Icon: any }[] = [
    { id: 'people',      label: 'People',      Icon: Users },
    { id: 'subjects',    label: 'Subjects',    Icon: BookOpen },
    { id: 'timetable',   label: 'Timetable',   Icon: Calendar },
    { id: 'notices',     label: 'Notices',     Icon: Bell },
    { id: 'assignments', label: 'Assignments', Icon: ClipboardList },
    { id: 'marks',       label: 'Marks',       Icon: BarChart2 },
  ];

  const teachers = users.filter(u => u.role === 'teacher');

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Manage Data</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Create and remove everything: people, subjects, timetables, notices, assignments and marks.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(({ id, label: l, Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
            fontFamily: FB, fontSize: 13, fontWeight: 600,
            background: tab === id ? GOLD_DIM : 'transparent',
            border: `1px solid ${tab === id ? GOLD_B : BORDER}`,
            color: tab === id ? GOLD : MUTED,
          }}>
            <Icon size={14} />{l}
          </button>
        ))}
      </div>

      {toast && (
        <div style={{ marginBottom: 16, padding: '11px 16px', borderRadius: 10, background: ok ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)', border: `1px solid ${ok ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, fontSize: 13, color: ok ? GREEN : AMBER }}>
          {toast}
        </div>
      )}

      {/* ── PEOPLE ── */}
      {tab === 'people' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>
          <div style={card}>
            <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Add Person</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><span style={label}>FULL NAME</span><input style={input} value={uForm.name} onChange={e => setUForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Zanele Mthembu" /></div>
              <div><span style={label}>EMAIL</span><input style={input} value={uForm.email} onChange={e => setUForm(f => ({ ...f, email: e.target.value }))} placeholder="email@sidelile.edu.za" /></div>
              <div><span style={label}>PASSWORD</span><input style={input} value={uForm.password} onChange={e => setUForm(f => ({ ...f, password: e.target.value }))} placeholder="min 6 characters" /></div>
              <div><span style={label}>ROLE</span>
                <select style={{ ...input, cursor: 'pointer' }} value={uForm.role} onChange={e => setUForm(f => ({ ...f, role: e.target.value }))}>
                  {['student', 'teacher', 'parent', 'admin'].map(r => <option key={r} value={r} style={{ background: S2 }}>{r}</option>)}
                </select>
              </div>
              {uForm.role === 'student' && (
                <div><span style={label}>GRADE</span>
                  <select style={{ ...input, cursor: 'pointer' }} value={uForm.grade} onChange={e => setUForm(f => ({ ...f, grade: e.target.value }))}>
                    {GRADES.map(g => <option key={g} style={{ background: S2 }}>{g}</option>)}
                  </select>
                </div>
              )}
              <button onClick={createUser} disabled={busy} style={{ ...goldBtn, opacity: busy ? 0.6 : 1, justifyContent: 'center' }}>
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create
              </button>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>All Users ({users.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {users.map(u => (
                <div key={u.id} style={{ ...row, opacity: u.active ? 1 : 0.45 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>{u.name} {!u.active && <span style={{ fontSize: 10, color: RED }}>(inactive)</span>}</div>
                    <div style={{ fontSize: 11, color: FAINT }}>{u.portalId} · {u.role}{u.grade ? ` · ${u.grade}` : ''} · {u.email}</div>
                  </div>
                  <button onClick={() => toggleUser(u)} style={{ ...delBtn, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)', color: AMBER }} title={u.active ? 'Deactivate (blocks login)' : 'Reactivate'}>
                    <Power size={12} />{u.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => deleteUser(u)} style={delBtn}><Trash2 size={12} />Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBJECTS ── */}
      {tab === 'subjects' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>
          <div style={card}>
            <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Add Subject</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><span style={label}>NAME</span><input style={input} value={sForm.name} onChange={e => setSForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Accounting" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><span style={label}>CODE</span><input style={input} value={sForm.code} onChange={e => setSForm(f => ({ ...f, code: e.target.value }))} placeholder="acc" /></div>
                <div><span style={label}>SHORT</span><input style={input} value={sForm.short} onChange={e => setSForm(f => ({ ...f, short: e.target.value }))} placeholder="ACC" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><span style={label}>COLOR</span><input type="color" style={{ ...input, padding: 4, height: 38, cursor: 'pointer' }} value={sForm.color} onChange={e => setSForm(f => ({ ...f, color: e.target.value }))} /></div>
                <div><span style={label}>ROOM</span><input style={input} value={sForm.room} onChange={e => setSForm(f => ({ ...f, room: e.target.value }))} placeholder="B-102" /></div>
              </div>
              <div><span style={label}>TEACHER</span>
                <select style={{ ...input, cursor: 'pointer' }} value={sForm.teacherPortalId} onChange={e => setSForm(f => ({ ...f, teacherPortalId: e.target.value }))}>
                  <option value="" style={{ background: S2 }}>— Unassigned —</option>
                  {teachers.map(t => <option key={t.portalId} value={t.portalId} style={{ background: S2 }}>{t.name} ({t.portalId})</option>)}
                </select>
              </div>
              <button onClick={createSubject} disabled={busy} style={{ ...goldBtn, opacity: busy ? 0.6 : 1, justifyContent: 'center' }}>
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Subject
              </button>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Subjects ({subjects.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {subjects.map(s => (
                <div key={s.id} style={row}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>{s.name} <span style={{ color: FAINT, fontSize: 11 }}>({s.short})</span></div>
                    <div style={{ fontSize: 11, color: FAINT }}>{s.teacherName ?? 'No teacher'} · Room {s.room ?? '—'} · {s.enrollments} learners · {s.marks} marks</div>
                  </div>
                  <button onClick={() => deleteSubject(s)} style={delBtn}><Trash2 size={12} />Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TIMETABLE ── */}
      {tab === 'timetable' && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: 0 }}>Timetable Builder</h3>
              <select style={{ ...input, width: 150, cursor: 'pointer' }} value={grade} onChange={e => setGrade(e.target.value)}>
                {GRADES.map(g => <option key={g} style={{ background: S2 }}>{g}</option>)}
              </select>
            </div>
            <button onClick={saveTimetable} disabled={busy} style={{ ...goldBtn, opacity: busy ? 0.6 : 1 }}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save {grade}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: 6, width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={{ fontSize: 11, color: FAINT, fontWeight: 600, textAlign: 'left', padding: '4px 8px' }}>PERIOD</th>
                  {DAYS.map(d => <th key={d} style={{ fontSize: 11, color: MUTED, fontWeight: 600, padding: '4px 8px' }}>{d.toUpperCase()}</th>)}
                </tr>
              </thead>
              <tbody>
                {PERIOD_TIMES.map(pt => (
                  <tr key={pt.period}>
                    <td style={{ fontSize: 11, color: FAINT, padding: '4px 8px', whiteSpace: 'nowrap' }}>
                      P{pt.period}<br />{pt.time}–{pt.endTime}
                    </td>
                    {DAYS.map(d => {
                      const key = `${d}-${pt.period}`;
                      const code = grid[key] ?? '';
                      const subj = subjects.find(s => s.code === code);
                      return (
                        <td key={key}>
                          <select
                            value={code}
                            onChange={e => setGrid(g => ({ ...g, [key]: e.target.value }))}
                            style={{
                              ...input, cursor: 'pointer', fontSize: 12, padding: '8px 8px',
                              borderColor: subj ? subj.color + '55' : BORDER,
                              background: subj ? subj.color + '14' : S2,
                            }}
                          >
                            <option value="" style={{ background: S2 }}>— Free —</option>
                            {subjects.map(s => <option key={s.code} value={s.code} style={{ background: S2 }}>{s.short}</option>)}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11.5, color: FAINT, marginTop: 12 }}>
            Pick a subject for each slot, then Save. Students in {grade} see the new timetable immediately. Saving replaces the whole grade's timetable.
          </p>
        </div>
      )}

      {/* ── NOTICES ── */}
      {tab === 'notices' && (
        <div style={card}>
          <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Notices ({notices.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notices.map(n => (
              <div key={n.id} style={row}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>{n.pinned ? '📌 ' : ''}{n.title}</div>
                  <div style={{ fontSize: 11, color: FAINT }}>{n.category} · {n.author} · {n.date}</div>
                </div>
                <button onClick={() => deleteNotice(n)} style={delBtn}><Trash2 size={12} />Delete</button>
              </div>
            ))}
            {notices.length === 0 && <p style={{ fontSize: 13, color: MUTED }}>No notices. Teachers post them from Capture → Notice.</p>}
          </div>
        </div>
      )}

      {/* ── ASSIGNMENTS ── */}
      {tab === 'assignments' && (
        <div style={card}>
          <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Assignments ({assignments.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {assignments.map(a => (
              <div key={a.id} style={row}>
                <div style={{ width: 3, height: 34, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: FAINT }}>{a.subject} · {a.type} · due {a.dueDate} · /{a.total}</div>
                </div>
                <button onClick={() => deleteAssignment(a)} style={delBtn}><Trash2 size={12} />Delete</button>
              </div>
            ))}
            {assignments.length === 0 && <p style={{ fontSize: 13, color: MUTED }}>No assignments. Teachers post them from Capture → Assignment.</p>}
          </div>
        </div>
      )}

      {/* ── MARKS ── */}
      {tab === 'marks' && (
        <div style={card}>
          <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Recent Marks ({marks.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {marks.map(m => (
              <div key={m.id} style={row}>
                <div style={{ width: 3, height: 34, borderRadius: 2, background: m.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>{m.studentName} — {m.task}</div>
                  <div style={{ fontSize: 11, color: FAINT }}>{m.subject} · {m.type} · Term {m.term} · {m.date}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: (m.score / m.total) >= 0.6 ? GREEN : (m.score / m.total) >= 0.4 ? AMBER : RED, flexShrink: 0 }}>
                  {m.score}/{m.total}
                </span>
                <button onClick={() => deleteMark(m)} style={delBtn}><Trash2 size={12} />Delete</button>
              </div>
            ))}
            {marks.length === 0 && <p style={{ fontSize: 13, color: MUTED }}>No marks captured yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
