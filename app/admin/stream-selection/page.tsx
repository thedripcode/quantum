'use client';

import { useState, useRef } from 'react';
import {
  CheckCircle2, ChevronDown, AlertTriangle, Bell, Users, Lock, Unlock,
} from 'lucide-react';
import { STREAM_STUDENTS, ADMIN_CLASSES, type StreamStudent } from '@/data/adminData';

const BG       = '#0C0C0C';
const SURFACE  = '#161616';
const S2       = '#1E1E1E';
const S3       = '#272727';
const GOLD     = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.10)';
const GOLD_B   = 'rgba(201,168,76,0.22)';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#FFFFFF';
const MUTED    = 'rgba(255,255,255,0.50)';
const FAINT    = 'rgba(255,255,255,0.22)';
const GREEN    = '#10B981';
const RED      = '#EF4444';
const AMBER    = '#F59E0B';
const BLUE     = '#3B82F6';
const PURPLE   = '#8B5CF6';
const FH       = "'Bricolage Grotesque', sans-serif";
const FB       = "'Inter', sans-serif";

type LocalStudent = StreamStudent & { assignedClass: string | null };

// Grade-10 classes from adminData
const GRADE10_CLASSES = ADMIN_CLASSES.filter(c => c.grade === 10);

function markColor(v: number) { return v >= 75 ? GREEN : v >= 60 ? AMBER : RED; }

