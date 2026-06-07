/**
 * Hand-drawn / pencil-sketch SVG icons for Okudingayo dashboard.
 * Each icon uses rough paths, round caps/joins, and a feTurbulence
 * displacement filter to simulate an illustrated, pencil-drawn aesthetic.
 */

import React from 'react';

/* ── shared filter (inject once per page, reused by id) ── */
export function SketchFilterDef() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="sketch" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

interface IconProps { size?: number; color?: string; strokeWidth?: number }

const D: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24, color = 'currentColor', strokeWidth = 1.7, children,
}) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ filter: 'url(#sketch)', display: 'block' }}
  >
    {children}
  </svg>
);

/* ── HOME ── */
export const HomeIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M3.2 10.8 L12.1 3.3 L20.9 10.7" />
    <path d="M5 9.8 L5 20.4 L10.2 20.4 L10.2 14.8 L13.9 14.8 L13.9 20.4 L19.1 20.4 L19.1 9.9" />
    <path d="M5.1 20.5 L19 20.5" />
  </D>
);

/* ── WATER DROP (Jobs) ── */
export const DropIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M12 2.4 C12 2.4 5.2 10.1 5.2 14.6 C5.2 18.2 8.2 21.1 12 21.1 C15.8 21.1 18.8 18.2 18.8 14.6 C18.8 10.1 12 2.4 12 2.4 Z" />
    <path d="M8.5 15.8 C8.5 17.7 10.1 19.1 12 19.1" strokeWidth={1.3} />
  </D>
);

/* ── USERS (Customers) ── */
export const UsersIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <circle cx="9.2" cy="7.1" r="3.5" />
    <path d="M2.4 21.2 C2.4 17.4 5.5 14.3 9.3 14.3 C13.1 14.3 16.2 17.4 16.2 21.2" />
    <path d="M15.2 4.8 C16.9 4.8 18.3 6.2 18.3 7.9 C18.3 9.6 16.9 11 15.2 11" strokeDasharray="0.1 0" />
    <path d="M17.8 14.8 C19.9 15.3 21.5 17.2 21.5 19.5 L21.5 21.2" />
  </D>
);

/* ── BOX (Inventory) ── */
export const BoxIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M21.1 8.1 L12 3.1 L2.9 8.1 L2.9 16 L12 21 L21.1 16 Z" />
    <path d="M2.9 8.1 L12 13.1 L21.1 8.1" />
    <path d="M12 13.1 L12 21" />
    <path d="M7.5 5.6 L16.5 10.6" strokeWidth={1.2} strokeDasharray="0.5 0" />
  </D>
);

/* ── COIN / WALLET (Financials) ── */
export const CoinIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <ellipse cx="12" cy="8.5" rx="8" ry="4.5" />
    <path d="M4 8.5 L4 15.5 C4 17.9 7.6 19.9 12 19.9 C16.4 19.9 20 17.9 20 15.5 L20 8.5" />
    <path d="M4 12 C4 14.4 7.6 16.4 12 16.4 C16.4 16.4 20 14.4 20 12" />
  </D>
);

/* ── HARD HAT (Team) ── */
export const HatIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M3.5 18.5 L20.5 18.5" />
    <path d="M3.5 18.5 L3.5 16 C3.5 16 3.2 11 12 11 C20.8 11 20.5 16 20.5 16 L20.5 18.5" />
    <path d="M12 11 L12 4.5" />
    <path d="M7 11.3 C7 11.3 7.5 6.5 12 6.5 C16.5 6.5 17 11.3 17 11.3" />
    <path d="M9.5 4.5 L14.5 4.5" />
  </D>
);

/* ── BAR CHART (Analytics) ── */
export const ChartIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M3 21 L21 21" />
    <rect x="4.5" y="12.5" width="3.5" height="8" rx="0.5" />
    <rect x="10.3" y="6.5" width="3.5" height="14" rx="0.5" />
    <rect x="16" y="9" width="3.5" height="11.5" rx="0.5" />
    <path d="M6.2 12 L12 6.5 L14 8 L20 3" strokeWidth={1.3} strokeDasharray="0.1 0" />
    <circle cx="20.1" cy="3" r="0.9" fill="currentColor" />
  </D>
);

