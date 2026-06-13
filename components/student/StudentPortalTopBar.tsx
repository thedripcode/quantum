'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Bell, Search, X, ChevronDown, Check, User, Settings, LogOut, Menu } from 'lucide-react';
import { NOTICES, MESSAGES } from '@/data/studentData';

const BG      = '#0C0C0C';
const BORDER  = 'rgba(255,255,255,0.07)';
const MUTED   = 'rgba(255,255,255,0.45)';
const WHITE   = '#FFFFFF';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard/student':              'Dashboard',
  '/dashboard/student/marks':        'My Marks',
  '/dashboard/student/assignments':  'Assignments',
  '/dashboard/student/timetable':    'Timetable',
  '/dashboard/student/attendance':   'Attendance',
  '/dashboard/student/subjects':     'Subjects',
  '/dashboard/student/sidi':         'SIDI — Study Companion',
  '/dashboard/student/notices':      'Notices',
  '/dashboard/student/messages':     'Messages',
  '/dashboard/student/achievements': 'Achievements',
  '/dashboard/student/goals':        'Goals',
  '/dashboard/student/profile':      'Profile',
  '/dashboard/student/parent-view':  'Parent View',
};

export default function StudentPortalTopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const displayName = session?.user?.name ?? '…';
  const displayId   = (session?.user as any)?.portalId ?? '';
  const displayGrade = (session?.user as any)?.grade ?? '';
  const displayEmail = session?.user?.email ?? '';
  const initials = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [readIds,     setReadIds]     = useState<Set<string>>(new Set());
  const [avatarOpen,  setAvatarOpen]  = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const baseRoute = Object.keys(PAGE_TITLES).find(k =>
    pathname === k || (k !== '/dashboard/student' && pathname.startsWith(k))
  );
  const pageTitle = baseRoute ? PAGE_TITLES[baseRoute] : 'Student Portal';

  const unreadMessages = MESSAGES.filter(m => !m.read).length;
  const totalUnread    = unreadMessages;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setSearchOpen(false); setSearchQuery(''); }
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* ── shared dropdown style ── */
  const drop: React.CSSProperties = {
    position: 'absolute', right: 0, top: 40, zIndex: 100,
    background: '#111111', border: `1px solid rgba(255,255,255,0.10)`,
    borderRadius: 14, overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  };

  const dropLink = (extra?: React.CSSProperties): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px', borderRadius: 8,
    fontSize: 13, color: MUTED, textDecoration: 'none',
    transition: 'color .15s, background .15s',
    cursor: 'pointer', background: 'transparent', border: 'none', width: '100%',
    ...extra,
  });

  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 20px', background: BG,
      borderBottom: `1px solid ${BORDER}`, flexShrink: 0,
      position: 'sticky', top: 0, zIndex: 30,
    }}>

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="flex lg:hidden"
        style={{ width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, flexShrink: 0 }}
      >
        <Menu size={18} />
      </button>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: WHITE, margin: 0 }}>
          {pageTitle}
        </h1>
        <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>
          {new Date().getFullYear()}{displayGrade ? ` · ${displayGrade}` : ''}
        </p>
      </div>

      {/* ── Search ── */}
      <div ref={searchRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setSearchOpen(v => !v)}
          style={{ width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = WHITE; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MUTED; (e.currentTarget as HTMLElement).style.background = 'none'; }}
        >
          <Search size={15} />
        </button>

        {searchOpen && (
          <div style={{ ...drop, width: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: `1px solid ${BORDER}` }}>
              <Search size={13} style={{ color: MUTED, flexShrink: 0 }} />
              <input
                autoFocus value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search portal…"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: WHITE }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}>
                  <X size={12} />
                </button>
              )}
            </div>
            <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', padding: '12px 0' }}>
              {searchQuery ? 'No results found' : 'Type to search'}
            </p>
          </div>
        )}
      </div>

      {/* ── Notifications ── */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setNotifOpen(v => !v)}
          style={{ width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, position: 'relative' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = WHITE; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MUTED; (e.currentTarget as HTMLElement).style.background = 'none'; }}
        >
          <Bell size={15} />
          {totalUnread > 0 && (
            <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: WHITE }} />
          )}
        </button>

        {notifOpen && (
          <div style={{ ...drop, width: 300 }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>Notifications</span>
              {unreadMessages > 0 && (
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 20 }}>
                  {unreadMessages} unread
                </span>
              )}
            </div>
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {MESSAGES.slice(0, 4).map((m, i) => {
                const isUnread = !m.read && !readIds.has(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => setReadIds(p => new Set([...p, m.id]))}
                    style={{ padding: '10px 16px', borderTop: i > 0 ? `1px solid rgba(255,255,255,0.05)` : 'none', cursor: 'pointer', background: isUnread ? 'rgba(255,255,255,0.04)' : 'transparent', display: 'flex', gap: 10, alignItems: 'flex-start' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isUnread ? 'rgba(255,255,255,0.04)' : 'transparent'; }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.fromColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: m.fromColor, flexShrink: 0 }}>
                      {m.fromInitials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: WHITE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
                      <div style={{ fontSize: 11, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.from}</div>
                    </div>
                    {!isUnread && <Check size={12} style={{ color: 'rgba(255,255,255,0.30)', flexShrink: 0, marginTop: 4 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Avatar / Profile dropdown ── */}
      <div ref={avatarRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setAvatarOpen(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 4px 4px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 10, transition: 'background .15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
        >
          {/* Avatar circle — white ring with initials */}
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.10)', border: '1.5px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: WHITE }}>
            {initials}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: WHITE, whiteSpace: 'nowrap' }}>{displayName}</div>
            <div style={{ fontSize: 10, color: MUTED }}>{displayId}</div>
          </div>
          <ChevronDown size={12} style={{ color: MUTED }} />
        </button>

        {avatarOpen && (
          <div style={{ ...drop, width: 210 }}>
            {/* Header */}
            <div style={{ padding: '12px 14px', borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>{displayName}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{displayEmail}</div>
            </div>

            {/* Menu items */}
            <div style={{ padding: 6 }}>
              {[
                { label: 'My Profile',    href: '/dashboard/student/profile',         Icon: User     },
                { label: 'Edit Profile',  href: '/dashboard/student/profile?edit=1',  Icon: Settings },
              ].map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  style={dropLink()}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = WHITE; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MUTED; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <Icon size={13} strokeWidth={1.6} />
                  {label}
                </a>
              ))}

              {/* Divider */}
              <div style={{ height: 1, background: BORDER, margin: '4px 2px' }} />

              <a
                href="/student-portal"
                style={dropLink({ color: 'rgba(239,68,68,0.75)' })}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.75)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <LogOut size={13} strokeWidth={1.6} />
                Sign Out
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
