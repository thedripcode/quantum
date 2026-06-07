'use client';

import { useState } from 'react';
import { Download, FileText, Filter, Calendar } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

type ReportType = 'performance' | 'attendance' | 'applications' | 'teachers';

const schoolPerformanceData = [
  { month: 'Jan', avg: 68 }, { month: 'Feb', avg: 69 }, { month: 'Mar', avg: 70 },
  { month: 'Apr', avg: 71 }, { month: 'May', avg: 70 }, { month: 'Jun', avg: 72 },
  { month: 'Jul', avg: 71 }, { month: 'Aug', avg: 73 }, { month: 'Sep', avg: 72 },
];

const gradePerformance = [
  { grade: 'Gr 8', avg: 70, pass: 88 },
  { grade: 'Gr 9', avg: 69, pass: 86 },
  { grade: 'Gr 10', avg: 71, pass: 89 },
  { grade: 'Gr 11', avg: 72, pass: 90 },
  { grade: 'Gr 12', avg: 75, pass: 93 },
];

const attendanceData = [
  { grade: 'Gr 8', rate: 93 },
  { grade: 'Gr 9', rate: 91 },
  { grade: 'Gr 10', rate: 94 },
  { grade: 'Gr 11', rate: 95 },
  { grade: 'Gr 12', rate: 96 },
];

const applicationStats = [
  { status: 'Pending', count: 8, color: AMBER },
  { status: 'Approved', count: 2, color: GREEN },
  { status: 'Rejected', count: 1, color: RED },
  { status: 'Info Req.', count: 1, color: BLUE },
];

const teacherLoadData = [
  { name: 'Mr. Dlamini', classes: 3 },
  { name: 'Ms. van der Merwe', classes: 3 },
  { name: 'Mrs. Khumalo', classes: 3 },
  { name: 'Mr. Mthembu', classes: 4 },
  { name: 'Ms. Ngubane', classes: 3 },
  { name: 'Mr. Sithole', classes: 4 },
];

const REPORT_TYPE_CONFIG: { id: ReportType; label: string; description: string }[] = [
  { id: 'performance', label: 'School Performance', description: 'Grade averages and pass rates' },
  { id: 'attendance', label: 'Attendance', description: 'Attendance rates by grade' },
  { id: 'applications', label: 'Applications', description: 'Application pipeline overview' },
  { id: 'teachers', label: 'Teacher Load', description: 'Class allocation per teacher' },
];

const QUICK_STATS = [
  { label: 'Reports Generated', value: '24', sub: 'This year', color: BLUE },
  { label: 'Last Report', value: 'Today', sub: 'Performance', color: GREEN },
  { label: 'Avg Pass Rate', value: '94%', sub: 'School-wide', color: GOLD },
  { label: 'At Risk Students', value: '12', sub: 'Require action', color: RED },
];

const RECENT_REPORTS = [
  { title: 'Term 2 Performance Report', date: '28 Jun 2025', size: '2.4 MB' },
  { title: 'Q2 Attendance Summary', date: '30 Jun 2025', size: '1.1 MB' },
  { title: 'Staff Load Report — June', date: '25 Jun 2025', size: '892 KB' },
  { title: 'Applications Mid-Year', date: '20 Jun 2025', size: '760 KB' },
];

const SUMMARIES: Record<ReportType, string> = {
  performance: 'School performance has shown a steady upward trend from January through September, with the overall average rising from 68% to 72%. Grade 12 leads with an average of 75% and a 93% pass rate, reflecting strong Matric preparation. Grades 8–11 remain within the 69–72% range. Continued focus on targeted support for Grade 9 learners is recommended to address the slight dip observed in February.',
  attendance: 'Attendance rates are strong across all grades, ranging from 91% in Grade 9 to 96% in Grade 12. The school-wide average sits at 93.8%, which exceeds the national benchmark of 90%. Grade 9 has the lowest attendance rate and warrants closer monitoring. The data suggests that senior learners — particularly Grade 11 and 12 — maintain higher attendance, likely driven by examination pressure and mentorship programmes.',
  applications: 'A total of 12 applications have been received for the upcoming academic year. 8 are currently pending review, 2 have been approved, 1 has been rejected, and 1 requires additional information from the applicant. The approval pipeline is progressing well. It is recommended that pending applications be reviewed before the end of the current term to ensure timely placement decisions and adequate classroom planning.',
  teachers: 'Teacher workload is distributed across 6 staff members. Mr. Mthembu and Mr. Sithole each carry 4 classes, while the remaining four teachers are each assigned 3 classes. The average class load per teacher is 3.3 classes. This distribution is considered sustainable; however, consideration should be given to balancing workloads more evenly if additional class sections are added in the next academic year.',
};

const tooltipStyle = {
  contentStyle: {
    background: S2,
    border: `1px solid rgba(255,255,255,0.10)`,
    borderRadius: 10,
    fontSize: 12,
    color: TEXT,
  },
};

