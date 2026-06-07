'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { C, F, R, E } from '@/styles/theme';

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: E.smooth } },
};

const Section = styled.section`
  background: ${C.white};
  id: about;
`;

const Block = styled.div<{ $last?: boolean }>`
  display: flex;
  align-items: center;
  gap: clamp(48px, 6vw, 80px);
  min-height: 85vh;
  padding: clamp(80px, 10vw, 140px) clamp(24px, 8vw, 120px);
  border-bottom: ${({ $last }) => ($last ? 'none' : `1px solid ${C.borderLight}`)};

  @media (max-width: 768px) {
    flex-direction: column !important;
    min-height: auto;
    padding: 72px 24px;
  }
`;

const TextSide = styled(motion.div)`
  flex: 0 0 50%;
  max-width: 50%;

  @media (max-width: 768px) { flex: none; max-width: 100%; }
`;

const ImgSide = styled(motion.div)`
  flex: 1;
  overflow: hidden;
  border-radius: ${R.lg};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(20%);
    transition: filter 0.5s ease, transform 0.5s ease;
    aspect-ratio: 4 / 3;
  }

  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.03);
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

const GoldLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${F.body};
  font-size: 14px;
  font-weight: 600;
  color: ${C.gold};
  text-decoration: none;
  margin-top: 32px;
  transition: gap 0.25s ease;

  &:hover { gap: 16px; }
`;

const BLOCKS = [
  {
    imageRight: true,
    label:   'About Sidelile',
    heading: 'Uncover the History and Vision That Drives Us Forward.',
    body:    'Sidelile High School has been a beacon of educational excellence in KwaZulu-Natal since 2001. Our commitment to developing the whole learner — academically, socially, and spiritually — has shaped over 25 years of outstanding graduates.',
    link:    { label: 'About School', href: '#' },
    image:   '/images/school-classroom.jpg',
    alt:     'Sidelile classroom',
  },
  {
    imageRight: false,
    label:   'Academic Programmes',
    heading: 'Fostering Excellence Through Innovative Learning.',
    body:    'Our CAPS-aligned curriculum spans the GET and FET phases, offering a rich and balanced education. From Mathematics and Physical Sciences to Arts and Languages, we pair rigorous academics with innovative teaching methods that ignite curiosity.',
    link:    { label: 'Explore Academics', href: '#' },
    image:   '/images/school-kids-classroom.jpg',
    alt:     'Students studying',
  },
  {
    imageRight: true,
    label:   'Admissions',
    heading: 'Join Our Vibrant School Community.',
    body:    'Applications for the 2026 academic year are now open. We welcome learners who are ready to commit to excellence, embrace their community, and grow as individuals. Our admissions process is straightforward.',
    link:    { label: 'Apply Today', href: '/apply' },
    image:   '/images/school-teens.jpg',
    alt:     'Students at Sidelile',
  },
];

export default function AboutSection() {
  return (
    <Section id="about">
      {BLOCKS.map((block, idx) => (
        <Block
          key={block.label}
          $last={idx === BLOCKS.length - 1}
          style={{ flexDirection: block.imageRight ? 'row' : 'row-reverse' }}
        >
          <TextSide
            initial={{ opacity: 0, x: block.imageRight ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: E.smooth }}
          >
            <GoldLabel>{block.label}</GoldLabel>
            <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(32px, 3.5vw, 56px)', fontWeight: 700, color: C.textPrimary, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              {block.heading}
            </h2>
            <p style={{ fontFamily: F.body, fontSize: 16, fontWeight: 300, color: C.textSecondary, lineHeight: 1.7, marginTop: 24 }}>
              {block.body}
            </p>
            <GoldLink href={block.link.href}>
              {block.link.label} →
            </GoldLink>
          </TextSide>

          <ImgSide
            initial={{ opacity: 0, x: block.imageRight ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: E.smooth }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.image} alt={block.alt} />
          </ImgSide>
        </Block>
      ))}
    </Section>
  );
}
