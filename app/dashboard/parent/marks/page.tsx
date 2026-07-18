'use client';

import { useEffect, useState } from 'react';
import { BarChart2, Filter } from 'lucide-react';

const BG = '#081420'; const SURFACE = '#0E1E30'; const S2 = '#14283E';
const GOLD = '#60a5fa'; const GOLD_DIM = 'rgba(96,165,250,0.08)'; const GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981'; const RED = '#EF4444'; const YELLOW = '#F59E0B';
const F_H = "'Roboto Condensed', sans-serif"; const F_B = "'Inter', sans-serif";

function capsLevel(pct: number) {
  if (pct >= 80) return { num: 7, label: 'Outstanding',  color: GREEN };
  if (pct >= 70) return { num: 6, label: 'Meritorious',  color: '#3B82F6' };
  if (pct >= 60) return { num: 5, label: 'Substantial',  color: '#8B5CF6' };
  if (pct >= 50) return { num: 4, label: 'Adequate',     color: YELLOW };
  if (pct >= 40) return { num: 3, label: 'Moderate',     color: '#F97316' };
  if (pct >= 30) return { num: 2, label: 'Elementary',   color: RED };
  return              { num: 1, label: 'Not Achieved',   color: RED };
}

interface Mark { id: string; task: string; type: string; score: number; total: number; pct: number; term: number; date: string; subjectName: string; subjectShort: string; subjectColor: string }
interface Subject { id: string; name: string; short: string; color: string; average: number | null; markCount: number }

export default function ParentMarksPage() {
  const [marks, setMarks]       = useState<Mark[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading]   = useState(true);
  const [term, setTerm]         = useState<string>('');
  const [subj, setSubj]         = useState<string>('');

  useEffect(() => {
    fetch('/api/parent/child')
      .then(r => r.json())
      .then(d => { setMarks(d.marks ?? []); setSubjects(d.subjects ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = marks.filter(m => {
    if (term && String(m.term) !== term) return false;
    if (subj && m.subjectName !== subj) return false;
    return true;
  });

  const subjectNames = [...new Set(marks.map(m => m.subjectName))];

  return (
    <div style={{ padding: '28px 24px', fontFamily: F_B, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: F_H, fontSize: 24, fontWeight: 800, color: TEXT, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Marks</h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>All assessment results for your child</p>
      </div>

      {/* Subject averages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {subjects.map(s => {
          const pct = s.average ?? 0;
          const lv  = s.average !== null ? capsLevel(pct) : null;
          return (
            <div key={s.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{s.name}</span>
              </div>
              {lv ? (
                <>
                  <div style={{ fontSize: 22, fontWeight: 800, color: lv.color, fontFamily: F_H }}>{pct}%</div>
                  <div style={{ fontSize: 10, color: lv.color, marginTop: 2 }}>Level {lv.num} · {lv.label}</div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: lv.color, borderRadius: 2 }} />
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: FAINT }}>No marks yet</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={13} style={{ color: MUTED }} />
        <select value={term} onChange={e => setTerm(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 12, fontFamily: F_B, cursor: 'pointer' }}>
          <option value="">All Terms</option>
          {[1,2,3,4].map(t => <option key={t} value={t}>Term {t}</option>)}
        </select>
        <select value={subj} onChange={e => setSubj(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 12, fontFamily: F_B, cursor: 'pointer' }}>
          <option value="">All Subjects</option>
          {subjectNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        {(term || subj) && (
          <button onClick={() => { setTerm(''); setSubj(''); }} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', color: RED, fontSize: 11, cursor: 'pointer', fontFamily: F_B }}>
            Clear
          </button>
        )}
      </div>

      {/* Marks table */}
      <div className="table-scroll" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ minWidth: 520, display: 'grid', gridTemplateColumns: '1fr 110px 100px 70px 80px', padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          {['Task', 'Subject', 'Type', 'Term', 'Result'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <div style={{ minWidth: 520, padding: 32, textAlign: 'center', fontSize: 13, color: MUTED }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ minWidth: 520, padding: 32, textAlign: 'center', fontSize: 13, color: MUTED }}>No marks found.</div>
        ) : filtered.map(m => {
          const lv = capsLevel(m.pct);
          return (
            <div key={m.id} style={{ minWidth: 520, display: 'grid', gridTemplateColumns: '1fr 110px 100px 70px 80px', padding: '11px 16px', borderBottom: `1px solid rgba(255,255,255,0.03)`, gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: TEXT }}>{m.task}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.subjectColor }} />
                <span style={{ fontSize: 12, color: MUTED }}>{m.subjectShort}</span>
              </div>
              <span style={{ fontSize: 11, color: MUTED }}>{m.type}</span>
              <span style={{ fontSize: 11, color: MUTED }}>Term {m.term}</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: lv.color }}>{m.pct}%</span>
                <span style={{ fontSize: 10, color: MUTED, marginLeft: 4 }}>{m.score}/{m.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
