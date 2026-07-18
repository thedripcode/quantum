// CSS variable tokens — values live in globals.css :root / html.light
export const V = {
  bg:           'var(--bg)',
  surface:      'var(--surface)',
  surface2:     'var(--surface-2)',
  surface3:     'var(--surface-3)',
  text:         'var(--text)',
  textMuted:    'var(--text-muted)',
  textFaint:    'var(--text-faint)',
  accent:       'var(--accent)',
  accentSubtle: 'var(--accent-subtle)',
  border:       'var(--border)',
  borderStrong: 'var(--border-strong)',
  btnBg:        'var(--btn-bg)',
  btnColor:     'var(--btn-color)',
  navBg:        'var(--nav-bg)',
  navBorder:    'var(--nav-border)',
  statNum:      'var(--stat-num)',
  pillBorder:   'var(--pill-border)',
  pillText:     'var(--pill-text)',
} as const;

// Hard values that don't change between modes
export const HARD = {
  black:  '#0C0C0C',
  navy:   '#0a1e2e',
  white:  '#FFFFFF',
} as const;

export const F = {
  heading: "'Roboto Condensed', 'Arial Narrow', sans-serif",
  body:    "'Inter', sans-serif",
} as const;

export const R = {
  sm:   '8px',
  md:   '12px',
  lg:   '20px',
  xl:   '24px',
  full: '9999px',
} as const;

export const E = {
  snappy: [0.76, 0, 0.24, 1]    as const,
  smooth: [0.33, 1, 0.68, 1]    as const,
  bouncy: [0.34, 1.56, 0.64, 1] as const,
} as const;

// Named colour palette used by home section components
export const C = {
  white:        '#FFFFFF',
  navy:         '#0a1e2e',
  navyDark:     '#061320',
  paper:        '#F6F7F4',
  royal:        '#1e3a8a',
  // Legacy token name — now a sky-blue accent (no gold in the navy/white scheme)
  gold:         '#60a5fa',
  textPrimary:  '#0a1e2e',
  textSecondary:'#374151',
  textMuted:    '#6B7280',
  mutedOnNavy:  'rgba(255,255,255,0.55)',
  border:       '#E5E7EB',
  borderLight:  'rgba(255,255,255,0.08)',
} as const;
