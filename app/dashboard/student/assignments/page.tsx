'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, FileCheck, Filter } from 'lucide-react';
import { useStudentData, type RealAssignment as Assignment } from '@/lib/useStudentData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.20)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const RED = '#EF4444'; const GREEN = '#10B981'; const AMBER = '#F59E0B';
const F_HEADING = "'Bricolage Grotesque', sans-serif"; const F_BODY = "'Inter', sans-serif";

type Filter = 'all' | 'pending' | 'overdue' | 'submitted' | 'graded';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: AMBER,  bg: 'rgba(245,158,11,0.10)',   icon: Clock },
  overdue:   { label: 'Overdue',   color: RED,    bg: 'rgba(239,68,68,0.10)',    icon: AlertTriangle },
  submitted: { label: 'Submitted', color: '#3B82F6', bg: 'rgba(59,130,246,0.10)', icon: FileCheck },
  graded:    { label: 'Graded',    color: GREEN,  bg: 'rgba(16,185,129,0.10)',   icon: CheckCircle2 },
};

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function AssignmentCard({ a }: { a: Assignment }) {
  const [open, setOpen] = useState(false);
  const sc  = STATUS_CONFIG[a.status];
  const Icon = sc.icon;
  const due = new Date(a.dueDate);
  const today = new Date();
  const diff = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  const pct = a.mark !== null ? Math.round((a.mark / a.total) * 100) : null;

  return (
    <div style={{ background: SURFACE, border: `1px solid ${a.status === 'overdue' ? 'rgba(239,68,68,0.22)' : BORDER}`, borderRadius: 14, overflow: 'hidden', marginBottom: 10, transition: 'border-color .15s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ width: 4, height: 44, borderRadius: 2, background: a.subjectColor, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</span>
            {a.priority === 'high' && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: RED, background: 'rgba(239,68,68,0.12)', padding: '2px 5px', borderRadius: 4, flexShrink: 0 }}>HIGH</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: a.subjectColor, fontWeight: 500 }}>{a.subject}</span>
            <span style={{ fontSize: 11, color: FAINT }}>·</span>
            <span style={{ fontSize: 11, color: MUTED }}>{a.type}</span>
            <span style={{ fontSize: 11, color: FAINT }}>·</span>
            <span style={{ fontSize: 11, color: MUTED }}>/{a.total} marks</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 6, background: sc.bg }}>
            <Icon size={11} style={{ color: sc.color }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: sc.color }}>{sc.label}</span>
          </div>
          <div style={{ fontSize: 11, color: a.status === 'overdue' ? RED : diff <= 3 ? AMBER : MUTED, marginTop: 4, fontWeight: a.status === 'overdue' ? 600 : 400 }}>
            {a.status === 'graded' ? `${pct}% — ${a.mark}/${a.total}` :
             a.status === 'submitted' ? `Submitted ${a.submittedDate}` :
             a.status === 'overdue' ? 'Past due' :
             diff === 0 ? 'Due today' : diff === 1 ? 'Due tomorrow' : `Due in ${diff} days`}
          </div>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: '14px 18px', background: S2 }}>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: '0 0 12px' }}>{a.description}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ background: '#0C0C0C', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, color: FAINT }}>Due Date</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginTop: 2 }}>{a.dueDate}</div>
            </div>
            <div style={{ background: '#0C0C0C', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, color: FAINT }}>Total Marks</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginTop: 2 }}>{a.total}</div>
            </div>
            {a.submittedDate && (
              <div style={{ background: '#0C0C0C', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: FAINT }}>Submitted</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: GREEN, marginTop: 2 }}>{a.submittedDate}</div>
              </div>
            )}
            {a.mark !== null && (
              <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.70)' }}>Your Mark</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginTop: 2 }}>{a.mark}/{a.total} ({pct}%)</div>
              </div>
            )}
          </div>
          {a.feedback && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: GREEN, marginBottom: 4 }}>Teacher Feedback</div>
              <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6 }}>{a.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const { data, loading } = useStudentData();
  const ASSIGNMENTS = data.assignments;

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 14 }}>Loading assignments…</span>
      </div>
    );
  }

  const counts = {
    all: ASSIGNMENTS.length,
    pending:   ASSIGNMENTS.filter(a => a.status === 'pending').length,
    overdue:   ASSIGNMENTS.filter(a => a.status === 'overdue').length,
    submitted: ASSIGNMENTS.filter(a => a.status === 'submitted').length,
    graded:    ASSIGNMENTS.filter(a => a.status === 'graded').length,
  };

  const filtered = ASSIGNMENTS
    .filter(a => filter === 'all' || a.status === filter)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const TABS: { id: Filter; label: string; color: string }[] = [
    { id: 'all',       label: 'All',       color: MUTED },
    { id: 'overdue',   label: 'Overdue',   color: RED   },
    { id: 'pending',   label: 'Pending',   color: AMBER },
    { id: 'submitted', label: 'Submitted', color: '#3B82F6' },
    { id: 'graded',    label: 'Graded',    color: GREEN },
  ];

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Stats */}
      <div className="portal-stats-grid" style={{ marginBottom: 22 }}>
        {[
          { label: 'Overdue', value: counts.overdue, color: RED },
          { label: 'Pending', value: counts.pending, color: AMBER },
          { label: 'Submitted', value: counts.submitted, color: '#3B82F6' },
          { label: 'Graded', value: counts.graded, color: GREEN },
        ].map(stat => (
          <div key={stat.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 13, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: MUTED, fontWeight: 500, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontFamily: F_HEADING, fontSize: 26, fontWeight: 700, color: stat.value > 0 && stat.label !== 'Graded' && stat.label !== 'Submitted' ? stat.color : TEXT, letterSpacing: '-0.02em' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: SURFACE, padding: 6, borderRadius: 12, border: `1px solid ${BORDER}`, width: 'fit-content' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: filter === tab.id ? S2 : 'transparent',
              color: filter === tab.id ? (tab.id === 'all' ? TEXT : tab.color) : MUTED,
              transition: 'all .15s',
            }}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span style={{ marginLeft: 5, fontSize: 10, padding: '1px 5px', borderRadius: 10, background: filter === tab.id ? tab.color + '28' : 'rgba(255,255,255,0.06)', color: filter === tab.id ? tab.color : FAINT }}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Assignment list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <CheckCircle2 size={36} style={{ color: GREEN, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>All clear!</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>No assignments in this category.</div>
        </div>
      ) : (
        filtered.map(a => <AssignmentCard key={a.id} a={a} />)
      )}
    </div>
  );
}
