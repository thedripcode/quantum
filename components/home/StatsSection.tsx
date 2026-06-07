'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { C, F, R, E } from '@/styles/theme';

const clipReveal = {
  hidden:  { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.9, ease: E.snappy } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: E.smooth } },
};

const Section = styled.section`
  background: ${C.navy};
`;

const Block = styled.div<{ $last?: boolean }>`
  display: flex;
  align-items: center;
  min-height: 100vh;
  gap: clamp(48px, 6vw, 80px);
  padding: 0 clamp(24px, 8vw, 120px);
  border-bottom: ${({ $last }) => ($last ? 'none' : '1px solid rgba(255,255,255,0.06)')};

  @media (max-width: 1024px) {
    flex-direction: column;
    min-height: auto;
    padding: 80px 24px;
    gap: 40px;
  }
`;

const StickyLeft = styled.div`
  width: 40%;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1024px) {
    position: relative;
    width: 100%;
    height: auto;
  }
`;

const RightContent = styled.div`
  flex: 1;
  padding: 120px 0;

  @media (max-width: 1024px) { padding: 0; }
`;

const LineMask = styled.div`
  overflow: hidden;
`;

const BulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
`;

const ImageWrap = styled.div`
  border-radius: ${R.lg};
  overflow: hidden;
  margin-top: 40px;

  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
    filter: grayscale(15%);
    transition: filter 0.5s ease;
  }

  &:hover img { filter: grayscale(0%); }
`;

const BLOCKS = [
  {
    num: '95%', label: 'Matric Pass Rate', sublabel: 'University Readiness',
    heading: 'Preparing Learners for Life After School',
    body:    'Year after year, our matric results place Sidelile among the top schools in KwaZulu-Natal. We measure success by the learners who go on to university, careers, and purposeful lives.',
    bullets: ['98 university endorsements in 2024', 'Partnerships with UNIZULU, UKZN & Mangosuthu'],
    image:   '/images/school-kids-classroom.jpg',
  },
  {
    num: '1,200+', label: 'Enrolled Learners', sublabel: 'Growing Community',
    heading: 'A Thriving and Growing School Family',
    body:    'Our school family spans Grades 8 to 12, representing diverse communities across KwaZulu-Natal. Every learner is welcomed into a community that celebrates individual achievement and collective success.',
    bullets: ['Diverse learners from across KZN', 'Strong parent and community involvement'],
    image:   '/images/school-children-outside.jpg',
  },
  {
    num: '25', label: 'Years of Excellence', sublabel: 'Established 2001',
    heading: 'Two Decades of Academic Excellence',
    body:    'Since 2001, Sidelile has built a legacy of excellence. What began as a small community school has grown into a beacon of quality education, shaping thousands of young South Africans.',
    bullets: ['From 120 learners in 2001 to 1,200+ today', 'Multiple provincial academic awards'],
    image:   '/images/school-award-council.jpg',
  },
];

export default function StatsSection() {
  return (
    <Section id="stats">
      {BLOCKS.map((block, idx) => (
        <Block key={block.num} $last={idx === BLOCKS.length - 1}>

          {/* Left — sticky stat number */}
          <StickyLeft>
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: E.smooth }}
            >
              <div style={{ fontFamily: F.heading, fontSize: 'clamp(72px, 10vw, 140px)', fontWeight: 800, color: C.gold, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {block.num}
              </div>
              <div style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: C.white, marginTop: 8 }}>
                {block.label}
              </div>
              <div style={{ fontFamily: F.body, fontSize: 13, color: C.mutedOnNavy, marginTop: 4, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                {block.sublabel}
              </div>
            </motion.div>
          </StickyLeft>

          {/* Right — scrolling content */}
          <RightContent>
            <div style={{ maxWidth: 480 }}>
              <LineMask>
                <motion.h2
                  style={{ fontFamily: F.heading, fontSize: 'clamp(26px, 3vw, 48px)', fontWeight: 700, color: C.white, letterSpacing: '-0.03em', lineHeight: 1.1 }}
                  variants={clipReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                >
                  {block.heading}
                </motion.h2>
              </LineMask>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.2 }}
              >
                <p style={{ fontFamily: F.body, fontSize: 16, fontWeight: 300, color: C.mutedOnNavy, lineHeight: 1.7, marginTop: 16 }}>
                  {block.body}
                </p>

                <BulletList>
                  {block.bullets.map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ color: C.gold, fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>·</span>
                      <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: C.mutedOnNavy, lineHeight: 1.6 }}>{b}</span>
                    </div>
                  ))}
                </BulletList>

                <ImageWrap>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={block.image} alt={block.heading} />
                </ImageWrap>
              </motion.div>
            </div>
          </RightContent>

        </Block>
      ))}
    </Section>
  );
}
