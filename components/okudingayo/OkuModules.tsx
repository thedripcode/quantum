import Link from 'next/link';

const services = [
  { icon: '💧', title: 'Job Management',   desc: 'Multi-channel intake, emergency triage, GPS dispatch, and real-time job tracking.' },
  { icon: '🌊', title: 'Customer CRM',      desc: 'Full service history, automated follow-ups, and WhatsApp communication hub.' },
  { icon: '🔧', title: 'Inventory Control', desc: 'Live stock levels, low-stock alerts, purchase orders, and vehicle auditing.' },
  { icon: '💰', title: 'Financial Suite',   desc: 'Automated invoicing, VAT-compliant SARS reporting, and cash flow forecasting.' },
  { icon: '⚙️', title: 'Team & HR',         desc: 'COC cert tracking, skill matrix, shift scheduling, and commission payroll.' },
  { icon: '📊', title: 'Analytics',         desc: 'KPI dashboards, response-time tracking, and seasonal demand heatmaps.' },
];

export default function OkuModules() {
  return (
    <section id="services" style={{
      background: '#1e4db3',
      padding: '100px 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Noise texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
        mixBlendMode: 'overlay', opacity: 0.5,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(245,232,94,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
            Our Services
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', margin: 0 }}>
            Everything your plumbing<br />business needs.
          </h2>
        </div>

        {/* 3×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {services.map((s, i) => (
            <div key={s.title} style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 20,
              padding: '32px 28px',
              position: 'relative',
              transition: 'background 0.2s',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              cursor: 'default',
            }}>
              {/* Arrow top-left */}
              <div style={{
                position: 'absolute', top: 18, right: 20,
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: 'rgba(255,255,255,0.6)',
              }}>↗</div>

              <div style={{ fontSize: 36, marginBottom: 18 }}>{s.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'white', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'white', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            Have a business emergency?
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:0000000" style={{
              background: '#f5e85e', color: '#1a1a1a',
              padding: '14px 32px', borderRadius: 100,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(245,232,94,0.4)',
            }}>📞 Call Us Now</a>
            <Link href="/okudingayo/login" style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', padding: '14px 32px', borderRadius: 100,
              fontWeight: 600, fontSize: 15, textDecoration: 'none',
            }}>Access Dashboard</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
