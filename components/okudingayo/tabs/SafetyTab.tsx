'use client';
import { useState } from 'react';
import { HardHatIcon, ShieldIcon, AlertIcon, CheckIcon, ClipboardIcon, FileIcon } from '@/components/okudingayo/OkuIcons';

const INCIDENTS = [
  { id: 'INC-001', type: 'Near Miss',   site: 'Harbour Phase 2',      desc: 'Unsecured scaffold board near edge, no injury', date: 'Jun 5, 2026', reportedBy: 'Themba K.', status: 'Closed' },
  { id: 'INC-002', type: 'First Aid',   site: 'Umhlanga Office',       desc: 'Minor hand laceration during coupling assembly', date: 'May 28, 2026', reportedBy: 'Bongani N.', status: 'Closed' },
  { id: 'INC-003', type: 'Near Miss',   site: 'KwaMashu Industrial',   desc: 'Telehandler operating too close to pedestrian zone', date: 'May 20, 2026', reportedBy: 'Siphamandla D.', status: 'Investigation' },
];

const TOOLBOX = [
  { topic: 'Working at Heights — Harness Inspection Protocol', date: 'Jun 6, 2026', site: 'All Sites', facilitator: 'Lungelo Ndlovu', attendance: 28, status: 'Completed' },
  { topic: 'Emergency Evacuation Procedure', date: 'Jun 13, 2026', site: 'Harbour Phase 2', facilitator: 'Lungelo Ndlovu', attendance: null, status: 'Scheduled' },
  { topic: 'Scaffold Erection Safety Standards (SANS 10085)', date: 'Jun 20, 2026', site: 'KwaMashu Industrial', facilitator: 'Lungelo Ndlovu', attendance: null, status: 'Scheduled' },
  { topic: 'Heat Stress and Hydration Awareness', date: 'May 30, 2026', site: 'Umhlanga Site', facilitator: 'Lungelo Ndlovu', attendance: 21, status: 'Completed' },
];

const CERTS = [
  { name: 'Sello Mokoena',   cert: 'Medical Fitness', expiry: 'Jun 28, 2026', daysLeft: 19, status: 'Expiring' },
  { name: 'Mthokozisi Hadebe',cert: 'Medical Fitness', expiry: 'Jul 5, 2026',  daysLeft: 26, status: 'Expiring' },
  { name: 'Siphamandla Dube', cert: 'Working at Heights', expiry: 'Jul 14, 2026', daysLeft: 35, status: 'Expiring' },
  { name: 'Bongani Nkosi',    cert: 'COC Plumbing',    expiry: 'Jan 10, 2027', daysLeft: 215, status: 'Valid' },
  { name: 'Themba Khumalo',   cert: 'First Aid Level 2', expiry: 'Feb 5, 2027',daysLeft: 241, status: 'Valid' },
];

const PPE = [
  { item: 'Full-Body Harness',   total: 28, required: 35, condition: 'Low' },
  { item: 'Hard Hats',           total: 45, required: 40, condition: 'OK' },
  { item: 'Safety Boots',        total: 32, required: 35, condition: 'Low' },
  { item: 'Hi-Vis Vests',        total: 50, required: 40, condition: 'OK' },
  { item: 'Safety Glasses',      total: 25, required: 35, condition: 'Low' },
  { item: 'Gloves (cut-resist)', total: 60, required: 40, condition: 'OK' },
];

