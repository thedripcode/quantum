'use client';
import Link from 'next/link';

export default function OkuNav() {
  return (
    <nav style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '28px 40px',
    }}>
      {/* Frosted glass pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 100,
        padding: '10px 10px 10px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        width: '100%', maxWidth: 860,
      }}>
        {/* Logo */}
        <Link href="/okudingayo" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 'auto' }}>
          <OkuLogo3D size={32} />
          <span style={{ fontWeight: 700, fontSize: 14, color: 'white', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            Okudingayo
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {['Services', 'About', 'FAQ', 'Blog'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              fontSize: 13, color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
              fontWeight: 500, padding: '8px 14px', borderRadius: 100,
              transition: 'background 0.15s',
            }}>{item}</a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginRight: 4 }}>📞 000-000-0000</span>
          <Link href="/okudingayo/login" style={{
            background: '#f5e85e', color: '#1a1a1a',
            padding: '9px 20px', borderRadius: 100,
            fontWeight: 700, fontSize: 13, textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(245,232,94,0.35)',
            whiteSpace: 'nowrap',
          }}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}

export function OkuLogo3D({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="globe-main" cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6fa8f5" />
          <stop offset="40%" stopColor="#2a6bc6" />
          <stop offset="100%" stopColor="#0f2d6b" />
        </radialGradient>
        <radialGradient id="globe-shine" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="globe-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0a1f5c" floodOpacity="0.5" />
        </filter>
        <clipPath id="circle-clip">
          <circle cx="24" cy="24" r="21" />
        </clipPath>
      </defs>
      {/* Drop shadow */}
      <ellipse cx="24" cy="46" rx="14" ry="3" fill="rgba(0,0,0,0.25)" />
      {/* Main sphere */}
      <circle cx="24" cy="24" r="21" fill="url(#globe-main)" filter="url(#globe-shadow)" />
      {/* Globe lines clipped */}
      <g clipPath="url(#circle-clip)" opacity="0.35">
        <ellipse cx="24" cy="24" rx="10" ry="21" stroke="white" strokeWidth="0.8" fill="none" />
        <ellipse cx="24" cy="24" rx="21" ry="21" stroke="white" strokeWidth="0.8" fill="none" />
        <line x1="3" y1="24" x2="45" y2="24" stroke="white" strokeWidth="0.8" />
        <line x1="3" y1="15" x2="45" y2="15" stroke="white" strokeWidth="0.8" />
        <line x1="3" y1="33" x2="45" y2="33" stroke="white" strokeWidth="0.8" />
      </g>
      {/* Crescent highlight */}
      <path d="M13 13 Q18 8 24 9 Q16 14 14 24 Q11 18 13 13Z" fill="rgba(255,255,255,0.22)" clipPath="url(#circle-clip)" />
      {/* Glassy shine */}
      <circle cx="24" cy="24" r="21" fill="url(#globe-shine)" clipPath="url(#circle-clip)" />
      {/* Rim light */}
      <circle cx="24" cy="24" r="20.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
    </svg>
  );
}
