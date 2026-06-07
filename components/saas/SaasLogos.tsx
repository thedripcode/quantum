const COMPANIES = [
  'Vercel', 'Stripe', 'Figma', 'Notion', 'Retool', 'Loom', 'Raycast',
];

export default function SaasLogos() {
  return (
    <div className="border-y border-zinc-100 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.14em] mb-7">
          Trusted by engineering teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {COMPANIES.map(name => (
            <span
              key={name}
              className="text-[14px] font-semibold text-zinc-300 tracking-tight select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
