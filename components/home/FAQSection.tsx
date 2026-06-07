'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Diamond } from 'lucide-react';
import { V, F, R, E } from '@/styles/theme';

const Section = styled.section`
  background: ${V.bg};
  padding: 120px clamp(24px, 8vw, 120px);
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 35% 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const FAQItem = styled.div`
  background: ${V.surface};
  border: 1px solid ${V.border};
  border-radius: ${R.lg};
  padding: 20px 24px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: border-color 0.25s ease;

  &:hover { border-color: ${V.borderStrong}; }
`;

const FAQHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FAQS = [
  {
    q: 'How does the online portal work?',
    a: 'Students, teachers and parents each have dedicated portals to track marks, attendance, assignments and school notices in real time.',
  },
  {
    q: 'What grades does Sidelile offer?',
    a: 'We offer Grades 8 through 12, covering the GET phase (8-9) and FET phase (10-12) with CAPS-aligned subject streams.',
  },
  {
    q: 'How do I apply for admission?',
    a: 'Applications are submitted online through our admissions portal. Our team reviews and assigns learners to the appropriate grade and class.',
  },
  {
    q: 'What subject streams are available?',
    a: 'Grade 10-12 learners choose from Sciences, Commerce, Humanities or Technical streams, each with 7 subjects including compulsory English, Zulu and Life Orientation.',
  },
  {
    q: 'Is Sidelile a partner school?',
    a: 'Yes. Sidelile is proud to be a Sappi partner school, bringing enhanced technology resources and opportunities to our learners.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="faq">
      <TwoCol>
        {/* Left */}
        <div>
          <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Got<br />Questions?
          </h2>
          <p style={{ fontFamily: F.body, fontSize: 16, fontWeight: 300, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
            We've got clear answers
          </p>
        </div>

        {/* Right — accordion */}
        <div>
          {FAQS.map((item, i) => (
            <FAQItem key={i} onClick={() => setOpen(open === i ? null : i)}>
              <FAQHeader>
                {open === i
                  ? <Diamond size={14} style={{ color: 'var(--text)', flexShrink: 0 }} fill="currentColor" />
                  : <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                }
                <span style={{ fontFamily: F.heading, fontSize: 16, fontWeight: 500, color: 'var(--text)', flex: 1 }}>
                  {item.q}
                </span>
              </FAQHeader>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: E.smooth }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.7, paddingTop: 14, paddingLeft: 26 }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </FAQItem>
          ))}
        </div>
      </TwoCol>
    </Section>
  );
}
