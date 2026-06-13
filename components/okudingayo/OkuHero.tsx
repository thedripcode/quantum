import Link from 'next/link';
import { OkuLogo3D } from './OkuNav';

export default function OkuHero() {
  return (
    <section style={{
      position: 'relative',
      background: '#1e4db3',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      padding: '120px 64px 80px',
    }}>
      {/* Noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: 0.6,
      }} />

      {/* Subtle radial glow top-left */}
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(100,160,255,0.18) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none',
      }} />
      {/* Subtle radial glow bottom-right */}
      <div style={{
        position: 'absolute', bottom: '-150px', right: '10%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(30,60,160,0.4) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: 80 }}>
        {/* Left — Text */}
        <div style={{ flex: '0 0 55%', maxWidth: '55%' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.20)',
            borderRadius: 100, padding: '6px 16px',
            marginBottom: 36,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f5e85e', display: 'inline-block', boxShadow: '0 0 8px #f5e85e' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              KwaZulu-Natal's #1 Plumbing Platform
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(42px, 5.5vw, 72px)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: '0 0 28px',
          }}>
            Your trusted<br />
            plumbing solutions<br />
            <span style={{ color: '#f5e85e' }}>in South Africa.</span>
          </h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.75, maxWidth: 480, margin: '0 0 44px',
          }}>
            One platform to manage every job, team member, invoice, and customer — built specifically for South African plumbing businesses with 30-minute emergency response.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/okudingayo/login" style={{
              background: '#f5e85e', color: '#1a1a1a',
              padding: '15px 32px', borderRadius: 100,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(245,232,94,0.40)',
              letterSpacing: '-0.01em',
            }}>
              Access Dashboard →
            </Link>
            <a href="#process" style={{
              color: 'rgba(255,255,255,0.80)',
              padding: '15px 28px', borderRadius: 100,
              fontWeight: 600, fontSize: 15, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.20)',
              background: 'rgba(255,255,255,0.07)',
            }}>
              See How It Works
            </a>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 40, marginTop: 60, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            {[
              { val: '30 min', label: 'Response time' },
              { val: '500+', label: 'Clients served' },
              { val: '10 yrs', label: 'Experience' },
              { val: '4.9★', label: 'Avg rating' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#f5e85e', letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D Logo + glass card */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* Big 3D logo */}
          <div style={{
            filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.45)) drop-shadow(0 8px 24px rgba(10,40,120,0.6))',
            animation: 'float 6s ease-in-out infinite',
          }}>
            <OkuLogo3D size={220} />
          </div>

          {/* Glass info card */}
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20,
            padding: '24px 32px',
            width: '100%', maxWidth: 340,
            boxShadow: '0 8px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              Live Operations
            </div>
            {[
              { icon: '🔧', label: 'Active Jobs', val: '24', color: '#60a5fa' },
              { icon: '⚡', label: 'Emergency Calls', val: '3', color: '#f87171' },
              { icon: '👷', label: 'Techs Dispatched', val: '8', color: '#34d399' },
              { icon: '💰', label: 'Revenue (Month)', val: 'R142K', color: '#f5e85e' },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{row.icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>{row.label}</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: row.color }}>{row.val}</span>
              </div>
            ))}
            <div style={{
              marginTop: 14, background: 'rgba(52,211,153,0.15)',
              borderRadius: 8, padding: '8px 14px',
              fontSize: 12, color: '#34d399', fontWeight: 600, textAlign: 'center',
            }}>✓ All systems operational</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </section>
  );
}
