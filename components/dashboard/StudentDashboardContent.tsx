'use client';

import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Bell, ChevronRight, Clock, User } from 'lucide-react';
import {
  STUDENT_SUBJECT_ATTENDANCE,
  STUDENT_TIMETABLE_TODAY,
  STUDENT_PORTAL_ANNOUNCEMENTS,
  TEACHERS_ON_LEAVE,
  STUDENT_RESULTS,
} from '@/lib/mockData';

// ─── Navy palette ─────────────────────────────────────────────────────────────
const N = {
  bg:      '#070E1D',
  surface: '#0B1628',
  card:    '#0F1F38',
  card2:   '#0D1B33',
  border:  'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.04)',
  text:    '#FFFFFF',
  muted:   'rgba(255,255,255,0.55)',
  faint:   'rgba(255,255,255,0.25)',
};
const F = {
  h: "'Bricolage Grotesque', sans-serif",
  b: "'Inter', sans-serif",
};

// ─── Category pill colors ─────────────────────────────────────────────────────
const CAT_COLOR: Record<string, { bg: string; text: string }> = {
  Academic:      { bg: 'rgba(59,130,246,0.18)',  text: '#93C5FD' },
  'Co-curricular':{ bg: 'rgba(245,158,11,0.18)', text: '#FCD34D' },
  Examination:   { bg: 'rgba(239,68,68,0.18)',   text: '#FCA5A5' },
};

// ─── Circular SVG progress ────────────────────────────────────────────────────
function CircleRing({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const R    = (size - 12) / 2;
  const circ = 2 * Math.PI * R;
  const [animated, setAnimated] = useState(0);
  const ref  = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);

  const offset = circ * (1 - animated / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={R}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
      {/* Progress */}
      <circle ref={ref} cx={size / 2} cy={size / 2} r={R}
        fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.0s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </svg>
  );
}

// ─── Styled ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  flex: 1;
  min-height: 100vh;
  background: ${N.bg};
  display: flex;
  overflow: hidden;
`;

/* Center scrollable column */
const Center = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 28px 24px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 4px; }
`;

/* Right info panel */
const RightPanel = styled.aside`
  width: 300px;
  min-height: 100vh;
  border-left: 1px solid ${N.border};
  background: ${N.surface};
  overflow-y: auto;
  flex-shrink: 0;
  padding: 28px 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 4px; }

  @media (max-width: 1200px) { display: none; }
`;

/* Section heading */
const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const SectionTitle = styled.h2`
  font-family: ${F.h};
  font-size: 18px;
  font-weight: 700;
  color: ${N.text};
  letter-spacing: -0.02em;
  margin: 0;
`;

const SeeAll = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${F.b};
  font-size: 12px;
  font-weight: 500;
  color: #93C5FD;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s ease;
  &:hover { opacity: 0.70; }
`;

/* Attendance cards scroll row */
const AttendRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 1400px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 800px)  { grid-template-columns: repeat(2, 1fr); }
`;

const AttendCard = styled(motion.div)`
  background: ${N.card};
  border: 1px solid ${N.border};
  border-radius: 16px;
  padding: 18px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: border-color 0.2s ease;
  &:hover { border-color: rgba(255,255,255,0.14); }
`;

const SubjectBadge = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${p => p.$color}22;
  border: 1px solid ${p => p.$color}44;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${F.b};
  font-size: 9.5px;
  font-weight: 700;
  color: ${p => p.$color};
  letter-spacing: 0.04em;
  margin-bottom: 2px;
`;

const AttendCount = styled.div`
  font-family: ${F.h};
  font-size: 17px;
  font-weight: 800;
  color: ${N.text};
  letter-spacing: -0.02em;
  line-height: 1;
`;

const CircleWrap = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PctLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: ${F.h};
  font-size: 15px;
  font-weight: 800;
  color: ${N.text};
  letter-spacing: -0.02em;
`;

/* Timetable */
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead``;
const TBody = styled.tbody``;

const Th = styled.th`
  font-family: ${F.b};
  font-size: 11px;
  font-weight: 600;
  color: ${N.faint};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: left;
  padding: 0 12px 12px;
  border-bottom: 1px solid ${N.border};
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${N.border2};
  transition: background 0.15s ease;
  &:hover { background: rgba(255,255,255,0.03); }
  &:last-child { border-bottom: none; }
`;

const Td = styled.td`
  font-family: ${F.b};
  font-size: 13px;
  color: ${N.muted};
  padding: 13px 12px;
  vertical-align: middle;
`;

const TypePill = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 20px;
  font-family: ${F.b};
  font-size: 10.5px;
  font-weight: 600;
  background: ${p => p.$type === 'Lab' ? 'rgba(245,158,11,0.16)' : 'rgba(59,130,246,0.14)'};
  color: ${p => p.$type === 'Lab' ? '#FCD34D' : '#93C5FD'};
