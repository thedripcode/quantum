'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Users, School, BookOpen,
  CheckCircle, ChevronLeft, ChevronRight,
  Upload, AlertCircle, ArrowUpRight,
} from 'lucide-react';
import { V, F, R, E } from '@/styles/theme';

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Personal',  subtitle: 'Learner details',       Icon: User     },
  { id: 2, title: 'Guardian',  subtitle: 'Parent / guardian',     Icon: Users    },
  { id: 3, title: 'School',    subtitle: 'Previous school',       Icon: School   },
  { id: 4, title: 'Grade',     subtitle: 'Grade & documents',     Icon: BookOpen },
];

const PROVINCES = ['Limpopo','Gauteng','KwaZulu-Natal','Western Cape','Eastern Cape','Mpumalanga','North West','Free State','Northern Cape'];
const GRADES    = ['Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'];
const YEARS     = ['2026','2027'];
const DOCS      = [
  'Certified copy of latest school report',
  'Certified copy of birth certificate / SA ID',
  'Proof of residence (utility bill)',
  'Transfer letter from previous school (if applicable)',
];

// ─── Styled ───────────────────────────────────────────────────────────────────
const Wrap = styled.div`
  width: 100%;
  font-family: ${F.body};
`;

/* ── Step indicator ── */
const StepTrack = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  margin-bottom: 44px;

  /* Full-width connector line behind steps */
  &::before {
    content: '';
    position: absolute;
    top: 18px;
    left: 5%;
    right: 5%;
    height: 1px;
    background: var(--border);
    z-index: 0;
  }
`;

const StepDot = styled.div<{ $state: 'done' | 'active' | 'idle' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  position: relative;
  z-index: 1;
`;

const DotCircle = styled.div<{ $state: 'done' | 'active' | 'idle' }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $state }) =>
    $state === 'done'   ? 'var(--text)' :
    $state === 'active' ? 'var(--border-strong)' :
                          'var(--border)'};
  background: ${({ $state }) =>
    $state === 'done'   ? 'var(--text)' :
    $state === 'active' ? 'var(--accent-subtle)' :
                          'transparent'};
  color: ${({ $state }) =>
    $state === 'done'   ? 'var(--btn-color)' :
    $state === 'active' ? 'var(--text)' :
                          'var(--text-faint)'};
  transition: all 0.3s ease;
`;

const DotLabel = styled.span<{ $state: 'done' | 'active' | 'idle' }>`
  font-family: ${F.body};
  font-size: 11px;
  font-weight: ${({ $state }) => $state === 'active' ? 600 : 400};
  color: ${({ $state }) =>
    $state === 'active' ? 'var(--text)' : 'var(--text-faint)'};
  text-align: center;
  display: none;

  @media (min-width: 480px) { display: block; }
`;

/* ── Field primitives ── */
const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 580px) { grid-template-columns: 1fr; }
`;

const FieldWrap = styled.div<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${({ $full }) => $full ? 'span 2' : 'span 1'};

  @media (max-width: 580px) { grid-column: span 1; }
`;

const Label = styled.label`
  font-family: ${F.body};
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.04em;
`;

const inputBase = `
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-body, sans-serif);
  font-size: 14px;
  font-weight: 300;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;
  box-sizing: border-box;
  -webkit-appearance: none;

  &::placeholder { color: var(--text-faint); }
  &:focus { border-color: var(--border-strong); background: var(--surface-3); }
`;

const Input = styled.input`${inputBase}`;
const Select = styled.select`${inputBase}
  cursor: pointer;
  option { background: var(--surface-2); }
`;

/* ── Step title ── */
const StepTitle = styled.h3`
  font-family: ${F.heading};
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
  margin: 0 0 24px;
`;

/* ── Info notice ── */
const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: ${R.lg};
  background: var(--accent-subtle);
  border: 1px solid var(--border);
  margin-top: 20px;
`;

/* ── Document upload row ── */
const DocRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px dashed var(--border);
  border-radius: ${R.lg};
  transition: border-color 0.2s ease;
  cursor: pointer;

  &:hover { border-color: var(--border-strong); }
`;

const UploadBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.body};
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--surface-3);
  border: 1px solid var(--border);
  border-radius: ${R.full};
  padding: 6px 14px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;

  &:hover { color: var(--text); border-color: var(--border-strong); }
`;

/* ── Nav buttons ── */
const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
`;

const GhostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.body};
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  background: none;
  border: 1px solid var(--border);
  border-radius: ${R.full};
  padding: 10px 20px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled) { color: var(--text); border-color: var(--border-strong); }
  &:disabled { opacity: 0.35; cursor: default; }
`;

const PrimaryBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.heading};
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-color);
  background: var(--btn-bg);
  border: none;
  border-radius: ${R.full};
  padding: 11px 24px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.50; cursor: default; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ApplicationForm() {
  const [step,      setStep]      = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [form,      setForm]      = useState({
    firstName: '', lastName: '', dob: '', gender: '', idNumber: '', email: '', phone: '', address: '', city: '', province: '',
    parentName: '', parentRelation: '', parentPhone: '', parentEmail: '', parentOccupation: '',
    previousSchool: '', previousGrade: '', previousYear: '',
    applyingGrade: '', academicYear: '2026',
  });

  const set = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: E.smooth }}
        style={{ textAlign: 'center', padding: '64px 24px' }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--accent-subtle)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <CheckCircle size={32} strokeWidth={1.5} style={{ color: 'var(--text)' }} />
        </div>
        <h2 style={{ fontFamily: F.heading, fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 12 }}>
          Application Submitted!
        </h2>
        <p style={{ fontFamily: F.body, fontSize: 15, fontWeight: 300, color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 8px', lineHeight: 1.65 }}>
          Thank you, <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{form.firstName}</strong>! Your application for{' '}
          <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{form.applyingGrade}</strong> ({form.academicYear}) has been received.
        </p>
        <p style={{ fontFamily: F.body, fontSize: 14, fontWeight: 300, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.65 }}>
          Our admissions team will contact you at{' '}
          <strong style={{ color: 'var(--text)' }}>{form.parentEmail || form.email}</strong> within 5 working days.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <PrimaryBtn
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => window.location.href = '/'}
          >
            Back to Home <ArrowUpRight size={14} strokeWidth={1.5} />
          </PrimaryBtn>
          <GhostBtn onClick={() => { setSubmitted(false); setStep(1); }}>
            New Application
          </GhostBtn>
        </div>
      </motion.div>
    );
  }

  const state = (id: number) => step > id ? 'done' : step === id ? 'active' : 'idle';

  return (
    <Wrap>
      {/* ── Step indicators ── */}
      <StepTrack>
        {STEPS.map(({ id, title, Icon }) => {
          const s = state(id);
          return (
            <StepDot key={id} $state={s}>
              <DotCircle $state={s}>
                {s === 'done'
                  ? <CheckCircle size={16} strokeWidth={2} />
                  : <Icon size={16} strokeWidth={1.5} />
                }
              </DotCircle>
              <DotLabel $state={s}>{title}</DotLabel>
            </StepDot>
          );
        })}
      </StepTrack>

      {/* ── Step content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28, ease: E.smooth }}
        >

          {/* Step 1 — Personal */}
          {step === 1 && (
            <div>
              <StepTitle>Personal Information</StepTitle>
              <FieldGroup>
                <FieldWrap><Label>First Name *</Label><Input placeholder="e.g. Thabo" value={form.firstName} onChange={e => set('firstName', e.target.value)} /></FieldWrap>
                <FieldWrap><Label>Last Name *</Label><Input placeholder="e.g. Molefe" value={form.lastName} onChange={e => set('lastName', e.target.value)} /></FieldWrap>
                <FieldWrap><Label>Date of Birth *</Label><Input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} /></FieldWrap>
                <FieldWrap>
                  <Label>Gender *</Label>
                  <Select value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option><option>Prefer not to say</option>
                  </Select>
                </FieldWrap>
                <FieldWrap><Label>SA ID Number</Label><Input placeholder="13-digit ID number" value={form.idNumber} onChange={e => set('idNumber', e.target.value)} /></FieldWrap>
                <FieldWrap><Label>Email Address</Label><Input type="email" placeholder="learner@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></FieldWrap>
                <FieldWrap $full><Label>Street Address *</Label><Input placeholder="123 Main Street" value={form.address} onChange={e => set('address', e.target.value)} /></FieldWrap>
                <FieldWrap><Label>City / Town *</Label><Input placeholder="e.g. Umkomaas" value={form.city} onChange={e => set('city', e.target.value)} /></FieldWrap>
                <FieldWrap>
                  <Label>Province *</Label>
                  <Select value={form.province} onChange={e => set('province', e.target.value)}>
                    <option value="">Select province</option>
                    {PROVINCES.map(p => <option key={p}>{p}</option>)}
                  </Select>
                </FieldWrap>
              </FieldGroup>
            </div>
          )}

          {/* Step 2 — Parent */}
          {step === 2 && (
            <div>
              <StepTitle>Parent / Guardian</StepTitle>
              <FieldGroup>
                <FieldWrap $full><Label>Full Name *</Label><Input placeholder="Parent or guardian full name" value={form.parentName} onChange={e => set('parentName', e.target.value)} /></FieldWrap>
                <FieldWrap>
                  <Label>Relationship *</Label>
                  <Select value={form.parentRelation} onChange={e => set('parentRelation', e.target.value)}>
                    <option value="">Select relationship</option>
                    <option>Mother</option><option>Father</option><option>Guardian</option><option>Grandparent</option><option>Other</option>
                  </Select>
                </FieldWrap>
                <FieldWrap><Label>Occupation</Label><Input placeholder="e.g. Nurse" value={form.parentOccupation} onChange={e => set('parentOccupation', e.target.value)} /></FieldWrap>
                <FieldWrap><Label>Phone Number *</Label><Input type="tel" placeholder="+27 XX XXX XXXX" value={form.parentPhone} onChange={e => set('parentPhone', e.target.value)} /></FieldWrap>
                <FieldWrap><Label>Email Address *</Label><Input type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={e => set('parentEmail', e.target.value)} /></FieldWrap>
              </FieldGroup>
            </div>
          )}

          {/* Step 3 — Previous school */}
          {step === 3 && (
            <div>
              <StepTitle>Previous School</StepTitle>
              <FieldGroup>
                <FieldWrap $full><Label>School Name *</Label><Input placeholder="Name of last school attended" value={form.previousSchool} onChange={e => set('previousSchool', e.target.value)} /></FieldWrap>
                <FieldWrap>
                  <Label>Last Grade Completed *</Label>
                  <Select value={form.previousGrade} onChange={e => set('previousGrade', e.target.value)}>
                    <option value="">Select grade</option>
                    {['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11'].map(g => <option key={g}>{g}</option>)}
                  </Select>
                </FieldWrap>
                <FieldWrap><Label>Year Completed *</Label><Input type="number" placeholder="e.g. 2024" min="2015" max="2025" value={form.previousYear} onChange={e => set('previousYear', e.target.value)} /></FieldWrap>
              </FieldGroup>
              <Notice>
                <AlertCircle size={16} strokeWidth={1.5} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontFamily: F.body, fontSize: 13, fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  You will need to provide a certified copy of your most recent school report. Please have this ready to upload in the next step.
                </p>
              </Notice>
            </div>
          )}

          {/* Step 4 — Grade & docs */}
          {step === 4 && (
            <div>
              <StepTitle>Grade &amp; Documents</StepTitle>
              <FieldGroup style={{ marginBottom: 28 }}>
                <FieldWrap>
                  <Label>Grade Applying For *</Label>
                  <Select value={form.applyingGrade} onChange={e => set('applyingGrade', e.target.value)}>
                    <option value="">Select grade</option>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </Select>
                </FieldWrap>
                <FieldWrap>
                  <Label>Academic Year *</Label>
                  <Select value={form.academicYear} onChange={e => set('academicYear', e.target.value)}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </Select>
                </FieldWrap>
              </FieldGroup>

              <Label style={{ display: 'block', marginBottom: 12 }}>Required Documents</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DOCS.map(doc => (
                  <DocRow key={doc}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Upload size={15} strokeWidth={1.5} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                      <span style={{ fontFamily: F.body, fontSize: 13, fontWeight: 300, color: 'var(--text-muted)' }}>{doc}</span>
                    </div>
                    <UploadBtn type="button">
                      <Upload size={11} strokeWidth={1.5} />
                      Upload
                    </UploadBtn>
                  </DocRow>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation ── */}
      <NavRow>
        <GhostBtn onClick={() => setStep(s => Math.max(s - 1, 1))} disabled={step === 1}>
          <ChevronLeft size={15} strokeWidth={1.5} />
          Back
        </GhostBtn>

        <span style={{ fontFamily: F.body, fontSize: 12, color: 'var(--text-faint)' }}>
          {step} / {STEPS.length}
        </span>

        {step < STEPS.length ? (
          <PrimaryBtn
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setStep(s => Math.min(s + 1, STEPS.length))}
          >
            Next
            <ChevronRight size={15} strokeWidth={1.5} />
          </PrimaryBtn>
        ) : (
          <PrimaryBtn
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting…' : 'Submit Application'}
            {!loading && <ArrowUpRight size={14} strokeWidth={1.5} />}
          </PrimaryBtn>
        )}
      </NavRow>
    </Wrap>
  );
}
