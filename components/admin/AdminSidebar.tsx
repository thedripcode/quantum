'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import {
  LayoutDashboard, FileText, GitBranch, RefreshCw,
  Users, GraduationCap, Grid3X3, Calendar,
  Bell, MessageSquare, BookOpen,
  Settings, School, UserCog, ClipboardList,
  LogOut, ChevronLeft, Menu, Shield,
} from 'lucide-react';

const BG = '#0C0C0C';
const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.10)';
const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.45)';
const FAINT = 'rgba(255,255,255,0.22)';

const goldPulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
  50%      { box-shadow: 0 0 0 6px rgba(201,168,76,0.12); }
`;

const Aside = styled.aside<{ $col: boolean }>`
  width: ${p => p.$col ? '64px' : '240px'};
  flex-shrink: 0; height: 100vh; position: sticky; top: 0;
  background: ${BG}; border-right: 1px solid ${BORDER};
  display: flex; flex-direction: column;
  transition: width 0.28s cubic-bezier(0.33,1,0.68,1);
  overflow: hidden; z-index: 40;
`;

const Brand = styled.div<{ $col: boolean }>`
  height: 60px; display: flex; align-items: center; gap: 10px;
  padding: 0 16px; border-bottom: 1px solid ${BORDER}; flex-shrink: 0;
  justify-content: ${p => p.$col ? 'center' : 'flex-start'};
`;

const BrandDot = styled.div`
  width: 30px; height: 30px; border-radius: 8px; background: ${GOLD};
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 12px; color: #000; flex-shrink: 0;
`;

const AdminCard = styled.div<{ $col: boolean }>`
  margin: 12px; padding: ${p => p.$col ? '10px 6px' : '12px'};
  background: ${GOLD_DIM}; border: 1px solid ${GOLD_B}; border-radius: 12px;
  display: flex; align-items: center; gap: 10px; flex-shrink: 0; overflow: hidden;
  justify-content: ${p => p.$col ? 'center' : 'flex-start'};
`;

const Av = styled.div`
  width: 36px; height: 36px; border-radius: 50%; background: ${GOLD};
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #000; flex-shrink: 0;
`;

const NavSection = styled.nav`
  flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px 0;
  &::-webkit-scrollbar { width: 0; }
`;

const SLabel = styled.div<{ $col: boolean }>`
  font-size: 9px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: ${FAINT}; padding: ${p => p.$col ? '10px 0 4px' : '10px 16px 4px'};
  white-space: nowrap; text-align: ${p => p.$col ? 'center' : 'left'};
  opacity: ${p => p.$col ? 0 : 1}; transition: opacity 0.15s;
`;

const NI = styled.div<{ $a: boolean; $g?: boolean; $col: boolean }>`
  display: flex; align-items: center; gap: 10px;
  padding: ${p => p.$col ? '9px 0' : '9px 12px'};
  margin: 2px 8px; border-radius: 10px; cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap; overflow: hidden; position: relative;
  justify-content: ${p => p.$col ? 'center' : 'flex-start'};
  background: ${p => p.$a && p.$g ? GOLD_DIM : p.$a ? 'rgba(255,255,255,0.06)' : 'transparent'};
  color: ${p => p.$a && p.$g ? GOLD : p.$a ? TEXT : MUTED};
  border: 1px solid ${p => p.$a && p.$g ? GOLD_B : p.$a ? 'rgba(255,255,255,0.08)' : 'transparent'};
  animation: ${p => p.$a && p.$g ? goldPulse : 'none'} 2s infinite;
  &:hover {
    background: ${p => p.$g ? GOLD_DIM : 'rgba(255,255,255,0.05)'};
    color: ${p => p.$g ? GOLD : TEXT};
  }
`;

const NLabel = styled.span`
  font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; flex: 1;
`;

const Bdg = styled.span`
  margin-left: auto; font-size: 9px; font-weight: 700; padding: 2px 6px;
  border-radius: 20px; background: rgba(239,68,68,0.85); color: #fff; flex-shrink: 0;
`;

const Spacer = styled.div`
  border-top: 1px solid ${BORDER}; padding: 8px 0; flex-shrink: 0;
