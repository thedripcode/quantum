'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styled from 'styled-components';
import {
  LayoutDashboard, BarChart2, ClipboardList, Calendar,
  CheckSquare, BookOpen, Brain, Bell, MessageSquare,
  Award, Target, User, Users, LogOut, ChevronLeft, Menu,
  AlertTriangle, FileText, ScrollText,
} from 'lucide-react';
import { useStudentData } from '@/lib/useStudentData';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BG         = '#0C0C0C';
const SURFACE    = '#111111';
const ACCENT     = 'rgba(255,255,255,0.90)';
const ACCENT_DIM = 'rgba(255,255,255,0.06)';
const ACCENT_B   = 'rgba(255,255,255,0.10)';
const BORDER     = 'rgba(255,255,255,0.07)';
const TEXT       = '#FFFFFF';
const MUTED      = 'rgba(255,255,255,0.45)';
const FAINT      = 'rgba(255,255,255,0.22)';

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

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
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
  padding: ${({ $collapsed }) => ($collapsed ? '0 16px' : '0 16px')};
  border-bottom: 1px solid ${BORDER};
  flex-shrink: 0;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
`;

const BrandDot = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
  color: ${TEXT};
  flex-shrink: 0;
  letter-spacing: -0.5px;
`;

const BrandText = styled.div`
  overflow: hidden;
  white-space: nowrap;
`;

const ProfileCard = styled.div<{ $collapsed: boolean }>`
  margin: 12px;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 6px' : '12px')};
  background: ${SURFACE};
  border: 1px solid ${BORDER};
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  overflow: hidden;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.10);
  border: 1.5px solid rgba(255,255,255,0.20);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: ${TEXT};
  flex-shrink: 0;
`;

const AtRiskBadge = styled.div`
  margin: 0 12px 8px;
  padding: 8px 10px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.20);
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  flex-shrink: 0;
`;

const NavSection = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;

  &::-webkit-scrollbar { width: 0; }
`;

const SectionLabel = styled.div<{ $collapsed: boolean }>`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${FAINT};
  padding: ${({ $collapsed }) => ($collapsed ? '10px 0 4px' : '10px 16px 4px')};
  white-space: nowrap;
  text-align: ${({ $collapsed }) => ($collapsed ? 'center' : 'left')};
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: opacity 0.15s;
`;

const NavItem = styled.div<{ $active: boolean; $gold?: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${({ $collapsed }) => ($collapsed ? '9px 0' : '9px 12px')};
  margin: 2px ${({ $collapsed }) => ($collapsed ? '8px' : '8px')};
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  position: relative;

  background: ${({ $active }) => $active ? ACCENT_DIM : 'transparent'};
  color:      ${({ $active }) => $active ? TEXT : MUTED};
  border: 1px solid ${({ $active }) => $active ? ACCENT_B : 'transparent'};

  &:hover {
    background: ${ACCENT_DIM};
    color: ${TEXT};
  }
`;

const NavLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
`;

const Badge = styled.span<{ $gold?: boolean }>`
  margin-left: auto;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  background: rgba(239,68,68,0.85);
  color: #fff;
  flex-shrink: 0;
`;

const Spacer = styled.div`
  margin-top: auto;
  border-top: 1px solid ${BORDER};
  padding: 8px 0;
  flex-shrink: 0;