export default function SafetyTab() {
  const [incidentForm, setIncidentForm] = useState(false);

  const score = 87;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>

        {/* Compliance gauge */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Safety Score</div>
          <div style={{ position: 'relative', width: 120, height: 120 }}>
            <svg width={120} height={120} viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'} strokeWidth="12" strokeDasharray={`${(score / 100) * 314} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{score}%</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Compliant</div>
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>Target: 95% · <span style={{ color: '#f59e0b', fontWeight: 700 }}>Below target</span></div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: 'Incident-Free Days',  value: '47',  sub: 'Since last incident', color: '#10b981', Icon: ShieldIcon },
            { label: 'Open Incidents',       value: '1',   sub: 'Under investigation', color: '#ef4444', Icon: AlertIcon },
            { label: 'Certs Expiring',       value: '3',   sub: 'Next 60 days',        color: '#f59e0b', Icon: HardHatIcon },
            { label: 'Toolbox Talks (MTD)',  value: '2',   sub: '2 scheduled',         color: '#3b82f6', Icon: ClipboardIcon },
            { label: 'PPE Items Low',        value: '3',   sub: 'Reorder required',    color: '#f59e0b', Icon: AlertIcon },
            { label: 'Risk Assessments',     value: '12',  sub: 'All sites covered',   color: '#10b981', Icon: FileIcon },
          ].map(s => (
            <div key={s.label} style={{
              background: 'white', borderRadius: 14, border: '1.5px solid #f1f5f9',
              padding: '16px 16px', borderLeft: `4px solid ${s.color}`, display: 'flex', gap: 10,
              boxShadow: '0 2px 8px rgba(30,77,179,0.04)',
            }}>
              <s.Icon size={20} color={s.color} strokeWidth={1.8} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{s.label}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Incident Log */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Incident Register</span>
            <button onClick={() => setIncidentForm(!incidentForm)} style={{
              background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white', border: 'none',
              padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>+ Report Incident</button>
          </div>
          {INCIDENTS.map((inc, i) => (
            <div key={inc.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: inc.type === 'Near Miss' ? '#b45309' : '#dc2626', background: inc.type === 'Near Miss' ? '#fef3c7' : '#fee2e2', padding: '2px 8px', borderRadius: 100, marginRight: 8 }}>{inc.type}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{inc.site}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: inc.status === 'Closed' ? '#15803d' : '#b45309', background: inc.status === 'Closed' ? '#dcfce7' : '#fef3c7', padding: '2px 8px', borderRadius: 100 }}>{inc.status}</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, margin: '0 0 6px' }}>{inc.desc}</p>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{inc.date} · Reported by {inc.reportedBy} · {inc.id}</div>
            </div>
          ))}
        </div>

        {/* Toolbox Talks */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Toolbox Talks</span>
            <button style={{ fontSize: 11, fontWeight: 700, color: '#1e4db3', background: '#f0f5ff', border: 'none', padding: '5px 12px', borderRadius: 100, cursor: 'pointer' }}>Schedule Talk</button>
          </div>
          {TOOLBOX.map((t, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{t.topic}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 8,
                  color: t.status === 'Completed' ? '#15803d' : '#1d4ed8',
                  background: t.status === 'Completed' ? '#dcfce7' : '#dbeafe',
                  padding: '2px 8px', borderRadius: 100, height: 'fit-content',
                }}>{t.status}</span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {t.date} · {t.site} · {t.facilitator}
                {t.attendance && ` · ${t.attendance} attended`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate expiry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Certificate Expiry Tracker</span>
          </div>
          {CERTS.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f8fafc' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{c.cert}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.daysLeft <= 30 ? '#dc2626' : '#64748b' }}>{c.expiry}</div>
                <div style={{ fontSize: 10, color: c.daysLeft <= 30 ? '#dc2626' : '#94a3b8' }}>{c.daysLeft} days left</div>
              </div>
            </div>
          ))}
        </div>

        {/* PPE Inventory */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>PPE Inventory</span>
            <button style={{ fontSize: 11, fontWeight: 700, color: '#1e4db3', background: '#f0f5ff', border: 'none', padding: '5px 12px', borderRadius: 100, cursor: 'pointer' }}>Issue PPE</button>
          </div>
          {PPE.map((p, i) => (
            <div key={i} style={{ padding: '12px 20px', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.item}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  background: p.condition === 'OK' ? '#dcfce7' : '#fee2e2',
                  color: p.condition === 'OK' ? '#15803d' : '#dc2626',
                }}>{p.condition === 'OK' ? 'Sufficient' : 'Low Stock'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 100 }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (p.total / p.required) * 100)}%`, background: p.condition === 'OK' ? '#10b981' : '#ef4444', borderRadius: 100 }} />
                </div>
                <span style={{ fontSize: 11, color: '#64748b', minWidth: 60 }}>{p.total} / {p.required}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
