'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Users, BookOpen, Calendar, Bell, ClipboardList, BarChart2,
  Trash2, Plus, Save, Loader2, Power, Link2, CheckSquare, Square,
} from 'lucide-react';

const BG = '#081420'; const SURFACE = '#0E1E30'; const S2 = '#14283E'; const S3 = '#182E46';
const GOLD = '#60a5fa'; const GOLD_DIM = 'rgba(96,165,250,0.10)'; const GOLD_B = 'rgba(96,165,250,0.30)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#10B981'; const RED = '#EF4444'; const AMBER = '#F59E0B'; const BLUE = '#3B82F6';
const FH = "'Roboto Condensed', sans-serif"; const FB = "'Inter', sans-serif";

const inp: React.CSSProperties = { background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, color: TEXT, fontFamily: FB, fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: '0.05em' };
const card: React.CSSProperties = { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22 };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: S2, borderRadius: 10, border: `1px solid ${BORDER}` };
const delBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: RED, fontSize: 11.5, fontWeight: 600, flexShrink: 0 };
const goldBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 10, cursor: 'pointer', background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13.5, fontWeight: 700 };

const GRADE_NUMS = ['8', '9', '10', '11', '12'];
const STREAMS    = ['A', 'B', 'C', 'D', 'E'];
const ALL_GRADES = GRADE_NUMS.map(n => `Grade ${n}`);
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIOD_TIMES = [
  { period: 1, time: '07:30', endTime: '08:30' },
  { period: 2, time: '08:30', endTime: '09:30' },
  { period: 3, time: '10:00', endTime: '11:00' },
  { period: 4, time: '11:00', endTime: '12:00' },
];

type Tab = 'people' | 'subjects' | 'enrollments' | 'timetable' | 'notices' | 'assignments' | 'marks';