// ─── 3-step confirm dialog ───────────────────────────────────────────────────
function FinaliseDialog({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { title: 'Are you sure?',          body: 'You are about to finalise stream selection for all 15 Grade 9 students. This will lock their class assignments.' },
    { title: 'This is permanent.',     body: 'Once finalised, stream assignments cannot be changed without a subject-change request. Students will be notified.' },
    { title: 'Confirmed.',             body: 'Stream selection has been finalised. Welcome emails will be sent and timetables updated.' },
  ];
  const current = steps[step];
  const isLast = step === steps.length - 1;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, width: 400, maxWidth: '92vw', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
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
              <button onClick={onCancel} style={{ flex: 1, padding: '10px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 9999, color: MUTED, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
                Cancel
              </button>
              <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, padding: '10px', background: GOLD, border: 'none', borderRadius: 9999, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>
                Continue →
              </button>
            </>
          ) : (
            <button onClick={onDone} style={{ flex: 1, padding: '10px', background: GREEN, border: 'none', borderRadius: 9999, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function StreamSelectionPage() {
  const [students, setStudents] = useState<LocalStudent[]>(STREAM_STUDENTS as LocalStudent[]);
  const [selectionOpen, setSelectionOpen] = useState(true);
  const [deadline, setDeadline] = useState('2025-10-20');
  const [notified, setNotified] = useState(false);
  const [showFinalise, setShowFinalise] = useState(false);
  const [finalised, setFinalised] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const assignedCount = students.filter(s => s.assignedClass !== null).length;
  const allAssigned = assignedCount === students.length;

  function assignStudent(id: string, cls: string) {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, assignedClass: cls || null, status: cls ? 'assigned' : 'pending' } : s));
  }

  function autoAssignAll() {
    setStudents(prev => prev.map(s => ({ ...s, assignedClass: s.recommended, status: 'assigned' as const })));
  }

  function handleFinalise() {
    setFinalised(true);
    setShowFinalise(false);
    setSelectionOpen(false);
  }

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>
            Stream Selection
          </h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Grade 9 → Grade 10 · Academic Year 2025</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: selectionOpen ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)', border: `1px solid ${selectionOpen ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.28)'}`, borderRadius: 9 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: selectionOpen ? GREEN : RED }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: selectionOpen ? GREEN : RED }}>
              {selectionOpen ? 'Selection Open' : 'Selection Closed'}
            </span>
          </div>

          {/* Toggle open/closed */}
          <button
            onClick={() => setSelectionOpen(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}
          >
            {selectionOpen ? <Lock size={12} /> : <Unlock size={12} />}
            {selectionOpen ? 'Close Selection' : 'Open Selection'}
          </button>

          {/* Deadline */}
          {selectionOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '6px 12px' }}>
              <span style={{ fontSize: 11, color: MUTED }}>Deadline:</span>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB, cursor: 'pointer' }}
              />
            </div>
          )}

          {/* Notify button */}
          <button
            onClick={() => setNotified(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: notified ? 'rgba(16,185,129,0.12)' : GOLD_DIM, border: `1px solid ${notified ? 'rgba(16,185,129,0.28)' : GOLD_B}`, borderRadius: 9, color: notified ? GREEN : GOLD, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FB, transition: 'all .2s' }}
          >
            {notified ? <CheckCircle2 size={12} /> : <Bell size={12} />}
            {notified ? 'Notified' : 'Notify All Grade 9'}
          </button>
        </div>
      </div>

      {/* Stream capacity cards — 5 col */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {GRADE10_CLASSES.map(cls => {
          const assignedHere = students.filter(s => s.assignedClass === cls.name).length;
          const pct = cls.capacity > 0 ? (cls.studentCount / cls.capacity) * 100 : 0;
          const STREAM_COLOR: Record<string, string> = {
            'Pure Sciences': BLUE,
            'Applied Sciences': GREEN,
            'Commerce': AMBER,
            'Humanities': PURPLE,
            'General': MUTED,
          };
          const col = STREAM_COLOR[cls.stream] ?? GOLD;
          return (
            <div key={cls.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontFamily: FH, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 2 }}>{cls.name}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: col, marginBottom: 8 }}>{cls.stream}</div>
              <div style={{ fontSize: 10, color: FAINT, marginBottom: 10, lineHeight: 1.7 }}>
                {cls.subjects.slice(0, 3).join(', ')}
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct > 90 ? RED : col, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: MUTED }}>{cls.studentCount}/{cls.capacity}</span>
                {assignedHere > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: GOLD }}>+{assignedHere} assigned</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 20px', marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={14} style={{ color: GOLD }} />
            <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{assignedCount} of {students.length} students assigned</span>
          </div>
          <span style={{ fontFamily: FH, fontSize: 14, fontWeight: 800, color: GOLD }}>
            {Math.round((assignedCount / students.length) * 100)}%
          </span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(assignedCount / students.length) * 100}%`, background: allAssigned ? GREEN : GOLD, borderRadius: 3, transition: 'width .4s ease' }} />
        </div>
      </div>

      {/* Auto-assign button */}
      {selectionOpen && !finalised && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <button
            onClick={autoAssignAll}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}
          >
            <CheckCircle2 size={12} style={{ color: GREEN }} />
            Auto-Assign All (Recommended)
          </button>
        </div>
      )}

      {/* Students table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 120px 130px 160px 100px', padding: '10px 16px', borderBottom: `1px solid ${BORDER}` }}>
          {['Student', 'Maths', 'Science', 'Pref 1', 'Recommended', 'Assign', 'Status'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {students.map((s, i) => {
          const recommended = GRADE10_CLASSES.find(c => c.name === s.recommended);
          const assigned = GRADE10_CLASSES.find(c => c.name === s.assignedClass);
          const mismatch = s.assignedClass && s.assignedClass !== s.recommended;
          const STREAM_COLOR: Record<string, string> = {
            'Pure Sciences': BLUE, 'Applied Sciences': GREEN, 'Commerce': AMBER, 'Humanities': PURPLE, 'General': MUTED,
          };
          const recColor = recommended ? (STREAM_COLOR[recommended.stream] ?? GOLD) : GOLD;

          return (
            <div
              key={s.id}
              style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 120px 130px 160px 100px', alignItems: 'center', padding: '0 16px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)`, background: hoveredRow === s.id ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background .1s' }}
              onMouseEnter={() => setHoveredRow(s.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Student */}
              <div style={{ padding: '12px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{s.firstName} {s.lastName}</div>
                <div style={{ fontSize: 10, color: FAINT, fontFamily: 'monospace' }}>{s.studentNumber}</div>
              </div>

              {/* Maths */}
              <div style={{ fontSize: 13, fontWeight: 700, color: markColor(s.mathsMark) }}>{s.mathsMark}%</div>

              {/* Science */}
              <div style={{ fontSize: 13, fontWeight: 700, color: markColor(s.scienceMark) }}>{s.scienceMark}%</div>

              {/* Pref 1 */}
              <div style={{ fontSize: 11, color: MUTED, paddingRight: 8 }}>{s.pref1}</div>

              {/* Recommended */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: recColor, background: recColor + '18', border: `1px solid ${recColor}33`, padding: '3px 10px', borderRadius: 6 }}>
                  {s.recommended}
                </span>
              </div>

              {/* Assign dropdown */}
              <div style={{ padding: '10px 0', position: 'relative' }}>
                {finalised ? (
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.assignedClass ? GREEN : RED }}>
                    {s.assignedClass ?? 'Not assigned'}
                  </span>
                ) : (
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                    <select
                      value={s.assignedClass ?? ''}
                      onChange={e => assignStudent(s.id, e.target.value)}
                      disabled={!selectionOpen}
                      style={{ width: '100%', padding: '6px 28px 6px 10px', background: S2, border: `1px solid ${s.assignedClass ? (mismatch ? AMBER + '55' : GREEN + '44') : BORDER}`, borderRadius: 8, color: s.assignedClass ? TEXT : MUTED, fontSize: 12, appearance: 'none', cursor: selectionOpen ? 'pointer' : 'default', fontFamily: FB, outline: 'none' }}
                    >
                      <option value="">— Assign —</option>
                      {GRADE10_CLASSES.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.stream})</option>
                      ))}
                    </select>
                    <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: FAINT, pointerEvents: 'none' }} />
                  </div>
                )}
                {mismatch && !finalised && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <AlertTriangle size={10} style={{ color: AMBER }} />
                    <span style={{ fontSize: 9, color: AMBER }}>Differs from recommended</span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                  background: s.status === 'assigned' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                  color: s.status === 'assigned' ? GREEN : AMBER,
                }}>
                  {s.status === 'assigned' ? <CheckCircle2 size={9} /> : null}
                  {s.status === 'assigned' ? 'Assigned' : 'Pending'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Finalise button */}
      {!finalised && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { if (allAssigned) setShowFinalise(true); }}
            disabled={!allAssigned}
            style={{
              padding: '11px 28px', background: allAssigned ? GOLD : 'rgba(201,168,76,0.15)',
              border: 'none', borderRadius: 9999, color: allAssigned ? '#000' : 'rgba(201,168,76,0.35)',
              fontSize: 13, fontWeight: 800, cursor: allAssigned ? 'pointer' : 'default', fontFamily: FH,
              transition: 'background .2s',
            }}
          >
            Finalise Stream Selection
          </button>
        </div>
      )}

      {finalised && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14 }}>
          <CheckCircle2 size={16} style={{ color: GREEN }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Stream selection has been finalised and locked.</span>
        </div>
      )}

      {/* Finalise confirm dialog */}
      {showFinalise && (
        <FinaliseDialog onDone={handleFinalise} onCancel={() => setShowFinalise(false)} />
      )}
    </div>
  );
}
