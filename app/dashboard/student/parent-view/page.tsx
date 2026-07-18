'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, X, AlertTriangle, TrendingUp } from 'lucide-react';
import { STUDENT, SUBJECTS, OVERALL_AVERAGE, AT_RISK_SUBJECTS, NOTICES, MESSAGES, OVERALL_ATTENDANCE } from '@/data/studentData';

const BG = '#081420'; const SURFACE = '#0E1E30'; const S2 = '#14283E';
const GOLD = '#60a5fa'; const GOLD_DIM = 'rgba(96,165,250,0.08)'; const GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const RED = '#EF4444'; const GREEN = '#10B981';
const F_HEADING = "'Roboto Condensed', sans-serif"; const F_BODY = "'Inter', sans-serif";

export default function ParentViewPage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Parent view banner */}
      <div style={{ background: GOLD_DIM, borderBottom: `1px solid ${GOLD_B}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Eye size={16} style={{ color: GOLD }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>You are viewing what your parent sees</span>
        <span style={{ fontSize: 12, color: 'rgba(96,165,250,0.65)', marginLeft: 4 }}>— This shows the limited parent portal view</span>
        <button
          onClick={() => router.push('/dashboard/student')}
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: GOLD, border: 'none', borderRadius: 8, cursor: 'pointer', color: '#000', fontSize: 12, fontWeight: 700 }}
        >
          <X size={13} /> Exit Parent View
        </button>
      </div>

      <div style={{ padding: 24 }}>
        {/* Student header */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD} 0%, #a07830 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#000', border: `2px solid ${GOLD}` }}>
            {STUDENT.avatarInitials}
          </div>
          <div>
            <h2 style={{ fontFamily: F_HEADING, fontSize: 20, fontWeight: 700, color: TEXT, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{STUDENT.firstName} {STUDENT.lastName}</h2>
            <div style={{ fontSize: 13, color: MUTED }}>Grade {STUDENT.grade} · Class {STUDENT.className} · {STUDENT.id}</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontFamily: F_HEADING, fontSize: 28, fontWeight: 800, color: OVERALL_AVERAGE >= 70 ? GREEN : OVERALL_AVERAGE >= 50 ? GOLD : RED, letterSpacing: '-0.03em' }}>{OVERALL_AVERAGE}%</div>
            <div style={{ fontSize: 11, color: MUTED }}>Overall Average</div>
          </div>
        </div>

        {/* At-risk alert */}
        {AT_RISK_SUBJECTS.length > 0 && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 14, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertTriangle size={18} style={{ color: RED, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: RED }}>Academic Alert — Parental Awareness Required</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                {STUDENT.firstName} is currently at risk in the following subject(s):{' '}
                <strong style={{ color: '#fff' }}>{AT_RISK_SUBJECTS.map(s => `${s.name} (${s.currentMark}%)`).join(', ')}</strong>.
                Please encourage additional study and contact the relevant teacher.
              </div>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Overall Average', value: `${OVERALL_AVERAGE}%`, color: OVERALL_AVERAGE >= 70 ? GREEN : GOLD },
            { label: 'Attendance', value: `${OVERALL_ATTENDANCE.percentage}%`, color: OVERALL_ATTENDANCE.percentage >= 90 ? GREEN : '#F59E0B' },
            { label: 'Subjects at Risk', value: `${AT_RISK_SUBJECTS.length}`, color: AT_RISK_SUBJECTS.length > 0 ? RED : GREEN },
          ].map(stat => (
            <div key={stat.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 13, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, color: MUTED }}>{stat.label}</div>
              <div style={{ fontFamily: F_HEADING, fontSize: 26, fontWeight: 800, color: stat.color, letterSpacing: '-0.03em', marginTop: 4 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Marks summary */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 14 }}>Term 3 Subject Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SUBJECTS.map(sub => (
              <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 3, height: 28, borderRadius: 2, background: sub.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: TEXT, flex: 1 }}>{sub.name}</span>
                <span style={{ fontSize: 12, color: MUTED }}>{sub.teacher}</span>
                <div style={{ width: 120, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sub.currentMark}%`, background: sub.isAtRisk ? RED : sub.color, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: sub.isAtRisk ? RED : TEXT, width: 40, textAlign: 'right', flexShrink: 0 }}>{sub.currentMark}%</span>
                {sub.isAtRisk && <AlertTriangle size={13} style={{ color: RED, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Recent notices */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 14 }}>Recent School Notices</div>
          {NOTICES.slice(0, 3).map(n => (
            <div key={n.id} style={{ padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{n.title}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{n.date} · {n.author}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body.slice(0, 90)}…</div>
            </div>
          ))}
        </div>

        {/* Attendance summary */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 14 }}>Attendance Summary</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { label: 'Overall', value: `${OVERALL_ATTENDANCE.percentage}%`, color: OVERALL_ATTENDANCE.percentage >= 90 ? GREEN : '#F59E0B' },
              { label: 'Days Present', value: `${OVERALL_ATTENDANCE.attended}`, color: GREEN },
              { label: 'Days Absent', value: `${OVERALL_ATTENDANCE.total - OVERALL_ATTENDANCE.attended}`, color: RED },
            ].map(stat => (
              <div key={stat.label} style={{ background: S2, borderRadius: 10, padding: '12px 16px', flex: 1 }}>
                <div style={{ fontSize: 10, color: FAINT }}>{stat.label}</div>
                <div style={{ fontFamily: F_HEADING, fontSize: 20, fontWeight: 700, color: stat.color, marginTop: 4 }}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: MUTED }}>
            Attendance below 80% may result in a learner being marked absent for the term, which affects promotion.
            Please ensure {STUDENT.firstName} attends school regularly.
          </div>
        </div>

        <div style={{ marginTop: 20, padding: '14px 18px', background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 14 }}>
          <div style={{ fontSize: 12, color: GOLD, fontWeight: 500, lineHeight: 1.6 }}>
            <strong>Note:</strong> This view shows what your parent can see when they log in to the parent portal.
            Personal messages, goals, and achievement details are private to the student.
            Parents can contact teachers directly through the parent portal messaging system.
          </div>
        </div>
      </div>
    </div>
  );
}
