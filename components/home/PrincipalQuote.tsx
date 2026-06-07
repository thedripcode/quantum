'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { C, F, R, E } from '@/styles/theme';

const Section = styled.section`
  background: ${C.white};
  padding: clamp(80px, 10vw, 140px) clamp(24px, 8vw, 120px);
  text-align: center;
`;

const Inner = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export default function PrincipalQuote() {
  return (
    <Section>
      <Inner>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: E.smooth }}
        >
          {/* Decorative quote mark */}
          <div style={{ fontFamily: F.heading, fontSize: 120, color: C.gold, opacity: 0.28, lineHeight: 0.8, marginBottom: 20, userSelect: 'none' }} aria-hidden>
            &ldquo;
          </div>

          {/* Quote */}
          <blockquote style={{ fontFamily: F.heading, fontSize: 'clamp(22px, 2.8vw, 40px)', fontWeight: 500, color: C.textPrimary, letterSpacing: '-0.02em', lineHeight: 1.4, fontStyle: 'italic', margin: 0 }}>
            Every day, I am inspired by the dedication of our learners and staff.
            Sidelile is more than a school —{' '}
            <span style={{ color: C.gold }}>it is a community that shapes futures.</span>
          </blockquote>

          {/* Gold rule */}
          <div style={{ width: 40, height: 2, background: C.gold, margin: '32px auto' }} />

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <div style={{ width: 60, height: 60, borderRadius: R.full, border: `2px solid ${C.gold}`, background: `rgba(201,168,76,0.10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: F.heading, fontSize: 18, fontWeight: 700, color: C.gold }}>SN</span>
            </div>
            <div style={{ fontFamily: F.heading, fontSize: 16, fontWeight: 600, color: C.textPrimary }}>
              Dr. Sipho Ndlovu
            </div>
            <div style={{ fontFamily: F.body, fontSize: 13, color: C.textMuted, marginTop: 4 }}>
              Principal, Sidelile High School
            </div>
          </div>
        </motion.div>
      </Inner>
    </Section>
  );
}
