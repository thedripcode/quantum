'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Heart, UserCheck, Trophy, Building2 } from 'lucide-react';
import { C, F, R, E } from '@/styles/theme';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const cardIn = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: E.smooth } },
};

// Geometric SVG background
const GeoBg = () => (
  <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }}>
    <defs>
      <pattern id="benefits-geo" width="80" height="80" patternUnits="userSpaceOnUse">
        <circle cx="40" cy="40" r="36" fill="none" stroke="white" strokeWidth="0.6" />
        <rect x="20" y="20" width="40" height="40" fill="none" stroke="white" strokeWidth="0.3" transform="rotate(45 40 40)" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#benefits-geo)" />
  </svg>
);

const Section = styled.section`
  position: relative;
  background: ${C.navy};
  padding: clamp(80px, 10vw, 140px) clamp(24px, 8vw, 120px);
  overflow: hidden;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 64px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const Card = styled(motion.div)`
  padding: 32px;
  border-radius: ${R.lg};
  background: rgba(255,255,255,0.04);
  border: 1px solid ${C.border};
  backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), background 0.3s ease;
  cursor: default;

  &:hover {
    border-color: rgba(201,168,76,0.4);
    transform: translateY(-4px);
    background: rgba(255,255,255,0.06);
  }
`;

const GoldLabel = styled.div`
  font-family: ${F.body};
  font-size: 11px;
  font-weight: 600;
  color: ${C.gold};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const BENEFITS = [
  { icon: BookOpen,   title: 'Personalised Learning',       desc: 'Tailored education that meets every learner where they are.' },
  { icon: Lightbulb, title: 'CAPS-Aligned Curriculum',      desc: 'Nationally recognised curriculum preparing learners for matric and beyond.' },
  { icon: Heart,      title: 'Ubuntu Community Culture',    desc: 'A school rooted in compassion, respect, and shared purpose.' },
  { icon: UserCheck,  title: 'Qualified Educators',         desc: '85 passionate, experienced teachers dedicated to learner success.' },
  { icon: Trophy,     title: 'Diverse Extracurriculars',    desc: 'Sports, arts, culture and clubs that develop the whole person.' },
  { icon: Building2,  title: 'Modern Facilities',           desc: 'Science labs, computer centre, and learning spaces built for excellence.' },
];

export default function BenefitsSection() {
  return (
    <Section id="benefits">
      <GeoBg />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <GoldLabel>Unique Benefits</GoldLabel>
        <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 700, color: C.white, letterSpacing: '-0.03em', lineHeight: 1.05, maxWidth: 600 }}>
          Experience What Sets<br />Sidelile Apart.
        </h2>

        <Grid
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <Card key={title} variants={cardIn}>
              <Icon style={{ width: 28, height: 28, color: C.gold, strokeWidth: 1.5 }} />
              <h3 style={{ fontFamily: F.heading, fontSize: 18, fontWeight: 600, color: C.white, marginTop: 16, letterSpacing: '-0.02em' }}>
                {title}
              </h3>
              <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: C.mutedOnNavy, lineHeight: 1.65, marginTop: 8 }}>
                {desc}
              </p>
            </Card>
          ))}
        </Grid>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link
            href="#contact"
            style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.gold, textDecoration: 'none', letterSpacing: '0.02em', transition: 'opacity 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </Section>
  );
}
