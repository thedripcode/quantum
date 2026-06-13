'use client';
import { ChartIcon, CoinIcon, UsersIcon, ShieldIcon, ScaffoldIcon, BuildingIcon, TrendUpIcon, FileIcon } from '@/components/okudingayo/OkuIcons';

const REPORTS = [
  { title: 'Monthly Financial Summary',     desc: 'Revenue, invoices, expenses, VAT report for Jun 2026',    category: 'Finance',   Icon: CoinIcon,    color: '#10b981', lastRun: '1 day ago' },
  { title: 'Project Progress Report',       desc: 'All active project status, milestones, and KPIs',         category: 'Projects',  Icon: BuildingIcon, color: '#3b82f6', lastRun: '2 days ago' },
  { title: 'Employee Attendance Report',    desc: 'Monthly attendance, leave, and overtime summary',         category: 'HR',        Icon: UsersIcon,   color: '#8b5cf6', lastRun: '5 days ago' },
  { title: 'Safety & Compliance Report',    desc: 'Incidents, toolbox talks, certificate status overview',   category: 'Safety',    Icon: ShieldIcon,  color: '#ef4444', lastRun: '1 week ago' },
  { title: 'Equipment Utilisation Report',  desc: 'Asset allocation, maintenance history, depreciation',     category: 'Equipment', Icon: ScaffoldIcon, color: '#06b6d4', lastRun: '3 days ago' },
  { title: 'Client Billing Report',         desc: 'Outstanding invoices, payment history per client',        category: 'Finance',   Icon: FileIcon,    color: '#f59e0b', lastRun: '2 days ago' },
  { title: 'Revenue Analytics',             desc: 'Monthly trend, forecast, and target comparison',          category: 'Finance',   Icon: TrendUpIcon, color: '#10b981', lastRun: '1 day ago' },
  { title: 'Operational KPI Dashboard',     desc: 'Response times, first-fix rates, customer satisfaction',  category: 'Operations',Icon: ChartIcon,   color: '#1e4db3', lastRun: 'Today' },
];

const QUICK_STATS = [
  { label: 'Reports Generated MTD', value: '24' },
  { label: 'Scheduled Reports',     value: '6' },
  { label: 'Data Last Synced',      value: '5 min ago' },
  { label: 'Report Recipients',     value: '8' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const JOB_DATA = [42, 58, 67, 61, 74, 67];
const REV_DATA = [82, 95, 110, 103, 138, 142];
const MAX_J = 80; const MAX_R = 160;

export default function ReportsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {QUICK_STATS.map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 14, border: '1.5px solid #f1f5f9',
            padding: '16px 18px', boxShadow: '0 2px 10px rgba(30,77,179,0.05)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1e4db3' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Jobs completed chart */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', padding: '20px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Jobs Completed (2026)</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 18 }}>Monthly job completion count</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 130, paddingBottom: 8 }}>
            {MONTHS.map((m, i) => (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>{JOB_DATA[i]}</div>
                <div style={{
                  width: '100%', height: `${(JOB_DATA[i] / MAX_J) * 110}px`,
                  background: i === MONTHS.length - 1 ? 'linear-gradient(180deg,#1e4db3,#3b72d9)' : 'linear-gradient(180deg,#93c5fd,#bfdbfe)',
                  borderRadius: '6px 6px 0 0',
                }} />
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue chart */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', padding: '20px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Revenue (R thousands, 2026)</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 18 }}>Monthly revenue trend</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 130, paddingBottom: 8 }}>
            {MONTHS.map((m, i) => (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>R{REV_DATA[i]}k</div>
                <div style={{
                  width: '100%', height: `${(REV_DATA[i] / MAX_R) * 110}px`,
                  background: i === MONTHS.length - 1 ? 'linear-gradient(180deg,#10b981,#34d399)' : 'linear-gradient(180deg,#6ee7b7,#a7f3d0)',
                  borderRadius: '6px 6px 0 0',
                }} />
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report cards */}
      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Available Reports</span>
          <button style={{ background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Schedule Report</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
          {REPORTS.map((r, i) => (
            <div key={r.title} style={{
              display: 'flex', gap: 14, padding: '18px 22px', alignItems: 'flex-start',
              borderBottom: i < REPORTS.length - 2 ? '1px solid #f8fafc' : 'none',
              borderRight: i % 2 === 0 ? '1px solid #f8fafc' : 'none',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: r.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <r.Icon size={22} color={r.color} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, marginBottom: 10 }}>{r.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, background: r.color + '18', color: r.color, padding: '2px 8px', borderRadius: 100 }}>{r.category}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>Last run: {r.lastRun}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['Generate', 'Schedule'].map(a => (
                      <button key={a} style={{
                        padding: '5px 12px', borderRadius: 100, border: '1.5px solid #e2e8f0',
                        background: 'white', color: '#334155', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      }}>{a}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
