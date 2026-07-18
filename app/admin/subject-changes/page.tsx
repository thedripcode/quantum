'use client';

import { useState } from 'react';
import { Search, X, RefreshCw, CheckCircle2, XCircle, Clock, ArrowRight, Lock } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

type ReqStatus = 'pending' | 'approved' | 'rejected';
type FilterType = 'all' | ReqStatus;

interface ChangeRequest {
  id: string;
  studentName: string;
  studentNum: string;
  grade: string;
  from: string;
  to: string;
  reason: string;
  date: string;
  status: ReqStatus;
  teacherNote: string;
}

const CHANGE_REQUESTS: ChangeRequest[] = [
  { id: 'SCR001', studentName: 'Amahle Dlamini',  studentNum: 'STU-11B-023', grade: '11B', from: 'Physical Sciences', to: 'History',                      reason: 'Struggling with sciences. Strong in humanities. Teacher recommendation.', date: '12 May 2025', status: 'pending',  teacherNote: 'Amahle has shown significant improvement in History essays.' },
  { id: 'SCR002', studentName: 'Sipho Mthembu',   studentNum: 'STU-10A-041', grade: '10A', from: 'Business Studies',   to: 'Computer Applications Technology', reason: 'Career path change — interested in IT field.',                           date: '10 May 2025', status: 'approved', teacherNote: '' },
  { id: 'SCR003', studentName: 'Nokwanda Zulu',    studentNum: 'STU-12C-007', grade: '12C', from: 'Life Sciences',      to: 'Consumer Studies',              reason: 'Life Sciences marks declining. Prefer Consumer Studies.',               date: '8 May 2025',  status: 'rejected', teacherNote: 'Grade 12 subject changes not advisable at this stage.' },
  { id: 'SCR004', studentName: 'Thabo Khumalo',    studentNum: 'STU-9A-015',  grade: '9A',  from: 'Geography',          to: 'Agricultural Sciences',          reason: 'Wants to pursue agriculture at tertiary level.',                        date: '7 May 2025',  status: 'pending',  teacherNote: '' },
  { id: 'SCR005', studentName: 'Lungelo Mokoena',  studentNum: 'STU-11A-038', grade: '11A', from: 'Accounting',         to: 'Economics',                      reason: 'Finds accounting too difficult. Better understanding of economics.',     date: '5 May 2025',  status: 'pending',  teacherNote: 'Lungelo has been attending extra classes.' },
  { id: 'SCR006', studentName: 'Nandi Ntuli',      studentNum: 'STU-10B-019', grade: '10B', from: 'Technical Maths',    to: 'Mathematics',                    reason: 'Plans to study engineering. Needs pure maths.',                        date: '3 May 2025',  status: 'approved', teacherNote: 'Nandi achieved 81% in Technical Maths. Capable.' },
];

const STATUS_CFG: Record<ReqStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  pending:  { label: 'Pending',  color: AMBER, bg: 'rgba(245,158,11,0.12)',  Icon: Clock },
  approved: { label: 'Approved', color: GREEN, bg: 'rgba(16,185,129,0.12)', Icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: RED,   bg: 'rgba(239,68,68,0.12)',  Icon: XCircle },
};

