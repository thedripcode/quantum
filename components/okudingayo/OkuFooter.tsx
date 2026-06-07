import Link from 'next/link';
import { OkuLogo3D } from './OkuNav';

export default function OkuFooter() {
  return (
    <footer>
      {/* CTA bar */}
      <div style={{
        background: '#1e4db3',
        padding: '36px 64px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px', mixBlendMode: 'overlay', opacity: 0.5,
        }} />
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.02em', position: 'relative' }}>
          Need a plumber fast?
        </h2>
        <a href="tel:0000000" style={{
          background: '#f5e85e', color: '#1a1a1a',
          padding: '14px 32px', borderRadius: 100,
          fontWeight: 700, fontSize: 15, textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(245,232,94,0.4)',
          position: 'relative',
        }}>📞 Call Us — 000-000-0000</a>
      </div>

      {/* Main footer */}
      <div style={{ background: 'white', padding: '64px 64px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 48, flexWrap: 'wrap' }}>

          {/* Brand col */}
          <div style={{ flex: '0 0 260px', minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <OkuLogo3D size={44} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', letterSpacing: '-0.01em' }}>Okudingayo</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Trading Enterprise</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, marginBottom: 24, maxWidth: 220 }}>
              Top-notch residential and commercial plumbing management for KwaZulu-Natal businesses.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {['f', '𝕏', '▶', 'in'].map(s => (
                <a key={s} href="#" style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: '#475569', textDecoration: 'none', fontWeight: 700,
                }}>{s}</a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div style={{ flex: 1, minWidth: 140 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Platform</h4>
            {['Job Management', 'Customer CRM', 'Inventory', 'Financials', 'Team & HR', 'Analytics'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <Link href="/okudingayo/login" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{l}</Link>
              </div>
            ))}
          </div>

          {/* Company links */}
          <div style={{ flex: 1, minWidth: 140 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Company</h4>
            {['About', 'Blog', 'Contact', 'Privacy Policy', 'Terms of Service'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <a href="#" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{l}</a>
              </div>
            ))}
          </div>

          {/* Location + image grid */}
          <div style={{ flex: '0 0 220px', minWidth: 180 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Location</h4>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: '0 0 8px' }}>
              Umkomanzi Drift<br />KwaZulu-Natal, 4170<br />South Africa
            </p>
            <a href="#" style={{ fontSize: 13, color: '#1e4db3', textDecoration: 'none', fontWeight: 600 }}>View on Google Maps →</a>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 6px' }}>📧 info@okudingayo.co.za</p>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>📞 000-000-0000</p>
            </div>

            {/* 5-image grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 20 }}>
              {[
                'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=80&h=80&fit=crop',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop',
                'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=80&h=80&fit=crop',
                'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=80&h=80&fit=crop',
                'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=80&h=80&fit=crop',
              ].map((src, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 8, overflow: 'hidden', lineHeight: 0 }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: 1100, margin: '48px auto 0',
          borderTop: '1px solid #f1f5f9',
          padding: '24px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>© 2026 Okudingayo Trading Enterprise. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Home', 'About', 'Services', 'Blog', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
