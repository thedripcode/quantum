'use client';

import styled, { keyframes } from 'styled-components';
import { V, F } from '@/styles/theme';

const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const Ticker = styled.div`
  background: ${V.bg};
  border-top: 1px solid ${V.border};
  border-bottom: 1px solid ${V.border};
  padding: 18px 0;
  overflow: hidden;
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  animation: ${scroll} 28s linear infinite;
  will-change: transform;

  &:hover { animation-play-state: paused; }
`;

const Item = styled.span`
  font-family: ${F.body};
  font-size: 13px;
  font-weight: 500;
  color: ${V.textMuted};
  padding: 0 28px;
  white-space: nowrap;
  letter-spacing: 0.02em;
`;

const Sep = styled.span`
  color: ${V.textFaint};
  flex-shrink: 0;
`;

const ITEMS = [
  '95% Matric Pass Rate', '1,200+ Learners', '85 Educators',
  '25 Years of Excellence', 'Sappi Partner School', 'CAPS Aligned',
  'KwaZulu-Natal', 'Est. 2001',
];

const TRACK = [...ITEMS, ...ITEMS];

export default function StatsTicker() {
  return (
    <Ticker>
      <Track>
        {TRACK.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Item>{item}</Item>
            <Sep>·</Sep>
          </span>
        ))}
      </Track>
    </Ticker>
  );
}
