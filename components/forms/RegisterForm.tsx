'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft, Shield, GraduationCap, CheckCircle } from 'lucide-react';
import { F } from '@/styles/theme';

type RegisterRole = 'student' | 'parent';

const SYMBOLS = [
  { sym: '∑', x: 6,  y: 14, size: 88, delay: 0.0, rot: -12, opacity: 0.13 },
  { sym: 'π', x: 87, y: 7,  size: 72, delay: 1.5, rot:  10, opacity: 0.11 },
  { sym: '∫', x: 14, y: 68, size: 80, delay: 0.8, rot:  -6, opacity: 0.10 },
  { sym: '√', x: 78, y: 62, size: 64, delay: 2.2, rot:  18, opacity: 0.12 },
  { sym: 'α', x: 44, y: 4,  size: 56, delay: 0.4, rot: -22, opacity: 0.09 },
  { sym: 'E=mc²', x: 2, y: 42, size: 22, delay: 1.8, rot: 14, opacity: 0.16 },
  { sym: '∂', x: 91, y: 38, size: 72, delay: 0.6, rot:  -9, opacity: 0.10 },
  { sym: '∇', x: 62, y: 84, size: 60, delay: 2.8, rot:  24, opacity: 0.11 },
  { sym: 'λ', x: 30, y: 87, size: 48, delay: 1.2, rot: -18, opacity: 0.09 },
  { sym: 'Δ', x: 55, y: 88, size: 40, delay: 3.6, rot:   5, opacity: 0.10 },
];

const floatA = keyframes`0%,100%{transform:translateY(0px) rotate(var(--r));}50%{transform:translateY(-18px) rotate(var(--r));}`;
const floatB = keyframes`0%,100%{transform:translateY(0px) rotate(var(--r));}50%{transform:translateY(14px) rotate(var(--r));}`;
const FLOAT_ANIMS = [floatA, floatB];

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(29,78,216,0.45) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(37,99,235,0.30) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 90%, rgba(14,165,233,0.20) 0%, transparent 45%),
    #071237;
`;

const SymbolEl = styled.span<{ $x:number;$y:number;$size:number;$delay:number;$rot:number;$opacity:number;$animIdx:number }>`
  position: absolute;
  left: ${p=>p.$x}%;
  top: ${p=>p.$y}%;
  font-size: ${p=>p.$size}px;
  font-family: 'Georgia','Times New Roman',serif;
  font-style: italic;
  font-weight: 700;
  color: rgba(147,197,253,${p=>p.$opacity});
  pointer-events: none;
  user-select: none;
  --r: ${p=>p.$rot}deg;
  transform: rotate(${p=>p.$rot}deg);
  animation: ${p=>FLOAT_ANIMS[p.$animIdx%2]} ${p=>5+(p.$delay%3)}s ease-in-out ${p=>p.$delay}s infinite;
`;

const Grid = styled.div`
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
  background-size:60px 60px;pointer-events:none;
`;

const Wrap = styled.div`position:relative;z-index:10;width:100%;max-width:460px;`;

const BackLink = styled(Link)`
  display:inline-flex;align-items:center;gap:7px;
  font-family:${F.body};font-size:13px;font-weight:500;
  color:rgba(255,255,255,0.38);text-decoration:none;margin-bottom:28px;transition:color 0.2s;
  &:hover{color:rgba(255,255,255,0.80);}
`;

const Card = styled(motion.div)`
  background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:28px;
  backdrop-filter:blur(32px);
  -webkit-backdrop-filter:blur(32px);
  padding:44px 40px 36px;
  box-shadow:0 48px 120px rgba(0,0,0,0.60),0 0 0 1px rgba(255,255,255,0.06) inset;
  @media(max-width:480px){padding:36px 28px 28px;border-radius:20px;}
`;

const FieldWrap = styled.div`display:flex;flex-direction:column;gap:7px;`;
const FieldLabel = styled.label`font-family:${F.body};font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:rgba(255,255,255,0.45);`;
const InputWrap = styled.div`position:relative;`;
const InputIcon = styled.div`position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(255,255,255,0.28);display:flex;align-items:center;`;

const StyledInput = styled.input`
  width:100%;padding:13px 14px 13px 42px;border-radius:12px;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);
  color:#ffffff;font-family:${F.body};font-size:13.5px;font-weight:300;
  outline:none;transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
  box-sizing:border-box;-webkit-appearance:none;
  &::placeholder{color:rgba(255,255,255,0.22);}
  &:focus{border-color:rgba(96,165,250,0.60);background:rgba(96,165,250,0.07);box-shadow:0 0 0 3px rgba(96,165,250,0.14);}
