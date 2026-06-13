'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const BG     = '#0C0C0C';
const BORDER = 'rgba(255,255,255,0.07)';
const MUTED  = 'rgba(255,255,255,0.45)';
const TEXT   = '#FFFFFF';
const SURFACE = '#161616';
const GOLD   = '#C9A84C';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard/parent':            'Dashboard',
  '/dashboard/parent/marks':      'Marks',
  '/dashboard/parent/attendance': 'Attendance',
  '/dashboard/parent/notices':    'Notices',
  '/dashboard/parent/profile':    'My Profile',
};

export default function ParentTopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const displayName = session?.user?.name ?? '…';
  const initials    = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  const base = Object.keys(PAGE_TITLES).find(k =>
    pathname === k || (k !== '/dashboard/parent' && pathname.startsWith(k))
  );
  const title = base ? PAGE_TITLES[base] : 'Parent Portal';

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 20px', background: BG, borderBottom: `1px solid ${BORDER}`,
      flexShrink: 0, position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* Hamburger — mobile only, hidden on desktop via Tailwind */}
      <button
        onClick={onMenuClick}
        className="flex lg:hidden"
        style={{ width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, flexShrink: 0 }}
      >
        <Menu size={18} />
      </button>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>Parent Portal · Sidelile High School</p>
      </div>

      {/* Avatar */}
      <div ref={avatarRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setAvatarOpen(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 4px 4px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 10 }}
        >
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1.5px solid rgba(201,168,76,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: GOLD }}>
            {initials}
          </div>
          <div style={{ textAlign: 'left' }} className="hidden sm:block">
            <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap' }}>{displayName}</div>
            <div style={{ fontSize: 10, color: MUTED }}>Parent</div>
          </div>
          <ChevronDown size={12} style={{ color: MUTED }} className="hidden sm:block" />
        </button>

        {avatarOpen && (
          <div style={{ position: 'absolute', right: 0, top: 44, width: 180, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{displayName}</div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>{session?.user?.email}</div>
            </div>
            <div style={{ padding: 6 }}>
              <button
                onClick={() => signOut({ callbackUrl: '/parent-portal' })}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.75)', fontSize: 13 }}
              >
                <LogOut size={13} strokeWidth={1.6} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
