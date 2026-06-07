'use client';

import { useState } from 'react';
import { Search, X, Plus, Shield, Users, GraduationCap, UserCog, Trash2, Key, CheckCircle2, Heart } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

type Role = 'admin' | 'teacher' | 'student' | 'parent';
type Tab  = 'students' | 'teachers' | 'admins';

interface UserEntry {
  id: string; name: string; email: string; role: Role;
  status: 'active' | 'inactive'; lastLogin: string; color: string; initials: string;
}

const ROLE_CFG: Record<Role, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  admin:   { label: 'Admin',   color: GOLD,  bg: GOLD_DIM,                   Icon: Shield },
  teacher: { label: 'Teacher', color: BLUE,  bg: 'rgba(59,130,246,0.10)',    Icon: GraduationCap },
  student: { label: 'Student', color: GREEN, bg: 'rgba(16,185,129,0.10)',    Icon: Users },
  parent:  { label: 'Parent',  color: AMBER, bg: 'rgba(245,158,11,0.10)',    Icon: Heart },
};

const INITIAL_USERS: UserEntry[] = [
  { id:'u-01', name:'School Admin',          email:'admin@sidelile.edu.za',               role:'admin',   status:'active',   lastLogin:'Today, 08:12',  color:GOLD,       initials:'SA' },
  { id:'u-02', name:'Deputy Principal',      email:'deputy@sidelile.edu.za',              role:'admin',   status:'active',   lastLogin:'Today, 07:45',  color:'#C9A84C',  initials:'DP' },
  { id:'u-03', name:'Mr. Jabulani Dlamini',  email:'dlamini@sidelile.edu.za',             role:'teacher', status:'active',   lastLogin:'Today, 07:30',  color:BLUE,       initials:'JD' },
  { id:'u-04', name:'Mrs. Sibongile Khumalo',email:'khumalo@sidelile.edu.za',             role:'teacher', status:'active',   lastLogin:'Yesterday',     color:'#10B981',  initials:'SK' },
  { id:'u-05', name:'Ms. Annelie van der Merwe',email:'vandermerwe@sidelile.edu.za',     role:'teacher', status:'active',   lastLogin:'Yesterday',     color:'#8B5CF6',  initials:'VM' },
  { id:'u-06', name:'Ms. Nobuhle Hadebe',    email:'hadebe@sidelile.edu.za',              role:'teacher', status:'active',   lastLogin:'3 days ago',    color:'#EC4899',  initials:'NH' },
  { id:'u-07', name:'Thabo Nkosi',           email:'thabo.nkosi@students.sidelile.edu.za',role:'student', status:'active',   lastLogin:'Today, 06:50',  color:'#3B82F6',  initials:'TN' },
  { id:'u-08', name:'Nomvula Dlamini',       email:'nomvula.dlamini@students.sidelile.edu.za',role:'student',status:'active', lastLogin:'Today',        color:'#EF4444',  initials:'ND' },
  { id:'u-09', name:'Sanele Mkhize',         email:'sanele.mkhize@students.sidelile.edu.za',role:'student',status:'inactive',lastLogin:'2 weeks ago',  color:'#F59E0B',  initials:'SM' },
  { id:'u-10', name:'Mrs. Zanele Nkosi',     email:'zanele.n@gmail.com',                 role:'parent',  status:'active',   lastLogin:'2 days ago',    color:AMBER,      initials:'ZN' },
  { id:'u-11', name:'Mr. Sipho Dlamini',     email:'sipho.d@hotmail.com',                role:'parent',  status:'active',   lastLogin:'1 week ago',    color:'#F97316',  initials:'SD' },
  { id:'u-12', name:'Mrs. Phindile Ngubane', email:'phindile.n@gmail.com',               role:'parent',  status:'inactive', lastLogin:'3 weeks ago',   color:'#6366F1',  initials:'PN' },
];

const TAB_ROLE: Record<Tab, Role> = { students: 'student', teachers: 'teacher', admins: 'admin' };

