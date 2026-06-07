'use client';

import { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useInView } from 'framer-motion';
import {
  FlaskConical, TrendingUp, BookOpen, Compass,
  CheckCircle2, ArrowUpRight,
} from 'lucide-react';
import { V, F, R, E } from '@/styles/theme';

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2.0, trigger: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const total = Math.round(duration * 60);
    const tick = () => {
      frame++;
      const p = Math.min(frame / total, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target, duration]);
  return val;
}

// ─── Variants ─────────────────────────────────────────────────────────────────
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
};
const up = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.70, ease: E.smooth } },
};
const clipLine = {
  hidden:  { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.88, ease: [0.76, 0, 0.24, 1] } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const STREAMS = [
  {
    Icon:     FlaskConical,
    name:     'Sciences',
    tagline:  'Analytical minds. Real discoveries.',
    subjects: [
      'Mathematics (Pure)',
      'Physical Sciences',
      'Life Sciences',
      'Geography',
      'English Home Language',
      'isiZulu HL / FAL',
      'Life Orientation',
    ],
  },
  {
    Icon:     TrendingUp,
    name:     'Commerce',
    tagline:  'Business thinking. Financial fluency.',
    subjects: [
      'Accounting',
      'Business Studies',
      'Economics',
      'Mathematical Literacy',
      'English Home Language',
      'isiZulu HL / FAL',
      'Life Orientation',
    ],
    featured: true,
  },
  {
    Icon:     BookOpen,
    name:     'Humanities',
    tagline:  'Critical thought. Cultural depth.',
    subjects: [
      'History',
      'Geography',
      'Tourism',
      'Mathematical Literacy',
      'English Home Language',
      'isiZulu HL / FAL',
      'Life Orientation',
    ],
  },
  {
    Icon:     Compass,
    name:     'Languages',
    tagline:  'Communication. Expression. Identity.',
    subjects: [
      'English Home Language',
      'isiZulu Home Language',
      'Afrikaans FAL',
      'Life Orientation',
      'History or Geography',
      'Mathematical Literacy',
      'Creative Arts',
    ],
  },
];

const STATS = [
  { raw: 85,  suffix: '+',    label: 'University endorsements per year'  },
  { raw: 100, suffix: '%',    label: 'CAPS-aligned curriculum'            },
  { raw: 25,  suffix: ' yrs', label: 'Consecutive pass rate growth'       },
];

// ─── Styled ───────────────────────────────────────────────────────────────────
const Section = styled.section`
  background: ${V.bg};
  overflow: hidden;
`;

const RateWrap = styled.div`
  padding: 120px clamp(24px, 8vw, 120px) 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const BigNumber = styled.div`
  font-family: ${F.heading};
  font-size: clamp(96px, 16vw, 196px);
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.05em;
  line-height: 0.88;
  display: flex;
  align-items: flex-start;
`;

const Percent = styled.span`
  font-size: 0.38em;
  font-weight: 700;
  margin-top: 0.18em;
  color: var(--text-muted);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${V.border};
  margin: 32px 0;
`;

const StatLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 0;
`;

const SubjectsWrap = styled.div`
  padding: 0 clamp(24px, 8vw, 120px) 120px;
  border-top: 1px solid ${V.border};
`;

const StreamGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 56px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const StreamCard = styled(motion.div)<{ $featured?: boolean }>`
  background: ${({ $featured }) => ($featured ? V.surface2 : V.surface)};
  border: 1px solid ${({ $featured }) => ($featured ? V.borderStrong : V.border)};
  border-radius: ${R.xl};
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.28s ease, background 0.28s ease;

  &:hover {
    border-color: ${V.borderStrong};
    background: ${V.surface2};
  }
`;

const TopAccent = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: ${V.text};
  opacity: 0.22;
`;

const SubjectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 0;
  font-family: ${F.body};
  font-size: 13px;
  font-weight: 300;
  color: var(--text-muted);
  border-bottom: 1px solid ${V.border};

  &:last-child { border-bottom: none; }
`;

// ─── Animated stat ─────────────────────────────────────────────────────────────
function AnimStat({ raw, suffix, label }: { raw: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const val = useCountUp(raw, 1.8, inView);
  return (
    <StatLine ref={ref}>
      <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.4 }}>
        {label}
      </span>
      <span style={{ fontFamily: F.heading, fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', flexShrink: 0 }}>
        {val}{suffix}
      </span>
    </StatLine>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AcademicsSection() {
  const rateRef  = useRef(null);
  const rateInView = useInView(rateRef, { once: true, margin: '-80px' });
  const rateVal  = useCountUp(95, 2.2, rateInView);

  return (
    <Section id="academics">

      {/* ══ Part 1 — Pass rate ══════════════════════════════════════════ */}
      <RateWrap>

        {/* Left — animated number */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: E.smooth }}
            style={{
              fontFamily: F.body, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: 20,
            }}
          >
            Academic Excellence
          </motion.div>

          <div ref={rateRef}>
            <BigNumber>
              {rateVal}<Percent>%</Percent>
            </BigNumber>
          </div>

          <div style={{ overflow: 'hidden', marginTop: 24 }}>
            <motion.p
              variants={clipLine}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                fontFamily: F.heading,
                fontSize: 'clamp(18px, 2.2vw, 26px)',
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: '-0.02em',
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              Matric pass rate — consistently above<br />the national average since 2001.
            </motion.p>
          </div>
        </div>

        {/* Right — supporting stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.p
            variants={up}
            style={{
              fontFamily: F.body, fontSize: 15, fontWeight: 300,
              color: 'var(--text-muted)', lineHeight: 1.72,
              marginBottom: 32, maxWidth: 420, margin: '0 0 32px',
            }}
          >
            Every learner who walks through our doors receives the support, structure, and skilled teaching needed to achieve their personal best. Excellence is not an accident — it is built, subject by subject, term by term.
          </motion.p>

          <Divider />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {STATS.map(s => (
              <motion.div key={s.label} variants={up}>
                <AnimStat {...s} />
              </motion.div>
            ))}
          </div>

          <Divider />

          <motion.div variants={up}>
            <motion.a
              href="/apply"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: F.body, fontSize: 14, fontWeight: 500,
                color: 'var(--text)', textDecoration: 'none',
                padding: '10px 20px', borderRadius: R.full,
                border: '1px solid var(--border)',
                transition: 'border-color 0.2s ease, background 0.2s ease',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border-strong)';
                el.style.background  = 'var(--accent-subtle)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border)';
                el.style.background  = 'transparent';
              }}
            >
              Apply for 2026 <ArrowUpRight size={14} strokeWidth={1.5} />
            </motion.a>
          </motion.div>
        </motion.div>
      </RateWrap>

      {/* ══ Part 2 — Subject streams ════════════════════════════════════ */}
      <SubjectsWrap>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: E.smooth }}
          style={{ paddingTop: 72 }}
        >
          <div style={{
            fontFamily: F.body, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: 12,
          }}>
            Curriculum
          </div>
          <h2 style={{
            fontFamily: F.heading,
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 700, color: 'var(--text)',
            letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
          }}>
            Subjects &amp; Streams
          </h2>
          <p style={{
            fontFamily: F.body, fontSize: 15, fontWeight: 300,
            color: 'var(--text-muted)', marginTop: 12, maxWidth: 520,
          }}>
            Grade 10–12 learners choose a subject stream aligned to their strengths and future career goals — all following the CAPS national curriculum.
          </p>
        </motion.div>

        <StreamGrid
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {STREAMS.map(({ Icon, name, tagline, subjects, featured }) => (
            <StreamCard key={name} variants={up} $featured={featured}>
              <TopAccent />

              {/* Icon + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: R.md,
                  background: 'var(--accent-subtle)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} strokeWidth={1.5} style={{ color: 'var(--text)' }} />
                </div>
                <span style={{
                  fontFamily: F.heading, fontSize: 17, fontWeight: 700,
                  color: 'var(--text)', letterSpacing: '-0.02em',
                }}>
                  {name}
                </span>
              </div>

              <p style={{
                fontFamily: F.body, fontSize: 12.5, fontWeight: 400,
                color: 'var(--text-muted)', lineHeight: 1.5,
                margin: '0 0 20px', letterSpacing: '0.01em',
              }}>
                {tagline}
              </p>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                {subjects.map(s => (
                  <SubjectItem key={s}>
                    <CheckCircle2 size={11} strokeWidth={1.5} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                    {s}
                  </SubjectItem>
                ))}
              </div>
            </StreamCard>
          ))}
        </StreamGrid>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontFamily: F.body, fontSize: 12.5, fontWeight: 300,
            color: 'var(--text-faint)', marginTop: 28,
            textAlign: 'center', letterSpacing: '0.01em',
          }}
        >
          All streams include English HL, isiZulu HL/FAL and Life Orientation as compulsory subjects. Subject combinations subject to availability.
        </motion.p>
      </SubjectsWrap>

    </Section>
  );
}
