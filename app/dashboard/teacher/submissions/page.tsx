'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Clock, FileCheck, Loader2, Save, ChevronDown, ChevronUp } from 'lucide-react';

const BG = '#081420'; const S2 = '#0F2032'; const S3 = '#14283E';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const FH = "'Roboto Condensed', sans-serif"; const FB = "'Inter', sans-serif";
const GOLD = '#60a5fa'; const GOLD_DIM = 'rgba(96,165,250,0.08)'; const GOLD_B = 'rgba(96,165,250,0.22)';
const GREEN = '#10B981'; const AMBER = '#F59E0B'; const BLUE = '#3B82F6'; const RED = '#EF4444';

interface Submission {
  id: string; assignmentId: string; assignmentTitle: string; assignmentTotal: number; assignmentDue: string;
  subjectName: string; subjectShort: string; subjectColor: string;
  student: { id: string; name: string; portalId: string; grade: string | null; stream: string | null };
  submittedDate: string | null; mark: number | null; pct: number | null; feedback: string | null; status: string;
}

function statusInfo(s: Submission) {
  if (s.status === 'graded')    return { label: 'Graded',    color: GREEN, bg: 'rgba(16,185,129,0.10)',  Icon: CheckCircle2 };
  if (s.status === 'submitted') return { label: 'Submitted', color: BLUE,  bg: 'rgba(59,130,246,0.10)', Icon: FileCheck    };
  return                               { label: 'Pending',   color: AMBER, bg: 'rgba(245,158,11,0.10)', Icon: Clock        };
}

