// No 'use client' needed — pure CSS animation, no JS

const ITEMS = [
  'Excellence',
  'Character',
  'Community',
  'KwaZulu-Natal',
  '25 Years of Excellence',
  '95% Matric Pass Rate',
  'Shaping Tomorrow\'s Leaders',
  'Est. 2001',
];

const TEXT = ITEMS.join('  ·  ') + '  ·  ';

interface Props {
  /** dark = navy bg white text | light = gold bg navy text */
  variant?: 'dark' | 'light';
  reversed?: boolean;
}

export default function MarqueeTicker({ variant = 'dark', reversed = false }: Props) {
  const bg   = variant === 'dark' ? '#0a1628' : '#7C3AED';
  const text = variant === 'dark' ? 'text-white/60' : 'text-[#0a1628]';
  const anim = reversed ? 'animate-marquee-rev' : 'animate-marquee';

  return (
    <div
      className="overflow-hidden py-3.5 select-none"
      style={{ background: bg }}
      aria-hidden="true"
    >
      {/* Two identical spans so the loop is seamless */}
      <div className={`flex whitespace-nowrap ${anim}`}>
        <span className={`inline-block text-[11px] font-bold uppercase tracking-[0.22em] ${text}`}>
          {TEXT.repeat(6)}
        </span>
        <span className={`inline-block text-[11px] font-bold uppercase tracking-[0.22em] ${text}`}>
          {TEXT.repeat(6)}
        </span>
      </div>
    </div>
  );
}
