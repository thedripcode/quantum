'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search, X, CheckCircle2, XCircle, AlertTriangle, Clock, ChevronDown,
  FileText, User, Phone, Mail, Calendar, GraduationCap, MapPin, AlertCircle,
} from 'lucide-react';
import { ADMIN_CLASSES, type Application } from '@/data/adminData';

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
const FH       = "'Bricolage Grotesque', sans-serif";
const FB       = "'Inter', sans-serif";

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'info_requested' | 'waitlisted';

type LocalApp = Application & { adminNote?: string; assignedGrade?: number; assignedClass?: string; studentNumber?: string };

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:        { label: 'Pending',        color: AMBER, bg: 'rgba(245,158,11,0.12)',  icon: Clock },
  approved:       { label: 'Approved',       color: GREEN, bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle2 },
  rejected:       { label: 'Rejected',       color: RED,   bg: 'rgba(239,68,68,0.12)',   icon: XCircle },
  info_requested: { label: 'Info Requested', color: BLUE,  bg: 'rgba(59,130,246,0.12)', icon: AlertTriangle },
  waitlisted:     { label: 'Waitlisted',     color: MUTED, bg: 'rgba(255,255,255,0.08)', icon: Clock },
};

const REJECT_REASONS = [
  'Capacity full',
  'Documents incomplete',
  'Age requirements',
  'Academic requirements',
  'Other',
];

function genStudentNum(grade: number, section: string): string {
  const n = String(Math.floor(Math.random() * 900) + 100);
  return `STU-${grade}${section}-2025-${n}`;
}

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 500,
      background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)',
      borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'slideUp .25s ease',
    }}>
      <CheckCircle2 size={16} style={{ color: GREEN, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: GREEN }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, marginLeft: 4 }}><X size={12} /></button>
    </div>
  );
}