export default function SubjectChangesPage() {
  const [requests, setRequests] = useState<ChangeRequest[]>(CHANGE_REQUESTS);
  const [filter, setFilter]     = useState<FilterType>('all');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<ChangeRequest | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const pending  = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;

  const filtered = requests.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || `${r.studentName} ${r.studentNum} ${r.id} ${r.from} ${r.to}`.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  function openDrawer(r: ChangeRequest) {
    setSelected(r);
    setAdminNote('');
  }

  function updateStatus(id: string, status: ReqStatus) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  }

  const TABS: { key: FilterType; label: string; count: number }[] = [
    { key: 'all',      label: 'All',      count: requests.length },
    { key: 'pending',  label: 'Pending',  count: pending },
    { key: 'approved', label: 'Approved', count: approved },
    { key: 'rejected', label: 'Rejected', count: rejected },
  ];

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>
          Subject Changes
        </h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
          {requests.length} requests · {pending} pending review
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Pending',  count: pending,  color: AMBER },
          { label: 'Approved', count: approved, color: GREEN },
          { label: 'Rejected', count: rejected, color: RED },
        ].map(s => (
          <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: FH, fontSize: 30, fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.count}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs + search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              style={{
                padding: '6px 14px', borderRadius: 8,
                background: filter === t.key ? GOLD_DIM : S2,
                border: `1px solid ${filter === t.key ? GOLD_B : BORDER}`,
                color: filter === t.key ? GOLD : MUTED,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {t.label}
              <span style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 10,
                background: filter === t.key ? GOLD_B : 'rgba(255,255,255,0.08)',
                color: filter === t.key ? GOLD : FAINT,
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px', width: 240 }}>
          <Search size={13} style={{ color: FAINT, flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student, subject, ref…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', minWidth: 820 }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 64px 180px 36px 180px 104px 90px 82px', alignItems: 'center', padding: '10px 18px', borderBottom: `1px solid ${BORDER}`, gap: 4 }}>
          {['Ref', 'Student', 'Grade', 'From Subject', '', 'To Subject', 'Date', 'Status', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '48px 18px', textAlign: 'center', color: MUTED, fontSize: 13 }}>No requests match your filter.</div>
        )}

        {filtered.map((r, i) => {
          const sc = STATUS_CFG[r.status];
          const Icon = sc.Icon;
          return (
            <div
              key={r.id}
              style={{ display: 'grid', gridTemplateColumns: '90px 1fr 64px 180px 36px 180px 104px 90px 82px', alignItems: 'center', padding: '0 18px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)`, gap: 4, transition: 'background .1s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{ padding: '13px 0' }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: GOLD, fontWeight: 600 }}>{r.id}</span>
              </div>
              <div style={{ padding: '13px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{r.studentName}</div>
                <div style={{ fontSize: 10, color: FAINT }}>{r.studentNum}</div>
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>{r.grade}</div>
              <div style={{ fontSize: 12, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.from}</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RefreshCw size={11} style={{ color: FAINT }} />
              </div>
              <div style={{ fontSize: 12, color: TEXT, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.to}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{r.date}</div>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: sc.bg, color: sc.color }}>
                  <Icon size={9} /> {sc.label}
                </span>
              </div>
              <div>
                <button
                  onClick={() => openDrawer(r)}
                  style={{ fontSize: 11, fontWeight: 700, color: GOLD, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontFamily: FB }}
                >
                  Review →
                </button>
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* ─── Right Drawer ──────────────────────────────────────────────────────── */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.50)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, background: SURFACE, borderLeft: `1px solid ${BORDER}`, zIndex: 110, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* Drawer header */}
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: FH, fontSize: 17, fontWeight: 800, color: TEXT }}>{selected.studentName}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 3, fontFamily: 'monospace' }}>{selected.studentNum} · Grade {selected.grade}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '18px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Current status badge + date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {(() => {
                  const sc = STATUS_CFG[selected.status];
                  const Icon = sc.Icon;
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 8, background: sc.bg, color: sc.color }}>
                      <Icon size={12} /> {sc.label}
                    </span>
                  );
                })()}
                <span style={{ fontSize: 11, color: FAINT }}>{selected.date}</span>
              </div>

              {/* From → To display (two boxes side by side with arrow between) */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Subject Change</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, background: S2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: MUTED, marginBottom: 5 }}>From</div>
                    <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: AMBER, lineHeight: 1.3 }}>{selected.from}</div>
                  </div>
                  <ArrowRight size={18} style={{ color: FAINT, flexShrink: 0 }} />
                  <div style={{ flex: 1, background: S2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: MUTED, marginBottom: 5 }}>To</div>
                    <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: GREEN, lineHeight: 1.3 }}>{selected.to}</div>
                  </div>
                </div>
              </div>

              {/* Student Reason */}
              <div style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Student Reason</div>
                <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.65 }}>{selected.reason}</p>
              </div>

              {/* Teacher Note (gold tint, only if non-empty) */}
              {selected.teacherNote && (
                <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Teacher Note</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', margin: 0, lineHeight: 1.65 }}>{selected.teacherNote}</p>
                </div>
              )}

              {/* Admin Note textarea */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Admin Note</div>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note…"
                  style={{ width: '100%', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '10px 12px', fontSize: 12, color: TEXT, fontFamily: FB, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Locked status banner when not pending */}
              {selected.status !== 'pending' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: S2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
                  <Lock size={15} style={{ color: FAINT, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: STATUS_CFG[selected.status].color }}>
                      Request {STATUS_CFG[selected.status].label}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>This request has been actioned and is now locked.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer — action buttons only when pending */}
            {selected.status === 'pending' && (
              <div style={{ padding: '16px 22px', borderTop: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', gap: 10 }}>
                <button
                  onClick={() => updateStatus(selected.id, 'rejected')}
                  style={{ flex: 1, padding: '10px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9999, color: RED, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}
                >
                  Reject
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'approved')}
                  style={{ flex: 1, padding: '10px', background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.32)', borderRadius: 9999, color: GREEN, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
