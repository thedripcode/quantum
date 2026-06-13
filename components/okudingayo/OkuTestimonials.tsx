const reviews = [
  { stars: 5, name: 'Senzokuhle Luthuli', platform: 'Trustpilot', initials: 'SL', color: '#1e4db3',
    text: 'The platform transformed our dispatch process. Real-time tracking and automated notifications cut our response time to under 25 minutes — every single job.' },
  { stars: 5, name: 'Phumelela Mbhele', platform: 'Facebook', initials: 'PM', color: '#0891b2',
    text: 'Outstandingly thorough workflow automation. The financial suite exceeded all our expectations and our accountant now saves 8 hours a week.' },
  { stars: 4, name: 'Sibonelo Dlamini', platform: 'Trustpilot', initials: 'SD', color: '#059669',
    text: 'Reliable, courteous, and meticulous. Inventory management resolved our chronic stock issues on day one. Highly recommend to any plumbing outfit.' },
  { stars: 5, name: 'Senzokuhle Mbutho', platform: 'Google', initials: 'SM', color: '#7c3aed',
    text: 'Emergency dispatch saved the day on our worst burst-pipe call. The system assigned a tech in 4 minutes and the customer got an SMS before we even called them.' },
  { stars: 5, name: 'Rajesh Pillay', platform: 'Google', initials: 'RP', color: '#b45309',
    text: 'Switching from spreadsheets to this platform felt like going from a Nokia to an iPhone. The COC generation alone is worth the subscription.' },
];

export default function OkuTestimonials() {
  return (
    <section id="testimonials" style={{ background: '#f0f4f8', padding: '100px 0' }}>
      {/* Header */}
      <div style={{ padding: '0 64px', marginBottom: 56 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#1e4db3', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
          Testimonials
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
          What our clients say.
        </h2>
      </div>

      {/* Horizontal scroll carousel */}
      <div style={{
        display: 'flex', gap: 20, overflowX: 'auto', paddingLeft: 64, paddingRight: 64, paddingBottom: 12,
        scrollbarWidth: 'none',
      }}>
        {reviews.map((r, i) => (
          <div key={i} style={{
            minWidth: 320, maxWidth: 340,
            background: 'white', borderRadius: 20, padding: 32,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column',
            flexShrink: 0,
          }}>
            {/* Stars */}
            <div style={{ marginBottom: 18 }}>
              {'★'.repeat(r.stars).split('').map((_, si) => (
                <span key={si} style={{ color: '#f5c518', fontSize: 17 }}>★</span>
              ))}
              {'☆'.repeat(5 - r.stars).split('').map((_, si) => (
                <span key={si} style={{ color: '#e2e8f0', fontSize: 17 }}>☆</span>
              ))}
            </div>

            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.8, flex: 1, margin: '0 0 28px', fontStyle: 'italic' }}>
              "{r.text}"
            </p>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: r.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0,
              }}>{r.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Review on {r.platform}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`.testimonial-scroll::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
