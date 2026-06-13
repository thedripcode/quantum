'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styled from 'styled-components';
import {
  LayoutDashboard, BarChart2, CheckSquare, Bell,
  User, LogOut, ChevronLeft, Menu,
} from 'lucide-react';

const BG      = '#0C0C0C';
const SURFACE = '#111111';
const BORDER  = 'rgba(255,255,255,0.07)';
const TEXT    = '#FFFFFF';
const MUTED   = 'rgba(255,255,255,0.45)';
const FAINT   = 'rgba(255,255,255,0.22)';
const GOLD    = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.08)';
const GOLD_B   = 'rgba(201,168,76,0.22)';
const ACCENT_DIM = 'rgba(255,255,255,0.06)';
const ACCENT_B   = 'rgba(255,255,255,0.10)';

const Aside = styled.aside<{ $collapsed: boolean; $mobileOpen: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '64px' : '240px')};
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  background: ${BG};
  border-right: 1px solid ${BORDER};
  display: flex;
  flex-direction: column;
  transition: width 0.28s cubic-bezier(0.33,1,0.68,1);
  overflow: hidden;
  z-index: 40;

  @media (max-width: 1023px) {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    height: 100dvh;
    width: 240px !important;
    transform: ${({ $mobileOpen }) => $mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s cubic-bezier(0.33,1,0.68,1);
    z-index: 50;
  }
`;

const Brand = styled.div<{ $collapsed: boolean }>`
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid ${BORDER};
  flex-shrink: 0;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
`;

const BrandDot = styled.div`
  width: 30px; height: 30px; border-radius: 8px;
  background: ${GOLD_DIM}; border: 1px solid ${GOLD_B};
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 12px; color: ${GOLD};
  flex-shrink: 0; letter-spacing: -0.5px;
`;

const ProfileCard = styled.div<{ $collapsed: boolean }>`
  margin: 12px;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 6px' : '12px')};
  background: ${SURFACE}; border: 1px solid ${BORDER}; border-radius: 12px;
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0; overflow: hidden;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
`;

const Avatar = styled.div`
  width: 36px; height: 36px; border-radius: 50%;
  background: ${GOLD_DIM}; border: 1.5px solid ${GOLD_B};
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: ${GOLD}; flex-shrink: 0;
`;

const NavSection = styled.div`
  flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px 0;
  &::-webkit-scrollbar { width: 0; }
`;

const SectionLabel = styled.div<{ $collapsed: boolean }>`
  font-size: 9px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: ${FAINT};
  padding: ${({ $collapsed }) => ($collapsed ? '10px 0 4px' : '10px 16px 4px')};
  white-space: nowrap;
  text-align: ${({ $collapsed }) => ($collapsed ? 'center' : 'left')};
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: opacity 0.15s;
`;

const NavItem = styled.div<{ $active: boolean; $collapsed: boolean }>`
  display: flex; align-items: center; gap: 10px;
  padding: ${({ $collapsed }) => ($collapsed ? '9px 0' : '9px 12px')};
  margin: 2px 8px; border-radius: 10px; cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  background: ${({ $active }) => $active ? ACCENT_DIM : 'transparent'};
  color: ${({ $active }) => $active ? TEXT : MUTED};
  border: 1px solid ${({ $active }) => $active ? ACCENT_B : 'transparent'};
  &:hover { background: ${ACCENT_DIM}; color: ${TEXT}; }
`;

const NavLabel = styled.span`
  font-size: 13px; font-weight: 500; overflow: hidden;
`;

const Spacer = styled.div`
  margin-top: auto; border-top: 1px solid ${BORDER}; padding: 8px 0; flex-shrink: 0;
`;

const CollapseBtn = styled.button<{ $collapsed: boolean }>`
  display: flex; align-items: center; gap: 10px;
  width: calc(100% - 16px); margin: 4px 8px;
  padding: 9px 12px; background: none; border: none; cursor: pointer;
  color: ${MUTED}; border-radius: 10px; transition: color 0.15s, background 0.15s;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  &:hover { color: ${TEXT}; background: rgba(255,255,255,0.05); }
`;

const NAV = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard',  href: '/dashboard/parent',            Icon: LayoutDashboard },
    ],
  },
  {
    section: "Child's Progress",
    items: [
      { label: 'Marks',      href: '/dashboard/parent/marks',      Icon: BarChart2   },
      { label: 'Attendance', href: '/dashboard/parent/attendance', Icon: CheckSquare },
      { label: 'Notices',   href: '/dashboard/parent/notices',    Icon: Bell        },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Profile',    href: '/dashboard/parent/profile',    Icon: User        },
    ],
  },
];

export default function ParentSidebar({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const displayName = session?.user?.name ?? '…';
  const initials    = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  const isActive = (href: string) =>
    href === '/dashboard/parent' ? pathname === href : pathname.startsWith(href);

  return (
    <Aside $collapsed={collapsed} $mobileOpen={mobileOpen}>
      <Brand $collapsed={collapsed}>
        <BrandDot>P</BrandDot>
        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 13, color: TEXT, letterSpacing: '-0.01em' }}>SIDELILE</div>
            <div style={{ fontSize: 8.5, color: MUTED, letterSpacing: '0.12em', marginTop: 1 }}>PARENT PORTAL</div>
          </div>
        )}
      </Brand>

      <ProfileCard $collapsed={collapsed}>
        <Avatar>{initials}</Avatar>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
            <div style={{ fontSize: 11, color: GOLD, marginTop: 1 }}>Parent</div>
          </div>
        )}
      </ProfileCard>

      <NavSection>
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <SectionLabel $collapsed={collapsed}>{section}</SectionLabel>
            {items.map(({ label, href, Icon }) => {
              const active = isActive(href);
              return (
                <NavItem
                  key={href}
                  $active={active}
                  $collapsed={collapsed}
                  onClick={() => { router.push(href); onClose?.(); }}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={15} strokeWidth={active ? 2 : 1.6} style={{ flexShrink: 0 }} />
                  {!collapsed && <NavLabel>{label}</NavLabel>}
                </NavItem>
              );
            })}
          </div>
        ))}
      </NavSection>

      <Spacer>
        <CollapseBtn $collapsed={collapsed} onClick={() => setCollapsed(v => !v)}>
          {collapsed ? <Menu size={15} /> : <><ChevronLeft size={15} /><span style={{ fontSize: 13 }}>Collapse</span></>}
        </CollapseBtn>
        <button
          onClick={() => signOut({ callbackUrl: '/parent-portal' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '9px 0' : '9px 12px', margin: '2px 8px', borderRadius: 10, color: MUTED, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, justifyContent: collapsed ? 'center' : 'flex-start', width: '100%' }}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={15} strokeWidth={1.6} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </Spacer>
    </Aside>
  );
}
