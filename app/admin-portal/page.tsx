'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';

const BG = '#F6F7F4'; const SURFACE = '#FFFFFF'; const S2 = '#F6F7F4';
const GOLD = '#1e3a8a'; const GOLD_DIM = 'rgba(30,58,138,0.06)'; const GOLD_B = 'rgba(30,58,138,0.22)';
const BORDER = 'rgba(10,30,46,0.12)'; const TEXT = '#0a1e2e'; const MUTED = 'rgba(10,30,46,0.55)'; const FAINT = 'rgba(10,30,46,0.38)';
const RED = '#DC2626';
const FH = "'Roboto Condensed', 'Arial Narrow', sans-serif"; const FB = "'Inter', sans-serif";

export default function AdminPortalPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError('Please enter your username and password.'); return; }
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      identifier: username,
      password,
      role: 'admin',
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials. Please check your admin ID / email and password.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FB, padding: 24 }}>
      {/* Background pattern */}
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse at 60% 20%, rgba(30,58,138,0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 8, background: '#0a1e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: FH }}>A</div>
          <h1 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>SIDELILE</h1>
          <p style={{ fontSize: 11, color: MUTED, letterSpacing: '0.14em', marginTop: 4, textTransform: 'uppercase' }}>Admin Portal</p>
        </div>

        {/* Card */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 32, boxShadow: '0 24px 64px rgba(10,30,46,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <Shield size={14} style={{ color: GOLD }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: GOLD }}>Secure Admin Access</span>
          </div>

          {/* Username */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Username</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: S2, border: `1px solid ${error ? 'rgba(239,68,68,0.40)' : BORDER}`, borderRadius: 10, padding: '10px 14px' }}>
              <User size={14} style={{ color: FAINT, flexShrink: 0 }} />
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="admin"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: TEXT, fontFamily: FB }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Password</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: S2, border: `1px solid ${error ? 'rgba(239,68,68,0.40)' : BORDER}`, borderRadius: 10, padding: '10px 14px' }}>
              <Lock size={14} style={{ color: FAINT, flexShrink: 0 }} />
              <input
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: TEXT, fontFamily: FB }}
              />
              <button onClick={() => setShowPassword(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex' }}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: 14, fontSize: 12, color: RED, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '8px 12px' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? 'rgba(30,58,138,0.55)' : GOLD, border: 'none', borderRadius: 6, color: '#fff', fontSize: 14.5, fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: FH, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? (
              <>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', animation: 'spin 0.6s linear infinite' }} />
                Signing in…
              </>
            ) : 'Sign In to Admin Portal'}
          </button>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <a href="/" style={{ fontSize: 12, color: MUTED, textDecoration: 'none' }}>← Back to homepage</a>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: FAINT }}>
          Admin ID: <span style={{ color: GOLD }}>ADM001</span> &nbsp;·&nbsp; Password: <span style={{ color: GOLD }}>admin123</span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
