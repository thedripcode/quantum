'use client';

import { useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { useStudentData } from '@/lib/useStudentData';

const BG = '#081420'; const SURFACE = '#0E1E30'; const S2 = '#14283E'; const S3 = '#1A3049';
const GOLD = '#60a5fa'; const GOLD_DIM = 'rgba(96,165,250,0.08)'; const GOLD_B = 'rgba(96,165,250,0.20)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const F_HEADING = "'Roboto Condensed', sans-serif"; const F_BODY = "'Inter', sans-serif";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = [
  { period: 1, time: '07:30', endTime: '08:30', label: 'Period 1' },
  { period: 2, time: '08:30', endTime: '09:30', label: 'Period 2' },
  { period: 3, time: '09:30', endTime: '10:00', label: 'Break', isBreak: true },
  { period: 4, time: '10:00', endTime: '11:00', label: 'Period 3' },
  { period: 5, time: '11:00', endTime: '12:00', label: 'Period 4' },
  { period: 6, time: '12:00', endTime: '12:40', label: 'Lunch', isBreak: true },
  { period: 7, time: '12:40', endTime: '13:40', label: 'Period 5' },
  { period: 8, time: '13:40', endTime: '14:40', label: 'Period 6' },
];

const todayIdx = new Date().getDay(); // 0=Sun, 1=Mon...
const activeDayDefault = todayIdx >= 1 && todayIdx <= 5 ? DAYS[todayIdx - 1] : 'Monday';

export default function TimetablePage() {
  const [view,    setView]    = useState<'day' | 'week'>('week');
  const [selDay,  setSelDay]  = useState(activeDayDefault);
  const { data, loading } = useStudentData();
  const TIMETABLE = data.timetable;

  // Match DB slots to the period grid by start time (DB period numbers are 1-4)
  const get = (day: string, period: number) => {
    const row = PERIODS.find(p => p.period === period);
    return TIMETABLE.find(t => t.day === day && t.time === row?.time);
  };

  const daySlots = PERIODS.map(p => ({ ...p, slot: get(selDay, p.period) }));

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: MUTED, fontSize: 14 }}>Loading timetable…</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* View toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4, background: SURFACE, padding: 4, borderRadius: 10, border: `1px solid ${BORDER}` }}>
          {(['day', 'week'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{ padding: '6px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: view === v ? S2 : 'transparent', color: view === v ? TEXT : MUTED, transition: 'all .15s', textTransform: 'capitalize' }}
            >{v === 'day' ? 'Day View' : 'Week View'}</button>
          ))}
        </div>
        {view === 'day' && (
          <div style={{ display: 'flex', gap: 4 }}>
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => setSelDay(d)}
                style={{ padding: '6px 12px', borderRadius: 7, border: `1px solid ${selDay === d ? GOLD_B : BORDER}`, cursor: 'pointer', fontSize: 11, fontWeight: 600, background: selDay === d ? GOLD_DIM : SURFACE, color: selDay === d ? GOLD : MUTED, transition: 'all .15s' }}
              >{d.slice(0, 3)}</button>
            ))}
          </div>
        )}
      </div>

      {/* Day view */}
      {view === 'day' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3 style={{ fontFamily: F_HEADING, fontSize: 18, fontWeight: 700, color: TEXT, margin: '0 0 12px', letterSpacing: '-0.02em' }}>{selDay}</h3>
          {daySlots.map(({ label, time, endTime, isBreak, slot }) => {
            if (isBreak) return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px dashed rgba(255,255,255,0.06)` }}>
                <div style={{ fontSize: 11, color: FAINT, width: 80, flexShrink: 0 }}>{time} – {endTime}</div>
                <div style={{ fontSize: 12, color: FAINT, fontStyle: 'italic' }}>{label}</div>
              </div>
            );
            if (!slot) return null;
            return (
              <div key={label} style={{ display: 'flex', gap: 14, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px', alignItems: 'center' }}>
                <div style={{ width: 4, height: 48, borderRadius: 2, background: slot.color, flexShrink: 0 }} />
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{time}</div>
                  <div style={{ fontSize: 10, color: FAINT }}>to {endTime}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{slot.subject}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{slot.teacher}</div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={11} style={{ color: FAINT }} />
                    <span style={{ fontSize: 12, color: MUTED }}>Room {slot.room}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={11} style={{ color: FAINT }} />
                    <span style={{ fontSize: 12, color: MUTED }}>60 min</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Week view */}
      {view === 'week' && (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 700 }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', gap: 6, marginBottom: 6 }}>
              <div />
              {DAYS.map(d => (
                <div key={d} style={{
                  textAlign: 'center', padding: '8px 4px', borderRadius: 10,
                  background: d === activeDayDefault ? GOLD_DIM : SURFACE,
                  border: `1px solid ${d === activeDayDefault ? GOLD_B : BORDER}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: d === activeDayDefault ? GOLD : TEXT }}>{d.slice(0, 3)}</div>
                </div>
              ))}
            </div>

            {/* Period rows */}
            {PERIODS.map(({ period, time, endTime, label, isBreak }) => (
              <div key={period} style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', gap: 6, marginBottom: 6, alignItems: 'stretch' }}>
                {/* Time column */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: isBreak ? FAINT : MUTED }}>{time}</div>
                  <div style={{ fontSize: 9, color: FAINT }}>–{endTime}</div>
                </div>

                {DAYS.map(day => {
                  const slot = get(day, period);
                  if (isBreak) {
                    return (
                      <div key={day} style={{ padding: '4px 6px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: `1px dashed rgba(255,255,255,0.05)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 9, color: FAINT, fontStyle: 'italic' }}>{label}</span>
                      </div>
                    );
                  }
                  if (!slot) return <div key={day} />;
                  return (
                    <div key={day} style={{ padding: '8px 10px', borderRadius: 10, background: slot.color + '14', border: `1px solid ${slot.color + '30'}`, borderLeft: `3px solid ${slot.color}` }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.subject.length > 18 ? slot.subject.slice(0, 12) + '…' : slot.subject}</div>
                      <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>Rm {slot.room}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject legend */}
      <div style={{ marginTop: 24, padding: '16px 18px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: FAINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Subject Key</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[...new Map(TIMETABLE.filter(t => t.type === 'Lesson').map(t => [t.subjectId, t])).values()].map(t => (
            <div key={t.subjectId} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: t.color }} />
              <span style={{ fontSize: 12, color: MUTED }}>{t.subject}</span>
              <span style={{ fontSize: 10, color: FAINT }}>· {t.room}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
