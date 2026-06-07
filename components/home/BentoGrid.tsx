'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Target, Heart, Star, Award } from 'lucide-react';
import { V, F, R, E } from '@/styles/theme';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const up = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: E.smooth } },
};

const Section = styled.section`
  background: ${V.bg};
  padding: 120px clamp(24px, 8vw, 120px);
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  gap: 16px;
  margin-top: 64px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const Card = styled(motion.div)`
  background: ${V.surface};
  border: 1px solid ${V.border};
  border-radius: ${R.xl};
  overflow: hidden;
  transition: border-color 0.3s ease;

  &:hover { border-color: ${V.borderStrong}; }
`;

const CardPad = styled.div`
  padding: 32px;
`;

// Tall card spans 2 rows
const TallCard = styled(Card)`
  grid-row: span 2;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) { grid-row: span 1; }
`;

const TallImg = styled.div`
  flex: 0 0 60%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: grayscale(80%);
    transition: filter 0.6s ease;
  }

  &:hover img { filter: grayscale(0%); }
`;

const TallBody = styled.div`
  flex: 1;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export default function BentoGrid() {
  return (
    <Section id="about">
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(32px, 3.8vw, 52px)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          The Sidelile Experience
        </h2>
        <p style={{ fontFamily: F.body, fontSize: 16, fontWeight: 300, color: 'var(--text-muted)', marginTop: 12 }}>
          Built for real learners, real results
        </p>
      </div>

      <Grid
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Card 1 */}
        <Card variants={up}>
          <CardPad>
            <Target style={{ width: 32, height: 32, color: 'var(--text)', strokeWidth: 1.5 }} />
            <h3 style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 20, letterSpacing: '-0.02em' }}>
              Outcome-Focused Learning
            </h3>
            <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 10 }}>
              Every lesson, every class, every term is designed with one goal — preparing learners for life beyond school.
            </p>
          </CardPad>
        </Card>

        {/* Card 2 */}
        <Card variants={up}>
          <CardPad>
            <Heart style={{ width: 32, height: 32, color: 'var(--text)', strokeWidth: 1.5 }} />
            <h3 style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 20, letterSpacing: '-0.02em' }}>
              More Support, Less Stress
            </h3>
            <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 10 }}>
              Dedicated support structures ensure no learner is left behind or overwhelmed.
            </p>
          </CardPad>
        </Card>

        {/* Card 3 — tall, spans 2 rows */}
        <TallCard variants={up}>
          <TallImg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/school-teens.jpg"
              alt="Sidelile High School learners"
            />
          </TallImg>
          <TallBody>
            <blockquote style={{ fontFamily: F.heading, fontSize: 18, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.35, margin: 0 }}>
              "Our learners don't just pass — they're prepared for life."
            </blockquote>
            <p style={{ fontFamily: F.body, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginTop: 12 }}>
              — Sidelile High School
            </p>
          </TallBody>
        </TallCard>

        {/* Card 4 */}
        <Card variants={up}>
          <CardPad>
            <Star style={{ width: 32, height: 32, color: 'var(--text)', strokeWidth: 1.5 }} />
            <h3 style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 20, letterSpacing: '-0.02em' }}>
              Ubuntu School Culture
            </h3>
            <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 10 }}>
              A community built on shared respect — every learner belongs and every voice matters.
            </p>
          </CardPad>
        </Card>

        {/* Card 5 */}
        <Card variants={up}>
          <CardPad>
            <Award style={{ width: 32, height: 32, color: 'var(--text)', strokeWidth: 1.5 }} />
            <h3 style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 20, letterSpacing: '-0.02em' }}>
              Sappi Partner School
            </h3>
            <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 10 }}>
              Enhanced technology and resources brought directly to our learners through our Sappi partnership.
            </p>
          </CardPad>
        </Card>
      </Grid>
    </Section>
  );
}
