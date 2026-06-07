'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { V, F, R, E } from '@/styles/theme';

const Section = styled.section`
  background: ${V.bg};
  padding: 120px clamp(24px, 8vw, 120px);
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 45% 1fr;
  gap: 64px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AccordionItem = styled.div`
  background: ${V.accentSubtle};
  border: 1px solid ${V.border};
  border-radius: ${R.lg};
  padding: 20px 24px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease;

  &:hover {
    border-color: ${V.borderStrong};
    background: var(--surface);
  }
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ImgCard = styled.div`
  background: ${V.surface};
  border-radius: ${R.xl};
  overflow: hidden;
  height: 500px;
  border: 1px solid ${V.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(100%);
    transition: filter 0.6s ease;
  }

  &:hover img { filter: grayscale(0%); }
`;

const ITEMS = [
  { title: 'Academic Excellence',  body: '95% matric pass rate consistently above the national average since 2001.' },
  { title: 'Dedicated Educators',  body: '85 qualified teachers passionate about developing every learner\'s potential.' },
  { title: 'Ubuntu Community',     body: 'A school culture rooted in compassion, respect and shared purpose.' },
  { title: 'Modern Facilities',    body: 'Science labs, computer centre and learning spaces built for excellence.' },
  { title: 'Portal Technology',    body: 'Student, teacher and parent portals for real-time academic tracking.' },
];

export default function AccordionFeatures() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="experience">
      <TwoCol>
        {/* Left */}
        <div>
          <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(32px, 3.8vw, 52px)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 48 }}>
            What Makes<br />Sidelile Different.
          </h2>

          {ITEMS.map((item, i) => (
            <AccordionItem key={i} onClick={() => setOpen(open === i ? null : i)}>
              <AccordionHeader>
                <span style={{ fontFamily: F.heading, fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>
                  {item.title}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: E.smooth }}
                  style={{ flexShrink: 0, marginLeft: 16 }}
                >
                  <Plus size={20} style={{ color: 'var(--text-muted)' }} />
                </motion.div>
              </AccordionHeader>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: E.smooth }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.7, paddingTop: 14 }}>
                      {item.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </AccordionItem>
          ))}
        </div>

        {/* Right — image */}
        <ImgCard>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/school-classroom.jpg"
            alt="Sidelile classroom"
          />
        </ImgCard>
      </TwoCol>
    </Section>
  );
}
