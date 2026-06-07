'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink, Facebook, Instagram, Twitter } from 'lucide-react';
import { C, F, R, E } from '@/styles/theme';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const itemIn = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: E.smooth } },
};

const Section = styled.section`
  background: ${C.navy};
  padding: clamp(80px, 10vw, 140px) clamp(24px, 8vw, 120px);
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 56px;
  align-items: start;
  margin-top: 56px;

  @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 40px; }
`;

const GoldLabel = styled.div`
  font-family: ${F.body};
  font-size: 11px;
  font-weight: 600;
  color: ${C.gold};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const ContactItem = styled(motion.div)`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px;
  border-radius: ${R.md};
  background: rgba(255,255,255,0.04);
  border: 1px solid ${C.border};
`;

const MapPanel = styled(motion.div)`
  position: relative;
  border-radius: ${R.lg};
  overflow: hidden;
  min-height: 420px;
  background: ${C.navyDark};
`;

const CONTACT_ITEMS = [
  { icon: MapPin, label: 'Physical Address', value: '1253 Sidiya Highway, Umkomaas, KwaZulu-Natal, 4170', href: 'https://maps.google.com/?q=1253+Sidiya+Highway+Umkomaas' },
  { icon: MapPin, label: 'Postal Address',   value: 'Private Bag X1012, Umkomaas, 4170',                  href: null },
  { icon: Phone,  label: 'Phone',            value: '+27 39 970 7393',                                     href: 'tel:+27399707393' },
  { icon: Mail,   label: 'Email',            value: 'info@sidelile.edu.za',                                href: 'mailto:info@sidelile.edu.za' },
  { icon: Clock,  label: 'Office Hours',     value: 'Mon – Fri: 07:30 – 16:00',                           href: null },
];

const SOCIAL = [
  { icon: Facebook,  label: 'Facebook',  href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter,   label: 'Twitter',   href: '#' },
];

export default function ContactSection() {
  return (
    <Section id="contact">
      <GoldLabel>Get In Touch</GoldLabel>
      <h2 style={{ fontFamily: F.heading, fontSize: 'clamp(32px, 4vw, 60px)', fontWeight: 700, color: C.white, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
        Find Us in<br />
        <span style={{ color: C.gold, fontWeight: 300, fontStyle: 'italic' }}>KwaZulu-Natal.</span>
      </h2>

      <TwoCol>
        {/* Contact items */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {CONTACT_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <ContactItem key={item.label} variants={itemIn}>
                <div style={{ width: 36, height: 36, borderRadius: R.full, background: `rgba(201,168,76,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 16, height: 16, color: C.gold }} />
                </div>
                <div>
                  <p style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', margin: '0 0 3px' }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ fontFamily: F.body, fontSize: 13.5, color: C.mutedOnNavy, textDecoration: 'none', transition: 'color 0.2s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.mutedOnNavy)}
                    >{item.value}</a>
                  ) : (
                    <p style={{ fontFamily: F.body, fontSize: 13.5, color: C.mutedOnNavy, margin: 0 }}>{item.value}</p>
                  )}
                </div>
              </ContactItem>
            );
          })}

          {/* Social row */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                style={{ width: 38, height: 38, borderRadius: R.full, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.gold; el.style.borderColor = C.gold; el.style.color = C.navy; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                <Icon style={{ width: 15, height: 15 }} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Map panel */}
        <MapPanel
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: E.smooth }}
        >
          {/* Grid lines */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)`, backgroundSize: '44px 44px', opacity: 0.06 }} />
          {/* Roads */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
            <div style={{ position: 'absolute', top: '48%', left: 0, right: 0, height: 2, background: C.gold }} />
            <div style={{ position: 'absolute', left: '38%', top: 0, bottom: 0, width: 2, background: C.gold }} />
          </div>
          {/* Pin */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: R.full, background: C.gold, border: `4px solid ${C.navyDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 40px rgba(201,168,76,0.4)` }}>
                <MapPin style={{ width: 24, height: 24, color: C.navy }} />
              </div>
              <div style={{ marginTop: 10, padding: '6px 16px', borderRadius: R.md, background: 'rgba(10,30,46,0.92)', border: `1px solid rgba(201,168,76,0.25)`, fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.white, whiteSpace: 'nowrap' }}>
                Sidelile High School
              </div>
            </motion.div>
          </div>
          {/* Directions btn */}
          <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <a href="https://maps.google.com/?q=1253+Sidiya+Highway+Umkomaas" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: R.md, background: C.gold, color: C.navy, fontFamily: F.body, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              <ExternalLink style={{ width: 13, height: 13 }} /> Get Directions
            </a>
          </div>
        </MapPanel>
      </TwoCol>
    </Section>
  );
}