function SubmissionRow({ sub, onGraded }: { sub: Submission; onGraded: () => void }) {
  const [open, setOpen]         = useState(false);
  const [mark, setMark]         = useState(String(sub.mark ?? ''));
  const [feedback, setFeedback] = useState(sub.feedback ?? '');
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const { label, color, bg, Icon } = statusInfo(sub);
  const inp: React.CSSProperties = { background: S3, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '8px 12px', color: TEXT, fontFamily: FB, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' };

  const save = async () => {
    if (!mark.trim() || isNaN(Number(mark))) return;
    setSaving(true);
    const res = await fetch('/api/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId: sub.id, mark: Number(mark), feedback }),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); onGraded(); }
  };

  const initials = sub.student.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const classLabel = sub.student.grade ? `${sub.student.grade}${sub.student.stream ? ' ' + sub.student.stream : ''}` : '';

  return (
    <div style={{ borderRadius: 12, border: `1px solid ${open ? GOLD_B : BORDER}`, overflow: 'hidden', marginBottom: 8 }}>
      {/* Row header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', background: S2, cursor: 'pointer', flexWrap: 'wrap' }}
      >
        {/* Avatar */}
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: TEXT, flexShrink: 0 }}>
          {initials}
        </div>
        {/* Student info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{sub.student.name}</div>
          <div style={{ fontSize: 11, color: FAINT }}>{sub.student.portalId}{classLabel ? ` · ${classLabel}` : ''}</div>
        </div>
        {/* Submitted date */}
        <div className="hide-mobile" style={{ fontSize: 11, color: MUTED, marginRight: 8 }}>
          {sub.submittedDate ? `Submitted ${sub.submittedDate}` : 'Not submitted'}
        </div>
        {/* Mark badge */}
        {sub.mark != null && (
          <div style={{ padding: '3px 10px', borderRadius: 6, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>
            {sub.mark}/{sub.assignmentTotal} ({sub.pct}%)
          </div>
        )}
        {/* Status */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 6, background: bg, flexShrink: 0 }}>
          <Icon size={11} style={{ color }} />
          <span style={{ fontSize: 11, fontWeight: 600, color }}>{label}</span>
        </div>
        {open ? <ChevronUp size={14} style={{ color: MUTED }} /> : <ChevronDown size={14} style={{ color: MUTED }} />}
      </div>

      {/* Expanded grading panel */}
      {open && (
        <div style={{ padding: '16px 18px', background: S3, borderTop: `1px solid ${BORDER}` }}>
          {sub.submittedDate ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'start' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: FAINT, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Mark (out of {sub.assignmentTotal})
                  </label>
                  <input
                    type="number" min={0} max={sub.assignmentTotal}
                    value={mark} onChange={e => setMark(e.target.value)}
                    style={{ ...inp, width: 110 }}
                    placeholder={`0–${sub.assignmentTotal}`}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: FAINT, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Feedback (optional)
                  </label>
                  <textarea
                    value={feedback} onChange={e => setFeedback(e.target.value)}
                    rows={3}
                    style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }}
                    placeholder="Well done! / Needs improvement on…"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={save} disabled={saving || !mark.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 10, background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13, fontWeight: 700, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  {saving ? 'Saving…' : 'Save Grade'}
                </button>
                {saved && <span style={{ fontSize: 12, color: GREEN }}>✓ Grade saved</span>}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
              This student has not submitted yet. You can still enter a mark below if needed.
            </p>
          )}
          {!sub.submittedDate && (
            <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: FAINT, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mark</label>
                <input type="number" min={0} max={sub.assignmentTotal} value={mark} onChange={e => setMark(e.target.value)} style={{ ...inp, width: 110 }} />
              </div>
              <button onClick={save} disabled={saving || !mark.trim()} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 10, background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13, fontWeight: 700, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
              </button>
              {saved && <span style={{ fontSize: 12, color: GREEN }}>✓ Saved</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [assignment, setAssignment]   = useState<string>('all');

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/submissions').then(r => r.json()).then(d => { setSubmissions(d.submissions ?? []); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  // Group by assignment
  const assignmentGroups = submissions.reduce<Record<string, { title: string; subject: string; color: string; due: string; total: number; items: Submission[] }>>((acc, s) => {
    if (!acc[s.assignmentId]) {
      acc[s.assignmentId] = { title: s.assignmentTitle, subject: s.subjectName, color: s.subjectColor, due: s.assignmentDue, total: s.assignmentTotal, items: [] };
    }
    acc[s.assignmentId].items.push(s);
    return acc;
  }, {});

  const assignmentIds = Object.keys(assignmentGroups);
  const filtered = assignment === 'all' ? assignmentIds : assignmentIds.filter(id => id === assignment);

  const totalSubmitted = submissions.filter(s => s.submittedDate).length;
  const totalGraded    = submissions.filter(s => s.status === 'graded').length;
  const totalPending   = submissions.filter(s => !s.submittedDate).length;

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Submissions & Grading</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Review student submissions and enter marks.</p>
      </div>

      {/* Stats */}
      <div className="portal-stats-grid" style={{ marginBottom: 22 }}>
        {[
          { label: 'Total',     value: submissions.length, color: TEXT  },
          { label: 'Submitted', value: totalSubmitted,     color: BLUE  },
          { label: 'Graded',    value: totalGraded,        color: GREEN },
          { label: 'Pending',   value: totalPending,       color: AMBER },
        ].map(c => (
          <div key={c.label} style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filter by assignment */}
      {assignmentIds.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button onClick={() => setAssignment('all')} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: assignment === 'all' ? GOLD_DIM : 'transparent', border: `1px solid ${assignment === 'all' ? GOLD_B : BORDER}`, color: assignment === 'all' ? GOLD : MUTED }}>
            All Assignments
          </button>
          {assignmentIds.map(id => (
            <button key={id} onClick={() => setAssignment(id)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: assignment === id ? GOLD_DIM : 'transparent', border: `1px solid ${assignment === id ? GOLD_B : BORDER}`, color: assignment === id ? GOLD : MUTED }}>
              {assignmentGroups[id].title}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 13 }}>Loading submissions…</div>
      ) : submissions.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 13 }}>
          No submissions yet. Once you create assignments and students are enrolled, submissions will appear here.
        </div>
      ) : (
        filtered.map(id => {
          const group = assignmentGroups[id];
          const submitted = group.items.filter(s => s.submittedDate).length;
          const graded    = group.items.filter(s => s.status === 'graded').length;
          return (
            <div key={id} style={{ marginBottom: 28 }}>
              {/* Assignment header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: group.color }} />
                <span style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT }}>{group.title}</span>
                <span style={{ fontSize: 12, color: MUTED }}>· {group.subject} · Due {group.due} · /{group.total} marks</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: MUTED }}>{submitted}/{group.items.length} submitted · {graded} graded</span>
              </div>
              {group.items.map(sub => (
                <SubmissionRow key={sub.id} sub={sub} onGraded={load} />
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}
