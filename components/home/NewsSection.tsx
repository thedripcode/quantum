'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Tag } from 'lucide-react';
import { V, F, R, E } from '@/styles/theme';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};
const cardIn = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: E.smooth } },
};

const Section = styled.section`
  background: ${V.surface};
  padding: 120px clamp(24px, 8vw, 120px);
  border-top: 1px solid ${V.border};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 56px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const Card = styled(motion.article)`
  background: ${V.bg};
  border-radius: ${R.xl};
  overflow: hidden;
  border: 1px solid ${V.border};
  transition: border-color 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover { border-color: ${V.borderStrong}; }
`;

const CardImg = styled.div`
  height: 210px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(80%);
    transition: filter 0.55s ease, transform 0.55s ease;
  }

  ${Card}:hover & img {
    filter: grayscale(0%);
    transform: scale(1.04);
  }
`;

const CardBody = styled.div`
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
`;

const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${F.body};
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${V.text};
  background: ${V.accentSubtle};
  border: 1px solid ${V.border};
  padding: 3px 10px 3px 8px;
  border-radius: ${R.full};
`;

const DateStr = styled.span`
  font-family: ${F.body};
  font-size: 12px;
  font-weight: 400;
  color: ${V.textFaint};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReadMore = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: ${F.body};
  font-size: 13px;
  font-weight: 500;
  color: ${V.textMuted};
  text-decoration: none;
  margin-top: auto;
  padding-top: 16px;
  transition: color 0.2s ease;

  &:hover { color: ${V.text}; }
`;

const AllNewsLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.body};
  font-size: 13.5px;
  font-weight: 500;
  color: ${V.textMuted};
  text-decoration: none;
  padding: 9px 18px;
  border: 1px solid ${V.border};
  border-radius: ${R.full};
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover { color: ${V.text}; border-color: ${V.borderStrong}; }
`;

const NEWS = [
  {
    image:   '/images/school-award-council.jpg',
    tag:     'Achievement',
    date:    'June 2025',
    title:   'Term 2 Results Show Record Matric Pass Rates',
    excerpt: 'Our matric class set a new school record — 97% achieving university entrance in the mid-year trial examinations. A proud moment for every learner, teacher and parent.',
  },
  {
    image:   '/images/school-children-outside.jpg',
    tag:     'Event',
    date:    'July 2025',
    title:   'Sidelile Wins Regional Science Olympiad',
    excerpt: 'Three learners claimed gold at the KwaZulu-Natal Science Olympiad, outpacing 64 schools in the regional finals. Sidelile continues to lead in STEM excellence.',
  },
  {
    image:   '/images/school-classroom.jpg',
    tag:     'News',
    date:    'May 2025',
    title:   'Sappi Partnership Brings New Technology Lab',
    excerpt: 'A new 40-seat computer centre, funded through our Sappi partnership, officially opened this term — giving every learner access to world-class digital learning tools.',
  },
];

export default function NewsSection() {
  return (
    <Section id="news">
      <Header>
        <div>
          <div style={{ fontFamily: F.body, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
            News &amp; Events
          </div>
          <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(32px, 3.8vw, 52px)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
            Latest from<br />Sidelile.
          </h2>
        </div>
        <AllNewsLink href="#">
          All News
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </AllNewsLink>
      </Header>

      <Grid
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {NEWS.map(({ image, tag, date, title, excerpt }) => (
          <Card key={title} variants={cardIn}>
            <CardImg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={title} />
            </CardImg>
            <CardBody>
              <MetaRow>
                <TagChip>
                  <Tag size={9} strokeWidth={2} />
                  {tag}
                </TagChip>
                <DateStr>
                  <Calendar size={11} strokeWidth={1.5} />
                  {date}
                </DateStr>
              </MetaRow>

              <h3 style={{ fontFamily: F.heading, fontSize: 19, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 10, margin: '0 0 10px' }}>
                {title}
              </h3>
              <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                {excerpt}
              </p>

              <ReadMore href="#">
                Read More
                <ArrowUpRight size={13} strokeWidth={1.5} />
              </ReadMore>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
