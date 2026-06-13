'use client';
import { useState } from 'react';
import { GearIcon, UsersIcon, ShieldIcon, FileIcon, CheckIcon } from '@/components/okudingayo/OkuIcons';

const USERS = [
  { id: 'USR-001', name: 'Thulani Mthembu',   email: 'thulani@okudingayo.co.za',   role: 'Administrator', dept: 'Management', status: 'Active', lastLogin: '2 hr ago',   twoFA: true },
  { id: 'USR-002', name: 'Zanele Mchunu',     email: 'zanele@okudingayo.co.za',    role: 'Finance Manager', dept: 'Finance',  status: 'Active', lastLogin: '5 hr ago',   twoFA: true },
  { id: 'USR-003', name: 'Lungelo Ndlovu',    email: 'lungelo@okudingayo.co.za',   role: 'Safety Manager', dept: 'HSE',       status: 'Active', lastLogin: '1 day ago',  twoFA: false },
  { id: 'USR-004', name: 'Nokuthula Zulu',    email: 'nokuthula@okudingayo.co.za', role: 'Administrator',  dept: 'Admin',     status: 'Active', lastLogin: '3 hr ago',   twoFA: true },
  { id: 'USR-005', name: 'Bongani Nkosi',     email: 'bongani@okudingayo.co.za',   role: 'Supervisor',    dept: 'Operations',status: 'Active', lastLogin: '30 min ago', twoFA: false },
  { id: 'USR-006', name: 'Rajesh Pillay',     email: 'r.pillay@coastlinedv.co.za', role: 'Client',        dept: 'External',  status: 'Active', lastLogin: '2 days ago', twoFA: false },
  { id: 'USR-007', name: 'Sipho Dlamini',     email: 's.dlamini@transnet.net',     role: 'Client',        dept: 'External',  status: 'Active', lastLogin: '1 day ago',  twoFA: false },
];

const ROLES = [
  { role: 'Administrator', perms: ['Full system access', 'User management', 'Financial reports', 'All modules'], color: '#ef4444' },
  { role: 'Finance Manager', perms: ['Invoices & quotes', 'Financial reports', 'Payslips', 'Read-only projects'], color: '#f59e0b' },
  { role: 'Safety Manager', perms: ['Safety module full', 'Incident reporting', 'Employee certs', 'Read-only all'], color: '#10b981' },
  { role: 'Supervisor', perms: ['Projects assigned to them', 'Team under them', 'Site photos', 'Daily reports'], color: '#3b82f6' },
  { role: 'Employee', perms: ['Own profile only', 'View assigned jobs', 'Submit incident reports'], color: '#8b5cf6' },
  { role: 'Client', perms: ['Client portal only', 'Own project status', 'Download own invoices'], color: '#64748b' },
];

const AUDIT = [
  { user: 'Thulani Mthembu', action: 'Created invoice INV-2026-093',        module: 'Finance',   time: '10 min ago' },
  { user: 'Zanele Mchunu',   action: 'Downloaded payslips bundle May 2026',  module: 'Finance',   time: '1 hr ago' },
  { user: 'Lungelo Ndlovu',  action: 'Submitted toolbox talk record',        module: 'Safety',    time: '2 hr ago' },
  { user: 'Nokuthula Zulu',  action: 'Added employee: Siphamandla Dube',     module: 'HR',        time: '5 hr ago' },
  { user: 'Bongani Nkosi',   action: 'Uploaded 6 site photos — Umhlanga',    module: 'Photos',    time: '6 hr ago' },
  { user: 'Thulani Mthembu', action: 'Updated project progress — Harbour 2', module: 'Projects',  time: '1 day ago' },
  { user: 'r.pillay',        action: 'Client portal login — viewed invoice', module: 'Client Portal','time': '1 day ago' },
];

const ROLE_COLORS: Record<string, string> = {
  Administrator: '#ef4444', 'Finance Manager': '#f59e0b', 'Safety Manager': '#10b981',
  Supervisor: '#3b82f6', Employee: '#8b5cf6', Client: '#64748b',
};

