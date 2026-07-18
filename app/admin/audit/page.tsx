'use client';

import { useState, useMemo } from 'react';
import { Search, X, Download, CheckCircle2, XCircle, Edit2, LogIn, Upload, Trash2, Plus } from 'lucide-react';
import { AUDIT_LOG } from '@/data/adminData';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E', S3 = '#1A3049';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

type ActionType = 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'login' | 'export';

const TYPE_CFG: Record<ActionType, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  approve: { label: 'Approve', color: GREEN,  bg: 'rgba(16,185,129,0.12)',  Icon: CheckCircle2 },
  reject:  { label: 'Reject',  color: RED,    bg: 'rgba(239,68,68,0.12)',   Icon: XCircle      },
  create:  { label: 'Create',  color: BLUE,   bg: 'rgba(59,130,246,0.12)',  Icon: Plus         },
  update:  { label: 'Update',  color: AMBER,  bg: 'rgba(245,158,11,0.12)',  Icon: Edit2        },
  delete:  { label: 'Delete',  color: RED,    bg: 'rgba(239,68,68,0.10)',   Icon: Trash2       },
  login:   { label: 'Login',   color: MUTED,  bg: 'rgba(255,255,255,0.06)', Icon: LogIn        },
  export:  { label: 'Export',  color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', Icon: Upload    },
};

export default function AuditPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ActionType | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exported, setExported] = useState(false);

  const filtered = useMemo(() =>
    AUDIT_LOG.filter(e => {
      const matchType = typeFilter === 'all' || e.type === typeFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || e.action.toLowerCase().includes(q) || e.record.toLowerCase().includes(q) || e.admin.toLowerCase().includes(q);
      return matchType && matchSearch;
    }),
  [search, typeFilter]);

  const TYPE_TABS: { key: ActionType | 'all'; label: string }[] = [
    { key: 'all',    label: 'All Actions' },
    { key: 'approve',label: 'Approvals' },
    { key: 'reject', label: 'Rejections' },
    { key: 'create', label: 'Created' },
    { key: 'update', label: 'Updates' },
    { key: 'login',  label: 'Logins' },
    { key: 'export', label: 'Exports' },
  ];

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Audit Log</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Complete record of all admin actions</p>
        </div>
        <button onClick={() => { setExported(true); setTimeout(() => setExported(false), 3000); }}
          style={{ background: exported ? 'rgba(16,185,129,0.12)' : S2, color: exported ? GREEN : MUTED, border: `1px solid ${exported ? 'rgba(16,185,129,0.25)' : BORDER}`, borderRadius: 9999, padding: '9px 20px', fontFamily: FB, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all .2s' }}>
          {exported ? <><CheckCircle2 size={13} /> Exported</> : <><Download size={13} /> Export Log</>}
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Actions',  value: AUDIT_LOG.length, color: BLUE },
          { label: 'Approvals',     value: AUDIT_LOG.filter(e => e.type === 'approve').length, color: GREEN },
          { label: 'Rejections',    value: AUDIT_LOG.filter(e => e.type === 'reject').length,  color: RED   },
          { label: 'Today',         value: 2, color: GOLD },
        ].map(s => (
          <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
            <div style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {TYPE_TABS.map(t => (
            <button key={t.key} onClick={() => setTypeFilter(t.key as typeof typeFilter)}
              style={{ padding: '5px 12px', borderRadius: 8, background: typeFilter === t.key ? GOLD_DIM : S2, border: `1px solid ${typeFilter === t.key ? GOLD_B : BORDER}`, color: typeFilter === t.key ? GOLD : MUTED, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px', width: 210 }}>
          <Search size={12} style={{ color: FAINT }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT }}><X size={11} /></button>}
        </div>
      </div>

      {/* Log table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 120px 140px 1fr 90px', padding: '10px 18px', borderBottom: `1px solid ${BORDER}` }}>
          {['Timestamp', 'Type', 'Admin', 'Action & Record', 'Details'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 13 }}>No entries match your filter.</div>
        )}

        {filtered.map((e, i) => {
          const tc = TYPE_CFG[e.type as ActionType];
          const TIcon = tc.Icon;
          const [showDetails, setShowDetails] = useState(false);
          return (
            <div key={e.id}
              style={{ display: 'grid', gridTemplateColumns: '160px 120px 140px 1fr 90px', alignItems: 'start', padding: '0 18px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)`, transition: 'background .1s' }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLElement).style.background = 'transparent'; }}>

              <div style={{ padding: '12px 0' }}>
                <div style={{ fontSize: 11, color: TEXT }}>{e.timestamp.split(' ')[0]}</div>
                <div style={{ fontSize: 10, color: FAINT }}>{e.timestamp.split(' ')[1]}</div>
              </div>

              <div style={{ padding: '12px 0' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: tc.bg, color: tc.color }}>
                  <TIcon size={9} /> {tc.label}
                </span>
              </div>

              <div style={{ padding: '12px 0', fontSize: 12, color: MUTED }}>{e.admin}</div>

              <div style={{ padding: '12px 0' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: TEXT, marginBottom: 2 }}>{e.action}</div>
                <div style={{ fontSize: 11, color: FAINT, fontFamily: 'monospace' }}>{e.record}</div>
              </div>

              <div style={{ padding: '12px 0' }}>
                <button onClick={() => setShowDetails(v => !v)}
                  style={{ fontSize: 11, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FB, fontWeight: 600 }}>
                  {showDetails ? 'Hide' : 'Details'}
                </button>
              </div>

              {showDetails && (
                <div style={{ gridColumn: '1 / -1', padding: '0 0 12px', borderTop: 'none' }}>
                  <div style={{ background: S2, borderRadius: 9, padding: '10px 14px', fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
                    {e.details}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: FAINT, textAlign: 'right' }}>
        Showing {filtered.length} of {AUDIT_LOG.length} entries
      </div>
    </div>
  );
}
