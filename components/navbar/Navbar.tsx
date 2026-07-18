'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Menu, X, ChevronDown,
  Layers, Newspaper, GraduationCap, LayoutGrid, MessageCircle,
  ArrowUpRight, BookOpen, Users, Heart, Shield,
} from 'lucide-react';
import { V, F, R, E, HARD } from '@/styles/theme';
import { useThemeMode } from '@/components/providers/ThemeProvider';

// ─── Styled ───────────────────────────────────────────────────────────────────

/* Static header — scrolls away with the page, Educare style */
const Header = styled.header`
  position: relative;
  z-index: 100;
`;

/* ── Deck 1 · ink-navy utility bar with bordered nav cells ── */
const UtilityBar = styled.div`
  background: ${HARD.navy};
  @media (max-width: 960px) { display: none; }
`;

const UtilityInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 64px);
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`;

const UtilLinks = styled.nav`
  display: flex;
  align-items: stretch;
`;

const UtilLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${F.heading};
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  padding: 13px 22px;
  border-left: 1px solid rgba(255,255,255,0.14);
  transition: background 0.18s ease, color 0.18s ease;

  &:last-child { border-right: 1px solid rgba(255,255,255,0.14); }
  &:hover { background: rgba(255,255,255,0.08); color: #ffffff; }
`;

const UtilRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const UtilIconBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255,255,255,0.70);
  cursor: pointer;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.18s ease;

  &:hover { color: #ffffff; }
`;

/* ── Deck 2 · main brand bar ── */
const MainBar = styled.div`
  background: ${V.navBg};
  border-bottom: 1px solid ${V.navBorder};
`;

const MainInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 14px clamp(20px, 4vw, 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  flex-shrink: 0;
`;

/* Navy square logo block — the Educare "EDU" treatment */
const LogoBlock = styled.div`
  width: 54px;
  height: 54px;
  background: ${HARD.navy};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.06;
`;

const QuickNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 26px;
  @media (max-width: 960px) { display: none; }
`;

const QuickLink = styled(Link)`
  font-family: ${F.body};
  font-size: 14px;
  font-weight: 500;
  color: ${V.textMuted};
  text-decoration: none;
  transition: color 0.18s ease;

  &:hover { color: ${V.text}; }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

/* Portals dropdown trigger */
const PortalsWrapper = styled.div`
  position: relative;
  @media (max-width: 640px) { display: none; }
`;

const PortalsTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${F.body};
  font-size: 14px;
  font-weight: 500;
  color: ${V.text};
  background: none;
  padding: 10px 18px;
  border: 1px solid ${V.borderStrong};
  border-radius: ${R.sm};
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;

  &:hover { background: ${V.accentSubtle}; }
`;

const PortalsDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 230px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: ${R.sm};
  padding: 8px;
  box-shadow: 0 16px 48px rgba(6,19,32,0.18);
  z-index: 200;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  font-family: ${F.body};
  font-size: 13.5px;
  font-weight: 500;
  color: ${V.textMuted};
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: ${V.text};
    background: ${V.accentSubtle};
  }
`;

/* Navy rectangle CTA — Educare button */
const ApplyBtn = styled(motion.div)`
  a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: ${F.heading};
    font-size: 14.5px;
    font-weight: 700;
    background: ${V.btnBg};
    color: ${V.btnColor};
    padding: 11px 24px;
    border-radius: ${R.sm};
    text-decoration: none;
    transition: opacity 0.18s ease;
    white-space: nowrap;

    &:hover { opacity: 0.88; }
  }
`;

const HamburgerBtn = styled.button`
  background: none;
  border: none;
  color: ${V.text};
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;

  @media (max-width: 960px) { display: flex; }
`;

/* ── Deck 3 · announcement ticker ── */
const TickerBar = styled.div`
  background: ${V.surface};
  border-bottom: 1px solid ${V.border};
  display: flex;
  align-items: stretch;
  overflow: hidden;
`;

const TickerLabel = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-family: ${F.heading};
  font-size: 13px;
  font-weight: 700;
  color: ${V.text};
  padding: 10px 20px 10px clamp(20px, 4vw, 64px);
  border-right: 1px solid ${V.border};
  white-space: nowrap;

  @media (max-width: 640px) { display: none; }
`;

const TickerTrack = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const TickerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
  animation: marquee 40s linear infinite;

  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const TickerItem = styled.span`
  font-family: ${F.body};
  font-size: 13px;
  font-weight: 400;
  color: ${V.textMuted};
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 18px;

  &::after {
    content: '•';
    color: ${V.textFaint};
  }
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${V.bg};
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 0 28px 48px;
  padding-top: 88px;
  overflow-y: auto;
`;

// ─── Nav items ────────────────────────────────────────────────────────────────
const LINKS = [
  { label: 'Experience', href: '#experience', Icon: Layers        },
  { label: 'Academics',  href: '#academics',  Icon: BookOpen      },
  { label: 'News',       href: '#news',       Icon: Newspaper     },
  { label: 'Teachers',   href: '#teachers',   Icon: GraduationCap },
  { label: 'Portals',    href: '#portals',    Icon: LayoutGrid    },
  { label: 'FAQ',        href: '#faq',        Icon: MessageCircle },
];

const TICKER_ITEMS = [
  'Applications for the 2027 academic year are now open',
  '95% Matric Pass Rate — consistently above the national average',
  'Sappi Partner School · KwaZulu-Natal',
  '1,200+ learners · 85 dedicated educators',
  'CAPS-aligned curriculum across all streams',
  'Est. 2001 — 25 Years of Excellence',
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { mode, toggle } = useThemeMode();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);

  return (
    <>
      <Header>
        {/* ── Deck 1 · utility nav ── */}
        <UtilityBar>
          <UtilityInner>
            <UtilLinks>
              {LINKS.map(({ label, href }) => (
                <UtilLink key={label} href={href}>
                  {label}
                </UtilLink>
              ))}
            </UtilLinks>
            <UtilRight>
              <UtilIconBtn onClick={toggle} aria-label="Toggle theme">
                {mode === 'dark'
                  ? <Sun  size={15} strokeWidth={1.5} />
                  : <Moon size={15} strokeWidth={1.5} />
                }
              </UtilIconBtn>
            </UtilRight>
          </UtilityInner>
        </UtilityBar>

        {/* ── Deck 2 · brand bar ── */}
        <MainBar>
          <MainInner>
            <Brand href="/">
              <LogoBlock>
                <Image
                  src="/images/sidelile-badge.png"
                  alt="Sidelile High School"
                  width={40}
                  height={40}
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </LogoBlock>
              <BrandText>
                <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 21, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                  Sidelile
                </span>
                <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 21, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                  High School
                </span>
              </BrandText>
            </Brand>

            <RightGroup>
              <QuickNav>
                <QuickLink href="#news">News &amp; Events</QuickLink>
                <QuickLink href="#academics">Academics</QuickLink>
                <QuickLink href="#faq">Contact</QuickLink>
              </QuickNav>

              <PortalsWrapper>
                <PortalsTrigger
                  onClick={() => setPortalsOpen(v => !v)}
                  onBlur={() => setTimeout(() => setPortalsOpen(false), 150)}
                  aria-label="Login portal selector"
                >
                  Portals
                  <ChevronDown size={14} strokeWidth={1.8} />
                </PortalsTrigger>

                <AnimatePresence>
                  {portalsOpen && (
                    <PortalsDropdown
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: E.smooth }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-faint)', padding: '4px 12px 6px' }}>
                        Portals
                      </div>
                      <DropdownItem href="/student-portal" onClick={() => setPortalsOpen(false)}>
                        <BookOpen size={14} strokeWidth={1.5} />
                        Student Portal
                      </DropdownItem>
                      <DropdownItem href="/teacher-portal" onClick={() => setPortalsOpen(false)}>
                        <Users size={14} strokeWidth={1.5} />
                        Teacher Portal
                      </DropdownItem>
                      <DropdownItem href="/parent-portal" onClick={() => setPortalsOpen(false)}>
                        <Heart size={14} strokeWidth={1.5} />
                        Parent Portal
                      </DropdownItem>

                      <div style={{ height: 1, background: 'var(--border)', margin: '6px 4px' }} />

                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-faint)', padding: '4px 12px 6px' }}>
                        Administration
                      </div>
                      <DropdownItem href="/admin-portal" onClick={() => setPortalsOpen(false)}>
                        <Shield size={14} strokeWidth={1.5} />
                        Admin Portal
                      </DropdownItem>
                    </PortalsDropdown>
                  )}
                </AnimatePresence>
              </PortalsWrapper>

              <ApplyBtn
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <Link href="/apply">
                  Apply Now
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </Link>
              </ApplyBtn>

              <HamburgerBtn onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={22} strokeWidth={1.5} />
              </HamburgerBtn>
            </RightGroup>
          </MainInner>
        </MainBar>

        {/* ── Deck 3 · announcement ticker ── */}
        <TickerBar>
          <TickerLabel>Apply for 2027 — let&apos;s make it official!</TickerLabel>
          <TickerTrack>
            <TickerContent>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <TickerItem key={i}>{item}</TickerItem>
              ))}
            </TickerContent>
          </TickerTrack>
        </TickerBar>
      </Header>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Fixed close button */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 201, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{ width: 38, height: 38, background: HARD.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/images/sidelile-badge.png" alt="Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
                </div>
                <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Sidelile High School</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}
            >
              {LINKS.map(({ label, href, Icon }) => (
                <motion.div
                  key={label}
                  variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: E.smooth } } }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: F.heading, fontSize: 28, fontWeight: 700, color: 'var(--text)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border)' }}
                  >
                    <Icon size={20} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                    {label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 24 }}>
              <div style={{ fontFamily: F.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', padding: '0 4px 4px', marginTop: 8 }}>
                Portals
              </div>
              <Link href="/student-portal" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 16px', borderRadius: 8, fontFamily: F.body, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
                <BookOpen size={15} strokeWidth={1.5} /> Student Portal
              </Link>
              <Link href="/teacher-portal" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 16px', borderRadius: 8, fontFamily: F.body, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
                <Users size={15} strokeWidth={1.5} /> Teacher Portal
              </Link>
              <Link href="/parent-portal" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 16px', borderRadius: 8, fontFamily: F.body, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
                <Heart size={15} strokeWidth={1.5} /> Parent Portal
              </Link>
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <Link href="/admin-portal" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border-strong)', color: 'var(--text)', background: 'var(--accent-subtle)', padding: '12px 16px', borderRadius: 8, fontFamily: F.body, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                <Shield size={15} strokeWidth={1.5} /> Admin Portal
              </Link>
              <Link href="/apply" onClick={() => setMobileOpen(false)} style={{ display: 'block', background: 'var(--btn-bg)', color: 'var(--btn-color)', padding: '15px', borderRadius: 8, fontFamily: F.heading, fontWeight: 700, fontSize: 15, textDecoration: 'none', textAlign: 'center', marginTop: 4 }}>
                Apply Now →
              </Link>
            </div>
          </MobileOverlay>
        )}
      </AnimatePresence>
    </>
  );
}
