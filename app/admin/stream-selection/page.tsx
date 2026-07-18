'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2, ChevronDown, AlertTriangle, Bell, Users, Lock, Unlock,
} from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E', S3 = '#1A3049';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6', PURPLE = '#8B5CF6';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

const GRADE10_STREAMS = [
  { name: '10A', stream: 'Pure Sciences',     subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences', 'IT'],        capacity: 35 },
  { name: '10B', stream: 'Applied Sciences',  subjects: ['Mathematics', 'Life Sciences', 'Business', 'Geography'],           capacity: 35 },
  { name: '10C', stream: 'Commerce',          subjects: ['Mathematics', 'Accounting', 'Business', 'Economics'],              capacity: 35 },
  { name: '10D', stream: 'Humanities',        subjects: ['Mathematics', 'History', 'Geography', 'Consumer Studies'],         capacity: 35 },
  { name: '10E', stream: 'General',           subjects: ['Mathematics', 'Consumer Studies', 'Business'],                     capacity: 35 },
];
const STREAM_COLOR: Record<string, string> = {
  'Pure Sciences': BLUE, 'Applied Sciences': GREEN, 'Commerce': AMBER, 'Humanities': PURPLE, 'General': MUTED,
};

function markColor(v: number) { return v >= 75 ? GREEN : v >= 60 ? AMBER : RED; }

function FinaliseDialog({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { title: 'Are you sure?',      body: 'You are about to finalise stream selection. This will update all Grade 9 students\' stream assignments.' },
    { title: 'This is permanent.', body: 'Once finalised, stream assignments cannot be changed without a subject-change request. Students will be notified.' },
    { title: 'Confirmed.',         body: 'Stream selection has been finalised. Timetables will be updated.' },
  ];
  const current = steps[step];
  const isLast = step === steps.length - 1;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, width: 400, maxWidth: '92vw' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? GOLD : 'rgba(255,255,255,0.10)', transition: 'background .3s' }} />
          ))}
        </div>
        <div style={{ fontFamily: FH, fontSize: 17, fontWeight: 800, color: TEXT, marginBottom: 10 }}>{current.title}</div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>{current.body}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {!isLast ? (
            <>
              <button onClick={onCancel} style={{ flex: 1, padding: 10, background: 'none', border: `1px solid ${BORDER}`, borderRadius: 9999, color: MUTED, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>Cancel</button>
              <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, padding: 10, background: GOLD, border: 'none', borderRadius: 9999, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>Continue →</button>
            </>
          ) : (
            <button onClick={onDone} style={{ flex: 1, padding: 10, background: GREEN, border: 'none', borderRadius: 9999, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>Done</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StreamSelectionPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectionOpen, setSelectionOpen] = useState(true);
  const [deadline, setDeadline] = useState('2025-10-20');
  const [notified, setNotified] = useState(false);
  const [showFinalise, setShowFinalise] = useState(false);
  const [finalised, setFinalised] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/marks').then(r => r.json()),
    ]).then(([u, m]) => {
      const grade9 = (u.users ?? []).filter((s: any) => s.role === 'student' && s.grade === 'Grade 9');
      setStudents(grade9);
      setMarks(m.marks ?? []);
      // Pre-fill assignments from stream field
      const init: Record<string, string> = {};
      grade9.forEach((s: any) => { if (s.stream) init[s.id] = s.stream; });
      setAssignments(init);
    }).finally(() => setLoading(false));
  }, []);

  function getAvg(student: any, subjectKeyword?: string) {
    const sm = marks.filter((m: any) => m.studentPortalId === student.portalId && (!subjectKeyword || m.subjectName?.toLowerCase().includes(subjectKeyword)));
    if (!sm.length) return null;
    return Math.round(sm.reduce((x: number, m: any) => x + (m.score / m.total) * 100, 0) / sm.length);
  }

  function recommend(student: any): string {
    const maths = getAvg(student, 'math');
    const science = getAvg(student, 'science');
    if (maths !== null && maths >= 70 && science !== null && science >= 70) return '10A';
    if (maths !== null && maths >= 60) return '10B';
    const overall = getAvg(student);
    if (overall !== null && overall >= 60) return '10C';
    return '10D';
  }

  const assignedCount = Object.keys(assignments).length;
  const allAssigned = assignedCount === students.length && students.length > 0;

  async function handleFinalise() {
    setSaving(true);
    await Promise.all(
      Object.entries(assignments).map(([id, stream]) =>
        fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, stream }),
        })
      )
    );
    setSaving(false);
    setFinalised(true);
    setShowFinalise(false);
    setSelectionOpen(false);
  }

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Stream Selection</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Grade 9 → Grade 10 · Academic Year 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: selectionOpen ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)', border: `1px solid ${selectionOpen ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.28)'}`, borderRadius: 9 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: selectionOpen ? GREEN : RED }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: selectionOpen ? GREEN : RED }}>{selectionOpen ? 'Selection Open' : 'Selection Closed'}</span>
          </div>
          <button onClick={() => setSelectionOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
            {selectionOpen ? <><Lock size={12} /> Close</> : <><Unlock size={12} /> Open</>}
          </button>
          {selectionOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '6px 12px' }}>
              <span style={{ fontSize: 11, color: MUTED }}>Deadline:</span>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB, cursor: 'pointer' }} />
            </div>
          )}
          <button onClick={() => setNotified(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: notified ? 'rgba(16,185,129,0.12)' : GOLD_DIM, border: `1px solid ${notified ? 'rgba(16,185,129,0.28)' : GOLD_B}`, borderRadius: 9, color: notified ? GREEN : GOLD, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>
            {notified ? <CheckCircle2 size={12} /> : <Bell size={12} />}
            {notified ? 'Notified' : 'Notify All Grade 9'}
          </button>
        </div>
      </div>

      {/* Stream capacity cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
        {GRADE10_STREAMS.map(cls => {
          const assignedHere = Object.values(assignments).filter(v => v === cls.name).length;
          const col = STREAM_COLOR[cls.stream] ?? GOLD;
          return (
            <div key={cls.name} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontFamily: FH, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 2 }}>{cls.name}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: col, marginBottom: 8 }}>{cls.stream}</div>
              <div style={{ fontSize: 10, color: FAINT, marginBottom: 10, lineHeight: 1.7 }}>{cls.subjects.slice(0, 3).join(', ')}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: assignedHere > 0 ? col : FAINT }}>
                {assignedHere} assigned
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      {!loading && students.length > 0 && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 20px', marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={14} style={{ color: GOLD }} />
              <span style={{ fontSize: 13, color: MUTED }}>{assignedCount} of {students.length} students assigned</span>
            </div>
            <span style={{ fontFamily: FH, fontSize: 14, fontWeight: 800, color: GOLD }}>{Math.round((assignedCount / students.length) * 100)}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(assignedCount / students.length) * 100}%`, background: allAssigned ? GREEN : GOLD, borderRadius: 3, transition: 'width .4s ease' }} />
          </div>
        </div>
      )}

      {/* Auto-assign */}
      {selectionOpen && !finalised && !loading && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <button
            onClick={() => {
              const init: Record<string, string> = {};
              students.forEach(s => { init[s.id] = recommend(s); });
              setAssignments(init);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}
          >
            <CheckCircle2 size={12} style={{ color: GREEN }} />
            Auto-Assign All (Recommended)
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p style={{ color: MUTED, fontSize: 14 }}>Loading Grade 9 students…</p>
      ) : students.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED }}>
          <Users size={28} style={{ marginBottom: 10, opacity: 0.4 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No Grade 9 students found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Add students to Grade 9 via User Management.</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: 20 }}>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', minWidth: 680 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 150px 130px 100px', padding: '10px 16px', borderBottom: `1px solid ${BORDER}` }}>
            {['Student', 'Maths', 'Overall', 'Recommended', 'Assign', 'Status'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>
          {students.map((s, i) => {
            const maths = getAvg(s, 'math');
            const overall = getAvg(s);
            const rec = recommend(s);
            const assigned = assignments[s.id];
            const mismatch = assigned && assigned !== rec;
            const recCol = STREAM_COLOR[GRADE10_STREAMS.find(c => c.name === rec)?.stream ?? ''] ?? GOLD;
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 150px 130px 100px', alignItems: 'center', padding: '0 16px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)` }}>
                <div style={{ padding: '12px 0' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: FAINT, fontFamily: 'monospace' }}>{s.portalId}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: maths !== null ? markColor(maths) : FAINT }}>{maths !== null ? `${maths}%` : '—'}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: overall !== null ? markColor(overall) : FAINT }}>{overall !== null ? `${overall}%` : '—'}</div>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: recCol, background: recCol + '18', border: `1px solid ${recCol}33`, padding: '3px 10px', borderRadius: 6 }}>{rec}</span>
                </div>
                <div style={{ padding: '10px 0', position: 'relative' }}>
                  {finalised ? (
                    <span style={{ fontSize: 12, fontWeight: 600, color: assigned ? GREEN : RED }}>{assigned ?? 'Not assigned'}</span>
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                      <select
                        value={assigned ?? ''}
                        onChange={e => setAssignments(prev => ({ ...prev, [s.id]: e.target.value }))}
                        disabled={!selectionOpen}
                        style={{ width: '100%', padding: '6px 24px 6px 8px', background: S2, border: `1px solid ${assigned ? (mismatch ? AMBER + '55' : GREEN + '44') : BORDER}`, borderRadius: 8, color: assigned ? TEXT : MUTED, fontSize: 12, appearance: 'none', cursor: selectionOpen ? 'pointer' : 'default', fontFamily: FB, outline: 'none' }}
                      >
                        <option value="">— Assign —</option>
                        {GRADE10_STREAMS.map(c => (
                          <option key={c.name} value={c.name}>{c.name} ({c.stream})</option>
                        ))}
                      </select>
                      <ChevronDown size={11} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', color: FAINT, pointerEvents: 'none' }} />
                    </div>
                  )}
                  {mismatch && !finalised && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <AlertTriangle size={10} style={{ color: AMBER }} />
                      <span style={{ fontSize: 9, color: AMBER }}>Differs from recommended</span>
                    </div>
                  )}
                </div>
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: assigned ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: assigned ? GREEN : AMBER }}>
                    {assigned ? <CheckCircle2 size={9} /> : null}
                    {assigned ? 'Assigned' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}

      {/* Finalise */}
      {!finalised && students.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { if (allAssigned) setShowFinalise(true); }}
            disabled={!allAssigned || saving}
            style={{ padding: '11px 28px', background: allAssigned ? GOLD : 'rgba(96,165,250,0.15)', border: 'none', borderRadius: 9999, color: allAssigned ? '#000' : 'rgba(96,165,250,0.35)', fontSize: 13, fontWeight: 800, cursor: allAssigned ? 'pointer' : 'default', fontFamily: FH }}
          >
            {saving ? 'Saving…' : 'Finalise Stream Selection'}
          </button>
        </div>
      )}

      {finalised && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14 }}>
          <CheckCircle2 size={16} style={{ color: GREEN }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Stream selection has been finalised and saved to the database.</span>
        </div>
      )}

      {showFinalise && <FinaliseDialog onDone={handleFinalise} onCancel={() => setShowFinalise(false)} />}
    </div>
  );
}
