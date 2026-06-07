'use client';

import styled, { keyframes } from 'styled-components';
import { C, F } from '@/styles/theme';

const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const Section = styled.section`
  background: ${C.white};
  border-top: 1px solid ${C.borderLight};
  border-bottom: 1px solid ${C.borderLight};
  padding: 48px clamp(24px, 8vw, 120px);
  overflow: hidden;
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  animation: ${scroll} 30s linear infinite;
  will-change: transform;
  margin-top: 40px;

  &:hover { animation-play-state: paused; }
`;

const Logo = styled.div`
  font-family: ${F.body};
  font-size: 15px;
  font-weight: 500;
  color: ${C.textPrimary};
  opacity: 0.38;
  padding: 0 48px;
  white-space: nowrap;
  transition: opacity 0.2s ease;
  cursor: default;

  &:hover { opacity: 1; }
`;

const PARTNERS = [
  'Sappi',
  'Department of Basic Education',
  'KZN Education',
  'UMALUSI',
  'Matric College',
];

const TRACK = [...PARTNERS, ...PARTNERS];

export default function PartnersSection() {
  return (
    <Section>
      <p style={{ fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center' }}>
        Our Trusted Partners
      </p>
      <Track>
        {TRACK.map((name, i) => (
          <Logo key={i}>{name}</Logo>
        ))}
      </Track>
    </Section>
  );
}
