'use client';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { V, F, R, HARD } from '@/styles/theme';

const FooterEl = styled.footer`
  background: #0a1e2e;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const Inner = styled.div`
  padding: 80px clamp(24px, 8vw, 120px) 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 48px;

  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const ColLabel = styled.div`
  font-family: ${F.body};
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.38);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const FooterLink = styled(Link)`
  display: block;
  font-family: ${F.body};
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.48);
  text-decoration: none;
  padding: 6px 0;
  transition: color 0.2s ease;

  &:hover { color: rgba(255, 255, 255, 0.90); }
`;

const ContactLine = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
  font-family: ${F.body};
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.44);
  line-height: 1.5;
`;

const SocialBtn = styled.a`
  width: 36px;
  height: 36px;
  border-radius: ${R.full};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.38);
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.10);
    border-color: rgba(255, 255, 255, 0.30);
    color: rgba(255, 255, 255, 0.90);
  }
`;

const EnrollBtn = styled(Link)`
  display: block;
  margin-top: 24px;
  padding: 13px 24px;
  border-radius: ${R.full};
  background: #FFFFFF;
  color: #0C0C0C;
  font-family: ${F.body};
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.85; }
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 12px;
`;

const BottomText = styled.span`
  font-family: ${F.body};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.28);
`;

const BottomLink = styled.a`
  font-family: ${F.body};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.28);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover { color: rgba(255, 255, 255, 0.70); }
`;

export default function Footer() {
  return (
    <FooterEl>
      <Inner>
        <Grid>
          {/* Col 1 — Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <Image
                src="/images/sidelile-badge.png"
                alt="Sidelile High School Badge"
                width={56}
                height={56}
                style={{ objectFit: 'contain', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontFamily: F.heading, fontWeight: 800, fontSize: 20, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                  SIDELILE
                </div>
                <div style={{ fontFamily: F.body, fontSize: 10, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.16em', marginTop: 3 }}>
                  HIGH SCHOOL
                </div>
              </div>
            </div>
            <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, maxWidth: 260, marginBottom: 28 }}>
              Shaping tomorrow's leaders in KwaZulu-Natal since 2001.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {([Facebook, Instagram, Twitter] as const).map((Icon, i) => (
                <SocialBtn key={i} href="#" aria-label="Social">
                  <Icon style={{ width: 15, height: 15 }} />
                </SocialBtn>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <ColLabel>Quick Links</ColLabel>
            {[
              { label: 'Home',        href: '/'           },
              { label: 'Experience',  href: '#experience' },
              { label: 'Academics',   href: '#academics'  },
              { label: 'News',        href: '#news'       },
              { label: 'Teachers',    href: '#teachers'   },
              { label: 'Portals',     href: '#portals'    },
              { label: 'FAQ',         href: '#faq'        },
            ].map(({ label, href }) => (
              <FooterLink key={label} href={href}>{label}</FooterLink>
            ))}
          </div>

          {/* Col 3 — Portals */}
          <div>
            <ColLabel>Portals</ColLabel>
            {[
              { label: 'Student Portal', href: '/student-portal' },
              { label: 'Teacher Portal', href: '/teacher-portal' },
              { label: 'Parent Portal',  href: '/parent-portal'  },
              { label: 'Apply Online',   href: '/apply'          },
            ].map(({ label, href }) => (
              <FooterLink key={label} href={href}>{label}</FooterLink>
            ))}
          </div>

          {/* Col 4 — Contact */}
          <div>
            <ColLabel>Contact</ColLabel>
            <ContactLine>
              <MapPin style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.55)', flexShrink: 0, marginTop: 2 }} />
              KwaZulu-Natal, South Africa
            </ContactLine>
            <ContactLine>
              <Phone style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.55)', flexShrink: 0, marginTop: 2 }} />
              +27 39 970 7393
            </ContactLine>
            <ContactLine>
              <Mail style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.55)', flexShrink: 0, marginTop: 2 }} />
              info@sidelile.edu.za
            </ContactLine>
            <ContactLine>
              <Clock style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.55)', flexShrink: 0, marginTop: 2 }} />
              Mon–Fri: 07:30–15:30
            </ContactLine>
            <EnrollBtn href="/apply">Enroll Today</EnrollBtn>
          </div>
        </Grid>

        <BottomBar>
          <BottomText>© 2025 Sidelile High School. All rights reserved.</BottomText>
          <BottomLink href="#">Proudly built by Visionary Beyond Imagination</BottomLink>
        </BottomBar>
      </Inner>
    </FooterEl>
  );
}
