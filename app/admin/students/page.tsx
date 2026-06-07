'use client';

import { useState, useMemo } from 'react';
import { Search, X, Users, TrendingUp, AlertTriangle, BarChart2, Mail, Phone, Calendar, User, Shield } from 'lucide-react';
import { ADMIN_STUDENTS } from '@/data/adminData';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

type GradeFilter = 'all' | '8' | '9' | '10' | '11' | '12';
type SortBy = 'name' | 'average' | 'attendance';
type Student = typeof ADMIN_STUDENTS[0];

interface NewStudent {
  firstName: string; lastName: string; grade: string; section: string;
  dob: string; gender: string;
}

function isAtRisk(s: Student) {
  return s.average < 60 || s.attendance < 85;
}

function avgOf(arr: number[]) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
}

function avgColor(v: number) {
  return v >= 75 ? GREEN : v >= 60 ? AMBER : RED;
}

function attColor(v: number) {
  return v >= 90 ? GREEN : v >= 80 ? AMBER : RED;
}

function genStudentNum(grade: string, section: string) {
  const rnd = String(Math.floor(Math.random() * 900) + 100);
  return `STU-${grade}${section}-2025-${rnd}`;
}

export default function StudentsPage() {
  const [search, setSearch]           = useState('');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [sortBy, setSortBy]           = useState<SortBy>('name');
  const [selected, setSelected]       = useState<Student | null>(null);
  const [showModal, setShowModal]     = useState(false);

  // New student form
  const [newStu, setNewStu] = useState<NewStudent>({ firstName: '', lastName: '', grade: '8', section: 'A', dob: '', gender: 'Male' });

  // Computed stats
  const totalStudents = 1247;
  const atRiskCount   = ADMIN_STUDENTS.filter(isAtRisk).length;
  const avgGrade      = avgOf(ADMIN_STUDENTS.map(s => s.average));
  const avgAtt        = avgOf(ADMIN_STUDENTS.map(s => s.attendance));

  const filtered = useMemo(() => {
    return ADMIN_STUDENTS.filter(s => {
      const matchGrade  = gradeFilter === 'all' || s.grade === Number(gradeFilter);
      const q           = search.toLowerCase();
      const matchSearch = !q || `${s.firstName} ${s.lastName} ${s.studentNumber}`.toLowerCase().includes(q);
      return matchGrade && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'average')    return b.average    - a.average;
      if (sortBy === 'attendance') return b.attendance - a.attendance;
      return a.lastName.localeCompare(b.lastName);
    });
  }, [search, gradeFilter, sortBy]);

  const stuNumPreview = useMemo(() => genStudentNum(newStu.grade, newStu.section), [newStu.grade, newStu.section]);

  function resetModal() {
    setNewStu({ firstName: '', lastName: '', grade: '8', section: 'A', dob: '', gender: 'Male' });
    setShowModal(false);
  }

  const STATUS_CFG = {
    active:    { label: 'Active',    color: GREEN, bg: 'rgba(16,185,129,0.12)' },
    suspended: { label: 'Suspended', color: RED,   bg: 'rgba(239,68,68,0.12)'  },
    inactive:  { label: 'Inactive',  color: AMBER, bg: 'rgba(245,158,11,0.12)' },
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Students</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
            {totalStudents.toLocaleString()} enrolled · {atRiskCount} at risk
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: GOLD, color: '#000', borderRadius: 9999, padding: '9px 20px', fontWeight: 700, fontFamily: FB, fontSize: 13, border: 'none', cursor: 'pointer', flexShrink: 0 }}
        >
          + Add Student Manually
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Students', value: totalStudents.toLocaleString(), color: BLUE,  Icon: Users },
          { label: 'Avg Grade',      value: `${avgGrade}%`,                color: GOLD,  Icon: BarChart2 },
          { label: 'Avg Attendance', value: `${avgAtt}%`,                  color: GREEN, Icon: TrendingUp },
          { label: 'At Risk',        value: String(atRiskCount),           color: RED,   Icon: AlertTriangle },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>{label}</div>
              <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{value}</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} style={{ color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['all', '8', '9', '10', '11', '12'] as GradeFilter[]).map(g => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              style={{ padding: '6px 13px', borderRadius: 8, background: gradeFilter === g ? GOLD_DIM : S2, border: `1px solid ${gradeFilter === g ? GOLD_B : BORDER}`, color: gradeFilter === g ? GOLD : MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}
            >
              {g === 'all' ? 'All Grades' : `Gr ${g}`}
            </button>
          ))}
          <div style={{ width: 1, height: 20, background: BORDER, margin: '0 4px' }} />
          <span style={{ fontSize: 11, color: FAINT, marginRight: 2 }}>Sort:</span>
          {([{ k: 'name', l: 'Name' }, { k: 'average', l: 'Average' }, { k: 'attendance', l: 'Attendance' }] as { k: SortBy; l: string }[]).map(({ k, l }) => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              style={{ padding: '5px 10px', borderRadius: 7, background: sortBy === k ? GOLD_DIM : 'transparent', border: `1px solid ${sortBy === k ? GOLD_B : 'transparent'}`, color: sortBy === k ? GOLD : MUTED, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px', width: 230 }}>
          <Search size={13} style={{ color: FAINT, flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or number…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT }}><X size={12} /></button>}
        </div>
      </div>

      {/* Student cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {filtered.map(s => {
          const risk = isAtRisk(s);
          return (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              style={{ background: SURFACE, border: `1px solid ${risk ? 'rgba(239,68,68,0.20)' : BORDER}`, borderRadius: 16, padding: '16px', cursor: 'pointer', transition: 'background .12s, border-color .12s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1b1b1b'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = SURFACE; }}
            >
              {/* Avatar + name row */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: s.color, flexShrink: 0 }}>
                  {s.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.firstName} {s.lastName}
                  </div>
                  <div style={{ fontSize: 10, color: FAINT }}>{s.studentNumber} · {s.className}</div>
                </div>
                {risk && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.12)', color: RED, flexShrink: 0 }}>
                    At Risk
                  </div>
                )}
              </div>
              {/* Two mini stat boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: S2, borderRadius: 9, padding: '9px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 800, color: avgColor(s.average) }}>{s.average}%</div>
                  <div style={{ fontSize: 9, color: MUTED, marginTop: 2 }}>Average</div>
                </div>
                <div style={{ background: S2, borderRadius: 9, padding: '9px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 800, color: attColor(s.attendance) }}>{s.attendance}%</div>
                  <div style={{ fontSize: 9, color: MUTED, marginTop: 2 }}>Attendance</div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '48px 0', textAlign: 'center', color: MUTED, fontSize: 13 }}>
            No students match your filter.
          </div>
        )}
      </div>

      {/* ─── Profile Drawer ────────────────────────────────────────────────────── */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.50)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, background: SURFACE, borderLeft: `1px solid ${BORDER}`, zIndex: 110, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* Drawer header */}
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 800, color: TEXT }}>Student Profile</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '20px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Avatar + name + status */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: selected.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: selected.color, flexShrink: 0 }}>
                  {selected.initials}
                </div>
                <div>
                  <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 800, color: TEXT }}>{selected.firstName} {selected.lastName}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 3, fontFamily: 'monospace' }}>{selected.studentNumber}</div>
                  <div style={{ fontSize: 11, color: FAINT, marginTop: 2 }}>Grade {selected.grade} · {selected.className}</div>
                </div>
              </div>

              {/* Status badge */}
              <div>
                {(() => {
                  const sc = STATUS_CFG[selected.status] ?? STATUS_CFG.active;
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 8, background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  );
                })()}
              </div>

              {/* 2 big stat boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: S2, borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 800, color: avgColor(selected.average), letterSpacing: '-0.03em' }}>{selected.average}%</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Academic Average</div>
                </div>
                <div style={{ background: S2, borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 800, color: attColor(selected.attendance), letterSpacing: '-0.03em' }}>{selected.attendance}%</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Attendance</div>
                </div>
              </div>

              {/* Personal details */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Details</div>
                {[
                  { Icon: Calendar, label: 'Date of Birth', value: selected.dob },
                  { Icon: User,     label: 'Gender',        value: selected.gender },
                  { Icon: Phone,    label: 'Phone',         value: selected.phone },
                  { Icon: Mail,     label: 'Email',         value: selected.email },
                ].map(({ Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <Icon size={13} style={{ color: FAINT, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, color: MUTED }}>{label}</div>
                      <div style={{ fontSize: 13, color: TEXT }}>{value || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Parent section */}
              <div style={{ background: S2, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Parent / Guardian</div>
                {[
                  { Icon: User,  label: 'Name',  value: selected.parentName },
                  { Icon: Phone, label: 'Phone', value: selected.parentPhone },
                ].map(({ Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <Icon size={13} style={{ color: FAINT, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, color: MUTED }}>{label}</div>
                      <div style={{ fontSize: 13, color: TEXT }}>{value || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* House badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={13} style={{ color: FAINT }} />
                <span style={{ fontSize: 12, color: MUTED }}>House:</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 6, padding: '3px 10px' }}>{selected.house}</span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button style={{ flex: 1, background: 'none', border: `1px solid ${BORDER}`, color: MUTED, borderRadius: 9999, padding: '9px 20px', fontWeight: 600, fontFamily: FB, fontSize: 12, cursor: 'pointer' }}>
                  Edit Details
                </button>
                <button style={{ flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: RED, borderRadius: 9999, padding: '9px 20px', fontWeight: 600, fontFamily: FB, fontSize: 12, cursor: 'pointer' }}>
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── Add Student Modal ────────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, width: 460, maxWidth: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontFamily: FH, fontSize: 17, fontWeight: 800, color: TEXT }}>Add Student Manually</div>
              <button onClick={resetModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}><X size={16} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'First Name', field: 'firstName' as const, placeholder: 'First name' },
                  { label: 'Last Name',  field: 'lastName'  as const, placeholder: 'Last name' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>{label}</div>
                    <input
                      value={newStu[field]}
                      onChange={e => setNewStu(p => ({ ...p, [field]: e.target.value }))}
                      placeholder={placeholder}
                      style={{ width: '100%', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>

              {/* Grade + Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>Grade</div>
                  <select
                    value={newStu.grade}
                    onChange={e => setNewStu(p => ({ ...p, grade: e.target.value }))}
                    style={{ width: '100%', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                  >
                    {['8', '9', '10', '11', '12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>Section</div>
                  <select
                    value={newStu.section}
                    onChange={e => setNewStu(p => ({ ...p, section: e.target.value }))}
                    style={{ width: '100%', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                  >
                    {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>

              {/* DOB + Gender */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>Date of Birth</div>
                  <input
                    type="date"
                    value={newStu.dob}
                    onChange={e => setNewStu(p => ({ ...p, dob: e.target.value }))}
                    style={{ width: '100%', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>Gender</div>
                  <select
                    value={newStu.gender}
                    onChange={e => setNewStu(p => ({ ...p, gender: e.target.value }))}
                    style={{ width: '100%', background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', fontSize: 13, color: TEXT, fontFamily: FB, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Student number preview */}
              <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Auto-generated Student Number</div>
                <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 800, color: GOLD }}>{stuNumPreview}</div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  onClick={resetModal}
                  style={{ flex: 1, background: 'none', border: `1px solid ${BORDER}`, color: MUTED, borderRadius: 9999, padding: '10px', fontWeight: 600, fontFamily: FB, fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={resetModal}
                  style={{ flex: 1, background: GOLD, color: '#000', borderRadius: 9999, padding: '10px', fontWeight: 700, fontFamily: FB, fontSize: 13, border: 'none', cursor: 'pointer' }}
                >
                  Create Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