/* ── CLIPBOARD (Compliance) ── */
export const ClipboardIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <rect x="5" y="4.5" width="14" height="17.5" rx="1.5" />
    <path d="M9.3 4.5 L9.3 3.2 C9.3 2.6 9.8 2.1 10.5 2.1 L13.5 2.1 C14.2 2.1 14.7 2.6 14.7 3.2 L14.7 4.5" />
    <path d="M8.5 10.5 L10.5 12.5 L15.5 8.5" strokeWidth={1.5} />
    <path d="M8.5 15.5 L15.5 15.5" strokeWidth={1.2} />
    <path d="M8.5 18.5 L13 18.5" strokeWidth={1.2} />
  </D>
);

/* ── MEGAPHONE (Marketing) ── */
export const MegaphoneIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M19 5.5 L19 18.5 L7.5 14.5 L7.5 9.5 Z" />
    <path d="M7.5 9.5 L4 9.5 C3.2 9.5 2.5 10.2 2.5 11 L2.5 13 C2.5 13.8 3.2 14.5 4 14.5 L7.5 14.5" />
    <path d="M7.5 14.5 L7.5 19.8 L10.5 19.8" strokeDasharray="0.1 0" />
    <path d="M22 8 C22 8 22.5 10.5 22 12" />
    <path d="M20.5 6.5 C20.5 6.5 22.5 9 22 12.5 C21.7 14.2 20.5 15 20.5 15" />
  </D>
);

/* ── LIGHTNING (Emergency) ── */
export const LightningIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M13.5 2.5 L6 13.5 L11.5 13.5 L10 21.5 L18.5 10 L13 10 Z" />
  </D>
);

/* ── CHECK CIRCLE (Completed) ── */
export const CheckIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M7.5 12.2 L10.5 15.2 L16.5 9.2" />
  </D>
);

/* ── STAR (Rating) ── */
export const StarIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M12 2.5 L14.3 9 L21.2 9.1 L15.8 13.5 L17.7 20.2 L12 16.2 L6.3 20.2 L8.2 13.5 L2.8 9.1 L9.7 9 Z" />
  </D>
);

/* ── SIGNAL / WIFI (Live ops) ── */
export const SignalIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M2 9.5 C6.4 4.8 17.6 4.8 22 9.5" />
    <path d="M4.8 12.5 C7.8 9.2 16.2 9.2 19.2 12.5" />
    <path d="M7.8 15.5 C9.5 13.5 14.5 13.5 16.2 15.5" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
  </D>
);

/* ── REFRESH / RECURRING ── */
export const RefreshIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M20.5 7 C19 4.2 16 2.5 12.5 2.5 C7.3 2.5 3 6.8 3 12 C3 17.2 7.3 21.5 12.5 21.5 C17 21.5 20.7 18.4 21.7 14.2" />
    <path d="M20.5 2.5 L20.5 7 L16 7" />
  </D>
);

/* ── TRUCK (Dispatch) ── */
export const TruckIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <rect x="1.5" y="7.5" width="13" height="11" rx="1" />
    <path d="M14.5 10.5 L18.5 10.5 L22.5 14.5 L22.5 18.5 L14.5 18.5 Z" />
    <circle cx="5.5" cy="19.5" r="2" />
    <circle cx="18.5" cy="19.5" r="2" />
    <path d="M3.5 11.5 L10.5 11.5" strokeWidth={1.2} />
    <path d="M3.5 14.5 L10.5 14.5" strokeWidth={1.2} />
  </D>
);

/* ── ALERT TRIANGLE ── */
export const AlertIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M12 3.5 L22 20.5 L2 20.5 Z" />
    <path d="M12 10 L12 14.5" />
    <circle cx="12" cy="17.5" r="0.8" fill="currentColor" />
  </D>
);

/* ── WRENCH / PLUMBING ── */
export const WrenchIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M14.7 6.3 C14.7 6.3 16.5 3.5 19.5 4.5 C22.5 5.5 22 8.5 20 10 L16 10 L14 8 C14 8 12 10 11.5 11 L5 17.5 C4 18.5 4 20 5 21 C6 22 7.5 22 8.5 21 L15 14.5 C16 13.5 16.5 12.5 14.7 6.3 Z" />
  </D>
);

/* ── CLOCK ── */
export const ClockIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 6.5 L12 12.5 L16 15" />
  </D>
);

/* ── TARGET / BULLSEYE ── */
export const TargetIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </D>
);

