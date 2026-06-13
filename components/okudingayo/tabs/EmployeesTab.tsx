'use client';
import { useState } from 'react';
import { UsersIcon, CheckIcon, AlertIcon, ClockIcon, FileIcon, PhoneIcon } from '@/components/okudingayo/OkuIcons';

const EMPLOYEES = [
  { id: 'EMP-001', name: 'Bongani Nkosi',      role: 'Senior Scaffolder',  dept: 'Operations', phone: '071 234 5678', status: 'On Site', coc: 'Valid', medical: 'Valid',   joined: 'Mar 2019', projects: 3, avatar: '#1e4db3' },
  { id: 'EMP-002', name: 'Themba Khumalo',      role: 'Scaffolder',         dept: 'Operations', phone: '082 345 6789', status: 'On Site', coc: 'Valid', medical: 'Valid',   joined: 'Jul 2020', projects: 2, avatar: '#0891b2' },
  { id: 'EMP-003', name: 'Sello Mokoena',       role: 'Site Supervisor',    dept: 'Supervision',phone: '063 456 7890', status: 'Available', coc: 'Valid', medical: 'Expires Jun 28', joined: 'Jan 2018', projects: 1, avatar: '#059669' },
  { id: 'EMP-004', name: 'Siphamandla Dube',    role: 'Apprentice Scaffolder',dept:'Operations',phone: '072 567 8901', status: 'On Site', coc: 'In Training', medical: 'Valid', joined: 'Feb 2025', projects: 1, avatar: '#7c3aed' },
  { id: 'EMP-005', name: 'Thulani Mthembu',     role: 'Project Manager',    dept: 'Management', phone: '083 678 9012', status: 'Office',  coc: 'Valid', medical: 'Valid',   joined: 'Jun 2017', projects: 4, avatar: '#b45309' },
  { id: 'EMP-006', name: 'Nokuthula Zulu',      role: 'Admin Coordinator',  dept: 'Admin',      phone: '061 789 0123', status: 'Office',  coc: 'N/A',  medical: 'Valid',   joined: 'Sep 2021', projects: 0, avatar: '#be185d' },
  { id: 'EMP-007', name: 'Mthokozisi Hadebe',   role: 'Scaffolder',         dept: 'Operations', phone: '079 890 1234', status: 'Leave',   coc: 'Valid', medical: 'Expires Jul 5', joined: 'May 2022', projects: 0, avatar: '#0f766e' },
  { id: 'EMP-008', name: 'Lungelo Ndlovu',      role: 'Safety Officer',     dept: 'HSE',        phone: '065 901 2345', status: 'Office',  coc: 'Valid', medical: 'Valid',   joined: 'Oct 2020', projects: 8, avatar: '#c2410c' },
  { id: 'EMP-009', name: 'Zanele Mchunu',       role: 'Finance Manager',    dept: 'Finance',    phone: '071 012 3456', status: 'Office',  coc: 'N/A',  medical: 'Valid',   joined: 'Mar 2016', projects: 0, avatar: '#6d28d9' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'On Site':   { bg: '#dcfce7', color: '#15803d' },
  'Available': { bg: '#dbeafe', color: '#1d4ed8' },
  'Office':    { bg: '#f1f5f9', color: '#475569' },
  'Leave':     { bg: '#fef3c7', color: '#b45309' },
};

const CERT_STYLE: Record<string, { color: string; bg: string }> = {
  'Valid':       { color: '#15803d', bg: '#dcfce7' },
  'In Training': { color: '#b45309', bg: '#fef3c7' },
  'N/A':         { color: '#94a3b8', bg: '#f1f5f9' },
};

function certStyle(val: string) {
  if (val.startsWith('Expires')) return { color: '#dc2626', bg: '#fee2e2' };
  return CERT_STYLE[val] || CERT_STYLE['N/A'];
}

export default function EmployeesTab() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const depts = ['All', 'Operations', 'Supervision', 'Management', 'Admin', 'HSE', 'Finance'];
  const filtered = EMPLOYEES.filter(e =>
    (deptFilter === 'All' || e.dept === deptFilter) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Employees', value: '34', sub: '28 field, 6 office', color: '#3b82f6', Icon: UsersIcon },
          { label: 'On Site Today',   value: '21', sub: 'Active deployment',  color: '#10b981', Icon: CheckIcon },
          { label: 'Cert Expiring',   value: '3',  sub: 'Action required',    color: '#ef4444', Icon: AlertIcon },
          { label: 'On Leave',        value: '2',  sub: 'Return next week',   color: '#f59e0b', Icon: ClockIcon },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 14, border: '1.5px solid #f1f5f9',
            boxShadow: '0 2px 10px rgba(30,77,179,0.05)', padding: '16px 18px',
            borderLeft: `4px solid ${s.color}`, display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <s.Icon size={22} color={s.color} strokeWidth={1.8} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{s.label}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search employees..."
          style={{
            flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 100,
            border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: 'white',
          }}
        />
        {depts.map(d => (
          <button key={d} onClick={() => setDeptFilter(d)} style={{
            padding: '8px 14px', borderRadius: 100, border: '1.5px solid',
            borderColor: deptFilter === d ? '#1e4db3' : '#e2e8f0',
            background: deptFilter === d ? '#1e4db3' : 'white',
            color: deptFilter === d ? 'white' : '#64748b',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>{d}</button>
        ))}
        <button style={{
          background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white',
          border: 'none', padding: '10px 20px', borderRadius: 100, fontWeight: 700, fontSize: 13, cursor: 'pointer',
        }}>+ Add Employee</button>
      </div>

      {/* Employee Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Employee Register ({filtered.length})</span>
          <button style={{ border: '1.5px solid #e2e8f0', background: 'white', padding: '7px 16px', borderRadius: 100, fontSize: 12, color: '#334155', cursor: 'pointer', fontWeight: 600 }}>Export CSV</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Employee', 'Role / Dept', 'Contact', 'Status', 'COC Cert', 'Medical', 'Projects', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafcff' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: e.avatar,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0,
                      }}>{e.name.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{e.name}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>{e.id} · Joined {e.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{e.role}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{e.dept}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12 }}>
                      <PhoneIcon size={12} color="#94a3b8" strokeWidth={1.8} /> {e.phone}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
                      background: STATUS_STYLE[e.status]?.bg || '#f1f5f9',
                      color: STATUS_STYLE[e.status]?.color || '#475569',
                    }}>{e.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, ...certStyle(e.coc) }}>{e.coc}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, ...certStyle(e.medical) }}>{e.medical}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1e4db3' }}>{e.projects}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['Profile', 'Docs'].map(a => (
                        <button key={a} style={{
                          padding: '5px 12px', borderRadius: 100, border: '1.5px solid #e2e8f0',
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
  );
}