export default function UserManagementPage() {
  const [users, setUsers]         = useState<UserEntry[]>(INITIAL_USERS);
  const [tab, setTab]             = useState<Tab>('students');
  const [search, setSearch]       = useState('');
  const [showAdd, setShowAdd]     = useState(false);
  const [resetId, setResetId]     = useState<string | null>(null);
  const [newName, setNewName]     = useState('');
  const [newEmail, setNewEmail]   = useState('');
  const [newRole, setNewRole]     = useState<Role>('student');

  const tabUsers = users.filter(u => u.role === TAB_ROLE[tab] &&
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStatus = (id: string) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));

  const deleteUser = (id: string) =>
    setUsers(prev => prev.filter(u => u.id !== id));

  const handleAdd = () => {
    if (!newName || !newEmail) return;
    setUsers(prev => [...prev, {
      id: `u-${Date.now()}`, name: newName, email: newEmail, role: newRole,
      status: 'active', lastLogin: 'Never',
      color: ['#3B82F6','#10B981','#8B5CF6','#F97316','#EC4899'][Math.floor(Math.random()*5)],
      initials: newName.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase(),
    }]);
    setNewName(''); setNewEmail(''); setNewRole('student'); setShowAdd(false);
  };

  const counts: Record<Tab, number> = {
    students: users.filter(u => u.role === 'student').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    admins:   users.filter(u => u.role === 'admin').length,
  };

  const inputStyle: React.CSSProperties = { background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '8px 12px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none', flex: 1 };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>User Management</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{users.length} system users · {users.filter(u => u.status === 'active').length} active</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} style={{ background: GOLD, color: '#000', borderRadius: 9999, padding: '9px 20px', fontWeight: 700, fontFamily: FB, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
          <Plus size={14} /> Add User
        </button>
      </div>

      {/* Add User form */}
      {showAdd && (
        <div style={{ background: SURFACE, border: `1px solid ${GOLD_B}`, borderRadius: 14, padding: 18, marginBottom: 18 }}>
          <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 14 }}>New User</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: 10, marginBottom: 12 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" style={inputStyle} />
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" style={inputStyle} />
            <select value={newRole} onChange={e => setNewRole(e.target.value as Role)} style={{ ...inputStyle, flex: 'none' }}>
              {(['admin','teacher','student','parent'] as Role[]).map(r => <option key={r} value={r}>{ROLE_CFG[r].label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowAdd(false)} style={{ padding: '7px 16px', background: S3, border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, fontSize: 12, cursor: 'pointer', fontFamily: FB }}>Cancel</button>
            <button onClick={handleAdd} style={{ padding: '7px 20px', background: GOLD, border: 'none', borderRadius: 9, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>Add User</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <div style={{ display: 'flex', gap: 4, background: S2, borderRadius: 10, padding: 4 }}>
          {(['students','teachers','admins'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: 8, background: tab === t ? GOLD_DIM : 'transparent', border: `1px solid ${tab === t ? GOLD_B : 'transparent'}`, color: tab === t ? GOLD : MUTED, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FB, transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6 }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 8, background: tab === t ? GOLD_B : 'rgba(255,255,255,0.08)', color: tab === t ? GOLD : FAINT }}>{counts[t]}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px', width: 210 }}>
          <Search size={12} style={{ color: FAINT }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT }}><X size={11} /></button>}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 80px 130px 140px', padding: '10px 18px', borderBottom: `1px solid ${BORDER}` }}>
          {['User', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {tabUsers.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: MUTED, fontSize: 13 }}>No users found.</div>
        )}

        {tabUsers.map((u, i) => {
          const rc = ROLE_CFG[u.role];
          const RIcon = rc.Icon;
          return (
            <div key={u.id}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 80px 130px 140px', alignItems: 'center', padding: '0 18px', borderTop: i === 0 ? 'none' : `1px solid rgba(255,255,255,0.04)`, transition: 'background .1s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: u.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: u.color, flexShrink: 0 }}>{u.initials}</div>
                <span style={{ fontSize: 13, fontWeight: 500, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
              </div>

              <div style={{ fontSize: 11, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>

              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: rc.bg, color: rc.color }}>
                  <RIcon size={9} /> {rc.label}
                </span>
              </div>

              <div>
                <span onClick={() => toggleStatus(u.id)} style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: u.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.06)', color: u.status === 'active' ? GREEN : MUTED, cursor: 'pointer' }}>
                  {u.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ fontSize: 11, color: FAINT }}>{u.lastLogin}</div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {resetId === u.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: GREEN }}>
                    <CheckCircle2 size={10} /> Sent
                  </div>
                ) : (
                  <button onClick={() => { setResetId(u.id); setTimeout(() => setResetId(null), 3000); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 7, padding: '4px 8px', cursor: 'pointer', color: MUTED, fontSize: 10, fontFamily: FB }}>
                    <Key size={9} /> Reset
                  </button>
                )}
                {u.role !== 'admin' && (
                  <button onClick={() => deleteUser(u.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.50)', padding: 4, display: 'flex' }}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
