'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { C, F, R, E } from '@/styles/theme';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const tileIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: E.smooth } },
};

const Section = styled.section`
  background: ${C.navy};
  padding: clamp(80px, 10vw, 140px) clamp(24px, 8vw, 120px);
`;

const GoldLabel = styled.div`
  font-family: ${F.body};
  font-size: 11px;
  font-weight: 600;
  color: ${C.gold};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 280px;
  gap: 16px;
  margin-top: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 240px;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    grid-auto-rows: 260px;
  }
`;

const Tile = styled(motion.div)<{ $tall?: boolean }>`
  position: relative;
  border-radius: ${R.md};
  overflow: hidden;
  grid-row: ${({ $tall }) => ($tall ? 'span 2' : 'span 1')};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(30%);
    transition: filter 0.5s ease, transform 0.5s ease;
  }

  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.04);
  }
`;

const GoldOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(201,168,76,0.15);
  opacity: 0;
  transition: opacity 0.3s ease;

  ${Tile}:hover & { opacity: 1; }
`;

const Caption = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-family: ${F.body};
  font-size: 13px;
  font-weight: 500;
  color: ${C.white};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${Tile}:hover & { opacity: 1; }
`;

const IMAGES = [
  { src: '/images/school-classroom.jpg',        caption: 'Modern Classrooms',   tall: true  },
  { src: '/images/school-kids-classroom.jpg',   caption: 'Academic Life',        tall: false },
  { src: '/images/school-award-council.jpg',    caption: 'School Spirit',        tall: false },
  { src: '/images/school-children-outside.jpg', caption: 'Sports & Athletics',   tall: true  },
  { src: '/images/school-teens.jpg',            caption: 'Vibrant Community',    tall: false },
  { src: '/images/school-kid-award.jpg',        caption: 'Learner Excellence',   tall: false },
];

export default function GallerySection() {
  return (
    <Section>
      <GoldLabel>School Life</GoldLabel>
      <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(32px, 3.5vw, 56px)', fontWeight: 700, color: C.white, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        A Visual Story of Our<br />Vibrant Community.
      </h2>

      <Grid
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {IMAGES.map(({ src, caption, tall }, i) => (
          <Tile key={i} $tall={tall} variants={tileIn}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={caption} />
            <GoldOverlay />
            <Caption>{caption}</Caption>
          </Tile>
        ))}
      </Grid>
    </Section>
  );
}
