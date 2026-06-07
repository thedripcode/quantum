'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Shield, GraduationCap } from 'lucide-react';
import { F, R } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────
export type PortalType = 'student' | 'teacher' | 'parent';

// ─── Portal config ────────────────────────────────────────────────────────────
const CONFIG: Record<PortalType, {
  title: string;
  subtitle: string;
  idLabel: string;
  idPlaceholder: string;
  dashboardHref: string;
  switchHref: string;
  switchLabel: string;
  switchText: string;
  emoji: string;
}> = {
  student: {
    title:          'Student Portal',
    subtitle:       'Sign in to access your subjects, assignments and results',
    idLabel:        'Student Number or Email',
    idPlaceholder:  'e.g. STU2024001 or you@sidelile.edu.za',
    dashboardHref:  '/dashboard/student',
    switchHref:     '/teacher-portal',
    switchLabel:    'Teacher Portal →',
    switchText:     'Are you a teacher?',
    emoji:          '🎓',
  },
  teacher: {
    title:          'Teacher Portal',
    subtitle:       'Sign in to manage your classes, learners and assessments',
    idLabel:        'Staff ID or Email',
    idPlaceholder:  'e.g. TCH001 or staff@sidelile.edu.za',
    dashboardHref:  '/dashboard/teacher',
    switchHref:     '/parent-portal',
    switchLabel:    'Parent Portal →',
    switchText:     'Are you a parent?',
    emoji:          '📚',
  },
  parent: {
    title:          'Parent Portal',
    subtitle:       "Sign in to track your child's progress, attendance and results",
    idLabel:        'Email Address',
    idPlaceholder:  'e.g. parent@email.com',
    dashboardHref:  '/dashboard/student',
    switchHref:     '/student-portal',
    switchLabel:    'Student Portal →',
    switchText:     'Are you a student?',
    emoji:          '👨‍👩‍👧',
  },
};

// ─── Floating math / physics symbols ─────────────────────────────────────────
const SYMBOLS = [
  { sym: '∑',      x: 6,  y: 14, size: 88, delay: 0.0, rot: -12, opacity: 0.13 },
  { sym: 'π',      x: 87, y: 7,  size: 72, delay: 1.5, rot:  10, opacity: 0.11 },
  { sym: '∫',      x: 14, y: 68, size: 80, delay: 0.8, rot:  -6, opacity: 0.10 },
  { sym: '√',      x: 78, y: 62, size: 64, delay: 2.2, rot:  18, opacity: 0.12 },
  { sym: 'α',      x: 44, y: 4,  size: 56, delay: 0.4, rot: -22, opacity: 0.09 },
  { sym: 'E=mc²',  x: 2,  y: 42, size: 22, delay: 1.8, rot:  14, opacity: 0.16 },
  { sym: '∂',      x: 91, y: 38, size: 72, delay: 0.6, rot:  -9, opacity: 0.10 },
  { sym: '∇',      x: 62, y: 84, size: 60, delay: 2.8, rot:  24, opacity: 0.11 },
  { sym: 'λ',      x: 30, y: 87, size: 48, delay: 1.2, rot: -18, opacity: 0.09 },
  { sym: 'F=ma',   x: 74, y: 18, size: 20, delay: 3.2, rot:  11, opacity: 0.15 },
  { sym: '∞',      x: 50, y: 72, size: 52, delay: 2.0, rot:   6, opacity: 0.10 },
  { sym: 'θ',      x: 7,  y: 30, size: 44, delay: 0.2, rot: -32, opacity: 0.09 },
  { sym: 'Δ',      x: 55, y: 88, size: 40, delay: 3.6, rot:   5, opacity: 0.10 },
  { sym: 'β',      x: 20, y: 52, size: 36, delay: 2.6, rot: -15, opacity: 0.08 },
  { sym: 'a²+b²=c²', x: 60, y: 6, size: 17, delay: 1.0, rot: -8,  opacity: 0.14 },
  { sym: 'φ',      x: 38, y: 16, size: 44, delay: 4.0, rot:  20, opacity: 0.09 },
  { sym: '⊗',      x: 82, y: 78, size: 36, delay: 1.6, rot: -25, opacity: 0.09 },
  { sym: 'μ',      x: 22, y: 8,  size: 40, delay: 3.0, rot:  16, opacity: 0.08 },
  { sym: 'v=λf',   x: 88, y: 50, size: 18, delay: 0.9, rot:  -5, opacity: 0.14 },
  { sym: 'γ',      x: 48, y: 50, size: 28, delay: 2.4, rot:  28, opacity: 0.07 },
];

// ─── Keyframes ────────────────────────────────────────────────────────────────
const floatA = keyframes`
  0%,100% { transform: translateY(0px) rotate(var(--r)); }
  50%      { transform: translateY(-18px) rotate(var(--r)); }
`;
const floatB = keyframes`
  0%,100% { transform: translateY(0px) rotate(var(--r)); }
  50%      { transform: translateY(14px) rotate(var(--r)); }
`;
const floatC = keyframes`
  0%,100% { transform: translateY(0px) rotate(var(--r)); }
  33%      { transform: translateY(-10px) rotate(var(--r)); }
  66%      { transform: translateY(10px) rotate(var(--r)); }
`;

