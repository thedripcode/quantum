const TESTIMONIALS = [
  {
    quote:
      'Sidelile has been amazing. The supportive teachers and personalized attention have helped me excel academically and personally. I feel truly prepared for university.',
    name: 'Thandeka M.',
    role: 'Grade 12 Learner',
    initials: 'TM',
  },
  {
    quote:
      'As a principal, I am proud of the culture of excellence and care we have built at Sidelile. Every child who walks through our gates leaves as a confident, capable young adult.',
    name: 'Dr. Sipho Ndlovu',
    role: 'Principal, Sidelile High School',
    initials: 'SN',
    featured: true,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24" style={{ background: '#060f1a' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-5"
            style={{ background: 'rgba(124,58,237,0.10)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.25)' }}
          >
            What They Say
          </span>
          <h2 className="text-[36px] sm:text-[44px] font-bold text-white leading-[1.1] tracking-tight">
            Words from our{' '}
            <span style={{ color: '#7C3AED' }}>community</span>
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, initials, featured }) => (
            <div
              key={name}
              className="flex flex-col justify-between p-8 rounded-[24px]"
              style={{
                background: featured ? '#0a1e2e' : 'rgba(255,255,255,0.04)',
                border: featured
                  ? '1px solid rgba(124,58,237,0.30)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Quote mark */}
              <div
                className="text-[64px] leading-none font-serif mb-2 -mt-2"
                style={{ color: featured ? '#7C3AED' : 'rgba(255,255,255,0.15)' }}
              >
                &ldquo;
              </div>

              <p className="text-[15px] leading-relaxed mb-8 flex-1" style={{ color: featured ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)' }}>
                {quote}
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{
                    background: featured ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.08)',
                    color: featured ? '#7C3AED' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{name}</div>
                  <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.40)' }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
