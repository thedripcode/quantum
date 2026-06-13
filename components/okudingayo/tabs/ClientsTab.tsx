'use client';
import { useState } from 'react';
import { KeyIcon, BuildingIcon, FileIcon, ReviewIcon, PhoneIcon, CheckIcon } from '@/components/okudingayo/OkuIcons';

const CLIENTS = [
  {
    id: 'CLT-001', name: 'Coastline Developments Ltd', contact: 'Rajesh Pillay', email: 'r.pillay@coastlinedv.co.za',
    phone: '031 445 6789', type: 'Commercial', projects: 2, spend: 'R 685,000',
    portalAccess: true, status: 'Active', avatar: '#1e4db3', joined: 'Jan 2024',
    lastActivity: '2 days ago',
  },
  {
    id: 'CLT-002', name: 'Transnet Port Authority', contact: 'Sipho Dlamini', email: 's.dlamini@transnet.net',
    phone: '031 361 2000', type: 'Government / SOE', projects: 3, spend: 'R 2,140,000',
    portalAccess: true, status: 'Active', avatar: '#0891b2', joined: 'Jun 2022',
    lastActivity: '1 day ago',
  },
  {
    id: 'CLT-003', name: 'Hyprop Investments', contact: 'Zanele Khumalo', email: 'z.khumalo@hyprop.co.za',
    phone: '011 447 0000', type: 'Retail Property', projects: 1, spend: 'R 320,000',
    portalAccess: true, status: 'Active', avatar: '#059669', joined: 'Nov 2023',
    lastActivity: '5 days ago',
  },
  {
    id: 'CLT-004', name: 'EDTEA (Dept of Economic Dev)', contact: 'Nomsa Mthethwa', email: 'n.mthethwa@edtea.gov.za',
    phone: '033 264 2600', type: 'Government', projects: 1, spend: 'R 2,100,000',
    portalAccess: false, status: 'Active', avatar: '#7c3aed', joined: 'Apr 2026',
    lastActivity: '1 week ago',
  },
  {
    id: 'CLT-005', name: 'uMgungundlovu District Municipality', contact: 'Bafana Mhlongo', email: 'bmhlongo@umdm.gov.za',
    phone: '033 897 5555', type: 'Municipality', projects: 1, spend: 'R 670,000',
    portalAccess: true, status: 'Active', avatar: '#b45309', joined: 'Feb 2026',
    lastActivity: '3 days ago',
  },
  {
    id: 'CLT-006', name: 'Seeff Coastal Properties', contact: 'Linda Ntuli', email: 'l.ntuli@seeffcoastal.co.za',
    phone: '032 586 1200', type: 'Residential Developer', projects: 1, spend: 'R 210,000',
    portalAccess: false, status: 'Active', avatar: '#be185d', joined: 'Apr 2026',
    lastActivity: '4 days ago',
  },
];

const MESSAGES = [
  { from: 'Rajesh Pillay', company: 'Coastline Developments', msg: 'Can we schedule a site visit for the east elevation review next week?', time: '2h ago', unread: true },
  { from: 'Sipho Dlamini', company: 'Transnet Port Authority', msg: 'Please confirm the crane 4 access platform completion date for our maintenance schedule.', time: '1d ago', unread: false },
  { from: 'Zanele Khumalo', company: 'Hyprop Investments', msg: 'The latest inspection report has been approved. Please proceed with final dismantling.', time: '2d ago', unread: false },
];

export default function ClientsTab() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Clients', value: '18', color: '#3b82f6', Icon: KeyIcon },
          { label: 'Active Projects', value: '8', color: '#10b981', Icon: BuildingIcon },
          { label: 'Portal Access', value: '12', color: '#8b5cf6', Icon: CheckIcon },
          { label: 'Total Billed', value: 'R 6.1M', color: '#f59e0b', Icon: FileIcon },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 14, border: '1.5px solid #f1f5f9',
            padding: '16px 18px', borderLeft: `4px solid ${s.color}`, display: 'flex', gap: 12,
            boxShadow: '0 2px 10px rgba(30,77,179,0.05)',
          }}>
            <s.Icon size={22} color={s.color} strokeWidth={1.8} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

        {/* Client list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search clients..."
              style={{ flex: 1, padding: '10px 16px', borderRadius: 100, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: 'white' }}
            />
            <button style={{
              background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: 100, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>+ Add Client</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(c => (
              <div key={c.id}
                onClick={() => setSelected(selected === c.id ? null : c.id)}
                style={{
                  background: 'white', borderRadius: 16, border: selected === c.id ? '2px solid #1e4db3' : '1.5px solid #f1f5f9',
                  boxShadow: '0 2px 12px rgba(30,77,179,0.06)', padding: '18px 22px', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 14, background: c.avatar,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: 16, flexShrink: 0,
                    }}>{c.name.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.contact} · {c.type}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                        <PhoneIcon size={11} color="#94a3b8" strokeWidth={1.8} />
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{c.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, background: '#dcfce7', color: '#15803d',
                      padding: '3px 10px', borderRadius: 100,
                    }}>{c.status}</span>
                    {c.portalAccess && (
                      <span style={{ fontSize: 10, background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 100, fontWeight: 700 }}>Portal Active</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  {[
                    { label: 'Projects', value: c.projects },
                    { label: 'Total Spend', value: c.spend },
                    { label: 'Client Since', value: c.joined },
                    { label: 'Last Activity', value: c.lastActivity },
                  ].map(info => (
                    <div key={info.label}>
                      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{info.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginTop: 2 }}>{info.value}</div>
                    </div>
                  ))}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    {['View Portal', 'Projects', 'Invoices'].map(a => (
                      <button key={a} style={{
                        padding: '5px 12px', borderRadius: 100, border: '1.5px solid #e2e8f0',
                        background: 'white', color: '#334155', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      }}>{a}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages sidebar */}
        <div>
          <div style={{
            background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Client Messages</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 100 }}>1 new</span>
            </div>
            {MESSAGES.map((m, i) => (
              <div key={i} style={{
                padding: '14px 18px', borderBottom: '1px solid #f8fafc',
                background: m.unread ? '#eff6ff' : 'white', cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{m.from}</span>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{m.time}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{m.company}</div>
                <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, margin: 0 }}>{m.msg}</p>
                {m.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 6 }} />}
              </div>
            ))}
            <div style={{ padding: '14px 18px' }}>
              <button style={{
                width: '100%', background: 'linear-gradient(135deg,#1e4db3,#3b72d9)',
                color: 'white', border: 'none', padding: '10px', borderRadius: 10,
                fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>New Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
