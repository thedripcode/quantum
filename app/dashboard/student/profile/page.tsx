'use client';

import { useState } from 'react';
import { Edit2, Save, X, Camera, User, BookOpen, Heart, Phone } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useStudentData } from '@/lib/useStudentData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const F_HEADING = "'Bricolage Grotesque', sans-serif"; const F_BODY = "'Inter', sans-serif";

function InfoRow({ label, value, editable, onChange }: { label: string; value: string; editable: boolean; onChange?: (v: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
      <span style={{ fontSize: 12, color: MUTED, fontWeight: 500, alignSelf: 'center' }}>{label}</span>
      {editable && onChange ? (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 10px', color: TEXT, fontSize: 13, outline: 'none', fontFamily: F_BODY, transition: 'border-color .15s' }}
          onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD_B; }}
          onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
        />
      ) : (
        <span style={{ fontSize: 13, color: TEXT }}>{value || '—'}</span>
      )}
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
          {icon}
        </div>
        <span style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, letterSpacing: '-0.01em' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data: studentData } = useStudentData();
  const SUBJECTS = studentData.subjects;

  const fullName = session?.user?.name ?? '…';
  const portalId = (session?.user as any)?.portalId ?? '—';
  const grade    = (session?.user as any)?.grade ?? '—';
  const initials = fullName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState({
    phone: '',
    email: '',
    address: '',
    homeLanguage: '',
  });

  // Fill email once session loads
  const email = data.email || session?.user?.email || '';

  const set = (k: keyof typeof data) => (v: string) => setData(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%', maxWidth: 800 }}>
      {/* Profile header */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '28px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD} 0%, #a07830 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#000', border: `3px solid ${GOLD}`, boxShadow: `0 0 20px rgba(201,168,76,0.25)` }}>
            {initials}
          </div>
          <button style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: GOLD, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={12} style={{ color: '#000' }} />
          </button>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: F_HEADING, fontSize: 24, fontWeight: 800, color: TEXT, margin: '0 0 4px', letterSpacing: '-0.03em' }}>
            {fullName}
          </h2>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: MUTED }}>{grade}</span>
            <span style={{ fontSize: 13, color: MUTED }}>·</span>
            <span style={{ fontSize: 13, color: MUTED }}>{portalId}</span>
          </div>
        </div>

        {/* Edit button */}
        <div style={{ flexShrink: 0, display: 'flex', gap: 8 }}>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, cursor: 'pointer', color: MUTED, fontSize: 12, fontWeight: 600 }}>
                <X size={13} /> Cancel
              </button>
              <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 9, cursor: 'pointer', color: GOLD, fontSize: 12, fontWeight: 600 }}>
                <Save size={13} /> Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 9, cursor: 'pointer', color: GOLD, fontSize: 12, fontWeight: 600 }}>
              <Edit2 size={13} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {saved && (
        <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, marginBottom: 16, fontSize: 13, color: '#10B981', display: 'flex', alignItems: 'center', gap: 8 }}>
          ✅ Profile changes saved successfully.
        </div>
      )}

      {/* Personal Details */}
      <Section icon={<User size={14} />} title="Personal Details">
        <InfoRow label="Full Name" value={fullName} editable={false} />
        <InfoRow label="Home Language" value={data.homeLanguage} editable={editing} onChange={set('homeLanguage')} />
        <InfoRow label="Phone" value={data.phone} editable={editing} onChange={set('phone')} />
        <InfoRow label="Email" value={email} editable={editing} onChange={set('email')} />
        <InfoRow label="Address" value={data.address} editable={editing} onChange={set('address')} />
      </Section>

      {/* Academic Details */}
      <Section icon={<BookOpen size={14} />} title="Academic Details">
        <InfoRow label="Student Number" value={portalId} editable={false} />
        <InfoRow label="Grade" value={grade} editable={false} />
        <InfoRow label="Subjects" value={SUBJECTS.map(s => s.short).join(', ')} editable={false} />
      </Section>

      {/* Parent/Guardian — captured during enrolment, coming to profiles soon */}
      <Section icon={<Heart size={14} />} title="Parent / Guardian">
        <InfoRow label="Name" value="" editable={false} />
        <InfoRow label="Cell Phone" value="" editable={false} />
        <InfoRow label="Email" value="" editable={false} />
      </Section>

      {/* Emergency Contact */}
      <Section icon={<Phone size={14} />} title="Emergency Contact">
        <InfoRow label="Name" value="" editable={false} />
        <InfoRow label="Phone" value="" editable={false} />
      </Section>
    </div>
  );
}
