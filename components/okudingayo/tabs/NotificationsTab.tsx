'use client';
import { useState } from 'react';
import { BellIcon, AlertIcon, CheckIcon, ClockIcon, ShieldIcon, CoinIcon, HardHatIcon } from '@/components/okudingayo/OkuIcons';

const NOTIFICATIONS = [
  { id: 1, type: 'safety',   title: 'Certificate Expiry Alert',           body: 'Sello Mokoena medical fitness expires in 19 days (Jun 28, 2026). Renewal required.',          time: '10 min ago',  read: false, priority: 'high' },
  { id: 2, type: 'finance',  title: 'Invoice Overdue — INV-2026-092',      body: 'Invoice R42,000 from EDTEA is 6 days overdue. Follow-up required.',                           time: '1 hr ago',    read: false, priority: 'high' },
  { id: 3, type: 'safety',   title: 'Toolbox Talk Scheduled',              body: 'Emergency Evacuation Procedure toolbox talk at Harbour Phase 2 on Jun 13, 2026.',            time: '2 hr ago',    read: false, priority: 'normal' },
  { id: 4, type: 'inventory', title: 'Low Stock Alert',                    body: 'Scaffolding couplers (right angle) are below minimum level — 12 units remaining (min 50).',  time: '3 hr ago',    read: true,  priority: 'high' },
  { id: 5, type: 'project',  title: 'Project Milestone Reached',           body: 'Gateway Theatre Renovation has reached 89% completion. Final inspection booking required.', time: '5 hr ago',    read: true,  priority: 'normal' },
  { id: 6, type: 'finance',  title: 'Payment Received',                    body: 'R48,500 payment received from Hyprop Investments for Invoice INV-2026-089.',                time: '1 day ago',   read: true,  priority: 'normal' },
  { id: 7, type: 'safety',   title: 'Incident Report Submitted',           body: 'Near-miss incident at KwaMashu Industrial Park reported by Siphamandla Dube. Under investigation.', time: '2 days ago', read: true, priority: 'normal' },
  { id: 8, type: 'equipment', title: 'Maintenance Overdue',                body: 'Telehandler Manitou MT625 engine service is overdue. Schedule service immediately.',        time: '2 days ago',  read: true,  priority: 'high' },
  { id: 9, type: 'project',  title: 'New Project Assigned',                body: 'KwaMashu Industrial Park project (R2.1M) has been activated and team assigned.',           time: '3 days ago',  read: true,  priority: 'normal' },
  { id: 10, type: 'finance', title: 'Quotation Accepted',                  body: 'EDTEA accepted quotation QUO-2026-041 for R2,100,000. Generate contract and first invoice.','time': '5 days ago', read: true,  priority: 'normal' },
];

const TYPE_CONFIG: Record<string, { Icon: any; color: string; bg: string; label: string }> = {
  safety:    { Icon: HardHatIcon, color: '#ef4444', bg: '#fee2e2', label: 'Safety' },
  finance:   { Icon: CoinIcon,    color: '#10b981', bg: '#dcfce7', label: 'Finance' },
  inventory: { Icon: AlertIcon,   color: '#f59e0b', bg: '#fef3c7', label: 'Inventory' },
  project:   { Icon: CheckIcon,   color: '#3b82f6', bg: '#dbeafe', label: 'Projects' },
  equipment: { Icon: ClockIcon,   color: '#8b5cf6', bg: '#ede9fe', label: 'Equipment' },
};

const ALERT_SETTINGS = [
  { label: 'Certificate Expiry Alerts',   email: true,  sms: true  },
  { label: 'Invoice Due Reminders',       email: true,  sms: false },
  { label: 'Low Stock Warnings',          email: true,  sms: false },
  { label: 'Incident Reports',            email: true,  sms: true  },
  { label: 'Payment Received',            email: true,  sms: true  },
  { label: 'Project Milestones',          email: false, sms: false },
  { label: 'Maintenance Due',             email: true,  sms: false },
];

export default function NotificationsTab() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [settings, setSettings] = useState(ALERT_SETTINGS);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(n => n.map(item => ({ ...item, read: true })));

  const filtered = notifications.filter(n =>
    filter === 'all' || filter === 'unread' ? (filter === 'unread' ? !n.read : true) : n.type === filter
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BellIcon size={22} color="#1e4db3" strokeWidth={1.8} />
          <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Notifications</span>
          {unread > 0 && (
            <span style={{ background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 100 }}>{unread} unread</span>
          )}
        </div>
        <button onClick={markAllRead} style={{
          border: '1.5px solid #e2e8f0', background: 'white', padding: '8px 18px',
          borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer',
        }}>Mark all as read</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

        {/* Notification feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'unread', 'safety', 'finance', 'inventory', 'project', 'equipment'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 14px', borderRadius: 100, border: '1.5px solid',
                borderColor: filter === f ? '#1e4db3' : '#e2e8f0',
                background: filter === f ? '#1e4db3' : 'white',
                color: filter === f ? 'white' : '#64748b',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              }}>{f}</button>
            ))}
          </div>

          {/* Notification list */}
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
            {filtered.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG['project'];
              return (
                <div key={n.id} style={{
                  display: 'flex', gap: 14, padding: '16px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
                  background: n.read ? 'white' : '#eff6ff',
                  cursor: 'pointer',
                }} onClick={() => setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: cfg.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <cfg.Icon size={20} color={cfg.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{n.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {n.priority === 'high' && (
                          <span style={{ fontSize: 9, fontWeight: 700, background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: 100 }}>HIGH</span>
                        )}
                        <span style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, margin: 0 }}>{n.body}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: 100 }}>{cfg.label}</span>
                      {!n.read && <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 600 }}>Unread</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alert Settings */}
        <div>
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Alert Settings</span>
            </div>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 50px', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Alert Type</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>Email</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>SMS</span>
              </div>
              {settings.map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 50px 50px', gap: 8, alignItems: 'center', padding: '8px 0', borderBottom: i < settings.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  <span style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>{s.label}</span>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => setSettings(prev => prev.map((item, idx) => idx === i ? { ...item, email: !item.email } : item))}
                      style={{
                        width: 32, height: 18, borderRadius: 100, border: 'none', cursor: 'pointer',
                        background: s.email ? '#1e4db3' : '#e2e8f0', transition: 'background 0.2s', position: 'relative',
                      }}>
                      <div style={{ position: 'absolute', top: 2, left: s.email ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => setSettings(prev => prev.map((item, idx) => idx === i ? { ...item, sms: !item.sms } : item))}
                      style={{
                        width: 32, height: 18, borderRadius: 100, border: 'none', cursor: 'pointer',
                        background: s.sms ? '#1e4db3' : '#e2e8f0', transition: 'background 0.2s', position: 'relative',
                      }}>
                      <div style={{ position: 'absolute', top: 2, left: s.sms ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 18px' }}>
              <button style={{
                width: '100%', background: 'linear-gradient(135deg,#1e4db3,#3b72d9)',
                color: 'white', border: 'none', padding: '10px', borderRadius: 10,
                fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>Save Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
