'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { V, F, R, E } from '@/styles/theme';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
};
const scaleIn = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: E.smooth } },
};

const Section = styled.section`
  background: ${V.bg};
  padding: 120px clamp(24px, 8vw, 120px);
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 64px;
  align-items: start;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Card = styled(motion.div)<{ $featured?: boolean }>`
  background: ${({ $featured }) => ($featured ? V.surface2 : V.surface)};
  border: 1px solid ${({ $featured }) => ($featured ? V.borderStrong : V.border)};
  border-radius: ${R.xl};
  padding: 40px 32px;
  position: relative;
  overflow: hidden;
  transform: ${({ $featured }) => ($featured ? 'translateY(-12px)' : 'none')};
  transition: border-color 0.3s ease;

  &:hover { border-color: ${V.borderStrong}; }
`;

const TopAccent = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: ${V.accent};
  opacity: 0.6;
`;

const FeatureItem = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
    <Check size={14} style={{ color: 'var(--text)', flexShrink: 0 }} strokeWidth={2.5} />
    <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)' }}>{text}</span>
  </div>
);

const PORTALS = [
  {
    for:      'For Students',
    title:    'Student Portal',
    subtitle: 'Track your progress',
    features: ['View marks & results', 'Attendance records', 'Assignments & tasks', 'School notices'],
    href:     '/student-portal',
    featured: false,
  },
  {
    for:      'For Teachers',
    title:    'Teacher Portal',
    subtitle: 'Manage your classes',
    features: ['Gradebook & capture', 'Student profiles', 'Reports & analytics', 'Class management'],
    href:     '/teacher-portal',
    featured: true,
  },
  {
    for:      'For Parents',
    title:    'Parent Portal',
    subtitle: "Monitor your child",
    features: ["Child's marks & results", 'Attendance tracking', 'School notices', 'Teacher communication'],
    href:     '/parent-portal',
    featured: false,
  },
];

export default function PortalSection() {
  return (
    <Section id="portals">
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(32px, 3.8vw, 52px)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Access Your Portal
        </h2>
        <p style={{ fontFamily: F.body, fontSize: 16, fontWeight: 300, color: 'var(--text-muted)', marginTop: 12 }}>
          Real-time academic tracking for everyone
        </p>
      </div>

      <Grid
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {PORTALS.map(({ for: label, title, subtitle, features, href, featured }) => (
          <Card key={title} $featured={featured} variants={scaleIn}>
            {featured && <TopAccent />}

            <div style={{ fontFamily: F.body, fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 16 }}>
              {label}
            </div>
            <h3 style={{ fontFamily: F.heading, fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {title}
            </h3>
            <p style={{ fontFamily: F.body, fontSize: 16, fontWeight: 600, color: 'var(--text-muted)', marginTop: 6 }}>
              {subtitle}
            </p>

            <div style={{ height: 1, background: 'var(--border)', margin: '28px 0' }} />

            <div style={{ marginBottom: 28 }}>
              {features.map(f => <FeatureItem key={f} text={f} />)}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Link
                href={href}
                style={{ display: 'block', width: '100%', padding: '14px', borderRadius: R.full, background: 'var(--btn-bg)', color: 'var(--btn-color)', fontFamily: F.heading, fontWeight: 700, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}
              >
                Login →
              </Link>
            </motion.div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
