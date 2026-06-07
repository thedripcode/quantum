export default function OkuHowItWorks() {
  const steps = [
    {
      icon: '📞',
      num: '01',
      title: 'Log a Request',
      desc: 'Available 24/7 via phone, WhatsApp, or web form. Emergency jobs are auto-classified and prioritised instantly.',
    },
    {
      icon: '👷',
      num: '02',
      title: 'Expert Dispatch',
      desc: 'Our system assigns the nearest certified technician and calculates a GPS-optimised route — 30-minute target guaranteed.',
    },
    {
      icon: '🚐',
      num: '03',
      title: 'Track in Real-Time',
      desc: 'The customer receives automated SMS and WhatsApp updates at every stage — En Route, On Site, and Completed.',
    },
  ];

  return (
    <section id="process" style={{ background: '#f0f4f8', padding: '100px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1e4db3', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
            How It Works
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Three steps to sorted.
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
            From first call to completed job, every step is tracked, automated, and communicated.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', position: 'relative' }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute', top: 48, left: 'calc(16.67% + 0px)', right: 'calc(16.67% + 0px)',
            height: 1, background: 'linear-gradient(90deg, #cbd5e1, #e2e8f0, #cbd5e1)',
            zIndex: 0,
          }} />

          {steps.map((s, i) => (
            <div key={s.num} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              {/* Yellow oval icon */}
              <div style={{
                width: 96, height: 96,
                background: '#f5e85e',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40,
                marginBottom: 28,
                boxShadow: '0 8px 32px rgba(245,232,94,0.35), 0 2px 8px rgba(0,0,0,0.08)',
                position: 'relative',
              }}>
                {s.icon}
                {/* Step number badge */}
                <div style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 26, height: 26, background: '#1e4db3',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: 'white',
                  border: '2px solid #f0f4f8',
                }}>{i + 1}</div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: '#1e4db3', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                Step {s.num}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, maxWidth: 280, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
