'use client';
import { useState } from 'react';
import { CoinIcon, TrendUpIcon, ReceiptIcon, AlertIcon, CheckIcon } from '@/components/okudingayo/OkuIcons';

const INVOICES = [
  { id: 'INV-2026-089', client: 'Hyprop Investments',     project: 'Gateway Theatre',       amount: 'R 48,500',  status: 'Paid',      due: 'Jun 1, 2026',  issued: 'May 15, 2026' },
  { id: 'INV-2026-090', client: 'Transnet Port Authority', project: 'Harbour Phase 2',       amount: 'R 124,000', status: 'Pending',   due: 'Jun 20, 2026', issued: 'Jun 1, 2026' },
  { id: 'INV-2026-091', client: 'Coastline Developments',  project: 'Umhlanga Office',       amount: 'R 87,500',  status: 'Pending',   due: 'Jun 25, 2026', issued: 'Jun 5, 2026' },
  { id: 'INV-2026-092', client: 'EDTEA',                   project: 'KwaMashu Industrial',   amount: 'R 42,000',  status: 'Overdue',   due: 'Jun 3, 2026',  issued: 'May 20, 2026' },
  { id: 'INV-2026-085', client: 'uMgungundlovu DM',        project: 'Pietermaritzburg Works',amount: 'R 55,000',  status: 'Paid',      due: 'May 28, 2026', issued: 'May 10, 2026' },
  { id: 'INV-2026-086', client: 'Transnet Port Authority', project: 'Harbour Phase 2',       amount: 'R 98,000',  status: 'Paid',      due: 'May 18, 2026', issued: 'May 1, 2026' },
  { id: 'INV-2026-093', client: 'Seeff Coastal Properties',project: 'Ballito Apartments',    amount: 'R 28,000',  status: 'Draft',     due: 'Jun 30, 2026', issued: 'Jun 7, 2026' },
];

const QUOTATIONS = [
  { id: 'QUO-2026-044', client: 'Nedbank Head Office',     value: 'R 340,000', status: 'Sent',     expiry: 'Jun 30, 2026' },
  { id: 'QUO-2026-043', client: 'Ethekwini Municipality',  value: 'R 890,000', status: 'Reviewing',expiry: 'Jun 24, 2026' },
  { id: 'QUO-2026-041', client: 'EDTEA',                   value: 'R 2,100,000',status: 'Accepted', expiry: 'Accepted' },
  { id: 'QUO-2026-040', client: 'Growthpoint Properties',  value: 'R 560,000', status: 'Declined', expiry: 'Expired' },
];