const FLOAT_ANIMS = [floatA, floatB, floatC];

// ─── Styled components ────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px 20px;

  /* Deep blue gradient background */
  background:
    radial-gradient(ellipse at 20% 50%, rgba(29,78,216,0.45) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(37,99,235,0.30) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 90%, rgba(14,165,233,0.20) 0%, transparent 45%),
    #071237;
`;

const SymbolEl = styled.span<{
  $x: number; $y: number; $size: number;
  $delay: number; $rot: number; $opacity: number; $animIdx: number;
}>`
  position: absolute;
  left: ${p => p.$x}%;
  top:  ${p => p.$y}%;
  font-size: ${p => p.$size}px;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  color: rgba(147,197,253, ${p => p.$opacity});
  line-height: 1;
  pointer-events: none;
  user-select: none;
  --r: ${p => p.$rot}deg;
  transform: rotate(${p => p.$rot}deg);
  animation: ${p => FLOAT_ANIMS[p.$animIdx % 3]} ${p => 5 + (p.$delay % 3)}s ease-in-out ${p => p.$delay}s infinite;
  text-shadow: 0 0 40px rgba(96,165,250,0.18);
`;

/* Subtle grid overlay */
const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
`;

const Wrap = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${F.body};
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.38);
  text-decoration: none;
  margin-bottom: 28px;
  transition: color 0.2s ease;

  &:hover { color: rgba(255,255,255,0.80); }
`;

const Card = styled(motion.div)`
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 28px;
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  padding: 44px 40px 36px;
  box-shadow:
    0 48px 120px rgba(0,0,0,0.60),
    0 0 0 1px rgba(255,255,255,0.06) inset;

  @media (max-width: 480px) {
    padding: 36px 28px 28px;
    border-radius: 20px;
  }
`;

/* ── Header ── */
const BadgeRing = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

/* ── Input ── */
const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const FieldLabel = styled.label`
  font-family: ${F.body};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
`;

const InputWrap = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(255,255,255,0.28);
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 13px 14px 13px 42px;
  border-radius: 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  color: #ffffff;
  font-family: ${F.body};
  font-size: 13.5px;
  font-weight: 300;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  -webkit-appearance: none;

  &::placeholder { color: rgba(255,255,255,0.22); }

  &:focus {
    border-color: rgba(96,165,250,0.60);
    background: rgba(96,165,250,0.07);
    box-shadow: 0 0 0 3px rgba(96,165,250,0.14);
  }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.28);
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s ease;

  &:hover { color: rgba(255,255,255,0.70); }
`;

/* ── Checkbox ── */
const CheckBox = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: ${p => p.$checked ? 'rgba(96,165,250,0.90)' : 'rgba(255,255,255,0.06)'};
  border: 1px solid ${p => p.$checked ? 'rgba(96,165,250,0.90)' : 'rgba(255,255,255,0.16)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.18s ease;
  font-size: 10px;
  color: #fff;
  font-weight: 700;
`;

/* ── Submit button ── */
const SubmitBtn = styled(motion.button)`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  border: none;
  color: #ffffff;
  font-family: ${F.heading};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s ease;
  box-shadow: 0 4px 24px rgba(37,99,235,0.40);

  &:disabled { opacity: 0.55; cursor: default; }
`;

/* ── Divider ── */
const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;

  span {
    font-family: ${F.body};
    font-size: 12px;
    font-weight: 400;
    color: rgba(255,255,255,0.28);
    white-space: nowrap;
  }

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.10);
  }
`;

/* ── Social buttons ── */
const SocialRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const SocialBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.72);
  font-family: ${F.body};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.10);
    border-color: rgba(255,255,255,0.20);
    color: #ffffff;
  }
`;

/* ── Switch portal ── */
const SwitchRow = styled.div`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.07);
  text-align: center;
  font-family: ${F.body};
  font-size: 13px;
  color: rgba(255,255,255,0.34);

  a {
    color: rgba(147,197,253,0.90);
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s ease;
    &:hover { opacity: 0.70; }
  }
`;

/* ── SSL note ── */
const SSLNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  font-family: ${F.body};
  font-size: 11px;
  color: rgba(255,255,255,0.18);
`;

/* ── Google SVG ── */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ── Microsoft SVG ── */
const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="1"  y="1"  width="10" height="10" fill="#F25022"/>
    <rect x="13" y="1"  width="10" height="10" fill="#7FBA00"/>
    <rect x="1"  y="13" width="10" height="10" fill="#00A4EF"/>
    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
  </svg>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.30);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  display: inline-block;