// ─── Confirm Approve Modal ───────────────────────────────────────────────────
interface ApproveConfirmProps {
  app: LocalApp;
  assignedClass: string;
  studentNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
}
function ApproveConfirmModal({ app, assignedClass, studentNumber, onConfirm, onCancel }: ApproveConfirmProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, width: 400, maxWidth: '92vw', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} style={{ color: GREEN }} />
          </div>
          <div>
            <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: TEXT }}>Confirm Approval</div>
            <div style={{ fontSize: 11, color: MUTED }}>{app.firstName} {app.lastName} · {app.ref}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {[
            `Create student account (${studentNumber})`,
            'Send welcome email to parent',
            'Initialize mark records',
            `Assign to class timetable (${assignedClass})`,
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <CheckCircle2 size={14} style={{ color: GREEN, marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: MUTED }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 9999, color: MUTED, fontSize: 13, cursor: 'pointer', fontFamily: FB, fontWeight: 600 }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '10px', background: GOLD, border: 'none', borderRadius: 9999, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
// Map a DB application row (from /api/applications) into the UI shape
function dbToLocalApp(row: any): LocalApp {
  return {
    id:             row.id,
    ref:            row.ref,
    firstName:      row.firstName,
    lastName:       row.lastName,
    dob:            row.dob ?? '—',
    gender:         (row.gender as 'Male' | 'Female') ?? 'Male',
    gradeApplying:  parseInt(String(row.applyingGrade).replace(/\D/g, ''), 10) || 8,
    currentSchool:  row.previousSchool ?? '—',
    currentAverage: 0,
    mathsMark:      0,
    scienceMark:    0,
    subjectChoices: [],
    parentName:     row.parentName ?? '—',
    parentPhone:    row.parentPhone ?? '—',
    parentEmail:    row.parentEmail ?? row.email ?? '—',
    address:        [row.address, row.city, row.province].filter(Boolean).join(', ') || '—',
    dateSubmitted:  new Date(row.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
    status:         (String(row.status).toLowerCase() as Application['status']) || 'pending',
    notes:          row.adminNote ?? '',
    missingDocs:    [],
  };
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<LocalApp[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Load real applications from the database
  useEffect(() => {
    fetch('/api/applications')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setApps((data.applications ?? []).map(dbToLocalApp)))
      .catch(() => setApps([]))
      .finally(() => setLoadingApps(false));
  }, []);

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<LocalApp | null>(null);
  const [note, setNote] = useState('');

  // Approve flow
  const [drawerGrade, setDrawerGrade] = useState<number>(8);
  const [drawerClass, setDrawerClass] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [pendingStudentNum, setPendingStudentNum] = useState('');

  // Reject flow
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Toast
  const [toast, setToast] = useState('');

  const drawerRef = useRef<HTMLDivElement>(null);

  // Derived
  const counts: Record<string, number> = {
    all:            apps.length,
    pending:        apps.filter(a => a.status === 'pending').length,
    approved:       apps.filter(a => a.status === 'approved').length,
    rejected:       apps.filter(a => a.status === 'rejected').length,
    info_requested: apps.filter(a => a.status === 'info_requested').length,
    waitlisted:     apps.filter(a => a.status === 'waitlisted').length,
  };

  const filtered = apps.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || `${a.firstName} ${a.lastName} ${a.ref} ${a.currentSchool}`.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const gradeClasses = ADMIN_CLASSES.filter(c => c.grade === drawerGrade);
  const chosenClass = ADMIN_CLASSES.find(c => c.id === drawerClass);

  function openDrawer(app: LocalApp) {
    setSelected(app);
    setNote(app.adminNote ?? app.notes ?? '');
    setDrawerGrade(app.gradeApplying);
    setDrawerClass('');
    setShowRejectReason(false);
    setRejectReason('');
    setShowApproveConfirm(false);
  }

  function updateApp(id: string, patch: Partial<LocalApp>) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...patch } : null);
  }

  function handleApproveClick() {
    if (!selected || !drawerClass || !chosenClass) return;
    const sn = genStudentNum(drawerGrade, chosenClass.section);
    setPendingStudentNum(sn);
    setShowApproveConfirm(true);
  }

  function handleApproveConfirm() {
    if (!selected || !chosenClass) return;
    const patch: Partial<LocalApp> = {
      status: 'approved',
      assignedClass: chosenClass.name,
      assignedGrade: drawerGrade,
      studentNumber: pendingStudentNum,
      adminNote: note,
    };
    updateApp(selected.id, patch);
    setShowApproveConfirm(false);
    setSelected(null);
    setToast(`${selected.firstName} ${selected.lastName} approved — ${pendingStudentNum}`);
  }

  function handleWaitlist() {
    if (!selected) return;
    updateApp(selected.id, { status: 'waitlisted', adminNote: note });
    setSelected(null);
    setToast('Application moved to waitlist.');
  }

  function handleReject() {
    if (!selected || !rejectReason) return;
    updateApp(selected.id, { status: 'rejected', adminNote: `${rejectReason}${note ? ': ' + note : ''}` });
    setSelected(null);
    setToast('Application rejected.');
  }

  function handleInfoRequest() {
    if (!selected) return;
    updateApp(selected.id, { status: 'info_requested', adminNote: note });
    setSelected(null);
    setToast('Info requested from applicant.');
  }

  const TABS: { key: FilterStatus; label: string; color: string }[] = [
    { key: 'all',            label: 'All',            color: TEXT },
    { key: 'pending',        label: 'Pending',        color: AMBER },
    { key: 'approved',       label: 'Approved',       color: GREEN },
    { key: 'rejected',       label: 'Rejected',       color: RED },
    { key: 'info_requested', label: 'Info Requested', color: BLUE },
    { key: 'waitlisted',     label: 'Waitlisted',     color: MUTED },
  ];

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <style>{`@keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Applications</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
          {counts.pending} pending review · {counts.all} total for 2025
        </p>
      </div>

      {/* Top stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total',     count: counts.all,            color: BLUE },
          { label: 'Pending',   count: counts.pending,        color: AMBER },
          { label: 'Approved',  count: counts.approved,       color: GREEN },
          { label: 'Rejected',  count: counts.rejected,       color: RED },
        ].map(s => (
          <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.count}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: filter === t.key ? GOLD_B : 'rgba(255,255,255,0.08)', color: filter === t.key ? GOLD : FAINT }}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px', width: 230 }}>
          <Search size={13} style={{ color: FAINT, flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, ref, school…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT }}><X size={12} /></button>}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px 110px 90px 100px 80px 90px', padding: '10px 16px', borderBottom: `1px solid ${BORDER}` }}>
          {['Reference', 'Applicant', 'Grade', 'School', 'Missing Docs', 'Date', 'Status', ''].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: MUTED, fontSize: 13 }}>No applications match your filter.</div>
        )}

        {filtered.map((a, i) => {
          const sc = STATUS_CONFIG[a.status];
          const Icon = sc.icon;
          const hasMissing = (a.missingDocs?.length ?? 0) > 0;
          return (
            <div
              key={a.id}
              style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px 110px 90px 100px 80px 90px', alignItems: 'center', padding: '0 16px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)`, transition: 'background .1s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{ padding: '12px 0' }}>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: GOLD, fontWeight: 600 }}>{a.ref}</div>
              </div>
              <div style={{ padding: '12px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{a.firstName} {a.lastName}</div>
                <div style={{ fontSize: 10, color: FAINT }}>{a.gender}</div>
              </div>
              <div style={{ fontSize: 13, color: MUTED }}>Gr {a.gradeApplying}</div>
              <div style={{ fontSize: 11, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{a.currentSchool}</div>
              <div>
                {hasMissing ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.12)', color: RED }}>
                    <AlertCircle size={9} /> {a.missingDocs!.length} missing
                  </span>
                ) : (
                  <span style={{ fontSize: 10, color: FAINT }}>—</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: MUTED }}>{a.dateSubmitted}</div>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: sc.bg, color: sc.color }}>
                  <Icon size={9} /> {sc.label}
                </span>
              </div>
              <div>
                <button
                  onClick={() => openDrawer(a)}
                  style={{ fontSize: 11, fontWeight: 700, color: GOLD, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontFamily: FB }}
                >
                  Review →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Drawer ─────────────────────────────────────────────────────────── */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100 }} />
          <div
            ref={drawerRef}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, background: SURFACE, borderLeft: `1px solid ${BORDER}`, zIndex: 110, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            {/* Drawer header */}
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: FH, fontSize: 17, fontWeight: 800, color: TEXT }}>{selected.firstName} {selected.lastName}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 3, fontFamily: 'monospace' }}>{selected.ref}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4 }}><X size={16} /></button>
            </div>

            <div style={{ flex: 1, padding: '18px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Status badge + assignment info */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                {(() => { const sc = STATUS_CONFIG[selected.status]; const Icon = sc.icon; return (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 8, background: sc.bg, color: sc.color }}>
                    <Icon size={12} /> {sc.label}
                  </span>
                ); })()}
                {selected.status === 'approved' && selected.assignedClass && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.10)', color: GREEN, border: '1px solid rgba(16,185,129,0.20)' }}>
                    <CheckCircle2 size={11} /> Class: {selected.assignedClass}
                  </span>
                )}
                {selected.status === 'approved' && selected.studentNumber && (
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: GOLD }}>{selected.studentNumber}</span>
                )}
              </div>

              {/* Personal Details */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Personal Details</div>
                {[
                  { icon: User,         label: 'Full Name',       value: `${selected.firstName} ${selected.lastName}` },
                  { icon: Calendar,     label: 'Date of Birth',   value: selected.dob },
                  { icon: User,         label: 'Gender',          value: selected.gender },
                  { icon: GraduationCap,label: 'Previous School', value: selected.currentSchool },
                  { icon: MapPin,       label: 'Address',         value: selected.address },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <row.icon size={13} style={{ color: FAINT, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, color: MUTED }}>{row.label}</div>
                      <div style={{ fontSize: 13, color: TEXT }}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Academic */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Academic</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                  {[
                    { label: 'Average', value: `${selected.currentAverage}%`, color: selected.currentAverage >= 75 ? GREEN : selected.currentAverage >= 60 ? AMBER : RED },
                    { label: 'Maths',   value: `${selected.mathsMark}%`,      color: selected.mathsMark >= 75 ? GREEN : selected.mathsMark >= 60 ? AMBER : RED },
                    { label: 'Science', value: `${selected.scienceMark}%`,    color: selected.scienceMark >= 75 ? GREEN : selected.scienceMark >= 60 ? AMBER : RED },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: S3, borderRadius: 9, padding: '10px 12px', textAlign: 'center' }}>
                      <div style={{ fontFamily: FH, fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: MUTED }}>
                  Subject choices: {selected.subjectChoices.join(', ')}
                </div>
              </div>

              {/* Parent / Guardian */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Parent / Guardian</div>
                {[
                  { icon: User,  label: 'Name',  value: selected.parentName },
                  { icon: Phone, label: 'Phone', value: selected.parentPhone },
                  { icon: Mail,  label: 'Email', value: selected.parentEmail },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <row.icon size={13} style={{ color: FAINT, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, color: MUTED }}>{row.label}</div>
                      <div style={{ fontSize: 13, color: TEXT }}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Missing docs */}
              {(selected.missingDocs?.length ?? 0) > 0 && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Missing Documents</div>
                  {selected.missingDocs!.map(d => (
                    <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <AlertCircle size={12} style={{ color: RED, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)' }}>{d}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Admin notes */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Admin Note</div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note…"
                  style={{ width: '100%', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '10px 12px', fontSize: 12, color: TEXT, fontFamily: FB, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Pending-only: assignment + actions */}
              {selected.status === 'pending' && (
                <>
                  {/* Assignment section */}
                  <div style={{ background: S2, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Assign to Class</div>

                    {/* Grade selector */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Grade</div>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={drawerGrade}
                          onChange={e => { setDrawerGrade(Number(e.target.value)); setDrawerClass(''); }}
                          style={{ width: '100%', padding: '9px 34px 9px 12px', background: S3, border: `1px solid ${BORDER}`, borderRadius: 9, color: TEXT, fontSize: 13, appearance: 'none', cursor: 'pointer', fontFamily: FB, outline: 'none' }}
                        >
                          {[8, 9, 10, 11, 12].map(g => (
                            <option key={g} value={g}>Grade {g}</option>
                          ))}
                        </select>
                        <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: FAINT, pointerEvents: 'none' }} />
                      </div>
                    </div>

                    {/* Class selector */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Class</div>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={drawerClass}
                          onChange={e => setDrawerClass(e.target.value)}
                          style={{ width: '100%', padding: '9px 34px 9px 12px', background: S3, border: `1px solid ${BORDER}`, borderRadius: 9, color: TEXT, fontSize: 13, appearance: 'none', cursor: 'pointer', fontFamily: FB, outline: 'none' }}
                        >
                          <option value="">Select class…</option>
                          {gradeClasses.map(c => (
                            <option key={c.id} value={c.id}>{c.name} — {c.stream} ({c.studentCount}/{c.capacity})</option>
                          ))}
                        </select>
                        <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: FAINT, pointerEvents: 'none' }} />
                      </div>
                    </div>

                    {/* Class info preview */}
                    {chosenClass && (
                      <div style={{ background: S3, borderRadius: 9, padding: '10px 14px', marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{chosenClass.name} — {chosenClass.stream}</span>
                          <span style={{ fontSize: 11, color: chosenClass.studentCount >= chosenClass.capacity ? RED : GREEN }}>{chosenClass.studentCount}/{chosenClass.capacity}</span>
                        </div>
                        <div style={{ fontSize: 10, color: MUTED, marginBottom: 8 }}>Room {chosenClass.room} · {chosenClass.homeTeacher}</div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(chosenClass.studentCount / chosenClass.capacity) * 100}%`, background: chosenClass.studentCount / chosenClass.capacity > 0.9 ? RED : GREEN, borderRadius: 2 }} />
                        </div>
                      </div>
                    )}

                    {/* Student number preview */}
                    {drawerClass && chosenClass && (
                      <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 9, padding: '10px 14px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Auto-generated Student Number</div>
                        <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 800, color: GOLD }}>
                          STU-{drawerGrade}{chosenClass.section}-2025-<em style={{ fontStyle: 'normal', color: MUTED }}>XXX</em>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reject reason */}
                  {showRejectReason && (
                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 12, padding: '14px 16px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: RED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Rejection Reason</div>
                      <div style={{ position: 'relative', marginBottom: 10 }}>
                        <select
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          style={{ width: '100%', padding: '9px 34px 9px 12px', background: S3, border: `1px solid rgba(239,68,68,0.25)`, borderRadius: 9, color: TEXT, fontSize: 13, appearance: 'none', cursor: 'pointer', fontFamily: FB, outline: 'none' }}
                        >
                          <option value="">Select reason…</option>
                          {REJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: FAINT, pointerEvents: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => { setShowRejectReason(false); setRejectReason(''); }}
                          style={{ flex: 1, padding: '9px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 9999, color: MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={!rejectReason}
                          style={{ flex: 1, padding: '9px', background: rejectReason ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.06)', border: `1px solid ${rejectReason ? 'rgba(239,68,68,0.40)' : 'rgba(239,68,68,0.15)'}`, borderRadius: 9999, color: rejectReason ? RED : 'rgba(239,68,68,0.35)', fontSize: 12, fontWeight: 700, cursor: rejectReason ? 'pointer' : 'default', fontFamily: FB }}
                        >
                          Confirm Reject
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Drawer footer actions */}
            {selected.status === 'pending' && !showRejectReason && (
              <div style={{ padding: '16px 22px', borderTop: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setShowRejectReason(true)}
                  style={{ flex: 1, padding: '10px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 9, color: RED, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}
                >
                  ✕ Reject
                </button>
                <button
                  onClick={handleWaitlist}
                  style={{ flex: 1, padding: '10px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}
                >
                  Waitlist
                </button>
                <button
                  onClick={handleInfoRequest}
                  style={{ flex: 1, padding: '10px', background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 9, color: BLUE, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}
                >
                  Request Info
                </button>
                <button
                  onClick={handleApproveClick}
                  disabled={!drawerClass}
                  style={{ flex: 1, padding: '10px', background: drawerClass ? GOLD : 'rgba(201,168,76,0.15)', border: 'none', borderRadius: 9, color: drawerClass ? '#000' : 'rgba(201,168,76,0.40)', fontSize: 12, fontWeight: 700, cursor: drawerClass ? 'pointer' : 'default', fontFamily: FB }}
                >
                  ✓ Approve
                </button>
              </div>
            )}
            {selected.status !== 'pending' && (
              <div style={{ padding: '16px 22px', borderTop: `1px solid ${BORDER}`, flexShrink: 0, textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: STATUS_CONFIG[selected.status]?.color ?? MUTED, fontWeight: 600 }}>
                  Status: {STATUS_CONFIG[selected.status]?.label ?? selected.status}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Approve confirm modal */}
      {showApproveConfirm && selected && chosenClass && (
        <ApproveConfirmModal
          app={selected}
          assignedClass={chosenClass.name}
          studentNumber={pendingStudentNum}
          onConfirm={handleApproveConfirm}
          onCancel={() => setShowApproveConfirm(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