`;

const StyledSelect = styled.select`
  width:100%;padding:13px 14px 13px 42px;border-radius:12px;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);
  color:#ffffff;font-family:${F.body};font-size:13.5px;font-weight:300;
  outline:none;transition:border-color 0.2s,background 0.2s;
  box-sizing:border-box;cursor:pointer;
  option{background:#0f1f4b;color:#fff;}
  &:focus{border-color:rgba(96,165,250,0.60);background:rgba(96,165,250,0.07);box-shadow:0 0 0 3px rgba(96,165,250,0.14);}
`;

const EyeBtn = styled.button`
  position:absolute;right:14px;top:50%;transform:translateY(-50%);
  background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.28);
  display:flex;align-items:center;padding:0;transition:color 0.2s;
  &:hover{color:rgba(255,255,255,0.70);}
`;

const RoleRow = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px;`;
const RoleBtn = styled.button<{$active:boolean}>`
  padding:11px 16px;border-radius:12px;
  background:${p=>p.$active?'rgba(37,99,235,0.35)':'rgba(255,255,255,0.06)'};
  border:1px solid ${p=>p.$active?'rgba(96,165,250,0.60)':'rgba(255,255,255,0.10)'};
  color:${p=>p.$active?'#ffffff':'rgba(255,255,255,0.55)'};
  font-family:${F.body};font-size:13px;font-weight:${p=>p.$active?'600':'400'};
  cursor:pointer;transition:all 0.2s;
  &:hover{background:rgba(255,255,255,0.10);color:#fff;}
`;

const SubmitBtn = styled(motion.button)`
  width:100%;padding:14px;border-radius:12px;
  background:linear-gradient(135deg,#2563EB 0%,#1D4ED8 100%);
  border:none;color:#ffffff;font-family:${F.heading};font-size:14px;font-weight:700;
  letter-spacing:0.04em;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:0 4px 24px rgba(37,99,235,0.40);transition:opacity 0.2s;
  &:disabled{opacity:0.55;cursor:default;}
`;

const SwitchRow = styled.div`
  margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);
  text-align:center;font-family:${F.body};font-size:13px;color:rgba(255,255,255,0.34);
  a{color:rgba(147,197,253,0.90);font-weight:600;text-decoration:none;transition:opacity 0.2s;&:hover{opacity:0.70;}}
`;

const spin = keyframes`from{transform:rotate(0deg);}to{transform:rotate(360deg);}`;
const Spinner = styled.span`
  width:16px;height:16px;border:2px solid rgba(255,255,255,0.30);border-top-color:#fff;
  border-radius:50%;animation:${spin} 0.7s linear infinite;display:inline-block;
`;

const SuccessBox = styled(motion.div)`
  text-align:center;padding:32px 24px;
`;

