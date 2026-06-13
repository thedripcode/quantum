import Link from 'next/link';

export default function OkuAbout() {
  return (
    <section id="about" style={{ background: 'white', padding: '100px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap' }}>

        {/* Left — rounded image with badge */}
        <div style={{ flex: '0 0 48%', position: 'relative' }}>
          <div style={{
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(30,77,179,0.14), 0 4px 16px rgba(0,0,0,0.08)',
            lineHeight: 0,
          }}>
            <img
              src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=700&h=520&fit=crop&q=80"
              alt="Plumber at work"
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>

          {/* Floating stat badge */}
          <div style={{
            position: 'absolute', bottom: 28, right: -24,
            background: 'white',
            borderRadius: 18,
            padding: '18px 24px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
            border: '1px solid #f1f5f9',
            minWidth: 160,
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#1e4db3', letterSpacing: '-0.03em', lineHeight: 1 }}>10+</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Years of experience</div>
            <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f5c518', fontSize: 14 }}>★</span>)}
            </div>
          </div>

          {/* Top-left accent */}
          <div style={{
            position: 'absolute', top: -16, left: -16,
            width: 60, height: 60, background: '#f5e85e',
            borderRadius: 14,
            zIndex: -1,
            boxShadow: '0 4px 16px rgba(245,232,94,0.5)',
          }} />
        </div>

        {/* Right — text */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1e4db3', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            About Us
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 20px', lineHeight: 1.1 }}>
            Business solutions<br />tailored to your needs.
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 32 }}>
            Our team of licensed and experienced professionals is committed to providing prompt, courteous service — ensuring your operations are always running at peak condition. Built specifically for KwaZulu-Natal plumbing companies.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
            {[
              'Experienced and COC-certified technicians',
              'POPIA-compliant cloud infrastructure',
              'WhatsApp Business API & GPS dispatch',
              'Xero / Sage accounting integration',
              'ZAR currency & PayFast/SnapScan payments',
              'Customer satisfaction guarantee',
            ].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <span style={{
                  width: 22, height: 22, background: '#1e4db3',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white', fontSize: 11, flexShrink: 0, fontWeight: 700,
                }}>✓</span>
                <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>{item}</span>
              </li>
            ))}
          </ul>

          <Link href="/okudingayo/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#1e4db3', fontWeight: 700, fontSize: 15,
            textDecoration: 'none', borderBottom: '2px solid #f5e85e',
            paddingBottom: 2,
          }}>
            Learn more about us →
          </Link>
        </div>
      </div>
    </section>
  );
}