export default function AdminTab() {
  const [view, setView] = useState<'users' | 'roles' | 'audit' | 'settings'>('users');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Sub-nav */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 100, padding: 4, width: 'fit-content' }}>
        {(['users', 'roles', 'audit', 'settings'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '9px 22px', borderRadius: 100, border: 'none', cursor: 'pointer',
            background: view === v ? 'white' : 'transparent',
            color: view === v ? '#1e4db3' : '#64748b', fontWeight: 700, fontSize: 13,
            boxShadow: view === v ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', textTransform: 'capitalize',
          }}>{v}</button>
        ))}
      </div>

      {/* Users panel */}
      {view === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>System Users ({USERS.length})</div>
            <button style={{ background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 100, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Invite User</button>
          </div>
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['User', 'Email', 'Role', 'Department', 'Status', '2FA', 'Last Login', ''].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u, i) => (
                    <tr key={u.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafcff' }}>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: ROLE_COLORS[u.role] || '#64748b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: 12, flexShrink: 0,
                          }}>{u.name.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748b' }}>{u.email}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: (ROLE_COLORS[u.role] || '#64748b') + '20', color: ROLE_COLORS[u.role] || '#64748b' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748b' }}>{u.dept}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 100 }}>{u.status}</span>
                      </td>
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        {u.twoFA ? <CheckIcon size={16} color="#10b981" strokeWidth={2} /> : <span style={{ fontSize: 11, color: '#94a3b8' }}>Off</span>}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 11, color: '#94a3b8' }}>{u.lastLogin}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {['Edit', 'Permissions'].map(a => (
                            <button key={a} style={{ padding: '5px 11px', borderRadius: 100, border: '1.5px solid #e2e8f0', background: 'white', color: '#334155', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{a}</button>
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
      )}

      {/* Roles panel */}
      {view === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {ROLES.map(r => (
            <div key={r.role} style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', background: r.color + '12', borderBottom: `2px solid ${r.color}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{r.role}</span>
                <span style={{ fontSize: 12, fontWeight: 700, background: r.color + '20', color: r.color, padding: '3px 12px', borderRadius: 100 }}>{USERS.filter(u => u.role === r.role).length} users</span>
              </div>
              <div style={{ padding: '14px 20px' }}>
                {r.perms.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < r.perms.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <CheckIcon size={14} color={r.color} strokeWidth={2} />
                    <span style={{ fontSize: 12, color: '#334155' }}>{p}</span>
                  </div>
                ))}
                <button style={{ marginTop: 12, width: '100%', padding: '8px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', color: '#334155', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit Permissions</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit log */}
      {view === 'audit' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Audit Log</span>
            <button style={{ border: '1.5px solid #e2e8f0', background: 'white', padding: '7px 16px', borderRadius: 100, fontSize: 12, color: '#334155', cursor: 'pointer', fontWeight: 600 }}>Export Log</button>
          </div>
          {AUDIT.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 22px', borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1e4db3', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 13 }}>{a.user}</span>
                <span style={{ fontSize: 13, color: '#334155' }}> {a.action}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, background: '#f0f5ff', color: '#1e4db3', padding: '3px 10px', borderRadius: 100 }}>{a.module}</span>
              <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{a.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {view === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            {
              title: 'Company Details', fields: [
                { label: 'Company Name', value: 'Okudingayo Trading Enterprise' },
                { label: 'Registration Number', value: 'CK2019/123456/23' },
                { label: 'VAT Number', value: '4230000000' },
                { label: 'CIDB Registration', value: 'CIDB-2019-KZN-0042' },
                { label: 'Primary Contact', value: '031 445 6789' },
              ],
            },
            {
              title: 'System Settings', fields: [
                { label: 'Financial Year End', value: 'February 28' },
                { label: 'Default Currency', value: 'ZAR (South African Rand)' },
                { label: 'Tax Rate', value: '15% VAT' },
                { label: 'Time Zone', value: 'Africa/Johannesburg (SAST)' },
                { label: 'Date Format', value: 'DD MMM YYYY' },
              ],
            },
          ].map(section => (
            <div key={section.title} style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{section.title}</span>
                <button style={{ fontSize: 11, fontWeight: 700, color: '#1e4db3', background: '#f0f5ff', border: 'none', padding: '5px 12px', borderRadius: 100, cursor: 'pointer' }}>Edit</button>
              </div>
              <div style={{ padding: '8px 0' }}>
                {section.fields.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 22px', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{f.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