`;

const ColorDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${p => p.$color};
  margin-right: 8px;
  flex-shrink: 0;
`;

/* Right panel sections */
const PanelSection = styled.div`
  padding: 0 20px 28px;
  border-bottom: 1px solid ${N.border};
  margin-bottom: 4px;
  &:last-child { border-bottom: none; }
`;

const PanelTitle = styled.h3`
  font-family: ${F.h};
  font-size: 15px;
  font-weight: 700;
  color: ${N.text};
  letter-spacing: -0.01em;
  margin: 0 0 16px;
`;

/* Announcement item */
const AnnouncementItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0;
  border-bottom: 1px solid ${N.border2};
  &:last-child { border-bottom: none; }
`;

const CatPill = styled.span<{ $cat: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-family: ${F.b};
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: ${p => (CAT_COLOR[p.$cat] || CAT_COLOR.Academic).bg};
  color: ${p => (CAT_COLOR[p.$cat] || CAT_COLOR.Academic).text};
  align-self: flex-start;
`;

/* Teacher leave item */
const TeacherRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${N.border2};
  &:last-child { border-bottom: none; }
`;

const TeacherAvatar = styled.div<{ $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: ${p => p.$color}22;
  border: 1px solid ${p => p.$color}44;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${F.h};
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$color};
  flex-shrink: 0;
`;

const DurationPill = styled.span<{ $full: boolean }>`
  margin-left: auto;
  padding: 3px 8px;
  border-radius: 20px;
  font-family: ${F.b};
  font-size: 10px;
  font-weight: 600;
  background: ${p => p.$full ? 'rgba(239,68,68,0.14)' : 'rgba(245,158,11,0.14)'};
  color: ${p => p.$full ? '#FCA5A5' : '#FCD34D'};
  flex-shrink: 0;
`;

