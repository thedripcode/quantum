'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, ClipboardList,
  Calendar, BarChart2, Bell, LogOut,
  Menu, X, Phone, Mail, MapPin, Cake, ChevronRight,
} from 'lucide-react';

// ─── Navy palette ─────────────────────────────────────────────────────────────
const N = {
  bg:        '#070E1D',
  surface:   '#0B1628',
  card:      '#0F1F38',
  border:    'rgba(255,255,255,0.07)',
  accent:    '#2563EB',
  accentFg:  'rgba(37,99,235,0.18)',
  text:      '#FFFFFF',
  muted:     'rgba(255,255,255,0.50)',
  faint:     'rgba(255,255,255,0.25)',
};
const F = {
  h: "'Bricolage Grotesque', sans-serif",
  b: "'Inter', sans-serif",
};

// ─── Nav items ────────────────────────────────────────────────────────────────
const ITEMS = [
  { label: 'Dashboard',   href: '/dashboard/student',             Icon: LayoutDashboard             },
  { label: 'Subjects',    href: '/dashboard/student#subjects',    Icon: BookOpen                    },
  { label: 'Assignments', href: '/dashboard/student#assignments', Icon: ClipboardList, badge: '3'   },
  { label: 'Attendance',  href: '/dashboard/student#attendance',  Icon: Calendar                    },
  { label: 'Results',     href: '/dashboard/student#results',     Icon: BarChart2                   },
  { label: 'Notices',     href: '/dashboard/student#notices',     Icon: Bell,          badge: '2'   },
];

// ─── Styled ───────────────────────────────────────────────────────────────────
const SideEl = styled.aside`
  width: 260px;
  min-height: 100vh;
  background: ${N.bg};
  border-right: 1px solid ${N.border};
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;

  /* scrollbar */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 4px; }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid ${N.border};
  flex-shrink: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 20px;
  border-bottom: 1px solid ${N.border};
  text-align: center;
`;

const AvatarCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${F.h};
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  box-shadow: 0 8px 28px rgba(37,99,235,0.40);
  position: relative;
  margin-bottom: 14px;
`;

const OnlineDot = styled.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #22C55E;
  border: 2.5px solid ${N.bg};
`;

const IDPill = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(37,99,235,0.14);
  border: 1px solid rgba(37,99,235,0.25);
  border-radius: 20px;
  padding: 3px 10px;
  font-family: ${F.b};
  font-size: 10.5px;
  font-weight: 600;
  color: #93C5FD;
  letter-spacing: 0.06em;
  margin-top: 6px;
`;

const InfoSection = styled.div`
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 11px;
  border-bottom: 1px solid ${N.border};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const InfoLabel = styled.span`
  font-family: ${F.b};
  font-size: 11px;
  font-weight: 600;
  color: ${N.faint};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  flex-shrink: 0;
  min-width: 56px;
  padding-top: 0.5px;
`;

const InfoVal = styled.span`
  font-family: ${F.b};
  font-size: 12px;
  font-weight: 400;
  color: ${N.muted};
  line-height: 1.45;
`;

const NavSection = styled.nav`
  flex: 1;
  padding: 10px 10px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 11px;
  border-radius: 9px;
  font-family: ${F.b};
  font-size: 12.5px;
  font-weight: ${p => p.$active ? 600 : 400};
  color: ${p => p.$active ? '#ffffff' : N.muted};
  background: ${p => p.$active ? N.accentFg : 'transparent'};
  border: 1px solid ${p => p.$active ? 'rgba(37,99,235,0.30)' : 'transparent'};
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.07);
  }
`;

const BadgePill = styled.span`
  margin-left: auto;
  background: ${N.accent};
  color: #fff;
  font-family: ${F.b};
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
`;

const FooterSection = styled.div`
  padding: 10px;
  border-top: 1px solid ${N.border};
  flex-shrink: 0;
`;

