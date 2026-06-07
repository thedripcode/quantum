'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Users, Phone, Mail, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SCHOOL_CLASSES, CURRENT_TEACHER_ID } from '@/lib/teacher/mockData';
import { useTeacherPortal } from '@/contexts/TeacherPortalContext';
import type { Student } from '@/types/teacher';

// ─── Constants ────────────────────────────────────────────────────────────────

const PURPLE = '#7C3AED';

type Step = 0 | 1 | 2;

const STEPS = [
  { label: 'Personal', icon: User  },
  { label: 'Parent',   icon: Users },
  { label: 'Details',  icon: MapPin },
];

const HOME_LANGUAGES = [
  'Zulu','Xhosa','Sotho','Tswana','Venda','Tsonga','Swati',
  'Afrikaans','English','Hindi','Tamil','Portuguese','Other',
];

const INPUT_STYLE: React.CSSProperties = {
  width:        '100%',
  padding:      '10px 14px',
  borderRadius: 12,
  background:   'rgba(255,255,255,0.06)',
  border:       '1px solid rgba(255,255,255,0.12)',
  color:        '#fff',
  fontSize:     14,
  outline:      'none',
};

const LABEL_STYLE: React.CSSProperties = {
  display:     'block',
  fontSize:    12,
  fontWeight:  600,
  color:       'rgba(255,255,255,0.55)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open:    boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddStudentModal({ open, onClose }: Props) {
  const { addStudent, students } = useTeacherPortal();
  const myClasses = SCHOOL_CLASSES.filter(c => c.teacherId === CURRENT_TEACHER_ID);

  const [step,    setStep]    = useState<Step>(0);
  const [success, setSuccess] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [toast,   setToast]   = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    homeLanguage: '', classId: myClasses[0]?._id ?? '',
    parentName: '', parentPhone: '', parentEmail: '',
    address: '', emergencyContact: '', emergencyNumber: '',
  });

  function set(key: keyof typeof form, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  }

  function validate(currentStep: Step): boolean {
    const e: Record<string, string> = {};
    if (currentStep === 0) {
      if (!form.firstName.trim())  e.firstName   = 'Required';
      if (!form.lastName.trim())   e.lastName    = 'Required';
      if (!form.dateOfBirth)       e.dateOfBirth = 'Required';
      if (!form.gender)            e.gender      = 'Required';
      if (!form.homeLanguage)      e.homeLanguage= 'Required';
      if (!form.classId)           e.classId     = 'Required';
    }
    if (currentStep === 1) {
      if (!form.parentName.trim())  e.parentName  = 'Required';
      if (!form.parentPhone.trim()) e.parentPhone = 'Required';
      if (!form.parentEmail.trim()) e.parentEmail = 'Required';
      else if (!/\S+@\S+\.\S+/.test(form.parentEmail)) e.parentEmail = 'Invalid email';
    }
    if (currentStep === 2) {
      if (!form.address.trim())          e.address          = 'Required';
      if (!form.emergencyContact.trim()) e.emergencyContact = 'Required';
      if (!form.emergencyNumber.trim())  e.emergencyNumber  = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next()  { if (validate(step)) setStep(s => Math.min(s + 1, 2) as Step); }
  function back()  { setStep(s => Math.max(s - 1, 0) as Step); setErrors({}); }

  function submit() {
    if (!validate(2)) return;
    const cls = SCHOOL_CLASSES.find(c => c._id === form.classId);
    if (!cls) return;
    const classStudents = students.filter(s => s.classId === cls._id);
    const nextNum       = String(classStudents.length + 1).padStart(3, '0');
    const newStudent: Student = {
      _id:            `s-new-${Date.now()}`,
      studentNumber:  `STU-${cls.grade}${cls.section}-${nextNum}`,
      firstName:      form.firstName.trim(),
      lastName:       form.lastName.trim(),
      fullName:       `${form.lastName.trim()}, ${form.firstName.trim()}`,
      grade:          cls.grade,
      classCode:      `${cls.grade}${cls.section}`,
      classId:        cls._id,
      gender:         form.gender as 'male' | 'female',
      dateOfBirth:    form.dateOfBirth,
      parentEmail:    form.parentEmail.trim(),
      parentPhone:    form.parentPhone.trim(),
      avatarInitials: `${form.firstName[0]}${form.lastName[0]}`.toUpperCase(),
      enrolledDate:   new Date().toISOString().split('T')[0],
      isActive:       true,
    };
    addStudent(newStudent);
    setSuccess(true);
    setToast(`${form.firstName} ${form.lastName} added to Grade ${cls.grade}${cls.section} successfully`);
    setTimeout(handleClose, 2500);
  }

  function handleClose() {
    setStep(0); setSuccess(false); setErrors({}); setToast('');
    setForm({
      firstName: '', lastName: '', dateOfBirth: '', gender: '',
      homeLanguage: '', classId: myClasses[0]?._id ?? '',
      parentName: '', parentPhone: '', parentEmail: '',
      address: '', emergencyContact: '', emergencyNumber: '',
    });
    onClose();
  }

  // ─── Field helper ─────────────────────────────────────────────────────────

  function Field({
    label, name, type = 'text', placeholder = '', options, required = true,
  }: {
    label: string; name: keyof typeof form; type?: string;
    placeholder?: string; options?: string[]; required?: boolean;
  }) {
    const err = errors[name];
    return (
      <div>
        <label style={LABEL_STYLE}>
          {label} {required && <span style={{ color: '#f87171' }}>*</span>}
        </label>
        {options ? (
          <select
            value={form[name]}
            onChange={e => set(name, e.target.value)}
            style={{
              ...INPUT_STYLE,
              borderColor: err ? 'rgba(248,113,113,0.60)' : 'rgba(255,255,255,0.12)',
            }}
          >
            <option value="">Select {label.toLowerCase()}…</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={form[name]}
            onChange={e => set(name, e.target.value)}
            placeholder={placeholder}
            style={{
              ...INPUT_STYLE,
              borderColor: err ? 'rgba(248,113,113,0.60)' : 'rgba(255,255,255,0.12)',
            }}
          />
        )}
        {err && (
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#f87171' }}>
            <AlertCircle className="w-3 h-3" />{err}
          </p>
        )}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              style={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.10)' }}
            >

              {/* Success state */}
              {success ? (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'rgba(34,197,94,0.15)' }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h3 className="font-bold text-xl text-white">Student Added!</h3>
                  <p className="text-sm mt-2 max-w-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>{toast}</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div>
                      <h2 className="font-bold text-lg text-white">Add New Student</h2>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                        Step {step + 1} of 3 — {STEPS[step].label}
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex gap-1 px-6 pt-5">
                    {STEPS.map((s, i) => {
                      const Icon = s.icon;
                      const done = i < step;
                      const active = i === step;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                            style={{
                              background: done   ? 'rgba(34,197,94,0.20)'
                                : active ? PURPLE
                                : 'rgba(255,255,255,0.08)',
                              color: done ? '#4ade80' : active ? '#fff' : 'rgba(255,255,255,0.35)',
                            }}
                          >
                            {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <div
                            className="h-1 w-full rounded-full"
                            style={{ background: i <= step ? PURPLE : 'rgba(255,255,255,0.08)' }}
                          />
                          <span
                            className="text-[9px] font-semibold uppercase tracking-wide"
                            style={{ color: active ? '#a78bfa' : 'rgba(255,255,255,0.30)' }}
                          >
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Form */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 py-5 space-y-4 overflow-y-auto max-h-[55vh]"
                    >
                      {step === 0 && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="First Name"  name="firstName"  placeholder="e.g. Amahle" />
                            <Field label="Last Name"   name="lastName"   placeholder="e.g. Dlamini" />
                          </div>
                          <Field label="Date of Birth" name="dateOfBirth" type="date" />
                          <Field label="Gender"        name="gender"      options={['male', 'female']} />
                          <Field label="Home Language" name="homeLanguage"options={HOME_LANGUAGES} />
                          <div>
                            <label style={LABEL_STYLE}>Class <span style={{ color: '#f87171' }}>*</span></label>
                            <select
                              value={form.classId}
                              onChange={e => set('classId', e.target.value)}
                              style={{
                                ...INPUT_STYLE,
                                borderColor: errors.classId ? 'rgba(248,113,113,0.60)' : 'rgba(255,255,255,0.12)',
                              }}
                            >
                              {myClasses.map(c => (
                                <option key={c._id} value={c._id}>
                                  Grade {c.grade}{c.section} (your class)
                                </option>
                              ))}
                            </select>
                            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.30)' }}>
                              You can only enrol students in your assigned classes
                            </p>
                          </div>
                        </>
                      )}

                      {step === 1 && (
                        <>
                          <div
                            className="p-3 rounded-xl"
                            style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.25)' }}
                          >
                            <p className="text-xs font-medium" style={{ color: '#a78bfa' }}>
                              Parent / Guardian Information
                            </p>
                          </div>
                          <Field label="Parent/Guardian Full Name" name="parentName" placeholder="e.g. Nomvula Dlamini" />
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Contact Number" name="parentPhone" type="tel" placeholder="+27 71 000 0000" />
                            <Field label="Email Address"  name="parentEmail" type="email" placeholder="parent@email.com" />
                          </div>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <Field label="Physical Address" name="address" placeholder="e.g. 12 Mandela Ave, Polokwane" />
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Emergency Contact" name="emergencyContact" placeholder="Full name" />
                            <Field label="Emergency Number"  name="emergencyNumber"  type="tel" placeholder="+27 82 000 0000" />
                          </div>
                          <div
                            className="p-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            <p
                              className="text-[10px] font-medium uppercase tracking-wide"
                              style={{ color: 'rgba(255,255,255,0.35)' }}
                            >
                              Student Number (auto-generated)
                            </p>
                            <p className="text-sm font-mono font-bold text-white mt-1">
                              {(() => {
                                const cls   = SCHOOL_CLASSES.find(c => c._id === form.classId);
                                const count = students.filter(s => s.classId === form.classId).length;
                                return cls
                                  ? `STU-${cls.grade}${cls.section}-${String(count + 1).padStart(3, '0')}`
                                  : '—';
                              })()}
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.20)' }}
                  >
                    {step > 0 ? (
                      <button
                        onClick={back}
                        className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                        style={{ color: 'rgba(255,255,255,0.50)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        ← Back
                      </button>
                    ) : (
                      <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                        style={{ color: 'rgba(255,255,255,0.40)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        Cancel
                      </button>
                    )}

                    {step < 2 ? (
                      <button
                        onClick={next}
                        className="px-6 py-2 text-white text-sm font-semibold rounded-xl transition-colors"
                        style={{ background: PURPLE }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.80)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = PURPLE; }}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        onClick={submit}
                        className="px-6 py-2 text-white text-sm font-semibold rounded-xl transition-colors"
                        style={{ background: PURPLE, boxShadow: '0 0 16px rgba(124,58,237,0.40)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.80)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = PURPLE; }}
                      >
                        Add Student
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
