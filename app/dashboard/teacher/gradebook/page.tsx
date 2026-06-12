'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, PenLine, Trash2 } from 'lucide-react';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const PURPLE = '#7C3AED'; const PURPLE_DIM = 'rgba(124,58,237,0.10)'; const PURPLE_B = 'rgba(124,58,237,0.25)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.25)';
const GREEN = '#10B981'; const RED = '#EF4444'; const AMBER = '#F59E0B';
const FH = "'Bricolage Grotesque', sans-serif"; const FB = "'Inter', sans-serif";

interface MarkRow {
  id: string; studentName: string; studentPortalId: string;
  subject: string; subjectShort: string; color: string;
  task: string; type: string; score: number; total: number; term: number; date: string;
}

const pctColor = (p: number) => (p >= 60 ? GREEN : p >= 40 ? AMBER : RED);

export default function GradebookPage() {
  const [marks, setMarks]     = useState<MarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('All');

  const load = () => fetch('/api/marks').then(r => r.json()).then(d => setMarks(d.marks ?? [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const subjects = useMemo(() => ['All', ...new Set(marks.map(m => m.subject))], [marks]);
  const filtered = subject === 'All' ? marks : marks.filter(m => m.subject === subject);

  // Group by assessment for a gradebook feel
  const groups = useMemo(() => {
    const map = new Map<string, MarkRow[]>();
    filtered.forEach(m => {
      const key = `${m.subject} — ${m.task} (Term ${m.term})`;
      map.set(key, [...(map.get(key) ?? []), m]);
    });
    return [...map.entries()];
  }, [filtered]);

  const removeMark = async (m: MarkRow) => {
    if (!confirm(`Delete ${m.studentName}'s ${m.score}/${m.total} for "${m.task}"?`)) return;
    const res = await fetch(`/api/marks?id=${m.id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Gradebook</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Every captured mark, live from the database.</p>
        </div>
        <Link href="/dashboard/teacher/capture" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: PURPLE, color: '#fff', textDecoration: 'none', fontFamily: FH, fontSize: 13, fontWeight: 700 }}>
          <PenLine size={14} /> Capture Marks
        </Link>
      </div>

      {/* Subject filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {subjects.map(s => (
          <button key={s} onClick={() => setSubject(s)} style={{
            padding: '8px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
            background: subject === s ? PURPLE_DIM : 'transparent',
            border: `1px solid ${subject === s ? PURPLE_B : BORDER}`,
            color: subject === s ? '#C4B5FD' : MUTED,
          }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 14 }}>Loading marks…</p>
      ) : groups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <BookOpen size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No marks yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Capture your first assessment from the Capture page.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groups.map(([title, rows]) => {
            const avg = Math.round(rows.reduce((s, m) => s + (m.score / m.total) * 100, 0) / rows.length);
            return (
              <div key={title} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: rows[0].color }} />
                    <span style={{ fontFamily: FH, fontSize: 14.5, fontWeight: 600, color: TEXT }}>{title}</span>
                    <span style={{ fontSize: 11, color: FAINT }}>· {rows[0].type} · /{rows[0].total}</span>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: pctColor(avg) }}>Class avg {avg}%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rows.map(m => {
                    const p = Math.round((m.score / m.total) * 100);
                    return (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: S2, borderRadius: 9, border: `1px solid ${BORDER}` }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{m.studentName}</span>
                          <span style={{ fontSize: 11, color: FAINT, marginLeft: 8 }}>{m.studentPortalId}</span>
                        </div>
                        <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, flexShrink: 0 }}>
                          <div style={{ height: '100%', width: `${Math.min(p, 100)}%`, background: pctColor(p), borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: pctColor(p), width: 90, textAlign: 'right', flexShrink: 0 }}>
                          {m.score}/{m.total} · {p}%
                        </span>
                        <button onClick={() => removeMark(m)} title="Delete mark" style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 4 }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
