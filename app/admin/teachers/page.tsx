'use client';

import { useState } from 'react';
import { ADMIN_TEACHERS, AdminTeacher } from '@/data/adminData';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const DEPARTMENTS = ['Mathematics', 'Sciences', 'Languages', 'Commerce', 'Technology', 'Humanities', 'Life Orientation'];
const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr'];
const ALL_CLASSES = ['11A', '11B', '11C', '10A', '10B', '10C', '12A', '12B', '12C', '9A', '9B', '9C'];
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];

function statusColor(status: AdminTeacher['status']) {
  if (status === 'active') return GREEN;
  if (status === 'on_leave') return AMBER;
  return FAINT;
}

function statusLabel(status: AdminTeacher['status']) {
  if (status === 'active') return 'Active';
  if (status === 'on_leave') return 'On Leave';
  return 'Inactive';
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface ModalProps {
  onClose: () => void;
  onAdd: (t: AdminTeacher) => void;
}

function AddTeacherModal({ onClose, onAdd }: ModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('Mr');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [department, setDepartment] = useState('Mathematics');
  const [subjects, setSubjects] = useState('');
  const [classes, setClasses] = useState<string[]>([]);

  const toggleClass = (c: string) =>
    setClasses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleCreate = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    const subjectList = subjects.split(',').map(s => s.trim()).filter(Boolean);
    const newTeacher: AdminTeacher = {
      id: `t-${Date.now()}`,
      employeeNumber: employeeNumber.trim() || `EMP-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      title: `${title}.`,
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sidelile.edu.za`,
      phone: phone.trim() || '—',
      subjects: subjectList.length ? subjectList : ['—'],
      classes,
      department,
      role: 'educator',
      status: 'active',
      initials: `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      joinedDate: new Date().toISOString().split('T')[0],
    };
    onAdd(newTeacher);
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: S2, border: `1px solid ${BORDER}`,
    borderRadius: 9, padding: '9px 12px', fontSize: 13, color: TEXT,
    fontFamily: FB, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: FAINT,
    letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5, display: 'block',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.60)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px 24px 20px', width: 420, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: FH, fontSize: 17, fontWeight: 700, color: TEXT }}>Add New Teacher</div>
          <button onClick={onClose} style={{ background: S3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: MUTED, fontFamily: FB, fontSize: 12 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title + First + Last row */}
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <select value={title} onChange={e => setTitle(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                {TITLES.map(t => <option key={t} value={t}>{t}.</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>First Name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. Sipho" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="e.g. Dlamini" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="teacher@sidelile.edu.za" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="082 000 0000" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Employee Number</label>
            <input value={employeeNumber} onChange={e => setEmployeeNumber(e.target.value)} placeholder="EMP-XXX" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Department</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Subjects (comma-separated)</label>
            <input value={subjects} onChange={e => setSubjects(e.target.value)} placeholder="e.g. Mathematics, Statistics" style={inputStyle} />
          </div>

          {/* Classes checkboxes */}
          <div>
            <label style={labelStyle}>Classes</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_CLASSES.map(c => {
                const checked = classes.includes(c);
                return (
                  <button key={c} onClick={() => toggleClass(c)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: FB, cursor: 'pointer', border: `1px solid ${checked ? GOLD_B : BORDER}`, background: checked ? GOLD_DIM : S2, color: checked ? GOLD : MUTED, transition: 'all .12s' }}>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: S3, border: `1px solid ${BORDER}`, borderRadius: 9999, color: MUTED, fontSize: 13, cursor: 'pointer', fontFamily: FB, fontWeight: 600 }}>Cancel</button>
          <button onClick={handleCreate} style={{ flex: 2, padding: '10px', background: GOLD, border: 'none', borderRadius: 9999, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>Create Teacher Account</button>
        </div>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminTeacher | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [teachers, setTeachers] = useState<AdminTeacher[]>(ADMIN_TEACHERS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = teachers.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return `${t.firstName} ${t.lastName} ${t.employeeNumber} ${t.department} ${t.subjects.join(' ')}`.toLowerCase().includes(q);
  });

  const totalTeachers = teachers.length;
  const activeCount = teachers.filter(t => t.status === 'active').length;
  const onLeaveCount = teachers.filter(t => t.status === 'on_leave').length;

  const addTeacher = (t: AdminTeacher) => setTeachers(prev => [...prev, t]);

  const sectionLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, color: FAINT,
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Teachers</h1>
          <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0' }}>{teachers.length} staff members</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: GOLD, color: '#000', borderRadius: 9999, padding: '9px 20px', fontWeight: 700, fontSize: 13, fontFamily: FB, border: 'none', cursor: 'pointer' }}>
          + Add Teacher
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Teachers', value: totalTeachers, color: BLUE },
          { label: 'Active', value: activeCount, color: GREEN },
          { label: 'On Leave', value: onLeaveCount, color: AMBER },
        ].map(s => (
          <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: FH, fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', minWidth: 260 }}>
          <span style={{ color: FAINT, fontSize: 13 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search teachers…"
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: TEXT, fontFamily: FB, width: 200 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT, fontSize: 13, lineHeight: 1 }}>✕</button>
          )}
        </div>
      </div>

      {/* ── Teacher grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map(t => {
          const isHovered = hoveredId === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setSelected(t)}
              onMouseEnter={() => setHoveredId(t.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: SURFACE,
                border: `1px solid ${isHovered ? t.color + '55' : BORDER}`,
                borderRadius: 16,
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'border-color .15s',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Avatar + name */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: t.color + '22', border: `2px solid ${t.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: t.color, flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>{t.title} {t.firstName} {t.lastName}</div>
                  {/* primary subject pill */}
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 9999, background: t.color + '1A', color: t.color }}>
                      {t.subjects[0] ?? '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Department pill */}
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 9999, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, color: GOLD }}>
                  {t.department}
                </span>
              </div>

              {/* Classes pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {t.classes.map(c => (
                  <span key={c} style={{ fontSize: 10, padding: '2px 7px', background: S3, borderRadius: 5, color: FAINT }}>{c}</span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(t.status) }} />
                  <span style={{ fontSize: 11, color: statusColor(t.status) }}>{statusLabel(t.status)}</span>
                  <span style={{ fontSize: 10, color: FAINT, marginLeft: 6 }}>{t.employeeNumber}</span>
                </div>
                <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>View profile →</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED, fontSize: 14 }}>
          No teachers match your search.
        </div>
      )}

      {/* ── Teacher Profile Drawer ── */}
      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.50)', zIndex: 200 }}
          />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: SURFACE, borderLeft: `1px solid ${BORDER}`, zIndex: 210, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Drawer header */}
            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT }}>Teacher Profile</div>
              <button onClick={() => setSelected(null)} style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: MUTED, fontFamily: FB, fontSize: 12 }}>✕</button>
            </div>

            <div style={{ padding: 20, flex: 1 }}>
              {/* Avatar + identity */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: selected.color + '22', border: `2px solid ${selected.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: selected.color, flexShrink: 0 }}>
                  {selected.initials}
                </div>
                <div>
                  <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 800, color: TEXT }}>{selected.title} {selected.firstName} {selected.lastName}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{selected.employeeNumber}</div>
                </div>
              </div>

              {/* Status + join date */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 9999, background: statusColor(selected.status) + '1A', color: statusColor(selected.status), border: `1px solid ${statusColor(selected.status)}44` }}>
                  {statusLabel(selected.status)}
                </span>
                <span style={{ fontSize: 11, color: FAINT }}>Joined {fmtDate(selected.joinedDate)}</span>
              </div>

              {/* Contact */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                <div style={sectionLabel}>Contact</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 12, color: FAINT, width: 14, textAlign: 'center', marginTop: 1 }}>✉</span>
                    <div>
                      <div style={{ fontSize: 10, color: MUTED }}>Email</div>
                      <div style={{ fontSize: 12, color: TEXT }}>{selected.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 12, color: FAINT, width: 14, textAlign: 'center', marginTop: 1 }}>📞</span>
                    <div>
                      <div style={{ fontSize: 10, color: MUTED }}>Phone</div>
                      <div style={{ fontSize: 12, color: TEXT }}>{selected.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                <div style={sectionLabel}>Subjects</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {selected.subjects.map(s => (
                    <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 9999, background: selected.color + '1A', border: `1px solid ${selected.color}33`, color: selected.color }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Classes */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                <div style={sectionLabel}>Classes ({selected.classes.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {selected.classes.length > 0 ? selected.classes.map(c => (
                    <span key={c} style={{ fontSize: 13, fontWeight: 600, padding: '5px 14px', borderRadius: 8, background: selected.color + '18', border: `1px solid ${selected.color}33`, color: selected.color }}>
                      {c}
                    </span>
                  )) : <span style={{ fontSize: 12, color: MUTED }}>None assigned</span>}
                </div>
              </div>

              {/* Department */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={sectionLabel}>Department</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{selected.department}</div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ flex: 1, padding: '9px 16px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 9999, color: TEXT, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
                  Edit
                </button>
                <button style={{ flex: 1, padding: '9px 16px', background: 'transparent', border: `1px solid ${RED}55`, borderRadius: 9999, color: RED, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Add Teacher Modal ── */}
      {showAddModal && (
        <AddTeacherModal onClose={() => setShowAddModal(false)} onAdd={addTeacher} />
      )}
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, color: FAINT,
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
};
