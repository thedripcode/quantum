'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DEMO_USERS = [
  { email: 'admin@okudingayo.co.za',   password: 'admin123',   role: 'Admin / Owner',        redirect: '/okudingayo/dashboard' },
  { email: 'ops@okudingayo.co.za',     password: 'ops123',     role: 'Operations Manager',   redirect: '/okudingayo/dashboard' },
  { email: 'tech@okudingayo.co.za',    password: 'tech123',    role: 'Field Technician',     redirect: '/okudingayo/dashboard' },
  { email: 'finance@okudingayo.co.za', password: 'finance123', role: 'Accountant',           redirect: '/okudingayo/dashboard' },
  { email: 'customer@example.com',     password: 'cust123',    role: 'Customer',             redirect: '/okudingayo/dashboard' },
];

export default function OkuLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('oku_user', JSON.stringify({ email: user.email, role: user.role }));
        router.push(user.redirect);
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  }

  function fillDemo(user: typeof DEMO_USERS[0]) {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f0f4f8' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(135deg, #1e5aa8 0%, #2a6bc6 50%, #4a90e2 100%)',
        padding: 60, flexDirection: 'column', justifyContent: 'space-between',
        color: 'white',
      }} className="oku-login-left">
        <Link href="/okudingayo" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 20, color: 'white',
          }}>O</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'white' }}>Okudingayo Trading</div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>Enterprise Management Hub</div>
          </div>
        </Link>

        <div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, margin: '0 0 20px' }}>
            Run your plumbing business smarter.
          </h1>
          <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.7, marginBottom: 40 }}>
            Manage jobs, dispatch technicians, track inventory, and collect payments — all from one platform built for KwaZulu-Natal.
          </p>
          {[
            { icon: '⚡', text: '30-minute emergency response system' },
            { icon: '📊', text: 'Live KPI dashboard and analytics' },
            { icon: '🔒', text: 'POPIA-compliant and fully encrypted' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{
                width: 36, height: 36, background: 'rgba(245,232,94,0.2)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{icon}</span>
              <span style={{ fontSize: 15, opacity: 0.9 }}>{text}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, opacity: 0.6 }}>© 2026 Okudingayo Trading Enterprise</p>
      </div>

      {/* Right panel — login form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <Link href="/okudingayo" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{
              width: 40, height: 40, background: 'linear-gradient(135deg, #1e5aa8, #4a90e2)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 18, color: 'white',
            }}>O</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Okudingayo Trading</div>
              <div style={{ fontSize: 12, color: '#888' }}>Management Hub</div>
            </div>
          </Link>

          <div style={{ background: 'white', borderRadius: 20, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: '#666', margin: '0 0 32px' }}>Sign in to your management hub account</p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@okudingayo.co.za"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10, fontSize: 15,
                    border: '1.5px solid #e5e7eb', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2a6bc6'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '12px 44px 12px 16px', borderRadius: 10, fontSize: 15,
                      border: '1.5px solid #e5e7eb', outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#2a6bc6'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#999',
                  }}>{showPass ? '🙈' : '👁'}</button>
                </div>
              </div>

              {error && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
                  padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#dc2626',
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e5aa8, #4a90e2)',
                color: 'white', fontWeight: 700, fontSize: 16, transition: 'opacity 0.2s',
              }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials */}
            <div style={{ marginTop: 28, padding: '20px', background: '#f8fafc', borderRadius: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Demo Accounts — click to fill
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEMO_USERS.map(u => (
                  <button key={u.email} onClick={() => fillDemo(u)} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
                    background: 'white', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <span style={{ fontSize: 12, color: '#2a6bc6', fontWeight: 600 }}>{u.role}</span>
                    <span style={{ fontSize: 11, color: '#999' }}>{u.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .oku-login-left { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
