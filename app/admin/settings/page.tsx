'use client';

import { useState } from 'react';
import { CheckCircle2, School, Clock, Bell, Shield, Save } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

function Section({ title, icon: Icon, color = GOLD, children }: { title: string; icon: React.ElementType; color?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: TEXT }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function FieldRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
      <div style={{ flex: 1, marginRight: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, width = 220 }: { value: string; onChange: (v: string) => void; placeholder?: string; width?: number }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '8px 13px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none', boxSizing: 'border-box' as const }} />
  );
}

function Toggle({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) {
  return (
    <div onClick={() => setOn(!on)} style={{ width: 42, height: 24, borderRadius: 12, background: on ? GOLD : S3, border: `1px solid ${on ? GOLD_B : BORDER}`, position: 'relative', cursor: 'pointer', transition: 'all .2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 4, left: on ? 20 : 3, width: 14, height: 14, borderRadius: '50%', background: on ? '#000' : MUTED, transition: 'left .2s' }} />
    </div>
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '8px 13px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none', cursor: 'pointer' }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ConfirmInput({ onConfirm, onCancel, word }: { onConfirm: () => void; onCancel: () => void; word: string }) {
  const [val, setVal] = useState('');
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Type <strong style={{ color: RED }}>{word}</strong> to confirm:</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={val} onChange={e => setVal(e.target.value)} placeholder={`Type ${word}…`}
          style={{ flex: 1, background: S3, border: '1px solid rgba(239,68,68,0.30)', borderRadius: 9, padding: '8px 12px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none' }} />
        <button onClick={onCancel} style={{ padding: '8px 14px', background: S3, border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, fontSize: 12, cursor: 'pointer', fontFamily: FB }}>Cancel</button>
        <button onClick={() => { if (val === word) onConfirm(); }}
          style={{ padding: '8px 14px', background: val === word ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.30)', borderRadius: 9, color: val === word ? RED : FAINT, fontSize: 12, fontWeight: 700, cursor: val === word ? 'pointer' : 'default', fontFamily: FB }}>
          Confirm
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [schoolName, setSchoolName]     = useState('Sidelile High School');
  const [principal, setPrincipal]       = useState('Mr. T. Mthembu');
  const [address, setAddress]           = useState('Sidelile, KwaDukuza, KwaZulu-Natal, 4450');
  const [phone, setPhone]               = useState('+27 32 551 0000');
  const [email, setEmail]               = useState('admin@sidelile.edu.za');

  const [currentTerm, setCurrentTerm]   = useState('Term 3');
  const [currentYear, setCurrentYear]   = useState('2025');
  const [passmark, setPassmark]         = useState('60');

  const [gradeCapacity, setGradeCapacity] = useState<Record<string, string>>({ '8': '40', '9': '40', '10': '38', '11': '35', '12': '32' });

  const [emailNotifs, setEmailNotifs]   = useState(true);
  const [smsNotifs, setSmsNotifs]       = useState(false);
  const [parentNotifs, setParentNotifs] = useState(true);
  const [twoFA, setTwoFA]               = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const [saved, setSaved]               = useState(false);
  const [showPromote, setShowPromote]   = useState(false);
  const [promoted, setPromoted]         = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%', maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Settings</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Manage school configuration and preferences</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: GREEN }}><CheckCircle2 size={13} /> Saved</div>}
          <button onClick={handleSave} style={{ background: GOLD, color: '#000', borderRadius: 9999, padding: '9px 22px', fontWeight: 700, fontFamily: FB, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Save size={13} /> Save Changes
          </button>
        </div>
      </div>

      {/* School Info */}
      <Section title="School Information" icon={School}>
        <FieldRow label="School Name">
          <TextInput value={schoolName} onChange={setSchoolName} width={280} />
        </FieldRow>
        <FieldRow label="Principal">
          <TextInput value={principal} onChange={setPrincipal} />
        </FieldRow>
        <FieldRow label="Email Address">
          <TextInput value={email} onChange={setEmail} />
        </FieldRow>
        <FieldRow label="Phone Number">
          <TextInput value={phone} onChange={setPhone} />
        </FieldRow>
        <FieldRow label="Address">
          <TextInput value={address} onChange={setAddress} width={300} />
        </FieldRow>
      </Section>

      {/* Academic Config */}
      <Section title="Academic Configuration" icon={Clock} color={AMBER}>
        <FieldRow label="Current Term">
          <SelectInput value={currentTerm} onChange={setCurrentTerm} options={['Term 1', 'Term 2', 'Term 3', 'Term 4']} />
        </FieldRow>
        <FieldRow label="Academic Year">
          <SelectInput value={currentYear} onChange={setCurrentYear} options={['2024', '2025', '2026']} />
        </FieldRow>
        <FieldRow label="Promotion Pass Mark" desc="Minimum % required to pass a grade">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TextInput value={passmark} onChange={setPassmark} width={80} />
            <span style={{ fontSize: 13, color: MUTED }}>%</span>
          </div>
        </FieldRow>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Class Capacity Per Grade</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 8 }}>
            {(['8', '9', '10', '11', '12'] as const).map(g => (
              <div key={g} style={{ background: S2, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: FAINT, marginBottom: 6 }}>Grade {g}</div>
                <input value={gradeCapacity[g] ?? '40'} onChange={e => setGradeCapacity(prev => ({ ...prev, [g]: e.target.value }))}
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 18, fontWeight: 700, fontFamily: FH, color: GOLD, textAlign: 'center' }} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell} color={GREEN}>
        <FieldRow label="Email Notifications" desc="Send reports and alerts via email">
          <Toggle on={emailNotifs} setOn={setEmailNotifs} />
        </FieldRow>
        <FieldRow label="SMS Notifications" desc="Send SMS alerts to parents and teachers">
          <Toggle on={smsNotifs} setOn={setSmsNotifs} />
        </FieldRow>
        <FieldRow label="Parent Portal Notifications" desc="Notify parents of student updates">
          <Toggle on={parentNotifs} setOn={setParentNotifs} />
        </FieldRow>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <FieldRow label="Two-Factor Authentication" desc="Require 2FA for admin login">
          <Toggle on={twoFA} setOn={setTwoFA} />
        </FieldRow>
        <FieldRow label="Session Timeout" desc="Auto-logout after inactivity">
          <SelectInput value={sessionTimeout} onChange={setSessionTimeout} options={['15 min', '30 min', '60 min', '2 hours']} />
        </FieldRow>
      </Section>

      {/* Danger Zone */}
      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 16, padding: '20px 24px' }}>
        <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 800, color: RED, marginBottom: 8 }}>⚠️ Promote All Students</div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, marginBottom: 16 }}>
          This action promotes all qualifying students to the next grade based on the pass mark of <strong style={{ color: TEXT }}>{passmark}%</strong>.
          Students who have not met the requirement will be flagged for review. <strong style={{ color: RED }}>This cannot be undone.</strong>
        </div>
        {!showPromote && !promoted && (
          <button onClick={() => setShowPromote(true)} style={{ padding: '9px 20px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.30)', borderRadius: 9999, color: RED, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>
            Run Year-End Promotion
          </button>
        )}
        {showPromote && !promoted && (
          <ConfirmInput word="PROMOTE" onConfirm={() => { setPromoted(true); setShowPromote(false); }} onCancel={() => setShowPromote(false)} />
        )}
        {promoted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: GREEN, fontWeight: 600 }}>
            <CheckCircle2 size={15} /> All qualifying students have been promoted to the next grade.
          </div>
        )}
      </div>
    </div>
  );
}