// ─── Content (shared between desktop/mobile) ──────────────────────────────────
function SidebarContent({ active, onClose }: { active: string; onClose?: () => void }) {
  return (
    <>
      {/* Top bar */}
      <TopBar>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sidelile-badge.png" alt="Sidelile" width={28} height={28} style={{ objectFit: 'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div>
            <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1 }}>SIDELILE HS</div>
            <div style={{ fontFamily: F.b, fontSize: 9, color: '#93C5FD', letterSpacing: '0.10em', marginTop: 2 }}>Student Portal</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: N.muted, cursor: 'pointer', display: 'flex', padding: 4 }}>
            <X size={16} strokeWidth={1.5} />
          </button>
        )}
      </TopBar>

      {/* Profile */}
      <ProfileSection>
        <AvatarCircle>
          TM
          <OnlineDot />
        </AvatarCircle>
        <div style={{ fontFamily: F.h, fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
          Hey, Thabo
        </div>
        <div style={{ fontFamily: F.b, fontSize: 12, color: N.muted, marginTop: 2 }}>
          Grade 12A · Sciences
        </div>
        <IDPill>STU2024042</IDPill>
      </ProfileSection>

      {/* Profile info */}
      <InfoSection>
        <InfoRow>
          <BookOpen size={12} strokeWidth={1.5} style={{ color: N.faint, flexShrink: 0, marginTop: 2 }} />
          <div>
            <InfoLabel>Course</InfoLabel>
            <InfoVal style={{ display: 'block', marginTop: 1 }}>Grade 12 · Science Stream</InfoVal>
          </div>
        </InfoRow>
        <InfoRow>
          <Cake size={12} strokeWidth={1.5} style={{ color: N.faint, flexShrink: 0, marginTop: 1 }} />
          <div>
            <InfoLabel>DOB</InfoLabel>
            <InfoVal style={{ display: 'block', marginTop: 1 }}>14 March 2008</InfoVal>
          </div>
        </InfoRow>
        <InfoRow>
          <Phone size={12} strokeWidth={1.5} style={{ color: N.faint, flexShrink: 0, marginTop: 1 }} />
          <div>
            <InfoLabel>Contact</InfoLabel>
            <InfoVal style={{ display: 'block', marginTop: 1 }}>+27 82 555 0142</InfoVal>
          </div>
        </InfoRow>
        <InfoRow>
          <Mail size={12} strokeWidth={1.5} style={{ color: N.faint, flexShrink: 0, marginTop: 1 }} />
          <div>
            <InfoLabel>Email</InfoLabel>
            <InfoVal style={{ display: 'block', marginTop: 1 }}>thabo@sidelile.edu.za</InfoVal>
          </div>
        </InfoRow>
        <InfoRow>
          <MapPin size={12} strokeWidth={1.5} style={{ color: N.faint, flexShrink: 0, marginTop: 1 }} />
          <div>
            <InfoLabel>Address</InfoLabel>
            <InfoVal style={{ display: 'block', marginTop: 1 }}>12 School Rd, Umkomaas, KZN</InfoVal>
          </div>
        </InfoRow>
      </InfoSection>

      {/* Navigation */}
      <NavSection>
        {ITEMS.map(({ label, href, Icon, badge }) => (
          <NavItem key={label} href={href} $active={active === label} onClick={onClose}>
            <Icon size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            {label}
            {badge && <BadgePill>{badge}</BadgePill>}
            {active === label && <ChevronRight size={12} strokeWidth={1.5} style={{ marginLeft: 'auto', opacity: 0.50 }} />}
          </NavItem>
        ))}
      </NavSection>

      {/* Footer */}
      <FooterSection>
        <Link
          href="/student-portal"
          style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderRadius: 9, fontFamily: F.b, fontSize: 12.5, color: N.faint, textDecoration: 'none', transition: 'all 0.15s ease' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = N.faint; el.style.background = 'transparent'; }}
        >
          <LogOut size={14} strokeWidth={1.5} />
          Sign Out
        </Link>
      </FooterSection>
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
interface StudentSidebarProps { activeItem?: string; }

export default function StudentSidebar({ activeItem = 'Dashboard' }: StudentSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <SideEl className="hidden lg:flex lg:flex-col">
        <SidebarContent active={activeItem} />
      </SideEl>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-30 w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center text-white"
        style={{ background: N.accent }}
      >
        <Menu size={22} strokeWidth={1.5} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, width: 270, background: N.bg, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
            >
              <SidebarContent active={activeItem} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
