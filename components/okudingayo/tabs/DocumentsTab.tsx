'use client';
import { useState } from 'react';
import { FileIcon, FolderIcon, ShieldIcon, ReceiptIcon, UsersIcon } from '@/components/okudingayo/OkuIcons';

const DOCS = [
  { name: 'Hyprop Investments — Master Contract 2026', category: 'Contracts', size: '2.4 MB', type: 'PDF', date: 'May 15, 2026', project: 'Gateway Theatre', uploadedBy: 'Thulani Mthembu', version: 'v3' },
  { name: 'INV-2026-089 — Hyprop Renovation Invoice', category: 'Invoices', size: '0.8 MB', type: 'PDF', date: 'Jun 1, 2026', project: 'Gateway Theatre', uploadedBy: 'Zanele Mchunu', version: 'v1' },
  { name: 'QUO-2026-041 — EDTEA Industrial Park Quote', category: 'Quotations', size: '1.1 MB', type: 'PDF', date: 'May 28, 2026', project: 'KwaMashu Industrial Park', uploadedBy: 'Thulani Mthembu', version: 'v2' },
  { name: 'Bongani Nkosi — COC Certificate 2026', category: 'Compliance', size: '0.5 MB', type: 'PDF', date: 'Jan 10, 2026', project: 'N/A', uploadedBy: 'Lungelo Ndlovu', version: 'v1' },
  { name: 'Transnet Harbour Phase 2 — SLA Agreement', category: 'Contracts', size: '3.2 MB', type: 'PDF', date: 'Apr 5, 2026', project: 'Harbour Phase 2', uploadedBy: 'Thulani Mthembu', version: 'v1' },
  { name: 'PAY-2026-MAY — May 2026 Payslips Bundle', category: 'Payslips', size: '4.8 MB', type: 'ZIP', date: 'May 31, 2026', project: 'N/A', uploadedBy: 'Zanele Mchunu', version: 'v1' },
  { name: 'Umhlanga Site Risk Assessment — Phase 1', category: 'Compliance', size: '1.6 MB', type: 'PDF', date: 'Mar 20, 2026', project: 'Umhlanga Office Complex', uploadedBy: 'Lungelo Ndlovu', version: 'v2' },
  { name: 'INV-2026-078 — Transnet Progress Claim 3', category: 'Invoices', size: '0.9 MB', type: 'PDF', date: 'May 18, 2026', project: 'Harbour Phase 2', uploadedBy: 'Zanele Mchunu', version: 'v1' },
  { name: 'Employee Contracts Bundle — Q1 2026', category: 'Contracts', size: '6.2 MB', type: 'ZIP', date: 'Jan 15, 2026', project: 'N/A', uploadedBy: 'Nokuthula Zulu', version: 'v1' },
  { name: 'QUO-2026-038 — Ballito Apartments Quote', category: 'Quotations', size: '0.7 MB', type: 'PDF', date: 'Apr 22, 2026', project: 'Ballito Apartments', uploadedBy: 'Thulani Mthembu', version: 'v3' },
];

const CATEGORIES = [
  { name: 'All Files',   count: 47, Icon: FolderIcon,  color: '#3b82f6' },
  { name: 'Contracts',   count: 12, Icon: FileIcon,    color: '#8b5cf6' },
  { name: 'Invoices',    count: 18, Icon: ReceiptIcon, color: '#10b981' },
  { name: 'Quotations',  count: 9,  Icon: FileIcon,    color: '#f59e0b' },
  { name: 'Payslips',    count: 6,  Icon: UsersIcon,   color: '#06b6d4' },
  { name: 'Compliance',  count: 14, Icon: ShieldIcon,  color: '#ef4444' },
];

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  'Contracts':  { bg: '#ede9fe', color: '#6d28d9' },
  'Invoices':   { bg: '#dcfce7', color: '#15803d' },
  'Quotations': { bg: '#fef3c7', color: '#b45309' },
  'Payslips':   { bg: '#cffafe', color: '#0e7490' },
  'Compliance': { bg: '#fee2e2', color: '#dc2626' },
};

export default function DocumentsTab() {
  const [cat, setCat] = useState('All Files');
  const [search, setSearch] = useState('');

  const filtered = DOCS.filter(d =>
    (cat === 'All Files' || d.category === cat) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%' }}>

      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Categories</span>
          </div>
          {CATEGORIES.map(c => (
            <button key={c.name} onClick={() => setCat(c.name)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
              border: 'none', borderLeft: cat === c.name ? `3px solid ${c.color}` : '3px solid transparent',
              background: cat === c.name ? c.color + '12' : 'transparent',
              cursor: 'pointer', textAlign: 'left',
            }}>
              <c.Icon size={18} color={cat === c.name ? c.color : '#94a3b8'} strokeWidth={1.8} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: cat === c.name ? 700 : 500, color: cat === c.name ? '#0f172a' : '#64748b' }}>{c.name}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, background: cat === c.name ? c.color : '#f1f5f9',
                color: cat === c.name ? 'white' : '#94a3b8', padding: '2px 8px', borderRadius: 100,
              }}>{c.count}</span>
            </button>
          ))}
          <div style={{ padding: '14px 18px', borderTop: '1px solid #f1f5f9' }}>
            <button style={{
              width: '100%', background: 'linear-gradient(135deg,#1e4db3,#3b72d9)',
              color: 'white', border: 'none', padding: '10px', borderRadius: 10,
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}>Upload Document</button>
          </div>
        </div>

        {/* Storage usage */}
        <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid #f1f5f9', padding: '16px', marginTop: 14, boxShadow: '0 2px 8px rgba(30,77,179,0.04)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Storage Used</div>
          <div style={{ height: 6, background: '#f1f5f9', borderRadius: 100, marginBottom: 6 }}>
            <div style={{ height: '100%', width: '62%', background: 'linear-gradient(90deg,#1e4db3,#3b72d9)', borderRadius: 100 }} />
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>6.2 GB of 10 GB used (62%)</div>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Search & actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 100,
              border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: 'white',
            }}
          />
          {['Download All', 'Print'].map(a => (
            <button key={a} style={{
              padding: '10px 18px', borderRadius: 100, border: '1.5px solid #e2e8f0',
              background: 'white', color: '#334155', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{a}</button>
          ))}
        </div>

        {/* Document table */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{cat} <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 12 }}>({filtered.length} files)</span></span>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#94a3b8', alignItems: 'center' }}>
              <span>Sort by: Date</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Document Name', 'Category', 'Project', 'Uploaded By', 'Date', 'Size', 'Ver.', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafcff' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, background: '#f0f5ff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <FileIcon size={15} color="#1e4db3" strokeWidth={1.8} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{d.name}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{d.type} file</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, ...CAT_COLORS[d.category] }}>{d.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{d.project}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{d.uploadedBy}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{d.date}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{d.size}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 100 }}>{d.version}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {['View', 'Download'].map(a => (
                          <button key={a} style={{
                            padding: '5px 11px', borderRadius: 100, border: '1.5px solid #e2e8f0',
                            background: 'white', color: '#334155', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          }}>{a}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
