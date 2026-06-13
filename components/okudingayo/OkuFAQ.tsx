'use client';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  { q: 'Is the system secure and POPIA compliant?', a: 'Yes — all data is fully encrypted and hosted on South African servers with automated daily backups and 30-day retention, fully aligned to POPIA requirements.' },
  { q: 'Do you offer free onboarding and training?', a: 'Absolutely. Comprehensive onboarding, staff training, and data migration are all included at no extra cost. We won\'t go live until your team is fully comfortable.' },
  { q: 'What payment methods does the system support?', a: 'Cash, card, EFT, PayFast, and SnapScan are all built in. Maintenance contracts can use recurring billing with payment plan tracking.' },
  { q: 'Does it work in poor-connectivity areas?', a: 'The mobile technician app is fully offline-capable. Job cards, checklists, photos, and digital signatures sync automatically when back online.' },
  { q: 'Can I connect my existing accounting software?', a: 'Yes — native integrations with Xero and Sage are included, along with WhatsApp Business API, Google Maps, and a REST API for custom connections.' },
  { q: 'Do you offer financing or flexible plans?', a: 'Yes. We offer flexible subscription plans and financing for qualifying businesses. Contact us to discuss a plan matched to your company size.' },
];

export default function OkuFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ background: 'white', padding: '100px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 80, flexWrap: 'wrap' }}>

        {/* Left */}
        <div style={{ flex: '0 0 340px', minWidth: 240 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1e4db3', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            FAQ
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 20px', lineHeight: 1.15 }}>
            Your questions,<br />answered.
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, marginBottom: 36 }}>
            Answers to the most common questions our clients have. Can't find what you're looking for?
          </p>
          <Link href="/okudingayo/login" style={{
            display: 'inline-block',
            background: '#f5e85e', color: '#1a1a1a',
            padding: '13px 28px', borderRadius: 100,
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(245,232,94,0.4)',
          }}>
            Contact Us
          </Link>
        </div>

        {/* Right — accordion */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              border: '1.5px solid',
              borderColor: open === i ? '#1e4db3' : '#e2e8f0',
              borderRadius: 14,
              marginBottom: 12,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: '100%', padding: '18px 24px',
                background: open === i ? '#f0f5ff' : 'white',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                gap: 16, transition: 'background 0.2s',
              }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: open === i ? '#1e4db3' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: open === i ? 'white' : '#64748b',
                  fontSize: 18, flexShrink: 0, fontWeight: 300,
                  transition: 'background 0.2s, transform 0.2s',
                  transform: open === i ? 'rotate(45deg)' : 'none',
                }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 24px 20px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