`;

// ─── Component ────────────────────────────────────────────────────────────────
interface LoginFormProps {
  type: PortalType;
}

export default function LoginForm({ type }: LoginFormProps) {
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [badgeErr,  setBadgeErr]  = useState(false);
  const [form,      setForm]      = useState({ identifier: '', password: '' });
  const [error,     setError]     = useState('');

  const router       = useRouter();
  const searchParams = useSearchParams();
  const cfg          = CONFIG[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.identifier || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);

    const result = await signIn('credentials', {
      identifier: form.identifier,
      password:   form.password,
      role:       type,
      redirect:   false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid credentials. Please check your ID / email and password.');
      return;
    }

    // Redirect to callbackUrl or the role's dashboard
    const callbackUrl = searchParams.get('callbackUrl') ?? cfg.dashboardHref;
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <Page>
      {/* ── Grid ── */}
      <Grid aria-hidden />

      {/* ── Floating math symbols ── */}
      {SYMBOLS.map((s, i) => (
        <SymbolEl
          key={i}
          aria-hidden
          $x={s.x} $y={s.y} $size={s.size}
          $delay={s.delay} $rot={s.rot}
          $opacity={s.opacity} $animIdx={i}
        >
          {s.sym}
        </SymbolEl>
      ))}

      <Wrap>

        {/* ── Back link ── */}
        <BackLink href="/">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Home
        </BackLink>

        {/* ── Card ── */}
        <Card
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* ── Header ── */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>

            {/* Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
              <BadgeRing>
                {badgeErr ? (
                  <GraduationCap size={28} strokeWidth={1.5} style={{ color: 'rgba(147,197,253,0.80)' }} />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src="/images/sidelile-badge.png"
                    alt="Sidelile crest"
                    width={48}
                    height={48}
                    style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(96,165,250,0.40))' }}
                    onError={() => setBadgeErr(true)}
                  />
                )}
              </BadgeRing>
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.10)' }} />
              <BadgeRing style={{ fontSize: 28 }}>
                {cfg.emoji}
              </BadgeRing>
            </div>

            {/* School label */}
            <div style={{
              fontFamily: F.body, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.26em', textTransform: 'uppercase',
              color: 'rgba(147,197,253,0.65)', marginBottom: 8,
            }}>
              Sidelile High School
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: F.heading,
              fontSize: 'clamp(22px, 3vw, 28px)',
              fontWeight: 800, color: '#ffffff',
              letterSpacing: '-0.03em', lineHeight: 1.15,
              margin: '0 0 8px',
            }}>
              {cfg.title}
            </h1>

            <p style={{
              fontFamily: F.body, fontSize: 13.5, fontWeight: 300,
              color: 'rgba(255,255,255,0.42)', maxWidth: 300,
              margin: '0 auto', lineHeight: 1.60,
            }}>
              {cfg.subtitle}
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Identifier */}
            <FieldWrap>
              <FieldLabel>{cfg.idLabel}</FieldLabel>
              <InputWrap>
                <InputIcon><Mail size={15} strokeWidth={1.5} /></InputIcon>
                <StyledInput
                  type="text"
                  placeholder={cfg.idPlaceholder}
                  value={form.identifier}
                  onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))}
                  autoComplete="username"
                  required
                />
              </InputWrap>
            </FieldWrap>

            {/* Password */}
            <FieldWrap>
              <FieldLabel>Password</FieldLabel>
              <InputWrap>
                <InputIcon><Lock size={15} strokeWidth={1.5} /></InputIcon>
                <StyledInput
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                  required
                />
                <EyeBtn type="button" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                  {showPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </EyeBtn>
              </InputWrap>
            </FieldWrap>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <CheckBox $checked={remember} onClick={() => setRemember(v => !v)}>
                  {remember && '✓'}
                </CheckBox>
                <span style={{ fontFamily: F.body, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: 'rgba(147,197,253,0.85)', textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.09)',
                  border: '1px solid rgba(239,68,68,0.24)',
                  fontFamily: F.body, fontSize: 13,
                  color: 'rgba(252,165,165,0.95)',
                }}
              >
                <Shield size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <SubmitBtn
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02, boxShadow: '0 8px 32px rgba(37,99,235,0.55)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ marginTop: 4 }}
            >
              {loading ? <Spinner /> : null}
              {loading ? 'Signing in…' : `Sign in to ${cfg.title}`}
            </SubmitBtn>

          </form>

          {/* ── Divider ── */}
          <Divider style={{ margin: '20px 0 16px' }}>
            <span>or continue with</span>
          </Divider>

          {/* ── Social buttons ── */}
          <SocialRow>
            <SocialBtn type="button">
              <GoogleIcon />
              Google
            </SocialBtn>
            <SocialBtn type="button">
              <MicrosoftIcon />
              Microsoft
            </SocialBtn>
          </SocialRow>

          {/* ── Switch portal ── */}
          <SwitchRow>
            {cfg.switchText}{' '}
            <Link href={cfg.switchHref}>{cfg.switchLabel}</Link>
          </SwitchRow>

          {/* ── SSL note ── */}
          <SSLNote>
            <Lock size={11} strokeWidth={1.5} />
            Secured with 256-bit SSL encryption
          </SSLNote>

        </Card>

        {/* ── Copyright ── */}
        <p style={{
          textAlign: 'center', fontFamily: F.body,
          fontSize: 11, color: 'rgba(255,255,255,0.18)',
          marginTop: 20,
        }}>
          © {new Date().getFullYear()} Sidelile High School · All rights reserved.
        </p>

      </Wrap>
    </Page>
  );
}