export default function RegisterForm() {
  const [role, setRole]         = useState<RegisterRole>('student');
  const [showPw, setShowPw]     = useState(false);
  const [showCPw, setShowCPw]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [portalId, setPortalId] = useState('');
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirmPassword: '', grade: '' });
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (role === 'student' && !form.grade) { setError('Please select your grade.'); return; }
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, grade: form.grade, role }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? 'Registration failed.'); return; }
    setPortalId(data.portalId);
    setSuccess(data.message);
  };

  const loginHref = role === 'student' ? '/student-portal' : '/parent-portal';

  if (success) {
    return (
      <Page>
        <Grid aria-hidden />
        {SYMBOLS.map((s, i) => (
          <SymbolEl key={i} aria-hidden $x={s.x} $y={s.y} $size={s.size} $delay={s.delay} $rot={s.rot} $opacity={s.opacity} $animIdx={i}>{s.sym}</SymbolEl>
        ))}
        <Wrap>
          <Card initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <SuccessBox>
              <CheckCircle size={56} color="#34d399" strokeWidth={1.5} style={{ marginBottom: 20 }} />
              <h2 style={{ fontFamily: F.heading, fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
                Account Created!
              </h2>
              <p style={{ fontFamily: F.body, fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 24, lineHeight: 1.6 }}>
                Welcome to Sidelile High School. Your portal ID is:
              </p>
              <div style={{
                background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.30)',
                borderRadius: 12, padding: '16px 24px', marginBottom: 28,
              }}>
                <span style={{ fontFamily: F.heading, fontSize: 28, fontWeight: 900, color: '#34d399', letterSpacing: '0.08em' }}>
                  {portalId}
                </span>
                <p style={{ fontFamily: F.body, fontSize: 12, color: 'rgba(255,255,255,0.40)', marginTop: 6 }}>
                  Save this ID — you will use it to log in
                </p>
              </div>
              <SubmitBtn
                type="button"
                onClick={() => router.push(loginHref)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Login
              </SubmitBtn>
            </SuccessBox>
          </Card>
        </Wrap>
      </Page>
    );
  }

  return (
    <Page>
      <Grid aria-hidden />
      {SYMBOLS.map((s, i) => (
        <SymbolEl key={i} aria-hidden $x={s.x} $y={s.y} $size={s.size} $delay={s.delay} $rot={s.rot} $opacity={s.opacity} $animIdx={i}>{s.sym}</SymbolEl>
      ))}

      <Wrap>
        <BackLink href="/student-portal">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Login
        </BackLink>

        <Card
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎓</div>
            <div style={{ fontFamily: F.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(147,197,253,0.65)', marginBottom: 8 }}>
              Sidelile High School
            </div>
            <h1 style={{ fontFamily: F.heading, fontSize: 26, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
              Create Account
            </h1>
            <p style={{ fontFamily: F.body, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.42)', margin: 0 }}>
              Register to access the school portal
            </p>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: 20 }}>
            <FieldLabel style={{ display: 'block', marginBottom: 8 }}>I am a</FieldLabel>
            <RoleRow>
              <RoleBtn type="button" $active={role === 'student'} onClick={() => setRole('student')}>🎓 Student</RoleBtn>
              <RoleBtn type="button" $active={role === 'parent'}  onClick={() => setRole('parent')}>👨‍👩‍👧 Parent</RoleBtn>
            </RoleRow>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Full name */}
            <FieldWrap>
              <FieldLabel>Full Name</FieldLabel>
              <InputWrap>
                <InputIcon><User size={15} strokeWidth={1.5} /></InputIcon>
                <StyledInput type="text" placeholder="e.g. Thabo Dlamini" value={form.name} onChange={set('name')} required />
              </InputWrap>
            </FieldWrap>

            {/* Email */}
            <FieldWrap>
              <FieldLabel>Email Address</FieldLabel>
              <InputWrap>
                <InputIcon><Mail size={15} strokeWidth={1.5} /></InputIcon>
                <StyledInput type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
              </InputWrap>
            </FieldWrap>

            {/* Grade — students only */}
            {role === 'student' && (
              <FieldWrap>
                <FieldLabel>Grade</FieldLabel>
                <InputWrap>
                  <InputIcon><GraduationCap size={15} strokeWidth={1.5} /></InputIcon>
                  <StyledSelect value={form.grade} onChange={set('grade')} required>
                    <option value="">Select your grade</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </StyledSelect>
                </InputWrap>
              </FieldWrap>
            )}

            {/* Password */}
            <FieldWrap>
              <FieldLabel>Password</FieldLabel>
              <InputWrap>
                <InputIcon><Lock size={15} strokeWidth={1.5} /></InputIcon>
                <StyledInput
                  type={showPw ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={form.password} onChange={set('password')}
                  style={{ paddingRight: 44 }} required
                />
                <EyeBtn type="button" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </EyeBtn>
              </InputWrap>
            </FieldWrap>

            {/* Confirm password */}
            <FieldWrap>
              <FieldLabel>Confirm Password</FieldLabel>
              <InputWrap>
                <InputIcon><Lock size={15} strokeWidth={1.5} /></InputIcon>
                <StyledInput
                  type={showCPw ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={set('confirmPassword')}
                  style={{ paddingRight: 44 }} required
                />
                <EyeBtn type="button" onClick={() => setShowCPw(v => !v)}>
                  {showCPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </EyeBtn>
              </InputWrap>
            </FieldWrap>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.24)', fontFamily: F.body, fontSize: 13, color: 'rgba(252,165,165,0.95)' }}
              >
                <Shield size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            <SubmitBtn
              type="submit" disabled={loading}
              whileHover={loading ? {} : { scale: 1.02, boxShadow: '0 8px 32px rgba(37,99,235,0.55)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ marginTop: 4 }}
            >
              {loading ? <Spinner /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </SubmitBtn>
          </form>

          <SwitchRow>
            Already have an account?{' '}
            <Link href="/student-portal">Sign in →</Link>
          </SwitchRow>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, fontFamily: F.body, fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
            <Lock size={11} strokeWidth={1.5} />
            Secured with 256-bit SSL encryption
          </div>
        </Card>

        <p style={{ textAlign: 'center', fontFamily: F.body, fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 20 }}>
          © {new Date().getFullYear()} Sidelile High School · All rights reserved.
        </p>
      </Wrap>
    </Page>
  );
}
