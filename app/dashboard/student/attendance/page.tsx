'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, MinusCircle } from 'lucide-react';
import { SUBJECT_ATTENDANCE, ATTENDANCE_RECORDS, OVERALL_ATTENDANCE, MONTHLY_ATTENDANCE } from '@/data/studentData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.20)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981'; const RED = '#EF4444'; const AMBER = '#F59E0B';
const F_HEADING = "'Bricolage Grotesque', sans-serif"; const F_BODY = "'Inter', sans-serif";

// ─── Donut ring ───────────────────────────────────────────────────────────────
function Donut({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
  const stroke = 7; const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = mounted ? circ * (1 - pct / 100) : circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.33,1,0.68,1)' }} />
    </svg>
  );
}

// ─── Monthly bar chart ────────────────────────────────────────────────────────
function MonthlyBars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 80 }}>
      {MONTHLY_ATTENDANCE.map(m => (
        <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{m.percentage}%</span>
          <div style={{ width: '100%', height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: '6px 6px 0 0', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: mounted ? `${m.percentage}%` : '0%', background: m.percentage >= 90 ? GREEN : m.percentage >= 80 ? AMBER : RED, borderRadius: '6px 6px 0 0', transition: 'height 1.1s cubic-bezier(0.33,1,0.68,1)' }} />
          </div>
          <span style={{ fontSize: 11, color: MUTED }}>{m.month}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Calendar view ────────────────────────────────────────────────────────────
const STATUS_COLORS = { present: GREEN, absent: RED, late: AMBER, excused: '#8B5CF6' };
const STATUS_ICONS = { present: CheckCircle2, absent: XCircle, late: Clock, excused: MinusCircle };

function CalendarView() {
  const months = [...new Set(ATTENDANCE_RECORDS.map(r => r.date.slice(0, 7)))];
  const byDate = Object.fromEntries(ATTENDANCE_RECORDS.map(r => [r.date, r]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {months.map(month => {
        const [y, m] = month.split('-').map(Number);
        const firstDay = new Date(y, m - 1, 1).getDay();
        const daysInMonth = new Date(y, m, 0).getDate();
        const monthName = new Date(y, m - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

        return (
          <div key={month}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 10 }}>{monthName}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 9, color: FAINT, fontWeight: 600, padding: '4px 0', letterSpacing: '0.06em' }}>{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = `${y}-${String(m).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                const rec  = byDate[date];
                const isWeekend = [0, 6].includes(new Date(date).getDay());
                return (
                  <div
                    key={date}
                    title={rec ? `${date}: ${rec.status}${rec.note ? ' — ' + rec.note : ''}` : date}
                    style={{
                      aspectRatio: '1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, cursor: rec ? 'pointer' : 'default',
                      background: rec ? STATUS_COLORS[rec.status] + '22' : isWeekend ? 'transparent' : 'rgba(255,255,255,0.02)',
                      border: rec ? `1px solid ${STATUS_COLORS[rec.status] + '40'}` : '1px solid transparent',
                      color: rec ? STATUS_COLORS[rec.status] : isWeekend ? FAINT : MUTED,
                    }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AttendancePage() {
  const absent = ATTENDANCE_RECORDS.filter(r => r.status === 'absent').length;
  const late   = ATTENDANCE_RECORDS.filter(r => r.status === 'late').length;

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 14, padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <Donut pct={OVERALL_ATTENDANCE.percentage} color={GOLD} size={64} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: GOLD }}>{OVERALL_ATTENDANCE.percentage}%</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.70)', fontWeight: 500 }}>Overall</div>
            <div style={{ fontFamily: F_HEADING, fontSize: 20, fontWeight: 700, color: GOLD, letterSpacing: '-0.02em' }}>{OVERALL_ATTENDANCE.attended}/{OVERALL_ATTENDANCE.total}</div>
            <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.50)' }}>days attended</div>
          </div>
        </div>
        {[
          { label: 'Present', value: OVERALL_ATTENDANCE.attended, color: GREEN, icon: CheckCircle2 },
          { label: 'Absent', value: absent, color: RED, icon: XCircle },
          { label: 'Late', value: late, color: AMBER, icon: Clock },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{stat.label}</div>
                <Icon size={16} style={{ color: stat.color }} />
              </div>
              <div style={{ fontFamily: F_HEADING, fontSize: 28, fontWeight: 700, color: stat.value > 0 && stat.label !== 'Present' ? stat.color : TEXT, letterSpacing: '-0.02em', marginTop: 8 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: FAINT, marginTop: 2 }}>this term</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left: subject attendance + calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Subject breakdown */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>Per Subject Attendance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SUBJECT_ATTENDANCE.map(sub => (
                <div key={sub.subjectId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: S2, borderRadius: 10 }}>
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: sub.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>{sub.subject}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: sub.percentage >= 90 ? GREEN : sub.percentage >= 80 ? AMBER : RED }}>
                        {sub.percentage}%
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${sub.percentage}%`, background: sub.percentage >= 90 ? sub.color : sub.percentage >= 80 ? AMBER : RED, borderRadius: 2, transition: 'width 1.1s ease' }} />
                    </div>
                    <div style={{ fontSize: 10, color: FAINT, marginTop: 3 }}>{sub.attended} / {sub.total} classes</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance records list */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
            <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 14px' }}>Absence Notes</h3>
            {ATTENDANCE_RECORDS.filter(r => r.status !== 'present' && r.note).map(r => {
              const Icon = STATUS_ICONS[r.status];
              return (
                <div key={r.date} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                  <Icon size={14} style={{ color: STATUS_COLORS[r.status], flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLORS[r.status], textTransform: 'capitalize' }}>{r.status} · {r.date}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{r.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: monthly chart + calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 14px' }}>Monthly Breakdown</h3>
            <MonthlyBars />
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 14px' }}>Calendar</h3>
            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: 10, color: MUTED, textTransform: 'capitalize' }}>{status}</span>
                </div>
              ))}
            </div>
            <CalendarView />
          </div>
        </div>
      </div>
    </div>
  );
}