const axisStyle = { fill: 'rgba(255,255,255,0.45)', fontSize: 11 };
const gridStyle = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.06)' };

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('performance');
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-09-30' });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<Set<ReportType>>(new Set());
  const [gradeFilter, setGradeFilter] = useState('All');

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(prev => new Set([...prev, reportType]));
    }, 1500);
  };

  const isGenerated = generated.has(reportType);

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Reports</h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0, marginTop: 4 }}>Generate and download school reports</p>
      </div>

      {/* ── Quick stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {QUICK_STATS.map(s => (
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {REPORT_TYPE_CONFIG.map(r => {
            const active = reportType === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setReportType(r.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: `1px solid ${active ? GOLD_B : BORDER}`,
                  background: active ? GOLD_DIM : SURFACE,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: active ? GOLD : TEXT, fontFamily: FH, marginBottom: 4, letterSpacing: '-0.01em' }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 11, color: FAINT }}>{r.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filters row ── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px' }}>
          <Filter size={12} color={FAINT} />
          <span style={{ fontSize: 12, color: MUTED }}>Grade:</span>
          <select
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB, cursor: 'pointer' }}
          >
            {['All', 'Gr 8', 'Gr 9', 'Gr 10', 'Gr 11', 'Gr 12'].map(g => (
              <option key={g} value={g} style={{ background: S2 }}>{g}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px' }}>
          <Calendar size={12} color={FAINT} />
          <span style={{ fontSize: 12, color: MUTED }}>From:</span>
          <input
            type="date"
            value={dateRange.from}
            onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB, colorScheme: 'dark' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px' }}>
          <Calendar size={12} color={FAINT} />
          <span style={{ fontSize: 12, color: MUTED }}>To:</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB, colorScheme: 'dark' }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 9,
            background: generating ? 'rgba(201,168,76,0.15)' : GOLD,
            border: `1px solid ${generating ? GOLD_B : 'transparent'}`,
            color: generating ? GOLD : '#000',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: FB,
            cursor: generating ? 'default' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {generating ? (
            <>
              <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${GOLD_B}`, borderTopColor: GOLD, animation: 'spin 0.7s linear infinite' }} />
              Generating…
            </>
          ) : (
            <>
              <FileText size={13} />
              Generate Report
            </>
          )}
        </button>
      </div>

      {/* ── Report preview ── */}
      {isGenerated && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22, marginBottom: 24 }}>
          {/* Preview header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, letterSpacing: '-0.02em' }}>
                Report Preview:{' '}
                <span style={{ color: GOLD }}>
                  {REPORT_TYPE_CONFIG.find(r => r.id === reportType)?.label}
                </span>
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>
                Period: {dateRange.from} — {dateRange.to} · Grade: {gradeFilter}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, color: GOLD, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
                <Download size={12} /> Download PDF
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.25)', color: BLUE, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>
                <Download size={12} /> Export Excel
              </button>
            </div>
          </div>

          {/* Chart */}
          <div style={{ height: 260, marginBottom: 20 }}>
            {reportType === 'performance' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={schoolPerformanceData} margin={{ top: 4, right: 20, left: 0, bottom: 4 }}>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="month" tick={axisStyle} />
                  <YAxis domain={[60, 80]} tick={axisStyle} />
                  <Tooltip {...tooltipStyle} formatter={(v: unknown) => [`${v}%`, 'Avg Score']} />
                  <Line type="monotone" dataKey="avg" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {reportType === 'attendance' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 4, right: 20, left: 0, bottom: 4 }}>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="grade" tick={axisStyle} />
                  <YAxis domain={[85, 100]} tick={axisStyle} />
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
                      <Pie data={applicationStats} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} innerRadius={48} paddingAngle={3}>
                        {applicationStats.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ width: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                  {applicationStats.map(s => (
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
                      {applicationStats.reduce((a, s) => a + s.count, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'teachers' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teacherLoadData} margin={{ top: 4, right: 20, left: 0, bottom: 4 }}>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} />
                  <YAxis domain={[0, 6]} tick={axisStyle} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="classes" fill={GOLD} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Summary */}
          <div style={{ background: S2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Auto-generated Summary</div>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0 }}>{SUMMARIES[reportType]}</p>
          </div>
        </div>
      )}

      {/* ── Recent reports ── */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
        <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 14, letterSpacing: '-0.02em' }}>Recent Reports</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {RECENT_REPORTS.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: S2,
                borderRadius: 10,
                border: `1px solid ${BORDER}`,
                cursor: 'pointer',
                transition: 'border-color 0.12s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD_B; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: GOLD_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={13} color={GOLD} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: FAINT, marginTop: 2 }}>{r.date} · {r.size}</div>
                </div>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED, fontSize: 11, cursor: 'pointer', fontFamily: FB, transition: 'all 0.12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD_B; (e.currentTarget as HTMLElement).style.color = GOLD; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.color = MUTED; }}
              >
                <Download size={11} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
