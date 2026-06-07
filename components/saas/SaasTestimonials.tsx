import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:   "We tried Linear, Jira, and Asana. Kairos is the first tool our engineers opened without being asked. The GitHub integration is what sold us.",
    name:    'Sarah Chen',
    role:    'CTO',
    company: 'Meridian Labs',
    initials:'SC',
    color:   'bg-indigo-500',
  },
  {
    quote:   "Issues update themselves when we merge. Closed 30% more issues last quarter with the exact same team. I don't know how we shipped before this.",
    name:    'Marcus Webb',
    role:    'Staff Engineer',
    company: 'Bloom',
    initials:'MW',
    color:   'bg-violet-500',
  },
  {
    quote:   "Kairos is what happens when engineers build tools for engineers. Our PM even switched from their beloved Notion. That's how you know it's good.",
    name:    'Priya Patel',
    role:    'VP Engineering',
    company: 'Forma',
    initials:'PP',
    color:   'bg-sky-500',
  },
];

const STATS = [
  { value: '12k+', label: 'engineering teams' },
  { value: '94%',  label: 'weekly active rate' },
  { value: '2.4×', label: 'avg. velocity gain'  },
  { value: '99.9%',label: 'uptime SLA'           },
];

export default function SaasTestimonials() {
  return (
    <section className="py-24 bg-zinc-50 border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="mb-12">
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-[0.14em] mb-3">
            Social proof
          </p>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-zinc-900 tracking-tight leading-tight">
            Loved by teams that ship
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {TESTIMONIALS.map(t => (
            <div
              key={t.name}
              className="bg-white rounded-xl border border-zinc-200/80 p-6 flex flex-col shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[13.5px] text-zinc-700 leading-relaxed flex-1">
                "{t.quote}"
              </p>

              {/* Person */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-zinc-100">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-zinc-900 leading-tight">{t.name}</p>
                  <p className="text-[12px] text-zinc-500 leading-tight mt-0.5">
                    {t.role}
                    <span className="text-zinc-300 mx-1">·</span>
                    {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-zinc-200/80 px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <p className="text-[26px] font-bold text-zinc-900 tracking-tight leading-none mb-1">
                {s.value}
              </p>
              <p className="text-[12px] text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