/* Stats strip */
const StatsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 28px;

  @media (max-width: 800px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled(motion.div)`
  background: ${N.card};
  border: 1px solid ${N.border};
  border-radius: 14px;
  padding: 16px 14px;
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function StudentDashboardContent() {
  const avgResult = Math.round(STUDENT_RESULTS.reduce((s, r) => s + r.mark, 0) / STUDENT_RESULTS.length);
  const avgAttend = Math.round(
    STUDENT_SUBJECT_ATTENDANCE.reduce((s, a) => s + Math.round((a.attended / a.total) * 100), 0) /
    STUDENT_SUBJECT_ATTENDANCE.length
  );

  const STATS = [
    { label: 'Subjects',   value: '6',            sub: 'Active this term',  color: '#3B82F6' },
    { label: 'Pending',    value: '3',             sub: 'Assignments due',   color: '#F59E0B' },
    { label: 'Average',    value: `${avgResult}%`, sub: 'Term mark',         color: '#10B981' },
    { label: 'Attendance', value: `${avgAttend}%`, sub: 'This term',         color: '#8B5CF6' },
  ];

  return (
    <Page>
      <Center>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{ fontFamily: F.b, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: 4 }}>
            Student Dashboard
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: F.h, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>
              Good morning, Thabo 👋
            </h1>
            <span style={{ fontFamily: F.b, fontSize: 13, color: N.muted }}>
              Term 4 · Monday, 3 November 2025
            </span>
          </div>
        </motion.div>

        {/* ── Stats strip ── */}
        <StatsStrip>
          {STATS.map((s, i) => (
            <StatCard
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.40 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ fontFamily: F.b, fontSize: 11, fontWeight: 600, color: N.faint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: F.h, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: F.b, fontSize: 11.5, color: N.muted, marginTop: 4 }}>{s.sub}</div>
            </StatCard>
          ))}
        </StatsStrip>

        {/* ── Attendance ── */}
        <SectionHead>
          <SectionTitle>Attendance</SectionTitle>
          <SeeAll>
            View all <ChevronRight size={13} strokeWidth={2} />
          </SeeAll>
        </SectionHead>

        <AttendRow>
          {STUDENT_SUBJECT_ATTENDANCE.map((a, i) => {
            const pct = Math.round((a.attended / a.total) * 100);
            return (
              <AttendCard
                key={a.subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.40 }}
              >
                <SubjectBadge $color={a.color}>{a.short}</SubjectBadge>
                <div style={{ fontFamily: F.b, fontSize: 11, fontWeight: 500, color: N.muted, textAlign: 'center', lineHeight: 1.3, marginBottom: 2 }}>
                  {a.subject}
                </div>
                <AttendCount>{a.attended}/{a.total}</AttendCount>

                <CircleWrap>
                  <CircleRing pct={pct} color={a.color} size={80} />
                  <PctLabel>{pct}%</PctLabel>
                </CircleWrap>

                <div style={{ fontFamily: F.b, fontSize: 10.5, color: N.faint }}>This term</div>
              </AttendCard>
            );
          })}
        </AttendRow>

        {/* ── Today's timetable ── */}
        <SectionHead>
          <SectionTitle>Today&apos;s Timetable</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: F.b, fontSize: 11.5, color: N.faint }}>
            <Clock size={12} strokeWidth={1.5} />
            Monday, 3 Nov
          </div>
        </SectionHead>

        <div style={{ background: N.card, border: `1px solid ${N.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <Table>
            <THead>
              <tr>
                <Th>Time</Th>
                <Th>Room No.</Th>
                <Th>Subject</Th>
                <Th>Type</Th>
              </tr>
            </THead>
            <TBody>
              {STUDENT_TIMETABLE_TODAY.map((row, i) => (
                <Tr key={i}>
                  <Td style={{ color: '#93C5FD', fontWeight: 500 }}>{row.time}</Td>
                  <Td>
                    <span style={{ fontFamily: F.b, fontSize: 12, fontWeight: 600, color: N.text, background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6 }}>
                      {row.room}
                    </span>
                  </Td>
                  <Td style={{ color: N.text }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <ColorDot $color={row.color} />
                      {row.subject}
                    </span>
                  </Td>
                  <Td>
                    <TypePill $type={row.type}>{row.type}</TypePill>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      </Center>

      {/* ── Right panel ── */}
      <RightPanel>
        {/* Bell icon row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 20px', borderBottom: `1px solid ${N.border}`, marginBottom: 20 }}>
          <div style={{ fontFamily: F.h, fontSize: 14, fontWeight: 700, color: N.text }}>Activity</div>
          <div style={{ position: 'relative' }}>
            <Bell size={16} strokeWidth={1.5} style={{ color: N.muted }} />
            <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', border: `1.5px solid ${N.surface}` }} />
          </div>
        </div>

        {/* Announcements */}
        <PanelSection>
          <PanelTitle>Announcements</PanelTitle>
          {STUDENT_PORTAL_ANNOUNCEMENTS.map(a => (
            <AnnouncementItem key={a.id}>
              <CatPill $cat={a.category}>{a.category}</CatPill>
              <div style={{ fontFamily: F.b, fontSize: 12.5, fontWeight: 400, color: N.muted, lineHeight: 1.5 }}>
                {a.title}
              </div>
              <div style={{ fontFamily: F.b, fontSize: 11, color: N.faint }}>
                {a.time}
              </div>
            </AnnouncementItem>
          ))}
        </PanelSection>

        {/* Teachers on leave */}
        <PanelSection>
          <PanelTitle>Teachers on Leave</PanelTitle>
          {TEACHERS_ON_LEAVE.map(t => (
            <TeacherRow key={t.id}>
              <TeacherAvatar $color={t.color}>{t.initials}</TeacherAvatar>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: F.b, fontSize: 13, fontWeight: 600, color: N.text, lineHeight: 1 }}>{t.name}</div>
                <div style={{ fontFamily: F.b, fontSize: 11.5, color: N.faint, marginTop: 3 }}>{t.subject}</div>
              </div>
              <DurationPill $full={t.duration === 'Full Day'}>{t.duration}</DurationPill>
            </TeacherRow>
          ))}
        </PanelSection>

        {/* Results summary */}
        <PanelSection>
          <PanelTitle>Term Results</PanelTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STUDENT_RESULTS.map(r => (
              <div key={r.subject} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${N.border2}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', flexShrink: 0 }} />
                  <span style={{ fontFamily: F.b, fontSize: 12, color: N.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.subject}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontFamily: F.h, fontSize: 14, fontWeight: 700, color: N.text }}>{r.mark}%</span>
                  <span style={{
                    fontFamily: F.b, fontSize: 10, fontWeight: 700,
                    padding: '2px 6px', borderRadius: 6,
                    background: r.mark >= 80 ? 'rgba(16,185,129,0.18)' : r.mark >= 60 ? 'rgba(245,158,11,0.18)' : 'rgba(239,68,68,0.18)',
                    color: r.mark >= 80 ? '#6EE7B7' : r.mark >= 60 ? '#FCD34D' : '#FCA5A5',
                  }}>
                    {r.grade}
                  </span>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 }}>
              <span style={{ fontFamily: F.b, fontSize: 12, color: N.faint }}>Overall Average</span>
              <span style={{ fontFamily: F.h, fontSize: 17, fontWeight: 800, color: N.text }}>{avgResult}%</span>
            </div>
          </div>
        </PanelSection>
      </RightPanel>
    </Page>
  );
}
