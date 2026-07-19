'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Filter, Loader2, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

type ReportType = 'performance' | 'attendance' | 'applications' | 'teachers';

const REPORT_TYPE_CONFIG: { id: ReportType; label: string; description: string }[] = [
  { id: 'performance',  label: 'School Performance', description: 'Grade averages and pass rates' },
  { id: 'attendance',   label: 'Attendance',         description: 'Attendance rates by grade' },
  { id: 'applications', label: 'Applications',       description: 'Application pipeline overview' },
  { id: 'teachers',     label: 'Teacher Load',       description: 'Subjects and learners per teacher' },
];

const APP_STATUS_COLORS: Record<string, string> = {
  Pending: AMBER, Approved: GREEN, Rejected: RED, 'Info Requested': BLUE, Waitlisted: '#A78BFA',
};

const tooltipStyle = {
  contentStyle: { background: S2, border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, fontSize: 12, color: TEXT },
};
const axisStyle = { fill: 'rgba(255,255,255,0.45)', fontSize: 11 };
const gridStyle = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.06)' };

// Build and download a CSV from rows of [header, ...values]
function downloadCsv(filename: string, header: string[], rows: (string | number | null)[][]) {
  const esc = (v: string | number | null) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [header, ...rows].map(r => r.map(esc).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function ReportsPage() {
  const [data, setData]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [reportType, setReportType] = useState<ReportType>('performance');
  const [gradeFilter, setGradeFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/reports');
    if (r.ok) setData(await r.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

  const performanceRows = useMemo(() => {
    if (!data) return [];
    return gradeFilter === 'All' ? data.performance : data.performance.filter((p: any) => p.grade === gradeFilter);
  }, [data, gradeFilter]);

  const attendanceRows = useMemo(() => {
    if (!data) return [];
    return gradeFilter === 'All' ? data.attendance : data.attendance.filter((a: any) => a.grade === gradeFilter);
  }, [data, gradeFilter]);

  const appRows = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.applications).map(([status, count]) => ({
      status, count: count as number, color: APP_STATUS_COLORS[status] ?? MUTED,
    }));
  }, [data]);

  const summary = useMemo(() => {
    if (!data) return '';
    const s = data.stats;
    if (reportType === 'performance') {
      const graded = data.performance.filter((p: any) => p.avg !== null);
      const best = graded.slice().sort((a: any, b: any) => b.avg - a.avg)[0];
      return `The school currently has ${s.totalStudents} active learners. The overall average across learners with captured marks is ${s.schoolAvg ?? '—'}%, against a pass mark of ${data.passMark}%. ` +
        (best ? `${best.grade} leads with an average of ${best.avg}%. ` : '') +
        `${s.atRisk} learner${s.atRisk === 1 ? ' is' : 's are'} below the pass mark and flagged as at-risk. Grades without captured marks show no average yet.`;
    }
    if (reportType === 'attendance') {
      const withData = data.attendance.filter((a: any) => a.rate !== null);
      if (withData.length === 0) return 'No attendance registers have been captured yet — rates will appear as teachers take the daily register.';
      const overall = Math.round(withData.reduce((acc: number, a: any) => acc + a.rate, 0) / withData.length);
      return `Attendance registers cover ${data.attendance.reduce((acc: number, a: any) => acc + a.records, 0)} recorded entries. The average attendance rate across grades with data is ${overall}%. Grades without registers captured show no rate yet.`;
    }
    if (reportType === 'applications') {
      const total = appRows.reduce((a: number, r: any) => a + r.count, 0);
      return `A total of ${total} application${total === 1 ? '' : 's'} ${total === 1 ? 'has' : 'have'} been received. ${data.applications['Pending'] ?? 0} pending, ${data.applications['Approved'] ?? 0} approved, ${data.applications['Rejected'] ?? 0} rejected. Reviewing pending applications before term-end is recommended for placement planning.`;
    }
    const totalSubjects = data.teacherLoad.reduce((a: number, t: any) => a + t.subjects, 0);
    return `${s.totalTeachers} active teacher${s.totalTeachers === 1 ? '' : 's'} carry ${totalSubjects} subject allocation${totalSubjects === 1 ? '' : 's'} between them. The table reflects live enrolments and marks captured per teacher.`;
  }, [data, reportType, appRows]);

  const exportCsv = () => {
    if (!data) return;
    const stamp = new Date().toISOString().slice(0, 10);
    if (reportType === 'performance') {
      downloadCsv(`sidelile-performance-${stamp}.csv`,
        ['Grade', 'Students', 'Average %', `Pass rate % (pass mark ${data.passMark}%)`],
        performanceRows.map((p: any) => [p.grade, p.students, p.avg, p.passRate]));
      // Detailed per-student sheet rides along
      downloadCsv(`sidelile-performance-students-${stamp}.csv`,
        ['Student', 'Grade', 'Average %', 'Graded assessments'],
        data.studentDetail
          .filter((st: any) => gradeFilter === 'All' || st.grade === gradeFilter)
          .map((st: any) => [st.name, st.grade, st.avg, st.marksCount]));
    } else if (reportType === 'attendance') {
      downloadCsv(`sidelile-attendance-${stamp}.csv`,
        ['Grade', 'Register entries', 'Attendance rate %'],
        attendanceRows.map((a: any) => [a.grade, a.records, a.rate]));
    } else if (reportType === 'applications') {
      downloadCsv(`sidelile-applications-${stamp}.csv`,
        ['Status', 'Count'],
        appRows.map((r: any) => [r.status, r.count]));
    } else {
      downloadCsv(`sidelile-teacher-load-${stamp}.csv`,
        ['Teacher', 'Subjects', 'Subject names', 'Learners taught', 'Marks captured'],
        data.teacherLoad.map((t: any) => [t.name, t.subjects, t.subjectNames.join('; '), t.learners, t.marksCaptured]));
    }
  };

  const quickStats = data ? [
    { label: 'Active Students',      value: String(data.stats.totalStudents),                          sub: 'Enrolled',            color: BLUE },
    { label: 'School Average',       value: data.stats.schoolAvg === null ? '—' : `${data.stats.schoolAvg}%`, sub: 'Graded learners', color: GOLD },
    { label: 'At-Risk Students',     value: String(data.stats.atRisk),                                  sub: `Below ${data.passMark}%`, color: data.stats.atRisk > 0 ? RED : GREEN },
    { label: 'Pending Applications', value: String(data.stats.pendingApplications),                     sub: 'Awaiting review',     color: AMBER },
  ] : [];

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Reports</h1>
          <p style={{ fontSize: 13, color: MUTED, margin: 0, marginTop: 4 }}>Live school data · generated {today}</p>
        </div>
        <button onClick={load} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 9, background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED, fontSize: 12, fontWeight: 600, cursor: loading ? 'default' : 'pointer', fontFamily: FB }}>
          <RefreshCw size={12} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} /> Refresh
        </button>
      </div>

      {loading && !data ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: MUTED, padding: 40 }}>
          <Loader2 size={16} className="animate-spin" /> Crunching live school data…
        </div>
      ) : !data ? (
        <div style={{ color: MUTED, padding: 40 }}>Could not load report data — try Refresh.</div>
      ) : (
        <>
          {/* ── Quick stat cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            {quickStats.map(s => (
              <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: FAINT, marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Report type selector ── */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Report Type</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
              {REPORT_TYPE_CONFIG.map(r => {
                const active = reportType === r.id;
                return (
                  <div key={r.id} onClick={() => setReportType(r.id)}
                    style={{ padding: '14px 16px', borderRadius: 12, border: `1px solid ${active ? GOLD_B : BORDER}`, background: active ? GOLD_DIM : SURFACE, cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? GOLD : TEXT, fontFamily: FH, marginBottom: 4, letterSpacing: '-0.01em' }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: FAINT }}>{r.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Filters row ── */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            {(reportType === 'performance' || reportType === 'attendance') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px' }}>
                <Filter size={12} color={FAINT} />
                <span style={{ fontSize: 12, color: MUTED }}>Grade:</span>
                <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB, cursor: 'pointer' }}>
                  {['All', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                    <option key={g} value={g} style={{ background: S2 }}>{g}</option>
                  ))}
                </select>
              </div>
            )}

            <button onClick={exportCsv}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 9, background: GOLD, border: '1px solid transparent', color: '#000', fontSize: 13, fontWeight: 700, fontFamily: FB, cursor: 'pointer' }}>
              <Download size={13} /> Download CSV
            </button>
          </div>

          {/* ── Report preview ── */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22, marginBottom: 24 }}>
            <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, letterSpacing: '-0.02em', marginBottom: 20 }}>
              {REPORT_TYPE_CONFIG.find(r => r.id === reportType)?.label}
              <span style={{ color: FAINT, fontWeight: 400, fontSize: 12, marginLeft: 10 }}>live data</span>
            </div>

            {/* Chart */}
            <div style={{ height: 260, marginBottom: 20 }}>
              {reportType === 'performance' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceRows} margin={{ top: 4, right: 20, left: 0, bottom: 4 }}>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="grade" tick={axisStyle} />
                    <YAxis domain={[0, 100]} tick={axisStyle} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="avg" name="Average %" fill={GOLD} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passRate" name="Pass rate %" fill={GREEN} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {reportType === 'attendance' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceRows} margin={{ top: 4, right: 20, left: 0, bottom: 4 }}>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="grade" tick={axisStyle} />
                    <YAxis domain={[0, 100]} tick={axisStyle} />
                    <Tooltip {...tooltipStyle} formatter={(v: unknown) => [`${v}%`, 'Attendance Rate']} />
                    <Bar dataKey="rate" fill={GOLD} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {reportType === 'applications' && (
                <div style={{ display: 'flex', gap: 24, height: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={appRows} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} innerRadius={48} paddingAngle={3}>
                          {appRows.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip {...tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ width: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                    {appRows.map((s: any) => (
                      <div key={s.status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: S2, borderRadius: 8, border: `1px solid ${BORDER}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                          <span style={{ fontSize: 12, color: MUTED }}>{s.status}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: s.color, fontFamily: FH }}>{s.count}</span>
                      </div>
                    ))}
                    <div style={{ padding: '8px 12px', background: GOLD_DIM, borderRadius: 8, border: `1px solid ${GOLD_B}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>Total</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: GOLD, fontFamily: FH }}>
                        {appRows.reduce((a: number, s: any) => a + s.count, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {reportType === 'teachers' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.teacherLoad} margin={{ top: 4, right: 20, left: 0, bottom: 4 }}>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={axisStyle} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="subjects" name="Subjects" fill={GOLD} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="learners" name="Learners" fill={BLUE} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Summary */}
            <div style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Summary</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0 }}>{summary}</p>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
