'use client';

import { useEffect, useState } from 'react';
import { Search, Shield, Users, GraduationCap, Heart, Key, CheckCircle2, XCircle } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

type Tab = 'students' | 'teachers' | 'admins' | 'parents';

const ROLE_CFG: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  admin:   { label: 'Admin',   color: GOLD,  bg: GOLD_DIM,                  Icon: Shield       },
  teacher: { label: 'Teacher', color: BLUE,  bg: 'rgba(59,130,246,0.10)',   Icon: GraduationCap },
  student: { label: 'Student', color: GREEN, bg: 'rgba(16,185,129,0.10)',   Icon: Users         },
  parent:  { label: 'Parent',  color: AMBER, bg: 'rgba(245,158,11,0.10)',   Icon: Heart         },
};

export default function UserManagementPage() {
  const [users,   setUsers]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<Tab>('students');
  const [q,       setQ]       = useState('');
  const [toast,   setToast]   = useState('');
  const [busy,    setBusy]    = useState<string | null>(null);

  const load = () => {
    fetch('/api/admin/users').then(r => r.json()).then(d => {
      setUsers(d.users ?? []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const toggleActive = async (u: any) => {
    setBusy(u.id);
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, active: !u.active }),
    });
    setBusy(null);
    if (res.ok) { flash(`${u.name} ${u.active ? 'deactivated' : 'activated'}.`); load(); }
    else flash('Could not update user.');
  };

  const tabMap: Record<Tab, string> = { students: 'student', teachers: 'teacher', admins: 'admin', parents: 'parent' };
  const filtered = users
    .filter(u => u.role === tabMap[tab])
    .filter(u => !q.trim() || u.name.toLowerCase().includes(q.toLowerCase()) || u.email?.toLowerCase().includes(q.toLowerCase()) || u.portalId?.toLowerCase().includes(q.toLowerCase()));

  const counts = {
    students: users.filter(u => u.role === 'student').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    admins:   users.filter(u => u.role === 'admin').length,
    parents:  users.filter(u => u.role === 'parent').length,
  };

  const tabs: { key: Tab; label: string; color: string }[] = [
    { key: 'students', label: `Students (${counts.students})`, color: GREEN },
    { key: 'teachers', label: `Teachers (${counts.teachers})`, color: BLUE  },
    { key: 'admins',   label: `Admins (${counts.admins})`,     color: GOLD  },
    { key: 'parents',  label: `Parents (${counts.parents})`,   color: AMBER },
  ];

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>User Management</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
          {loading ? 'Loading…' : `${users.filter(u => u.active).length} active · ${users.filter(u => !u.active).length} inactive`}
        </p>
      </div>

      {toast && (
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 9, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 13, color: GREEN }}>{toast}</div>
      )}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
        {Object.entries(counts).map(([role, count]) => {
          const cfg = ROLE_CFG[role === 'admins' ? 'admin' : role === 'teachers' ? 'teacher' : role === 'parents' ? 'parent' : 'student'];
          const Icon = cfg.Icon;
          return (
            <div key={role} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: MUTED, textTransform: 'capitalize' }}>{role}</span>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={13} style={{ color: cfg.color }} />
                </div>
              </div>
              <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: cfg.color }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 14px', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB,
            background: tab === t.key ? t.color + '18' : S2,
            border: `1px solid ${tab === t.key ? t.color + '44' : BORDER}`,
            color: tab === t.key ? t.color : MUTED,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: FAINT }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, ID or email…"
          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 34px', borderRadius: 10, background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, fontFamily: FB, fontSize: 13, outline: 'none' }} />
      </div>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 14 }}>Loading users…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: MUTED, fontSize: 14 }}>No {tab} found{q ? ' matching your search' : ''}.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(u => {
            const cfg = ROLE_CFG[u.role] ?? ROLE_CFG.student;
            return (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: SURFACE, borderRadius: 12, border: `1px solid ${u.active ? BORDER : 'rgba(239,68,68,0.25)'}`, opacity: u.active ? 1 : 0.55 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: cfg.color, flexShrink: 0 }}>
                  {u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: FAINT }}>{u.portalId ?? '—'} · {u.email}{u.grade ? ` · ${u.grade}` : ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: u.active ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)', color: u.active ? GREEN : RED }}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleActive(u)}
                    disabled={busy === u.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: FB, background: u.active ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${u.active ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`, color: u.active ? RED : GREEN }}
                    title={u.active ? 'Deactivate account' : 'Reactivate account'}
                  >
                    {u.active ? <><XCircle size={12} /> Deactivate</> : <><CheckCircle2 size={12} /> Activate</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