const STAT_COLORS: Record<string, { bg: string; color: string }> = {
  'Paid':      { bg: '#dcfce7', color: '#15803d' },
  'Pending':   { bg: '#fef3c7', color: '#b45309' },
  'Overdue':   { bg: '#fee2e2', color: '#dc2626' },
  'Draft':     { bg: '#f1f5f9', color: '#475569' },
  'Sent':      { bg: '#dbeafe', color: '#1d4ed8' },
  'Reviewing': { bg: '#fef3c7', color: '#b45309' },
  'Accepted':  { bg: '#dcfce7', color: '#15803d' },
  'Declined':  { bg: '#fee2e2', color: '#dc2626' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const REVENUE = [82, 95, 110, 103, 138, 142];
const MAX_REV = 160;

export default function FinanceTab() {
  const [tab, setTab] = useState<'invoices' | 'quotations'>('invoices');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Revenue (MTD)',   value: 'R 142,500', sub: '+18% vs last month', Icon: CoinIcon,    color: '#10b981' },
          { label: 'Outstanding',     value: 'R 253,500', sub: '3 invoices overdue', Icon: AlertIcon,   color: '#f59e0b' },
          { label: 'Collected MTD',   value: 'R 201,500', sub: 'On-time rate: 88%',  Icon: CheckIcon,   color: '#3b82f6' },
          { label: 'YTD Revenue',     value: 'R 671,000', sub: 'Target: R 900,000',  Icon: TrendUpIcon, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9',
            boxShadow: '0 2px 12px rgba(30,77,179,0.06)', padding: '18px 20px',
            borderTop: `3px solid ${s.color}`,
          }}>
            <s.Icon size={22} color={s.color} strokeWidth={1.8} />
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 10, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Invoice / Quotation table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, background: '#f1f5f9', borderRadius: 100, padding: 4, width: 'fit-content' }}>
            {(['invoices', 'quotations'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '8px 22px', borderRadius: 100, border: 'none', cursor: 'pointer',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#1e4db3' : '#64748b',
                fontWeight: 700, fontSize: 13,
                boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}>{t === 'invoices' ? 'Invoices' : 'Quotations'}</button>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{tab === 'invoices' ? 'Invoice Register' : 'Quotation Pipeline'}</span>
              <button style={{
                background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white', border: 'none',
                padding: '8px 18px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>{tab === 'invoices' ? '+ New Invoice' : '+ New Quote'}</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {tab === 'invoices' ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Invoice #', 'Client', 'Project', 'Amount', 'Status', 'Due Date', ''].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICES.map((inv, i) => (
                      <tr key={inv.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafcff' }}>
                        <td style={{ padding: '13px 16px', fontWeight: 700, color: '#1e4db3', fontSize: 12 }}>{inv.id}</td>
                        <td style={{ padding: '13px 16px', fontWeight: 600, color: '#0f172a' }}>{inv.client}</td>
                        <td style={{ padding: '13px 16px', color: '#64748b', fontSize: 12 }}>{inv.project}</td>
                        <td style={{ padding: '13px 16px', fontWeight: 800, color: '#0f172a' }}>{inv.amount}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, ...STAT_COLORS[inv.status] }}>{inv.status}</span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{inv.due}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {['View', 'Send'].map(a => (
                              <button key={a} style={{ padding: '5px 11px', borderRadius: 100, border: '1.5px solid #e2e8f0', background: 'white', color: '#334155', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{a}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Quote #', 'Client', 'Value', 'Status', 'Expiry', ''].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {QUOTATIONS.map((q, i) => (
                      <tr key={q.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafcff' }}>
                        <td style={{ padding: '13px 16px', fontWeight: 700, color: '#1e4db3', fontSize: 12 }}>{q.id}</td>
                        <td style={{ padding: '13px 16px', fontWeight: 600, color: '#0f172a' }}>{q.client}</td>
                        <td style={{ padding: '13px 16px', fontWeight: 800, color: '#0f172a' }}>{q.value}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, ...STAT_COLORS[q.status] }}>{q.status}</span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748b' }}>{q.expiry}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {['View', 'Convert'].map(a => (
                              <button key={a} style={{ padding: '5px 11px', borderRadius: 100, border: '1.5px solid #e2e8f0', background: 'white', color: '#334155', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{a}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Revenue chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', padding: '20px', overflow: 'hidden' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Monthly Revenue (2026)</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, paddingBottom: 8 }}>
              {MONTHS.map((m, i) => (
                <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700 }}>R{REVENUE[i]}k</div>
                  <div style={{
                    width: '100%', height: `${(REVENUE[i] / MAX_REV) * 120}px`,
                    background: i === MONTHS.length - 1
                      ? 'linear-gradient(180deg,#1e4db3,#3b72d9)'
                      : 'linear-gradient(180deg,#93c5fd,#bfdbfe)',
                    borderRadius: '6px 6px 0 0', transition: 'height 0.5s',
                  }} />
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{m}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', padding: '18px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Generate VAT Report', 'Download Payslips', 'Export Transactions', 'SARS Submission'].map(a => (
                <button key={a} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0',
                  background: 'white', cursor: 'pointer', width: '100%',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{a}</span>
                  <span style={{ color: '#1e4db3', fontSize: 16 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