`;

const CollapseBtn = styled.button<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: calc(100% - 16px);
  margin: 4px 8px;
  padding: 9px 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${MUTED};
  border-radius: 10px;
  transition: color 0.15s, background 0.15s;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};

  &:hover { color: ${TEXT}; background: rgba(255,255,255,0.05); }
`;

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard',  href: '/dashboard/student',              Icon: LayoutDashboard, badge: null,  gold: false },
    ],
  },
  {
    section: 'Academic',
    items: [
      { label: 'My Marks',   href: '/dashboard/student/marks',        Icon: BarChart2,       badge: null,  gold: false },
      { label: 'Report Card', href: '/dashboard/student/report',      Icon: ScrollText,      badge: null,  gold: true  },
      { label: 'Assignments',href: '/dashboard/student/assignments',   Icon: ClipboardList,   badge: '3',   gold: false },
      { label: 'Timetable',  href: '/dashboard/student/timetable',    Icon: Calendar,        badge: null,  gold: false },
      { label: 'Attendance', href: '/dashboard/student/attendance',   Icon: CheckSquare,     badge: null,  gold: false },
      { label: 'Subjects',   href: '/dashboard/student/subjects',     Icon: BookOpen,        badge: null,  gold: false },
    ],
  },
  {
    section: 'Tools',
    items: [
      { label: 'SIDI',        href: '/dashboard/student/sidi',         Icon: Brain,           badge: null,  gold: false },
      { label: 'Past Papers', href: '/dashboard/student/papers',       Icon: FileText,        badge: null,  gold: false },
      { label: 'Notices',    href: '/dashboard/student/notices',      Icon: Bell,            badge: '2',   gold: false },
      { label: 'Messages',   href: '/dashboard/student/messages',     Icon: MessageSquare,   badge: '1',   gold: false },
      { label: 'Achievements',href: '/dashboard/student/achievements',Icon: Award,           badge: null,  gold: false },
      { label: 'Goals',      href: '/dashboard/student/goals',        Icon: Target,          badge: null,  gold: false },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Profile',    href: '/dashboard/student/profile',      Icon: User,            badge: null,  gold: false },
      { label: 'Parent View',href: '/dashboard/student/parent-view',  Icon: Users,           badge: null,  gold: false },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function StudentPortalSidebar({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const { data: session } = useSession();
  const { data: studentData } = useStudentData();
  const AT_RISK_SUBJECTS = studentData.atRiskSubjects;
  const [collapsed, setCollapsed] = useState(false);

  // Real logged-in user
  const displayName  = session?.user?.name ?? '…';
  const displayGrade = (session?.user as any)?.grade ?? '';
  const initials     = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  const isActive = (href: string) =>
    href === '/dashboard/student'
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <Aside $collapsed={collapsed} $mobileOpen={mobileOpen}>
      {/* Brand */}
      <Brand $collapsed={collapsed}>
        <BrandDot>S</BrandDot>
        {!collapsed && (
          <BrandText>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 13, color: TEXT, letterSpacing: '-0.01em' }}>SIDELILE</div>
            <div style={{ fontSize: 8.5, color: MUTED, letterSpacing: '0.12em', marginTop: 1 }}>STUDENT PORTAL</div>
          </BrandText>
        )}
      </Brand>

      {/* Profile card */}
      <ProfileCard $collapsed={collapsed}>
        <Avatar>{initials}</Avatar>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{displayGrade}</div>
          </div>
        )}
      </ProfileCard>

      {/* At-risk alert */}
      {!collapsed && AT_RISK_SUBJECTS.length > 0 && (
        <AtRiskBadge>
          <AlertTriangle size={13} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#EF4444' }}>At Risk</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.40)', marginTop: 1 }}>
              {AT_RISK_SUBJECTS.map(s => s.short).join(', ')} · below 60%
            </div>
          </div>
        </AtRiskBadge>
      )}

      {/* Navigation */}
      <NavSection>
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <SectionLabel $collapsed={collapsed}>{section}</SectionLabel>
            {items.map(({ label, href, Icon, badge, gold }) => {
              const active = isActive(href);
              return (
                <NavItem
                  key={href}
                  $active={active}
                  $gold={gold}
                  $collapsed={collapsed}
                  onClick={() => { router.push(href); onClose?.(); }}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={15} strokeWidth={active ? 2 : 1.6} style={{ flexShrink: 0 }} />
                  {!collapsed && <NavLabel>{label}</NavLabel>}
                  {!collapsed && badge && (
                    <Badge $gold={gold}>{badge}</Badge>
                  )}
                  {collapsed && badge && (
                    <span style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#EF4444',
                    }} />
                  )}
                </NavItem>
              );
            })}
          </div>
        ))}
      </NavSection>

      {/* Footer */}
      <Spacer>
        <CollapseBtn $collapsed={collapsed} onClick={() => setCollapsed(v => !v)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed
            ? <Menu size={15} />
            : <><ChevronLeft size={15} /><span style={{ fontSize: 13 }}>Collapse</span></>
          }
        </CollapseBtn>
        <button
          onClick={() => signOut({ callbackUrl: '/student-portal' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '9px 0' : '9px 12px', margin: `2px 8px`, borderRadius: 10, color: MUTED, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, justifyContent: collapsed ? 'center' : 'flex-start', width: '100%' }}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={15} strokeWidth={1.6} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </Spacer>
    </Aside>
  );
}