export default function AdminManagePage() {
  const [tab, setTab]     = useState<Tab>('people');
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState('');
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 4500); };
  const ok = toast.startsWith('✓');

  // ── People ──
  const [users, setUsers] = useState<any[]>([]);
  const [uForm, setUForm] = useState({ name: '', email: '', password: '', role: 'student', grade: 'Grade 8', stream: 'A' });
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editGrade, setEditGrade]     = useState('Grade 8');
  const [editStream, setEditStream]   = useState('A');
  const [linkingParentId, setLinkingParentId] = useState<string | null>(null);
  const [linkStudentId, setLinkStudentId]     = useState<string>('');
  const loadUsers = useCallback(() => fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d.users ?? [])), []);

  // ── Subjects ──
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sForm, setSForm] = useState({ code: '', name: '', short: '', color: '#3B82F6', room: '', teacherPortalId: '', grades: [] as string[] });
  const loadSubjects = useCallback(() => fetch('/api/admin/subjects').then(r => r.json()).then(d => setSubjects(d.subjects ?? [])), []);

  // ── Enrollments ──
  const [enrGrade, setEnrGrade]   = useState('Grade 10');
  const [enrStream, setEnrStream] = useState('A');
  const [enrStudents, setEnrStudents] = useState<any[]>([]);
  const [enrSubjects, setEnrSubjects] = useState<any[]>([]);
  const [enrolledSet, setEnrolledSet] = useState<Set<string>>(new Set());
  const [enrBusy, setEnrBusy] = useState(false);

  const loadEnrollments = useCallback(() => {
    setEnrBusy(true);
    fetch(`/api/admin/enrollments?grade=${encodeURIComponent(enrGrade)}&stream=${encodeURIComponent(enrStream)}`)
      .then(r => r.json())
      .then(d => {
        setEnrStudents(d.students ?? []);
        setEnrSubjects(d.subjects ?? []);
        setEnrolledSet(new Set(d.enrolled ?? []));
        setEnrBusy(false);
      });
  }, [enrGrade, enrStream]);

  // ── Timetable ──
  const [ttGrade, setTtGrade] = useState('Grade 11');
  const [grid, setGrid]       = useState<Record<string, string>>({});
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
    if (tab === 'timetable') loadTimetable(ttGrade);
    if (tab === 'notices') loadNotices();
    if (tab === 'assignments') loadAssignments();
    if (tab === 'marks') loadMarks();
    if (tab === 'enrollments') loadEnrollments();
  }, [tab, ttGrade, loadTimetable, loadNotices, loadAssignments, loadMarks, loadEnrollments]);

  // ── Generic API helper ──
  const api = async (url: string, init?: RequestInit) => {
    setBusy(true);
    const res = await fetch(url, init);
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { flash(data.error ?? 'Something went wrong.'); return null; }
    return data;
  };

  // ── People actions ──
  const createUser = async () => {
    if (!uForm.name.trim() || !uForm.email.trim() || !uForm.password) { flash('Fill in name, email and password.'); return; }
    const body = { ...uForm, stream: uForm.role === 'student' ? uForm.stream : undefined };
    const d = await api('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (d) { flash(`✓ Created — portal ID ${d.portalId}`); setUForm({ name: '', email: '', password: '', role: 'student', grade: 'Grade 8', stream: 'A' }); loadUsers(); }
  };
  const saveClass = async (u: any) => {
    const d = await api('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, grade: editGrade, stream: editStream }) });
    if (d) { flash(`✓ ${u.name} moved to ${editGrade} ${editStream}.`); setEditingId(null); loadUsers(); }
  };
  const toggleUser = async (u: any) => {
    const d = await api('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, active: !u.active }) });
    if (d) { flash(`✓ ${u.name} ${u.active ? 'deactivated' : 'reactivated'}.`); loadUsers(); }
  };
  const linkParentToStudent = async (parentUser: any) => {
    const d = await api('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: parentUser.id, linkedStudentId: linkStudentId }) });
    if (d) {
      const student = users.find(u => u.id === linkStudentId);
      flash(`✓ ${parentUser.name} linked to ${student?.name ?? 'student'}.`);
      setLinkingParentId(null);
      loadUsers();
    }
  };

  const deleteUser = async (u: any) => {
    if (!confirm(`Delete ${u.name} (${u.portalId})? Their marks and attendance are removed too.`)) return;
    const d = await api(`/api/admin/users?id=${u.id}`, { method: 'DELETE' });
    if (d) { flash(`✓ ${u.name} deleted.`); loadUsers(); }
  };

  // ── Subject actions ──
  const createSubject = async () => {
    if (!sForm.code.trim() || !sForm.name.trim() || !sForm.short.trim()) { flash('Fill in code, name and short label.'); return; }
    const d = await api('/api/admin/subjects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sForm) });
    if (d) { flash(`✓ Subject "${sForm.name}" created.`); setSForm({ code: '', name: '', short: '', color: '#3B82F6', room: '', teacherPortalId: '', grades: [] }); loadSubjects(); }
  };
  const deleteSubject = async (s: any) => {
    if (!confirm(`Delete ${s.name}? This removes its ${s.marks} marks, assignments and timetable slots.`)) return;
    const d = await api(`/api/admin/subjects?id=${s.id}`, { method: 'DELETE' });
    if (d) { flash(`✓ ${s.name} deleted.`); loadSubjects(); }
  };

  // ── Enrollment actions ──
  const streamLabel = `${enrGrade} ${enrStream}`;

  const isEnrolled = (studentId: string, subjectId: string) => enrolledSet.has(`${studentId}:${subjectId}`);

  const countEnrolled = (subjectId: string) => enrStudents.filter(s => isEnrolled(s.id, subjectId)).length;

  const enrollStream = async (subjectId: string) => {
    const studentIds = enrStudents.map((s: any) => s.id);
    if (!studentIds.length) { flash('No students in this stream.'); return; }
    setEnrBusy(true);
    const res = await fetch('/api/admin/enrollments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentIds, subjectIds: [subjectId] }),
    });
    if (res.ok) {
      const newSet = new Set(enrolledSet);
      for (const sid of studentIds) newSet.add(`${sid}:${subjectId}`);
      setEnrolledSet(newSet);
      flash(`✓ ${streamLabel} enrolled in subject.`);
    } else flash('Could not enroll.');
    setEnrBusy(false);
  };

  const unenrollStream = async (subjectId: string) => {
    const studentIds = enrStudents.map((s: any) => s.id);
    if (!studentIds.length) return;
    setEnrBusy(true);
    const res = await fetch('/api/admin/enrollments', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentIds, subjectIds: [subjectId] }),
    });
    if (res.ok) {
      const newSet = new Set(enrolledSet);
      for (const sid of studentIds) newSet.delete(`${sid}:${subjectId}`);
      setEnrolledSet(newSet);
      flash(`✓ ${streamLabel} unenrolled from subject.`);
    } else flash('Could not unenroll.');
    setEnrBusy(false);
  };

  // ── Timetable ──
  const saveTimetable = async () => {
    const slots = Object.entries(grid)
      .filter(([, code]) => code)
      .map(([key, code]) => {
        const [day, p] = key.split('-');
        const pt = PERIOD_TIMES.find(x => x.period === Number(p))!;
        return { day, period: Number(p), time: pt.time, endTime: pt.endTime, subjectCode: code };
      });
    const d = await api('/api/admin/timetable', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ grade: ttGrade, slots }) });
    if (d) flash(`✓ ${ttGrade} timetable saved (${d.count} lessons).`);
  };

  const deleteNotice     = async (n: any) => { if (!confirm(`Delete notice "${n.title}"?`)) return; const d = await api(`/api/notices?id=${n.id}`, { method: 'DELETE' }); if (d) { flash('✓ Notice deleted.'); loadNotices(); } };
  const deleteAssignment = async (a: any) => { if (!confirm(`Delete assignment "${a.title}"?`)) return; const d = await api(`/api/assignments?id=${a.id}`, { method: 'DELETE' }); if (d) { flash('✓ Assignment deleted.'); loadAssignments(); } };
  const deleteMark       = async (m: any) => { if (!confirm(`Delete ${m.studentName}'s mark for "${m.task}" (${m.score}/${m.total})?`)) return; const d = await api(`/api/marks?id=${m.id}`, { method: 'DELETE' }); if (d) { flash('✓ Mark deleted.'); loadMarks(); } };

  const TABS: { id: Tab; label: string; Icon: any }[] = [
    { id: 'people',      label: 'People',      Icon: Users },
    { id: 'subjects',    label: 'Subjects',    Icon: BookOpen },
    { id: 'enrollments', label: 'Enrollments', Icon: Link2 },
    { id: 'timetable',   label: 'Timetable',   Icon: Calendar },
    { id: 'notices',     label: 'Notices',     Icon: Bell },
    { id: 'assignments', label: 'Assignments', Icon: ClipboardList },
    { id: 'marks',       label: 'Marks',       Icon: BarChart2 },
  ];

  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Manage Data</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>People, subjects, streams, enrollments, timetables and more.</p>
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
        <div className="portal-notice-grid">
          <div style={card}>
            <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Add Person</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><span style={lbl}>FULL NAME</span><input style={inp} value={uForm.name} onChange={e => setUForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Zanele Mthembu" /></div>
              <div><span style={lbl}>EMAIL</span><input style={inp} value={uForm.email} onChange={e => setUForm(f => ({ ...f, email: e.target.value }))} placeholder="email@sidelile.edu.za" /></div>
              <div><span style={lbl}>PASSWORD</span><input type="password" style={inp} value={uForm.password} onChange={e => setUForm(f => ({ ...f, password: e.target.value }))} placeholder="min 6 characters" /></div>
              <div><span style={lbl}>ROLE</span>
                <select style={{ ...inp, cursor: 'pointer' }} value={uForm.role} onChange={e => setUForm(f => ({ ...f, role: e.target.value }))}>
                  {['student', 'teacher', 'parent', 'admin'].map(r => <option key={r} value={r} style={{ background: S2 }}>{r}</option>)}
                </select>
              </div>
              {uForm.role === 'student' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div><span style={lbl}>GRADE</span>
                    <select style={{ ...inp, cursor: 'pointer' }} value={uForm.grade} onChange={e => setUForm(f => ({ ...f, grade: e.target.value }))}>
                      {ALL_GRADES.map(g => <option key={g} style={{ background: S2 }}>{g}</option>)}
                    </select>
                  </div>
                  <div><span style={lbl}>STREAM</span>
                    <select style={{ ...inp, cursor: 'pointer' }} value={uForm.stream} onChange={e => setUForm(f => ({ ...f, stream: e.target.value }))}>
                      {STREAMS.map(s => <option key={s} style={{ background: S2 }}>{s}</option>)}
                    </select>
                  </div>
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
              {users.map(u => {
                const classLabel = u.grade ? `${u.grade}${u.stream ? ' ' + u.stream : ''}` : null;
                const isEditing  = editingId === u.id;
                return (
                  <div key={u.id} style={{ borderRadius: 10, border: `1px solid ${isEditing ? GOLD_B : BORDER}`, overflow: 'hidden' }}>
                    {/* Main row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: S2, opacity: u.active ? 1 : 0.45, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>
                          {u.name} {!u.active && <span style={{ fontSize: 10, color: RED }}>(inactive)</span>}
                        </div>
                        <div style={{ fontSize: 11, color: FAINT }}>
                          {u.portalId} · {u.role}
                          {classLabel && <span style={{ color: GOLD, fontWeight: 600 }}> · {classLabel}</span>}
                          {' · '}{u.email}
                        </div>
                      </div>
                      {u.role === 'student' && (
                        <button
                          onClick={() => {
                            if (isEditing) { setEditingId(null); return; }
                            setEditGrade(u.grade ?? 'Grade 8');
                            setEditStream(u.stream ?? 'A');
                            setEditingId(u.id);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: isEditing ? GOLD_DIM : 'rgba(96,165,250,0.06)', border: `1px solid ${isEditing ? GOLD_B : 'rgba(96,165,250,0.20)'}`, color: GOLD, fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>
                          {isEditing ? '✕ Cancel' : '✎ Class'}
                        </button>
                      )}
                      {u.role === 'parent' && (
                        <button
                          onClick={() => {
                            if (linkingParentId === u.id) { setLinkingParentId(null); return; }
                            setLinkStudentId('');
                            setLinkingParentId(u.id);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: linkingParentId === u.id ? GOLD_DIM : 'rgba(96,165,250,0.06)', border: `1px solid ${linkingParentId === u.id ? GOLD_B : 'rgba(96,165,250,0.20)'}`, color: GOLD, fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>
                          {linkingParentId === u.id ? '✕ Cancel' : '🔗 Link Student'}
                        </button>
                      )}
                      <button onClick={() => toggleUser(u)} style={{ ...delBtn, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)', color: AMBER }}>
                        <Power size={12} />{u.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteUser(u)} style={delBtn}><Trash2 size={12} />Delete</button>
                    </div>

                    {/* Inline parent-link editor */}
                    {linkingParentId === u.id && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: GOLD_DIM, borderTop: `1px solid ${GOLD_B}`, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: GOLD, fontWeight: 600, flexShrink: 0 }}>Link to student:</span>
                        <select value={linkStudentId} onChange={e => setLinkStudentId(e.target.value)}
                          style={{ ...inp, flex: 1, minWidth: 200, cursor: 'pointer', borderColor: GOLD_B, background: S3 }}>
                          <option value="" style={{ background: S2 }}>— Remove link —</option>
                          {students.map(s => <option key={s.id} value={s.id} style={{ background: S2 }}>{s.name} ({s.portalId}){s.grade ? ` · ${s.grade}` : ''}</option>)}
                        </select>
                        <button onClick={() => linkParentToStudent(u)} disabled={busy}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9, background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13, fontWeight: 700, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1, flexShrink: 0 }}>
                          {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save Link
                        </button>
                      </div>
                    )}

                    {/* Inline class editor */}
                    {isEditing && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: GOLD_DIM, borderTop: `1px solid ${GOLD_B}`, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: GOLD, fontWeight: 600, flexShrink: 0 }}>Assign class:</span>
                        <select value={editGrade} onChange={e => setEditGrade(e.target.value)}
                          style={{ ...inp, width: 130, cursor: 'pointer', borderColor: GOLD_B, background: S3 }}>
                          {ALL_GRADES.map(g => <option key={g} style={{ background: S2 }}>{g}</option>)}
                        </select>
                        <select value={editStream} onChange={e => setEditStream(e.target.value)}
                          style={{ ...inp, width: 100, cursor: 'pointer', borderColor: GOLD_B, background: S3 }}>
                          {STREAMS.map(s => <option key={s} style={{ background: S2 }}>Stream {s}</option>)}
                        </select>
                        <button onClick={() => saveClass(u)} disabled={busy}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9, background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13, fontWeight: 700, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1, flexShrink: 0 }}>
                          {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
                        </button>
                        <span style={{ fontSize: 11, color: 'rgba(96,165,250,0.60)' }}>
                          → {editGrade} {editStream}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBJECTS ── */}
      {tab === 'subjects' && (
        <div className="portal-notice-grid">
          <div style={card}>
            <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Add Subject</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><span style={lbl}>NAME</span><input style={inp} value={sForm.name} onChange={e => setSForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Accounting" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><span style={lbl}>CODE</span><input style={inp} value={sForm.code} onChange={e => setSForm(f => ({ ...f, code: e.target.value }))} placeholder="acc" /></div>
                <div><span style={lbl}>SHORT</span><input style={inp} value={sForm.short} onChange={e => setSForm(f => ({ ...f, short: e.target.value }))} placeholder="ACC" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><span style={lbl}>COLOR</span><input type="color" style={{ ...inp, padding: 4, height: 38, cursor: 'pointer' }} value={sForm.color} onChange={e => setSForm(f => ({ ...f, color: e.target.value }))} /></div>
                <div><span style={lbl}>ROOM</span><input style={inp} value={sForm.room} onChange={e => setSForm(f => ({ ...f, room: e.target.value }))} placeholder="B-102" /></div>
              </div>
              <div><span style={lbl}>TEACHER</span>
                <select style={{ ...inp, cursor: 'pointer' }} value={sForm.teacherPortalId} onChange={e => setSForm(f => ({ ...f, teacherPortalId: e.target.value }))}>
                  <option value="" style={{ background: S2 }}>— Unassigned —</option>
                  {teachers.map(t => <option key={t.portalId} value={t.portalId} style={{ background: S2 }}>{t.name} ({t.portalId})</option>)}
                </select>
              </div>
              <div>
                <span style={lbl}>APPLIES TO GRADES (optional)</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ALL_GRADES.map(g => {
                    const checked = sForm.grades.includes(g);
                    return (
                      <button key={g} type="button"
                        onClick={() => setSForm(f => ({ ...f, grades: checked ? f.grades.filter(x => x !== g) : [...f.grades, g] }))}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', border: `1px solid ${checked ? GOLD + '60' : BORDER}`, background: checked ? GOLD_DIM : 'transparent', color: checked ? GOLD : MUTED, fontSize: 12, fontWeight: 600 }}>
                        {checked ? <CheckSquare size={12} /> : <Square size={12} />}{g}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={createSubject} disabled={busy} style={{ ...goldBtn, opacity: busy ? 0.6 : 1, justifyContent: 'center' }}>
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Subject
              </button>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Subjects ({subjects.length})</h3>
            <p style={{ fontSize: 12, color: FAINT, margin: '0 0 14px' }}>After creating a subject, go to <strong style={{ color: MUTED }}>Enrollments</strong> to assign it to class streams.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {subjects.map(s => (
                <div key={s.id} style={row}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: TEXT }}>{s.name} <span style={{ color: FAINT, fontSize: 11 }}>({s.short})</span></div>
                    <div style={{ fontSize: 11, color: FAINT }}>
                      {s.teacherName ?? 'No teacher'} · Room {s.room ?? '—'} · {s.enrollments} learners · {s.marks} marks
                      {s.grades ? ` · ${s.grades}` : ''}
                    </div>
                  </div>
                  <button onClick={() => deleteSubject(s)} style={delBtn}><Trash2 size={12} />Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ENROLLMENTS ── */}
      {tab === 'enrollments' && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 4px' }}>Stream Enrollment Manager</h3>
              <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>Pick a class stream and toggle which subjects they take.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={enrGrade} onChange={e => setEnrGrade(e.target.value)}
                style={{ ...inp, width: 130, cursor: 'pointer' }}>
                {ALL_GRADES.map(g => <option key={g} style={{ background: S2 }}>{g}</option>)}
              </select>
              <select value={enrStream} onChange={e => setEnrStream(e.target.value)}
                style={{ ...inp, width: 100, cursor: 'pointer' }}>
                {STREAMS.map(s => <option key={s} style={{ background: S2 }}>Stream {s}</option>)}
              </select>
              <button onClick={loadEnrollments} disabled={enrBusy}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13, fontWeight: 700, cursor: enrBusy ? 'default' : 'pointer', opacity: enrBusy ? 0.7 : 1 }}>
                {enrBusy ? <Loader2 size={13} className="animate-spin" /> : <Link2 size={13} />}
                Load {enrGrade} {enrStream}
              </button>
            </div>
          </div>

          {enrStudents.length === 0 && !enrBusy && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: MUTED, fontSize: 13 }}>
              No students in {enrGrade} Stream {enrStream}.<br />
              <span style={{ fontSize: 12, color: FAINT }}>Add students in the People tab first.</span>
            </div>
          )}

          {enrStudents.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
                <strong style={{ color: TEXT }}>{enrStudents.length}</strong> student{enrStudents.length !== 1 ? 's' : ''} in {enrGrade} Stream {enrStream}
              </div>

              {/* Subject enrollment matrix */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {enrSubjects.map(subj => {
                  const enrolled = countEnrolled(subj.id);
                  const total    = enrStudents.length;
                  const allIn    = enrolled === total;
                  const someIn   = enrolled > 0 && enrolled < total;
                  const barPct   = Math.round((enrolled / total) * 100);

                  return (
                    <div key={subj.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: S2, borderRadius: 12, border: `1px solid ${allIn ? subj.color + '40' : BORDER}` }}>
                      <div style={{ width: 3, height: 36, borderRadius: 2, background: subj.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                          {subj.name}
                          <span style={{ fontSize: 11, color: FAINT, fontWeight: 400, marginLeft: 8 }}>{subj.short}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${barPct}%`, background: allIn ? subj.color : someIn ? subj.color + '88' : 'transparent', borderRadius: 2, transition: 'width 0.4s ease' }} />
                          </div>
                          <span style={{ fontSize: 11, color: allIn ? subj.color : MUTED, fontWeight: 600, flexShrink: 0 }}>
                            {enrolled}/{total}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button
                          disabled={enrBusy || allIn}
                          onClick={() => enrollStream(subj.id)}
                          style={{ padding: '7px 14px', borderRadius: 8, cursor: enrBusy || allIn ? 'default' : 'pointer', background: allIn ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.12)', border: `1px solid ${allIn ? 'rgba(16,185,129,0.30)' : 'rgba(16,185,129,0.40)'}`, color: GREEN, fontSize: 12, fontWeight: 600, opacity: allIn ? 0.5 : 1 }}>
                          {allIn ? '✓ Enrolled' : 'Enroll All'}
                        </button>
                        <button
                          disabled={enrBusy || enrolled === 0}
                          onClick={() => unenrollStream(subj.id)}
                          style={{ padding: '7px 14px', borderRadius: 8, cursor: enrBusy || enrolled === 0 ? 'default' : 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: RED, fontSize: 12, fontWeight: 600, opacity: enrolled === 0 ? 0.4 : 1 }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Individual student breakdown */}
              <details style={{ marginTop: 20 }}>
                <summary style={{ fontSize: 12, color: MUTED, cursor: 'pointer', userSelect: 'none', padding: '8px 0' }}>
                  View per-student breakdown
                </summary>
                <div style={{ marginTop: 12, overflowX: 'auto' }}>
                  <table style={{ borderCollapse: 'separate', borderSpacing: 4, width: '100%', minWidth: 600 }}>
                    <thead>
                      <tr>
                        <th style={{ fontSize: 10, color: FAINT, fontWeight: 600, textAlign: 'left', padding: '4px 8px' }}>STUDENT</th>
                        {enrSubjects.map(s => (
                          <th key={s.id} title={s.name} style={{ fontSize: 10, color: FAINT, fontWeight: 600, textAlign: 'center', padding: '4px 6px', maxWidth: 60, overflow: 'hidden' }}>
                            <div style={{ width: 3, height: 14, background: s.color, borderRadius: 2, margin: '0 auto 2px' }} />
                            {s.short}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {enrStudents.map(st => (
                        <tr key={st.id}>
                          <td style={{ fontSize: 12, color: TEXT, padding: '6px 8px', whiteSpace: 'nowrap' }}>
                            {st.name}<br /><span style={{ fontSize: 10, color: FAINT }}>{st.portalId}</span>
                          </td>
                          {enrSubjects.map(subj => {
                            const enrolled = isEnrolled(st.id, subj.id);
                            return (
                              <td key={subj.id} style={{ textAlign: 'center', padding: '4px 6px' }}>
                                <button
                                  onClick={async () => {
                                    setEnrBusy(true);
                                    if (enrolled) {
                                      const res = await fetch(`/api/admin/enrollments?studentId=${st.id}&subjectId=${subj.id}`, { method: 'DELETE' });
                                      if (res.ok) { const ns = new Set(enrolledSet); ns.delete(`${st.id}:${subj.id}`); setEnrolledSet(ns); }
                                    } else {
                                      const res = await fetch('/api/admin/enrollments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentIds: [st.id], subjectIds: [subj.id] }) });
                                      if (res.ok) { const ns = new Set(enrolledSet); ns.add(`${st.id}:${subj.id}`); setEnrolledSet(ns); }
                                    }
                                    setEnrBusy(false);
                                  }}
                                  style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${enrolled ? subj.color + '50' : BORDER}`, background: enrolled ? subj.color + '22' : 'transparent', cursor: 'pointer', color: enrolled ? subj.color : FAINT, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                  {enrolled ? '✓' : '·'}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}
        </div>
      )}

      {/* ── TIMETABLE ── */}
      {tab === 'timetable' && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: 0 }}>Timetable Builder</h3>
              <select style={{ ...inp, width: 150, cursor: 'pointer' }} value={ttGrade} onChange={e => { setTtGrade(e.target.value); loadTimetable(e.target.value); }}>
                {ALL_GRADES.map(g => <option key={g} style={{ background: S2 }}>{g}</option>)}
              </select>
            </div>
            <button onClick={saveTimetable} disabled={busy} style={{ ...goldBtn, opacity: busy ? 0.6 : 1 }}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save {ttGrade}
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
                    <td style={{ fontSize: 11, color: FAINT, padding: '4px 8px', whiteSpace: 'nowrap' }}>P{pt.period}<br />{pt.time}–{pt.endTime}</td>
                    {DAYS.map(d => {
                      const key = `${d}-${pt.period}`;
                      const code = grid[key] ?? '';
                      const subj = subjects.find(s => s.code === code);
                      return (
                        <td key={key}>
                          <select value={code} onChange={e => setGrid(g => ({ ...g, [key]: e.target.value }))}
                            style={{ ...inp, cursor: 'pointer', fontSize: 12, padding: '8px 8px', borderColor: subj ? subj.color + '55' : BORDER, background: subj ? subj.color + '14' : S2 }}>
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
          <p style={{ fontSize: 11.5, color: FAINT, marginTop: 12 }}>Pick a subject for each slot, then Save. Saving replaces the whole grade's timetable.</p>
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
            {notices.length === 0 && <p style={{ fontSize: 13, color: MUTED }}>No notices yet.</p>}
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
            {assignments.length === 0 && <p style={{ fontSize: 13, color: MUTED }}>No assignments yet.</p>}
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
