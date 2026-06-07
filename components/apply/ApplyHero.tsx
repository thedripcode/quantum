'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle2, Phone, Mail, Clock } from 'lucide-react';
import { F, R, E } from '@/styles/theme';

// ─── Same video source as hero ────────────────────────────────────────────────
const VIDEO_SRC = '/videos/hero-bg.mp4';

const BENEFITS = [
  '95% matric pass rate — consistently above national average',
  'World-class science labs and 40-seat computer centre',
  'Dedicated learner support and counselling services',
  '24+ sports codes and extracurricular activities',
];

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: d, ease: E.smooth } }),
};
const clip = (i: number) => ({
  hidden:  { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.85, delay: 0.15 + i * 0.10, ease: [0.76, 0, 0.24, 1] } },
});

// ─── Styled ───────────────────────────────────────────────────────────────────
const Wrap = styled.section`
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #0a0a0a;
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
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(0,0,0,0.88) 0%,
    rgba(0,0,0,0.72) 55%,
    rgba(0,0,0,0.50) 100%
  );
  z-index: 1;
`;

const Grain = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  z-index: 2;
`;

const Inner = styled.div`
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 140px clamp(24px, 8vw, 120px) 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-top: 120px;
  }
`;

const LineMask = styled.div`
  overflow: hidden;
  line-height: 1.03;
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ApplyHero() {
  return (
    <Wrap>
      {/* Background video */}
      <VideoBg autoPlay muted loop playsInline preload="auto">
        <source src={VIDEO_SRC} type="video/mp4" />
      </VideoBg>
      <Overlay aria-hidden />
      <Grain   aria-hidden />

      <Inner>
        {/* ── Left: Text content ── */}
        <div>
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: R.full, marginBottom: 28,
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <GraduationCap size={13} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.70)' }} />
            <span style={{ fontFamily: F.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.70)' }}>
              Admissions 2026
            </span>
          </motion.div>

          {/* Headline */}
          <h1 style={{ fontFamily: F.heading, fontSize: 'clamp(44px, 6vw, 80px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.03, margin: '0 0 20px' }}>
            {['Apply for', 'Admission.'].map((line, i) => (
              <LineMask key={i}>
                <motion.span
                  style={{ display: 'block' }}
                  variants={clip(i)}
                  initial="hidden"
                  animate="visible"
                >
                  {line}
                </motion.span>
              </LineMask>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            custom={0.4}
            initial="hidden"
            animate="visible"
            style={{ fontFamily: F.body, fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.60)', lineHeight: 1.65, maxWidth: 420, marginBottom: 32 }}
          >
            Take the first step towards an extraordinary education. Join the Sidelile community and unlock your full potential.
          </motion.p>

          {/* Benefits */}
          <motion.ul
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
            initial="hidden"
            animate="visible"
            style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {BENEFITS.map(b => (
              <motion.li
                key={b}
                variants={fadeUp}
                custom={0}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}
              >
                <CheckCircle2 size={15} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.70)', flexShrink: 0, marginTop: 1 }} />
                {b}
              </motion.li>
            ))}
          </motion.ul>

          {/* Contact strip */}
          <motion.div
            variants={fadeUp}
            custom={0.75}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px' }}
          >
            {[
              { Icon: Phone, text: '+27 39 970 7393',          href: 'tel:+27399707393'               },
              { Icon: Mail,  text: 'admissions@sidelile.edu.za', href: 'mailto:admissions@sidelile.edu.za' },
              { Icon: Clock, text: 'Mon–Fri: 07:30–15:30',      href: undefined                          },
            ].map(({ Icon, text, href }) =>
              href ? (
                <a key={text} href={href}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: F.body, fontSize: 13, color: 'rgba(255,255,255,0.50)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
                >
                  <Icon size={13} strokeWidth={1.5} />
                  {text}
                </a>
              ) : (
                <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: F.body, fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
                  <Icon size={13} strokeWidth={1.5} />
                  {text}
                </span>
              )
            )}
          </motion.div>
        </div>

        {/* ── Right: Stats card ── */}
        <motion.div
          variants={fadeUp}
          custom={0.3}
          initial="hidden"
          animate="visible"
        >
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: R.xl,
            padding: '40px 36px',
          }}>
            <div style={{ fontFamily: F.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)', marginBottom: 28 }}>
              Why Sidelile
            </div>

            {[
              { num: '95%',  label: 'Matric Pass Rate',   sub: 'Consistently above national average' },
              { num: '1,200+', label: 'Enrolled Learners', sub: 'Across Grade 8 to Grade 12'         },
              { num: '85',   label: 'Expert Educators',   sub: 'Passionate, qualified teachers'      },
              { num: '25',   label: 'Years of Excellence', sub: 'Serving KwaZulu-Natal since 2001'  },
            ].map(({ num, label, sub }, i) => (
              <div key={label} style={{
                paddingTop: i === 0 ? 0 : 20,
                marginTop: i === 0 ? 0 : 20,
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}>
                <div style={{ fontFamily: F.heading, fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>
                  {num}
                </div>
                <div>
                  <div style={{ fontFamily: F.heading, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.80)' }}>{label}</div>
                  <div style={{ fontFamily: F.body, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.40)', marginTop: 2 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Inner>
    </Wrap>
  );
}
