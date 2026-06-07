'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { V, F, E } from '@/styles/theme';

const Section = styled.section`
  background: ${V.bg};
  border-top: 1px solid ${V.border};
  border-bottom: 1px solid ${V.border};
  padding: 80px clamp(24px, 8vw, 120px);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const StatItem = styled.div<{ $last?: boolean }>`
  padding: 0 48px;
  border-right: ${({ $last }) => ($last ? 'none' : `1px solid ${V.border}`)};

  @media (max-width: 640px) {
    padding: 32px 0;
    border-right: none;
    border-bottom: ${({ $last }) => ($last ? 'none' : `1px solid ${V.border}`)};
  }
`;

// Count-up hook
function useCountUp(target: number, duration = 1.8, start: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const totalFrames = Math.round(duration * 60);
    const tick = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (frame < totalFrames) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target, duration]);
  return val;
}

function Stat({ prefix, raw, num, suffix, label }: { prefix?: string; raw: number; num: string; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const counted = useCountUp(raw, 1.8, inView);

  return (
    <div ref={ref}>
      <div style={{ fontFamily: F.body, fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8 }}>
        More Than
      </div>
      <div style={{ fontFamily: F.heading, fontSize: 'clamp(52px, 6vw, 80px)', fontWeight: 800, color: 'var(--stat-num)', letterSpacing: '-0.04em', lineHeight: 1 }}>
        {prefix}{counted}{suffix}
      </div>
      <div style={{ fontFamily: F.body, fontSize: 14, color: 'var(--text-muted)', marginTop: 12 }}>
        {label}
      </div>
    </div>
  );
}

const STATS = [
  { prefix: '',  raw: 1200, num: '1,200', suffix: '+', label: 'Enrolled Learners'   },
  { prefix: '',  raw: 95,   num: '95',    suffix: '%', label: 'Matric Pass Rate'    },
  { prefix: '',  raw: 25,   num: '25',    suffix: '',  label: 'Years of Excellence' },
];

export default function StatsRow() {
  return (
    <Section>
      <Row>
        {STATS.map((s, i) => (
          <StatItem key={s.label} $last={i === STATS.length - 1}>
            <Stat {...s} />
          </StatItem>
        ))}
      </Row>
    </Section>
  );
}
