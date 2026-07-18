'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const BG = '#0a1e2e';
const BORDER = 'rgba(255,255,255,0.12)';
const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.55)'; const FAINT = 'rgba(255,255,255,0.30)';
const GOLD = '#C9A84C'; const GOLD_B = 'rgba(201,168,76,0.30)';
const RED = '#EF4444'; const GREEN = '#10B981';
const FH = "'Bricolage Grotesque', sans-serif"; const FB = "'Inter', sans-serif";

const inp: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  background: 'rgba(255,255,255,0.07)', border: `1px solid ${BORDER}`,
  color: TEXT, fontFamily: FB, fontSize: 14, outline: 'none', boxSizing: 'border-box',
};

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [busy, setBusy]         = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');
  const [info, setInfo]         = useState('');

  const isResetStep = !!token;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    setBusy(true);

    const body = isResetStep
      ? { token, password }
      : { email };

    const res = await fetch('/api/reset-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }

    if (isResetStep) {
      setDone(true);
      setTimeout(() => router.push('/student-portal'), 3000);
    } else {
      setInfo(data.message ?? 'Check with your school admin for the reset link.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: FB }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Back */}
        <Link href="/student-portal" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: FAINT, textDecoration: 'none', marginBottom: 28 }}>
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${BORDER}`, borderRadius: 24, padding: '40px 36px', backdropFilter: 'blur(24px)' }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle2 size={40} style={{ color: GREEN, margin: '0 auto 16px' }} />
              <h2 style={{ fontFamily: FH, fontSize: 20, fontWeight: 700, color: TEXT, margin: '0 0 8px' }}>Password updated!</h2>
              <p style={{ fontSize: 13, color: MUTED }}>Redirecting you to login…</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                {isResetStep ? 'Set new password' : 'Reset password'}
              </h2>
              <p style={{ fontSize: 13, color: MUTED, margin: '0 0 28px', lineHeight: 1.6 }}>
                {isResetStep
                  ? 'Enter your new password below.'
                  : 'Enter your school email address. The admin will share a reset link with you.'}
              </p>

              <form onSubmit={submit}>
                {!isResetStep ? (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Email Address
                    </label>
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@sidelile.edu.za"
                      style={inp}
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: 16, position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw ? 'text' : 'password'} required minLength={6}
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        style={{ ...inp, paddingRight: 44 }}
                      />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex' }}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', fontSize: 13, color: RED }}>
                    {error}
                  </div>
                )}
                {info && (
                  <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.20)', fontSize: 13, color: GREEN, lineHeight: 1.6 }}>
                    {info}
                  </div>
                )}

                <button type="submit" disabled={busy} style={{ width: '100%', padding: '13px', borderRadius: 12, background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 14, fontWeight: 800, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                  {busy ? 'Please wait…' : isResetStep ? 'Update Password' : 'Request Reset'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