/* ── SMILEY ── */
export const SmileIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M8.5 14.5 C9.5 16.5 14.5 16.5 15.5 14.5" />
    <circle cx="9.5" cy="10.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
  </D>
);

/* ── ENVELOPE ── */
export const MailIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <rect x="2.5" y="5" width="19" height="15" rx="1.5" />
    <path d="M2.5 5.5 L12 13.5 L21.5 5.5" />
  </D>
);

/* ── PHONE ── */
export const PhoneIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M6.5 3.5 L10 3.5 L12 8 L9.5 9.5 C10.8 12.2 13 14.4 15.5 15.5 L17 13 L21.5 15 L21.5 18.5 C21.5 20.2 20 21.5 18.3 21.4 C9.8 20.8 3.2 14.2 2.6 5.7 C2.5 4 3.8 3.5 5.5 3.5 Z" />
  </D>
);

/* ── DOCUMENT / FILE ── */
export const FileIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M14.5 2.5 L5 2.5 C4.2 2.5 3.5 3.2 3.5 4 L3.5 20 C3.5 20.8 4.2 21.5 5 21.5 L19 21.5 C19.8 21.5 20.5 20.8 20.5 20 L20.5 8 Z" />
    <path d="M14.5 2.5 L14.5 8 L20.5 8" />
    <path d="M7.5 13 L16.5 13" strokeWidth={1.2} />
    <path d="M7.5 16.5 L16.5 16.5" strokeWidth={1.2} />
    <path d="M7.5 9.5 L10.5 9.5" strokeWidth={1.2} />
  </D>
);

/* ── GLOBE ── */
export const GlobeIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 2.5 C12 2.5 8 7 8 12 C8 17 12 21.5 12 21.5" />
    <path d="M12 2.5 C12 2.5 16 7 16 12 C16 17 12 21.5 12 21.5" />
    <path d="M2.5 12 L21.5 12" />
    <path d="M3.5 7.5 L20.5 7.5" />
    <path d="M3.5 16.5 L20.5 16.5" />
  </D>
);

/* ── SHIELD (Security/POPIA) ── */
export const ShieldIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M12 2.5 L21 6 L21 13 C21 17.5 17 21.5 12 22.5 C7 21.5 3 17.5 3 13 L3 6 Z" />
    <path d="M8.5 12.5 L11 15 L15.5 9.5" />
  </D>
);

/* ── TOOL / SPANNER ── */
export const ToolIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M5.5 3 C3 4.5 2.5 8 4.5 10.5 L14.5 20.5 C15.5 21.5 17.5 21.5 18.5 20.5 C19.5 19.5 19.5 17.5 18.5 16.5 L8.5 6.5 C8.5 6.5 10 3.5 8.5 2 C7 0.5 5.5 3 5.5 3 Z" />
    <path d="M16 8 L20 4 L21.5 5.5 L17.5 9.5" />
  </D>
);

/* ── TRENDING UP ── */
export const TrendUpIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M3 17 L9 11 L13 15 L21 7" />
    <path d="M17 7 L21 7 L21 11" />
  </D>
);

/* ── PERSON / TECHNICIAN ── */
export const PersonIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <circle cx="12" cy="7" r="4.5" />
    <path d="M3 22 C3 17.6 7.1 14 12 14 C16.9 14 21 17.6 21 22" />
  </D>
);

/* ── REVIEW / SPEECH BUBBLE ── */
export const ReviewIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M4 4 L20 4 C20.8 4 21.5 4.7 21.5 5.5 L21.5 16 C21.5 16.8 20.8 17.5 20 17.5 L8 17.5 L3 22 L3 5.5 C3 4.7 3.7 4 4 4 Z" />
    <path d="M8 9.5 L16 9.5" strokeWidth={1.2} />
    <path d="M8 13 L13 13" strokeWidth={1.2} />
  </D>
);

/* ── MAP PIN / LOCATION ── */
export const PinIcon: React.FC<IconProps> = (p) => (
  <D {...p}>
    <path d="M12 2.5 C8.7 2.5 6 5.2 6 8.5 C6 13.5 12 21.5 12 21.5 C12 21.5 18 13.5 18 8.5 C18 5.2 15.3 2.5 12 2.5 Z" />
    <circle cx="12" cy="8.5" r="2.5" />
  </D>
);
