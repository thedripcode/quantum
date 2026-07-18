'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CalendarCheck, Clock, MapPin, BookOpen, Loader2, AlertCircle } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

function daysUntil(dateStr: string) {
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const t = new Date();        t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86_400_000);
}

function examStatus(dateStr: string) {
  const diff = daysUntil(dateStr);
  if (diff === 0) return 'today';
  if (diff > 0)  return 'upcoming';
  return 'past';
}

function CountdownBadge({ dateStr }: { dateStr: string }) {
  const diff = daysUntil(dateStr);
  if (diff < 0)   return <span style={{ fontSize: 11, color: FAINT }}>Past</span>;
  if (diff === 0) return <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>Today</span>;
  const urgent = diff <= 7;
  return <span style={{ fontSize: 11, fontWeight: 700, color: urgent ? RED : GOLD }}>{diff === 1 ? 'Tomorrow' : `In ${diff} days`}</span>;
}

function ExamCard({ exam }: { exam: any }) {
  const status = examStatus(exam.date);
  const diff = daysUntil(exam.date);
  const d = new Date(exam.date.includes('T') ? exam.date : exam.date + 'T12:00:00');
  const borderColor = status === 'today' ? 'rgba(16,185,129,0.25)' : (status === 'upcoming' && diff <= 7) ? 'rgba(239,68,68,0.18)' : BORDER;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', background: SURFACE, border: `1px solid ${borderColor}`, borderRadius: 14 }}>
      <div style={{ width: 4, borderRadius: 99, background: exam.subject?.color ?? GOLD, alignSelf: 'stretch', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{exam.subject?.name ?? 'Unknown'}</span>
          <CountdownBadge dateStr={exam.date} />
        </div>
        <div style={{ fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 8 }}>
          {d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}><Clock size={11} />{exam.startTime} – {exam.endTime}</span>
          {exam.venue && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}><MapPin size={11} />{exam.venue}</span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}><BookOpen size={11} />{exam.totalMarks} marks</span>
          <span style={{ fontSize: 12, color: FAINT }}>Term {exam.term}</span>
        </div>
        {exam.notes && <div style={{ fontSize: 12, color: FAINT, marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>{exam.notes}</div>}
      </div>
    </div>
  );
}

export default function StudentExamsPage() {
  const { data: session } = useSession();
  const grade = (session?.user as any)?.grade as string | undefined;

  const [exams, setExams]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTerm, setFilterTerm] = useState('All');

  useEffect(() => {
    if (!grade) { setLoading(false); return; }
    fetch(`/api/exams?grade=${encodeURIComponent(grade)}`)
      .then(r => r.json())
      .then(d => { setExams(d.exams ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [grade]);

  const filtered = exams.filter(e => filterTerm === 'All' || e.term === Number(filterTerm));
  const upcoming = filtered.filter(e => daysUntil(e.date) >= 0).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past     = filtered.filter(e => daysUntil(e.date) < 0).sort((a, b)  => new Date(b.date).getTime() - new Date(a.date).getTime());
  const nextExam = upcoming[0];
  const nextDiff = nextExam ? daysUntil(nextExam.date) : null;

  const selInp: React.CSSProperties = {
    background: S2, border: `1px solid ${BORDER}`, borderRadius: 9,
    color: TEXT, fontFamily: FB, fontSize: 13, padding: '9px 12px',
    outline: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Exam Timetable</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{grade ?? 'Your'} exam schedule — stay ahead of every test.</p>
      </div>

      {/* Next exam hero */}
      {nextExam && (
        <div style={{ marginBottom: 24, padding: '18px 22px', background: nextDiff === 0 ? 'rgba(16,185,129,0.07)' : nextDiff !== null && nextDiff <= 7 ? 'rgba(239,68,68,0.07)' : GOLD_DIM, border: `1px solid ${nextDiff === 0 ? 'rgba(16,185,129,0.25)' : nextDiff !== null && nextDiff <= 7 ? 'rgba(239,68,68,0.20)' : GOLD_B}`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: nextExam.subject?.color ?? GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#000', flexShrink: 0 }}>
            {nextExam.subject?.short?.slice(0, 3) ?? '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Next Exam</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{nextExam.subject?.name}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
              {new Date(nextExam.date.includes('T') ? nextExam.date : nextExam.date + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} · {nextExam.startTime}–{nextExam.endTime}{nextExam.venue ? ` · ${nextExam.venue}` : ''}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: nextDiff === 0 ? GREEN : nextDiff !== null && nextDiff <= 7 ? RED : GOLD, fontFamily: FH, lineHeight: 1 }}>
              {nextDiff === 0 ? 'Today' : nextDiff === 1 ? '1 day' : `${nextDiff} days`}
            </div>
            {nextDiff !== 0 && <div style={{ fontSize: 11, color: FAINT }}>away</div>}
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select style={selInp} value={filterTerm} onChange={e => setFilterTerm(e.target.value)}>
          <option value="All" style={{ background: S2 }}>All Terms</option>
          {[1, 2, 3, 4].map(t => <option key={t} value={t} style={{ background: S2 }}>Term {t}</option>)}
        </select>
        <span style={{ fontSize: 12, color: FAINT }}>{filtered.length} exam{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <Loader2 size={22} className="animate-spin" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 13 }}>Loading your exam timetable…</div>
        </div>
      ) : !grade ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <AlertCircle size={28} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 14 }}>No grade assigned. Contact your admin.</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: SURFACE, borderRadius: 16, border: `1px solid ${BORDER}` }}>
          <CalendarCheck size={30} style={{ color: FAINT, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 6 }}>No exams scheduled</div>
          <div style={{ fontSize: 13, color: MUTED }}>Your teachers haven't added any exams yet.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {upcoming.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 12 }}>Upcoming ({upcoming.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{upcoming.map(e => <ExamCard key={e.id} exam={e} />)}</div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 12 }}>Past ({past.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.65 }}>{past.map(e => <ExamCard key={e.id} exam={e} />)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
