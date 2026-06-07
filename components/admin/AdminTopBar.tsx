'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { Bell, Search, X, Shield, ChevronDown } from 'lucide-react';

const BG = '#0C0C0C';
const SURFACE = '#161616';
const S2 = '#1E1E1E';
const GOLD = '#C9A84C';
const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.45)';
const FAINT = 'rgba(255,255,255,0.22)';

const Header = styled.header`
  height: 56px; display: flex; align-items: center; gap: 8px;
  padding: 0 20px; background: ${BG}; border-bottom: 1px solid ${BORDER};
  flex-shrink: 0; position: sticky; top: 0; z-index: 30;
`;

const PageInfo = styled.div` flex: 1; `;

const SearchWrap = styled.div`
  display: flex; align-items: center; gap: 8px; background: ${S2};
  border: 1px solid ${BORDER}; border-radius: 9px; padding: 6px 12px; width: 220px;
`;

const SearchInput = styled.input`
  flex: 1; background: transparent; border: none; outline: none;
  font-size: 12px; color: ${TEXT}; font-family: 'Inter', sans-serif;
  &::placeholder { color: ${FAINT}; }
`;

const IconBtn = styled.button`
  width: 34px; height: 34px; border-radius: 8px; display: flex;
  align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer; color: ${MUTED};
  transition: all 0.15s; position: relative;
  &:hover { background: rgba(255,255,255,0.06); color: ${TEXT}; }
`;

const Dropdown = styled.div`
  position: absolute; right: 0; top: 40px; width: 300px;
  background: ${SURFACE}; border: 1px solid ${BORDER}; border-radius: 14px;
  overflow: hidden; z-index: 100;
`;

const NotifItem = styled.div<{ $unread: boolean }>`
  padding: 10px 16px; cursor: pointer;
  background: ${p => p.$unread ? 'rgba(201,168,76,0.05)' : 'transparent'};
  border-top: 1px solid rgba(255,255,255,0.04);
  &:first-child { border-top: none; }
  &:hover { background: rgba(255,255,255,0.04); }
`;

const AvatarBtn = styled.button`
  display: flex; align-items: center; gap: 8px; padding: 4px 8px 4px 4px;
  background: none; border: none; cursor: pointer; border-radius: 10px;
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.06); }
`;

const Av = styled.div`
  width: 30px; height: 30px; border-radius: 50%; background: ${GOLD};
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #000;
`;

const AvatarDrop = styled.div`
  position: absolute; right: 0; top: 44px; width: 180px; background: ${SURFACE};
  border: 1px solid ${BORDER}; border-radius: 12px; overflow: hidden; z-index: 100;
`;

const PAGE_TITLES: Record<string, string> = {
  '/admin':                   'Dashboard',
  '/admin/applications':      'New Applications',
  '/admin/stream-selection':  'Stream Selection',
  '/admin/subject-changes':   'Subject Changes',
  '/admin/students':          'Students',
  '/admin/teachers':          'Teachers',
  '/admin/classes':           'Classes',
  '/admin/timetable':         'Timetable',
  '/admin/notices':           'Notices',
  '/admin/messages':          'Messages',
  '/admin/reports':           'Reports',
  '/admin/settings':          'Settings',
  '/admin/academic-year':     'Academic Year',
  '/admin/user-management':   'User Management',
  '/admin/audit':             'Audit Log',
};

const NOTIFS = [
  { id: 1, text: '12 new applications pending review', time: '5m ago',  read: false },
  { id: 2, text: 'Stream selection deadline: 20 Oct',  time: '1h ago',  read: false },
  { id: 3, text: 'Mr. Dlamini submitted marks for 11A',time: '3h ago',  read: true  },
  { id: 4, text: 'Grade 12A term report ready',        time: 'Yesterday',read: true  },
];

export default function AdminTopBar() {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const notifRef  = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const base = Object.keys(PAGE_TITLES).find(k =>
    pathname === k || (k !== '/admin' && pathname.startsWith(k))
  );
  const title = base ? PAGE_TITLES[base] : 'Admin';
  const unread = NOTIFS.filter(n => !n.read && !readIds.has(n.id)).length;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <Header>
      <PageInfo>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>Term 3 · 2025 · Sidelile High School</p>
      </PageInfo>

      {/* Search */}
      <SearchWrap>
        <Search size={13} style={{ color: FAINT, flexShrink: 0 }} />
        <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students, teachers…" />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex' }}><X size={12} /></button>}
      </SearchWrap>

      {/* Bell */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <IconBtn onClick={() => setNotifOpen(v => !v)}>
          <Bell size={15} />
          {unread > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: GOLD }} />}
        </IconBtn>
        {notifOpen && (
          <Dropdown>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Notifications</span>
              {unread > 0 && <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>{unread} new</span>}
            </div>
            {NOTIFS.map(n => {
              const isUnread = !n.read && !readIds.has(n.id);
              return (
                <NotifItem key={n.id} $unread={isUnread} onClick={() => setReadIds(p => new Set([...p, n.id]))}>
                  <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 10, color: FAINT, marginTop: 3 }}>{n.time}</div>
                </NotifItem>
              );
            })}
          </Dropdown>
        )}
      </div>

      {/* Avatar */}
      <div ref={avatarRef} style={{ position: 'relative' }}>
        <AvatarBtn onClick={() => setAvatarOpen(v => !v)}>
          <Av>SA</Av>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap' }}>School Admin</div>
            <div style={{ fontSize: 10, color: MUTED, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Shield size={8} style={{ color: GOLD }} /> Administrator
            </div>
          </div>
          <ChevronDown size={12} style={{ color: MUTED }} />
        </AvatarBtn>
        {avatarOpen && (
          <AvatarDrop>
            {[{ label: 'Settings', href: '/admin/settings' }, { label: 'Sign Out', href: '/admin-portal' }].map(item => (
              <a key={item.label} href={item.href}
                style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: MUTED, textDecoration: 'none', transition: 'all 0.1s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = TEXT; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MUTED; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                {item.label}
              </a>
            ))}
          </AvatarDrop>
        )}
      </div>
    </Header>
  );
}
