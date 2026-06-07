'use client';

import { CheckCircle2, Phone, Mail, Clock } from 'lucide-react';
import { F, R } from '@/styles/theme';

const BENEFITS = [
  '95% matric pass rate — Class of 2024',
  'World-class science labs and computer centre',
  'Dedicated learner support and counselling',
  '24+ sports codes and extracurricular activities',
  'Experienced, passionate, and qualified teachers',
  'Strong parent–school community partnership',
];

export default function ApplySidebar() {
  return (
    <div style={{ position: 'sticky', top: 112, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Why Choose Sidelile */}
      <div style={{
        borderRadius: 20,
        padding: '28px 24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}>
        <h2 style={{
          fontFamily: F.heading, fontWeight: 700, fontSize: 15,
          marginBottom: 20, color: 'var(--text)', letterSpacing: '-0.01em',
          margin: '0 0 20px',
        }}>
          Why Choose Sidelile?
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BENEFITS.map(b => (
            <li key={b} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              fontFamily: F.body, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5,
            }}>
              <CheckCircle2 style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1, color: 'var(--text)' }} strokeWidth={1.5} />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Need Help */}
      <div style={{
        borderRadius: 20,
        padding: '28px 24px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{
          fontFamily: F.heading, fontWeight: 700, fontSize: 14,
          color: 'var(--text)', margin: '0 0 8px',
        }}>
          Need Help?
        </h3>
        <p style={{ fontFamily: F.body, fontSize: 13, color: 'var(--text-muted)', margin: '0 0 18px', lineHeight: 1.6 }}>
          Contact our admissions office for assistance with your application.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href="tel:+27399707393"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: F.body, fontSize: 13, fontWeight: 500,
              color: 'var(--text)', textDecoration: 'none', opacity: 1,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.60')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <Phone style={{ width: 13, height: 13 }} strokeWidth={1.5} />
            +27 39 970 7393
          </a>
          <a
            href="mailto:admissions@sidelile.edu.za"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: F.body, fontSize: 13, fontWeight: 500,
              color: 'var(--text)', textDecoration: 'none', opacity: 1,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.60')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <Mail style={{ width: 13, height: 13 }} strokeWidth={1.5} />
            admissions@sidelile.edu.za
          </a>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.body, fontSize: 12, color: 'var(--text-faint)' }}>
            <Clock style={{ width: 13, height: 13 }} strokeWidth={1.5} />
            Mon–Fri: 07:30–15:30
          </span>
        </div>
      </div>

    </div>
  );
}