`;

const CBtn = styled.button<{ $col: boolean }>`
  display: flex; align-items: center; gap: 10px; width: calc(100% - 16px);
  margin: 4px 8px; padding: 9px 12px; background: none; border: none;
  cursor: pointer; color: ${MUTED}; border-radius: 10px; font-size: 13px;
  transition: color 0.15s, background 0.15s;
  justify-content: ${p => p.$col ? 'center' : 'flex-start'};
  &:hover { color: ${TEXT}; background: rgba(255,255,255,0.05); }
`;

const NAV = [
  { section: 'Overview', items: [
    { label: 'Dashboard',        href: '/admin',                  Icon: LayoutDashboard, badge: null, gold: false },
  ]},
  { section: 'Admissions', items: [
    { label: 'Applications',     href: '/admin/applications',     Icon: FileText,        badge: '12', gold: false },
    { label: 'Stream Selection', href: '/admin/stream-selection', Icon: GitBranch,       badge: null, gold: false },
    { label: 'Subject Changes',  href: '/admin/subject-changes',  Icon: RefreshCw,       badge: null, gold: false },
  ]},
  { section: 'Academic', items: [
    { label: 'Students',         href: '/admin/students',         Icon: Users,           badge: null, gold: false },
    { label: 'Teachers',         href: '/admin/teachers',         Icon: GraduationCap,   badge: null, gold: false },
    { label: 'Classes',          href: '/admin/classes',          Icon: Grid3X3,         badge: null, gold: false },
    { label: 'Timetable',        href: '/admin/timetable',        Icon: Calendar,        badge: null, gold: false },
  ]},
  { section: 'Management', items: [
    { label: 'Notices',          href: '/admin/notices',          Icon: Bell,            badge: null, gold: false },
    { label: 'Messages',         href: '/admin/messages',         Icon: MessageSquare,   badge: null, gold: false },
    { label: 'Reports',          href: '/admin/reports',          Icon: BookOpen,        badge: null, gold: false },
  ]},
  { section: 'System', items: [
    { label: 'Settings',         href: '/admin/settings',         Icon: Settings,        badge: null, gold: false },
    { label: 'Academic Year',    href: '/admin/academic-year',    Icon: School,          badge: null, gold: false },
    { label: 'User Management',  href: '/admin/user-management',  Icon: UserCog,         badge: null, gold: false },
    { label: 'Audit Log',        href: '/admin/audit',            Icon: ClipboardList,   badge: null, gold: false },
  ]},
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [col, setCol] = useState(false);

  const isA = (href: string) =>
    href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <Aside $col={col}>
      <Brand $col={col}>
        <BrandDot><Shield size={13} /></BrandDot>
        {!col && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 13, color: TEXT, letterSpacing: '-0.01em' }}>SIDELILE</div>
            <div style={{ fontSize: 8.5, color: MUTED, letterSpacing: '0.12em', marginTop: 1 }}>ADMIN PORTAL</div>
          </div>
        )}
      </Brand>

      <AdminCard $col={col}>
        <Av>SA</Av>
        {!col && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>School Admin</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>Administrator</div>
          </div>
        )}
      </AdminCard>

      <NavSection>
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <SLabel $col={col}>{section}</SLabel>
            {items.map(({ label, href, Icon, badge, gold }) => {
              const a = isA(href);
              return (
                <NI key={href} $a={a} $g={gold} $col={col}
                  onClick={() => router.push(href)} title={col ? label : undefined}>
                  <Icon size={15} strokeWidth={a ? 2 : 1.6} style={{ flexShrink: 0 }} />
                  {!col && <NLabel>{label}</NLabel>}
                  {!col && badge && <Bdg>{badge}</Bdg>}
                  {col && badge && (
                    <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: '#EF4444' }} />
                  )}
                </NI>
              );
            })}
          </div>
        ))}
      </NavSection>

      <Spacer>
        <CBtn $col={col} onClick={() => setCol(v => !v)}>
          {col ? <Menu size={15} /> : <><ChevronLeft size={15} /><span>Collapse</span></>}
        </CBtn>
        <NI $a={false} $col={col} onClick={() => router.push('/admin-portal')}>
          <LogOut size={15} strokeWidth={1.6} style={{ flexShrink: 0 }} />
          {!col && <NLabel>Sign Out</NLabel>}
        </NI>
      </Spacer>
    </Aside>
  );
}
