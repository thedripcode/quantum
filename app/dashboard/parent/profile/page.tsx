'use client';

import { useSession } from 'next-auth/react';
import { User, Link as LinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const BG = '#0C0C0C'; const SURFACE = '#161616';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)';
const F_H = "'Bricolage Grotesque', sans-serif"; const F_B = "'Inter', sans-serif";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: TEXT }}>{value || '—'}</span>
    </div>
  );
}

export default function ParentProfilePage() {
  const { data: session } = useSession();
  const [student, setStudent] = useState<{ name: string; grade: string; stream: string; portalId: string } | null>(null);

  useEffect(() => {
    fetch('/api/parent/child')
      .then(r => r.json())
      .then(d => setStudent(d.student ?? null));
  }, []);

  const name    = session?.user?.name ?? '…';
  const email   = session?.user?.email ?? '—';
  const portalId = (session?.user as any)?.portalId ?? '—';
  const initials = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ padding: '28px 24px', fontFamily: F_B, background: BG, minHeight: '100%', maxWidth: 700 }}>
      <h1 style={{ fontFamily: F_H, fontSize: 24, fontWeight: 800, color: TEXT, margin: '0 0 24px', letterSpacing: '-0.03em' }}>My Profile</h1>

      {/* Header card */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: GOLD_DIM, border: `2px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: GOLD, flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontFamily: F_H, fontSize: 20, fontWeight: 700, color: TEXT }}>{name}</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{email}</div>
          <div style={{ marginTop: 8, padding: '4px 10px', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 6, display: 'inline-block', fontSize: 11, color: GOLD, fontWeight: 600 }}>
            {portalId}
          </div>
        </div>
      </div>

      {/* Account details */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
            <User size={13} />
          </div>
          <span style={{ fontFamily: F_H, fontSize: 14, fontWeight: 600, color: TEXT }}>Account Details</span>
        </div>
        <Row label="Full Name" value={name} />
        <Row label="Email" value={email} />
        <Row label="Portal ID" value={portalId} />
        <Row label="Role" value="Parent / Guardian" />
      </div>

      {/* Linked student */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
            <LinkIcon size={13} />
          </div>
          <span style={{ fontFamily: F_H, fontSize: 14, fontWeight: 600, color: TEXT }}>Linked Student</span>
        </div>
        {student ? (
          <>
            <Row label="Name" value={student.name} />
            <Row label="Portal ID" value={student.portalId} />
            <Row label="Grade" value={`${student.grade}${student.stream ? ` ${student.stream}` : ''}`} />
          </>
        ) : (
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
            Your account is not yet linked to a student. Contact the school office with your Portal ID (<strong style={{ color: TEXT }}>{portalId}</strong>) to get linked.
          </p>
        )}
      </div>
    </div>
  );
}
