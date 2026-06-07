'use client';

import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { V, F, R, E } from '@/styles/theme';

// ─── Keyframe ─────────────────────────────────────────────────────────────────
const scrollLeft = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

// ─── Styled ───────────────────────────────────────────────────────────────────
const Section = styled.section`
  background: ${V.bg};
  padding: 120px 0;
  overflow: hidden;
`;

const HeadingArea = styled.div`
  text-align: center;
  margin-bottom: 64px;
  padding: 0 clamp(24px, 8vw, 120px);
`;

/* Fade edges with mask */
const CarouselWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
`;

/* Infinite scrolling track — duplicated cards create seamless loop */
const ScrollTrack = styled.div`
  display: flex;
  gap: 20px;
  width: max-content;
  animation: ${scrollLeft} 34s linear infinite;

  &:hover { animation-play-state: paused; }
`;

const TeacherCard = styled.div`
  width: 240px;
  flex-shrink: 0;
  background: ${V.surface};
  border-radius: ${R.lg};
  overflow: hidden;
  border: 1px solid ${V.border};
  transition: border-color 0.3s ease;
  cursor: default;

  &:hover { border-color: ${V.borderStrong}; }
`;

const TeacherImg = styled.div`
  height: 300px;
  overflow: hidden;
  background: #111111;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: grayscale(100%);
    transition: filter 0.5s ease, transform 0.5s ease;
  }

  ${TeacherCard}:hover & img {
    filter: grayscale(0%);
    transform: scale(1.03);
  }
`;

// ─── Teacher data — placeholder image for all ─────────────────────────────────
const PLACEHOLDER = '/images/teacher-placeholder.svg';

const TEACHERS = [
  { name: 'Mr. Nkosi',    subject: 'Mathematics'       },
  { name: 'Ms. Dube',     subject: 'Physical Sciences' },
  { name: 'Mrs. Botha',   subject: 'English HL'        },
  { name: 'Mr. Zulu',     subject: 'Life Sciences'     },
  { name: 'Ms. Moloto',   subject: 'History'           },
  { name: 'Mr. Sithole',  subject: 'Accounting'        },
  { name: 'Ms. Khumalo',  subject: 'Geography'         },
  { name: 'Mr. Mahlangu', subject: 'Business Studies'  },
];

// Duplicate for seamless infinite loop
const TRACK = [...TEACHERS, ...TEACHERS];

// ─── Section reveal ───────────────────────────────────────────────────────────
const headingVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: E.smooth } },
};

export default function TeachersSection() {
  return (
    <Section id="teachers">
      {/* ── Heading ── */}
      <HeadingArea>
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <h2 style={{
            fontFamily: F.heading,
            fontSize: 'clamp(32px, 3.8vw, 52px)',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            Meet Our Educators
          </h2>
          <p style={{
            fontFamily: F.body,
            fontSize: 16,
            fontWeight: 300,
            color: 'var(--text-muted)',
            marginTop: 12,
          }}>
            Teachers who listen, adapt, and guide
          </p>
        </motion.div>
      </HeadingArea>

      {/* ── Infinite carousel ── */}
      <CarouselWrapper>
        <ScrollTrack>
          {TRACK.map((t, i) => (
            <TeacherCard key={`${t.name}-${i}`}>
              <TeacherImg>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PLACEHOLDER} alt={t.name} />
              </TeacherImg>
              <div style={{ padding: '18px 20px 20px' }}>
                <div style={{
                  fontFamily: F.heading,
                  fontSize: 17,
                  fontWeight: 600,
                  color: 'var(--text)',
                  letterSpacing: '-0.01em',
                }}>
                  {t.name}
                </div>
                <div style={{
                  fontFamily: F.body,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  marginTop: 4,
                }}>
                  {t.subject}
                </div>
              </div>
            </TeacherCard>
          ))}
        </ScrollTrack>
      </CarouselWrapper>
    </Section>
  );
}
