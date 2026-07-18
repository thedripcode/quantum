'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { F, E } from '@/styles/theme';

// ─── Local video (copied to public/) ──────────────────────────────────────────
const VIDEO_SRC = '/videos/hero-bg.mp4';

// ─── Slides ───────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    label:    'KwaZulu-Natal · Est. 2001',
    lines:    ['Excellence in Education,', 'Done Right.'],
    sub:      "Shaping tomorrow's leaders in KwaZulu-Natal. A CAPS-aligned school built for learner success.",
    cta1:     { label: 'Apply Now',      href: '/apply'       },
    cta2:     { label: 'Explore School', href: '#experience'  },
  },
  {
    label:    '95% Matric Pass Rate',
    lines:    ["Building Tomorrow's", 'Leaders Today.'],
    sub:      'Our learners consistently outperform national benchmarks, guided by 85 dedicated educators.',
    cta1:     { label: 'Meet Our Teachers', href: '#teachers'   },
    cta2:     { label: 'View Academics',    href: '#academics'  },
  },
  {
    label:    'Ubuntu School Culture',
    lines:    ['A Community', 'Built on Ubuntu.'],
    sub:      'Every voice matters. Every learner belongs. Shared respect drives everything we do at Sidelile.',
    cta1:     { label: 'Apply Now',    href: '/apply'    },
    cta2:     { label: 'Our Story',    href: '#experience' },
  },
  {
    label:    'Sappi Partner School',
    lines:    ['Modern Learning,', 'Real Results.'],
    sub:      'From computer labs to science facilities — Sidelile is fully equipped for the future of education.',
    cta1:     { label: 'View Portals', href: '#portals'    },
    cta2:     { label: 'Learn More',   href: '#academics'  },
  },
];

const INTERVAL = 6000;

// ─── Framer variants ──────────────────────────────────────────────────────────
const lineReveal = (i: number) => ({
  hidden:  { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    transition: { duration: 0.82, delay: 0.06 + i * 0.10, ease: [0.76, 0, 0.24, 1] },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.20 } },
});
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.60, delay: d, ease: E.smooth },
  }),
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

// ─── Styled ───────────────────────────────────────────────────────────────────
const Wrap = styled.section`
  position: relative;
  /* Header is static now — hero fills most of the remaining viewport */
  min-height: clamp(560px, 82vh, 900px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: #090909;
`;

const VideoBg = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  z-index: 0;
  opacity: 0.55;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom,
      rgba(0,0,0,0.60) 0%,
      rgba(0,0,0,0.65) 40%,
      rgba(0,0,0,0.80) 100%
    );
  z-index: 1;
`;

const Grain = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");
  opacity: 0.030;
  pointer-events: none;
  z-index: 2;
`;

const Content = styled.div`
  position: relative;
  z-index: 3;
  text-align: left;
  max-width: 1400px;
  width: 100%;
  padding: 120px clamp(20px, 4vw, 64px) 88px;
  margin: 0 auto;
`;

const LineMask = styled.div`
  overflow: hidden;
  line-height: 1.03;
`;

/* Progress bar strip at the very bottom */
const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255,255,255,0.10);
  z-index: 4;
  overflow: hidden;
`;

/* Dots */
const DotsRow = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.button<{ $active: boolean }>`
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 0;
  background: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255,255,255,0.28)')};
  width: ${({ $active }) => ($active ? '28px' : '6px')};
  height: 6px;
  border-radius: 3px;
  transition: width 0.40s cubic-bezier(0.33,1,0.68,1), background 0.40s ease;
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((next: number) => {
    setSlide(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const advance = useCallback(() => go(slide + 1), [slide, go]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(advance, INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [slide, paused, advance]);

  const { label, lines, sub, cta1, cta2 } = SLIDES[slide];

  return (
    <Wrap
      id="home"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Video background ── */}
      <VideoBg autoPlay muted loop playsInline preload="auto">
        <source src={VIDEO_SRC} type="video/mp4" />
      </VideoBg>
      <Overlay aria-hidden />
      <Grain   aria-hidden />

      {/* ── Slide content ── */}
      <Content>
        <AnimatePresence mode="wait">
          <motion.div key={slide} style={{ width: '100%' }}>

            {/* Label pill */}
            <motion.div
              variants={fadeUp} custom={0}
              initial="hidden" animate="visible" exit="exit"
              style={{
                display: 'inline-block',
                background: '#1e3a8a',
                color: '#ffffff',
                padding: '7px 16px',
                borderRadius: 3,
                fontFamily: F.heading,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                marginBottom: 28,
              }}
            >
              {label}
            </motion.div>

            {/* Headline — clip-reveal per line */}
            <h1 style={{
              fontFamily: F.heading,
              fontSize: 'clamp(52px, 8vw, 112px)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1.02,
              margin: '0 0 22px',
            }}>
              {lines.map((line, i) => (
                <LineMask key={i}>
                  <motion.span
                    style={{ display: 'block' }}
                    variants={lineReveal(i)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {line}
                  </motion.span>
                </LineMask>
              ))}
            </h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp} custom={0.36}
              initial="hidden" animate="visible" exit="exit"
              style={{
                fontFamily: F.body,
                fontSize: 17,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.68)',
                maxWidth: 520,
                margin: '0 0 36px',
                lineHeight: 1.65,
              }}
            >
              {sub}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp} custom={0.52}
              initial="hidden" animate="visible" exit="exit"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Link
                  href={cta1.href}
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    fontFamily: F.heading, fontSize: 15, fontWeight: 700,
                    background: '#FFFFFF', color: '#0a1e2e',
                    padding: '14px 34px', borderRadius: 6, textDecoration: 'none',
                  }}
                >
                  {cta1.label}
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Link
                  href={cta2.href}
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    fontFamily: F.body, fontSize: 15, fontWeight: 400,
                    color: 'rgba(255,255,255,0.68)',
                    padding: '14px 34px', borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.30)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s ease, color 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.55)';
                    el.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.22)';
                    el.style.color = 'rgba(255,255,255,0.68)';
                  }}
                >
                  {cta2.label}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </Content>

      {/* ── Slide indicators ── */}
      <DotsRow>
        {SLIDES.map((_, i) => (
          <Dot
            key={i}
            $active={i === slide}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </DotsRow>

      {/* ── Progress strip ── */}
      <ProgressBar>
        <AnimatePresence>
          {!paused && (
            <motion.div
              key={slide}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              exit={{ width: '100%' }}
              transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
              style={{ height: '100%', background: 'rgba(255,255,255,0.55)' }}
            />
          )}
        </AnimatePresence>
      </ProgressBar>
    </Wrap>
  );
}
