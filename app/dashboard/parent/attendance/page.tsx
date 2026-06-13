'use client';

import { useEffect, useState } from 'react';
import { CheckSquare, XCircle, Clock, AlertTriangle } from 'lucide-react';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981'; const RED = '#EF4444'; const YELLOW = '#F59E0B'; const BLUE = '#3B82F6';
const F_H = "'Bricolage Grotesque', sans-serif"; const F_B = "'Inter', sans-serif";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  present:  { label: 'Present',  color: GREEN,  bg: 'rgba(16,185,129,0.10)',  Icon: CheckSquare },
  absent:   { label: 'Absent',   color: RED,    bg: 'rgba(239,68,68,0.10)',   Icon: XCircle     },
  late:     { label: 'Late',     color: YELLOW, bg: 'rgba(245,158,11,0.10)', Icon: Clock       },
  excused:  { label: 'Excused',  color: BLUE,   bg: 'rgba(59,130,246,0.10)', Icon: AlertTriangle },
};

interface AttRecord { id: string; date: string; status: string; note?: string }

export default function ParentAttendancePage() {
  const [records, setRecords]     = useState<AttRecord[]>([]);
  const [stats, setStats]         = useState<{ totalDays: number; presentDays: number; attendancePct: number | null } | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch('/api/parent/child')
      .then(r => r.json())
      .then(d => {
        setRecords(d.attendance?.records ?? []);
        setStats(d.attendance ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const countByStatus = (st: string) => records.filter(r => r.status === st).length;
  const pct = stats?.attendancePct;
  const pctColor = pct === null ? MUTED : pct >= 90 ? GREEN : pct >= 75 ? YELLOW : RED;

  return (
    <div style={{ padding: '28px 24px', fontFamily: F_B, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: F_H, fontSize: 24, fontWeight: 800, color: TEXT, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Attendance</h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Your child's attendance record (last 90 school days)</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Rate', value: pct !== null ? `${pct}%` : '—', color: pctColor, sub: `${stats?.presentDays ?? 0}/${stats?.totalDays ?? 0} days` },
          { label: 'Present',  value: countByStatus('present'),  color: GREEN,  sub: 'days' },
          { label: 'Absent',   value: countByStatus('absent'),   color: RED,    sub: 'days' },
          { label: 'Late',     value: countByStatus('late'),     color: YELLOW, sub: 'days' },
          { label: 'Excused',  value: countByStatus('excused'),  color: BLUE,   sub: 'days' },
        ].map(c => (
          <div key={c.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.color, fontFamily: F_H }}>{c.value}</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {pct !== null && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 18px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: MUTED }}>Attendance Rate</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: pctColor }}>{pct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pctColor, borderRadius: 4, transition: 'width 0.5s ease' }} />
          </div>
          {pct < 80 && (
            <div style={{ marginTop: 10, fontSize: 12, color: YELLOW, display: 'flex', gap: 6, alignItems: 'center' }}>
              <AlertTriangle size={12} />
              Department of Education requires at least 80% attendance. Please ensure regular school attendance.
            </div>
          )}
        </div>
      )}

      {/* Records list */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 1fr', padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          {['Date', 'Status', 'Note'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', fontSize: 13, color: MUTED }}>Loading…</div>
        ) : records.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', fontSize: 13, color: MUTED }}>No attendance records found.</div>
        ) : records.map(r => {
          const s = STATUS_MAP[r.status] ?? STATUS_MAP.present;
          const { Icon } = s;
          return (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 1fr', padding: '10px 16px', borderBottom: `1px solid rgba(255,255,255,0.03)`, gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: TEXT }}>{new Date(r.date).toLocaleDateString('en-ZA', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 6, background: s.bg, width: 'fit-content' }}>
                <Icon size={11} style={{ color: s.color }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 11, color: MUTED }}>{r.note ?? '—'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
