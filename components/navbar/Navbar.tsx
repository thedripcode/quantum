'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Menu, X,
  Layers, Newspaper, GraduationCap, LayoutGrid, MessageCircle,
  LogIn, ArrowUpRight, BookOpen, Users, Heart, Shield,
} from 'lucide-react';
import { V, F, R, E } from '@/styles/theme';
import { useThemeMode } from '@/components/providers/ThemeProvider';

// ─── Styled ───────────────────────────────────────────────────────────────────

const Bar = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${V.navBg};
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-bottom: 1px solid ${V.navBorder};
  height: 68px;
  display: flex;
  align-items: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 64px);
  display: flex;
  align-items: center;
  gap: 0;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: 32px;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;

  @media (max-width: 640px) { display: none; }
`;

/* Centre links fill the remaining space */
const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;

  @media (max-width: 960px) { display: none; }
`;

const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${F.body};
  font-size: 13.5px;
  font-weight: 400;
  color: ${V.textMuted};
  text-decoration: none;
  padding: 7px 12px;
  border-radius: 10px;
  transition: color 0.18s ease, background 0.18s ease;
  white-space: nowrap;

  &:hover {
    color: ${V.text};
    background: ${V.accentSubtle};
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 24px;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  color: ${V.textMuted};
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: ${R.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.18s ease, background 0.18s ease;

  &:hover { color: ${V.text}; background: ${V.accentSubtle}; }
`;

const LoginWrapper = styled.div`
  position: relative;
  @media (max-width: 640px) { display: none; }
`;

const LoginTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.body};
  font-size: 13.5px;
  font-weight: 500;
  color: ${V.textMuted};
  background: none;
  padding: 8px 16px;
  border-radius: ${R.full};
  border: 1px solid ${V.border};
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;

  &:hover {
    color: ${V.text};
    border-color: ${V.borderStrong};
    background: ${V.accentSubtle};
  }
`;

const LoginDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 220px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.28);
  z-index: 200;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
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

const ApplyBtn = styled(motion.div)`
  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: ${F.heading};
    font-size: 13.5px;
    font-weight: 600;
    background: ${V.btnBg};
    color: ${V.btnColor};
    padding: 9px 20px;
    border-radius: ${R.full};
    text-decoration: none;
    transition: opacity 0.18s ease;
    white-space: nowrap;

    &:hover { opacity: 0.82; }
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
  width: 36px;
  height: 36px;

  @media (max-width: 960px) { display: flex; }
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { mode, toggle } = useThemeMode();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [loginOpen,    setLoginOpen]    = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Bar
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: E.smooth }}
        style={{ boxShadow: scrolled ? '0 1px 0 var(--border)' : 'none' }}
      >
        <Inner>
          {/* ── Logo + Brand ── */}
          <Brand href="/">
            <Image
              src="/images/sidelile-badge.png"
              alt="Sidelile High School"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
              priority
            />
            <BrandText>
              <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 14, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                SIDELILE
              </span>
              <span style={{ fontFamily: F.body, fontSize: 8.5, color: 'var(--text-muted)', letterSpacing: '0.14em', marginTop: 1.5 }}>
                HIGH SCHOOL
              </span>
            </BrandText>
          </Brand>

          {/* ── Centre navigation ── */}
          <NavLinks>
            {LINKS.map(({ label, href, Icon }) => (
              <NavLink key={label} href={href}>
                <Icon size={13} strokeWidth={1.5} />
                {label}
              </NavLink>
            ))}
          </NavLinks>

          {/* ── Right actions ── */}
          <RightGroup>
            <IconBtn onClick={toggle} aria-label="Toggle theme">
              {mode === 'dark'
                ? <Sun  size={15} strokeWidth={1.5} />
                : <Moon size={15} strokeWidth={1.5} />
              }
            </IconBtn>

            <LoginWrapper>
              <LoginTrigger
                onClick={() => setLoginOpen(v => !v)}
                onBlur={() => setTimeout(() => setLoginOpen(false), 150)}
                aria-label="Login portal selector"
              >
                <LogIn size={13} strokeWidth={1.5} />
                Login
              </LoginTrigger>

              <AnimatePresence>
                {loginOpen && (
                  <LoginDropdown
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: E.smooth }}
                  >
                    {/* Section label */}
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-faint)', padding: '4px 12px 6px' }}>
                      Portals
                    </div>
                    <DropdownItem href="/student-portal" onClick={() => setLoginOpen(false)}>
                      <BookOpen size={14} strokeWidth={1.5} />
                      Student Portal
                    </DropdownItem>
                    <DropdownItem href="/teacher-portal" onClick={() => setLoginOpen(false)}>
                      <Users size={14} strokeWidth={1.5} />
                      Teacher Portal
                    </DropdownItem>
                    <DropdownItem href="/parent-portal" onClick={() => setLoginOpen(false)}>
                      <Heart size={14} strokeWidth={1.5} />
                      Parent Portal
                    </DropdownItem>

                    {/* Divider */}
                    <div style={{ height: 1, background: 'var(--border)', margin: '6px 4px' }} />

                    {/* Admin */}
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-faint)', padding: '4px 12px 6px' }}>
                      Administration
                    </div>
                    <DropdownItem
                      href="/admin-portal"
                      onClick={() => setLoginOpen(false)}
                      style={{ color: '#C9A84C' } as React.CSSProperties}
                    >
                      <Shield size={14} strokeWidth={1.5} style={{ color: '#C9A84C' }} />
                      Admin Portal
                    </DropdownItem>
                  </LoginDropdown>
                )}
              </AnimatePresence>
            </LoginWrapper>

            <ApplyBtn
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <Link href="/apply">
                Apply Now
                <ArrowUpRight size={13} strokeWidth={2} />
              </Link>
            </ApplyBtn>

            <HamburgerBtn onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={20} strokeWidth={1.5} />
            </HamburgerBtn>
          </RightGroup>
        </Inner>
      </Bar>

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
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 201, background: 'var(--bg)' }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <Image src="/images/sidelile-badge.png" alt="Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
                <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>SIDELILE</span>
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
              <Link href="/student-portal" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 16px', borderRadius: 12, fontFamily: F.body, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
                <BookOpen size={15} strokeWidth={1.5} /> Student Portal
              </Link>
              <Link href="/teacher-portal" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 16px', borderRadius: 12, fontFamily: F.body, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
                <Users size={15} strokeWidth={1.5} /> Teacher Portal
              </Link>
              <Link href="/parent-portal" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 16px', borderRadius: 12, fontFamily: F.body, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
                <Heart size={15} strokeWidth={1.5} /> Parent Portal
              </Link>
              {/* Divider */}
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <Link href="/admin-portal" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(201,168,76,0.30)', color: '#C9A84C', background: 'rgba(201,168,76,0.07)', padding: '12px 16px', borderRadius: 12, fontFamily: F.body, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                <Shield size={15} strokeWidth={1.5} /> Admin Portal
              </Link>
              <Link href="/apply" onClick={() => setMobileOpen(false)} style={{ display: 'block', background: 'var(--btn-bg)', color: 'var(--btn-color)', padding: '15px', borderRadius: R.full, fontFamily: F.body, fontWeight: 600, fontSize: 15, textDecoration: 'none', textAlign: 'center', marginTop: 4 }}>
                Apply Now →
              </Link>
            </div>
          </MobileOverlay>
        )}
      </AnimatePresence>
    </>
  );
}
