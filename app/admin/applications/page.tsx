'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Search, ChevronDown, FileText, Loader2 } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E';
const GOLD = '#C9A84C';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

type Status = 'Pending' | 'Approved' | 'Rejected' | 'Waitlisted';

const STATUS_CFG: Record<Status, { color: string; bg: string; icon: React.ElementType }> = {
  Pending:    { color: AMBER, bg: 'rgba(245,158,11,0.10)',  icon: Clock },
  Approved:   { color: GREEN, bg: 'rgba(16,185,129,0.10)',  icon: CheckCircle2 },
  Rejected:   { color: RED,   bg: 'rgba(239,68,68,0.10)',   icon: XCircle },
  Waitlisted: { color: BLUE,  bg: 'rgba(59,130,246,0.10)',  icon: AlertCircle },
};

interface App {
  id: string; ref: string; firstName: string; lastName: string;
  applyingGrade: string; academicYear: string; status: Status;
  email: string | null; phone: string | null; parentName: string | null;
  parentPhone: string | null; previousSchool: string | null; adminNote: string | null;
  createdAt: string;
}

function DetailModal({ app, onClose, onStatusChange }: {
  app: App; onClose: () => void;
  onStatusChange: (id: string, status: Status, note: string) => Promise<void>;
}) {
  const [note, setNote] = useState(app.adminNote ?? '');
  const [busy, setBusy] = useState(false);

  const act = async (status: Status) => {
    setBusy(true);
    await onStatusChange(app.id, status, note);
    setBusy(false);
    onClose();
  };

  const sc = STATUS_CFG[app.status]; const Icon = sc.icon;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: TEXT }}>{app.firstName} {app.lastName}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{app.ref} · Grade {app.applyingGrade} · {app.academicYear}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: sc.bg }}>
            <Icon size={12} style={{ color: sc.color }} /><span style={{ fontSize: 12, fontWeight: 600, color: sc.color }}>{app.status}</span>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          {([['Email', app.email], ['Phone', app.phone], ['Parent / Guardian', app.parentName], ['Parent Phone', app.parentPhone], ['Previous School', app.previousSchool], ['Applied', new Date(app.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })]] as [string,string|null][]).map(([label, val]) => val ? (
            <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: MUTED, width: 130, flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 13, color: TEXT }}>{val}</span>
            </div>
          ) : null)}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 6 }}>ADMIN NOTE</div>
            <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note…"
              style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, color: TEXT, fontFamily: FB, fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {(['Approved', 'Waitlisted', 'Rejected'] as Status[]).map(s => {
              const c = STATUS_CFG[s];
              return (
                <button key={s} disabled={busy || app.status === s} onClick={() => act(s)}
                  style={{ padding: '9px 18px', borderRadius: 9, border: `1px solid ${c.color}40`, cursor: busy || app.status === s ? 'default' : 'pointer', background: app.status === s ? c.bg : 'transparent', color: c.color, fontFamily: FH, fontSize: 13, fontWeight: 600, opacity: app.status === s ? 0.5 : 1 }}>
                  {busy ? '…' : s}
                </button>
              );
            })}
            <button onClick={onClose} style={{ marginLeft: 'auto', padding: '9px 18px', borderRadius: 9, border: `1px solid ${BORDER}`, cursor: 'pointer', background: 'transparent', color: MUTED, fontFamily: FH, fontSize: 13 }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [selected, setSelected] = useState<App | null>(null);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 4000); };

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/applications').then(r => r.json()).then(d => { setApps(d.applications ?? []); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: Status, adminNote: string) => {
    const res = await fetch('/api/applications', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, adminNote }),
    });
    if (res.ok) { flash(`✓ Application ${status.toLowerCase()}.`); load(); }
    else flash('Could not update application.');
  };

  const counts = { All: apps.length, Pending: 0, Approved: 0, Rejected: 0, Waitlisted: 0 };
  for (const a of apps) { if (counts[a.status] !== undefined) counts[a.status]++; }

  const filtered = apps.filter(a =>
    (statusFilter === 'All' || a.status === statusFilter) &&
    (!search || `${a.firstName} ${a.lastName} ${a.ref}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Applications</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Review and process admissions applications.</p>
      </div>

      {toast && (
        <div style={{ marginBottom: 16, padding: '11px 16px', borderRadius: 10, background: toast.startsWith('✓') ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)', border: `1px solid ${toast.startsWith('✓') ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, fontSize: 13, color: toast.startsWith('✓') ? GREEN : AMBER }}>
          {toast}
        </div>
      )}

      <div className="portal-stats-grid" style={{ marginBottom: 20 }}>
        {(['Pending', 'Approved', 'Waitlisted', 'Rejected'] as Status[]).map(s => {
          const c = STATUS_CFG[s]; const Icon = c.icon;
          return (
            <div key={s} style={{ background: SURFACE, border: `1px solid ${statusFilter === s ? c.color + '40' : BORDER}`, borderRadius: 13, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setStatusFilter(s === statusFilter ? 'All' : s)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{s}</span>
                <Icon size={14} style={{ color: c.color }} />
              </div>
              <div style={{ fontFamily: FH, fontSize: 26, fontWeight: 700, color: counts[s] > 0 ? c.color : TEXT, letterSpacing: '-0.02em' }}>{counts[s]}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 8, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '0 12px' }}>
          <Search size={14} style={{ color: MUTED, flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or reference…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: TEXT, fontFamily: FB, fontSize: 13, padding: '10px 0' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, color: TEXT, fontFamily: FB, fontSize: 13, padding: '10px 36px 10px 14px', outline: 'none', cursor: 'pointer', appearance: 'none' }}>
            {(['All', 'Pending', 'Approved', 'Waitlisted', 'Rejected'] as const).map(s => (
              <option key={s} value={s} style={{ background: S2 }}>{s} ({counts[s]})</option>
            ))}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: MUTED, pointerEvents: 'none' }} />
        </div>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 13 }}><Loader2 size={20} className="animate-spin" style={{ marginBottom: 8 }} /><br />Loading applications…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <FileText size={32} style={{ color: MUTED, marginBottom: 12, opacity: 0.5 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No applications found</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 110px 110px', gap: 12, padding: '11px 20px', borderBottom: `1px solid ${BORDER}` }}>
              {['Applicant', 'Grade', 'Year', 'Applied', 'Status'].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {filtered.map(app => {
              const sc = STATUS_CFG[app.status]; const Icon = sc.icon;
              return (
                <div key={app.id} onClick={() => setSelected(app)}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 110px 110px', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = S2)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT }}>{app.firstName} {app.lastName}</div>
                    <div style={{ fontSize: 11, color: FAINT, marginTop: 2 }}>{app.ref}</div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT, alignSelf: 'center' }}>{app.applyingGrade}</div>
                  <div style={{ fontSize: 13, color: MUTED, alignSelf: 'center' }}>{app.academicYear}</div>
                  <div style={{ fontSize: 12, color: MUTED, alignSelf: 'center' }}>{new Date(app.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: sc.bg, width: 'fit-content', alignSelf: 'center' }}>
                    <Icon size={11} style={{ color: sc.color }} /><span style={{ fontSize: 11, fontWeight: 600, color: sc.color }}>{app.status}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {selected && <DetailModal app={selected} onClose={() => { setSelected(null); }} onStatusChange={handleStatusChange} />}
    </div>
  );
}
