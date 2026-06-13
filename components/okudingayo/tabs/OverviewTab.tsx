'use client';
import {
  DropIcon, LightningIcon, CheckIcon, CoinIcon, HatIcon, StarIcon,
  WrenchIcon, AlertIcon, ClockIcon, TrendUpIcon, BuildingIcon, CalendarIcon,
} from '@/components/okudingayo/OkuIcons';

const PROJECTS = [
  { name: 'Umhlanga Ridge Office Complex', client: 'Coastline Developments', progress: 72, status: 'On Track', color: '#10b981' },
  { name: 'Durban Harbour Scaffolding Phase 2', client: 'Transnet Port Authority', progress: 45, status: 'In Progress', color: '#3b82f6' },
  { name: 'Gateway Theatre Renovation', client: 'Hyprop Investments', progress: 89, status: 'Near Complete', color: '#8b5cf6' },
  { name: 'KwaMashu Industrial Park', client: 'EDTEA', progress: 18, status: 'Early Stage', color: '#f59e0b' },
  { name: 'Pietermaritzburg Municipal Works', client: 'uMgungundlovu DM', progress: 61, status: 'On Track', color: '#10b981' },
];

const ACTIVITY = [
  { icon: 'drop', text: 'Job #0047 assigned to Bongani Nkosi — Umhlanga site inspection', time: '8 min ago', accent: '#3b82f6' },
  { icon: 'alert', text: 'Low stock alert: Scaffolding couplers below minimum (12 units)', time: '23 min ago', accent: '#ef4444' },
  { icon: 'check', text: 'Invoice INV-2026-089 paid — R48,500 received from Hyprop', time: '1 hr ago', accent: '#10b981' },
  { icon: 'hat', text: 'Sello Mokoena completed COC refresher training', time: '2 hr ago', accent: '#8b5cf6' },
  { icon: 'clock', text: 'Site photo report uploaded — Harbour Phase 2 progress', time: '3 hr ago', accent: '#f59e0b' },
  { icon: 'trend', text: 'Monthly revenue target 87% achieved — R142,500 of R163,000', time: '5 hr ago', accent: '#10b981' },
];

const DEADLINES = [
  { project: 'Gateway Theatre Renovation', task: 'Final scaffolding inspection', date: 'Jun 14', urgent: true },
  { project: 'Umhlanga Office Complex', task: 'Progress report submission', date: 'Jun 17', urgent: false },
  { project: 'Harbour Phase 2', task: 'Equipment delivery confirmation', date: 'Jun 20', urgent: false },
  { project: 'KwaMashu Industrial Park', task: 'Site safety audit', date: 'Jun 22', urgent: false },
];

function KPI({ Icon, label, value, sub, accent }: { Icon: any; label: string; value: string; sub: string; accent: string }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9',
      boxShadow: '0 2px 16px rgba(30,77,179,0.06)', padding: '20px 22px',
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{ marginBottom: 10 }}><Icon size={24} color={accent} strokeWidth={1.8} /></div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginTop: 5 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{sub}</div>
    </div>
  );
}

export default function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Safety Alert Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #fef3c7, #fffbeb)',
        border: '1px solid #fcd34d', borderRadius: 12, padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <AlertIcon size={20} color="#b45309" strokeWidth={2} />
        <div>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>Safety Alert: </span>
          <span style={{ fontSize: 13, color: '#78350f' }}>
            3 employee safety certificates expire within 30 days. PPE inspection overdue for KwaMashu site.
          </span>
        </div>
        <button style={{
          marginLeft: 'auto', background: '#b45309', color: 'white', border: 'none',
          padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>Review</button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <KPI Icon={BuildingIcon} label="Active Projects"    value="8"       sub="2 near completion"       accent="#3b82f6" />
        <KPI Icon={HatIcon}      label="Total Employees"    value="34"      sub="28 field, 6 office"      accent="#8b5cf6" />
        <KPI Icon={DropIcon}     label="Pending Invoices"   value="11"      sub="R284,000 outstanding"    accent="#f59e0b" />
        <KPI Icon={LightningIcon} label="Safety Score"     value="87%"     sub="Target: 95%"             accent="#10b981" />
        <KPI Icon={WrenchIcon}   label="Equipment Items"    value="142"     sub="6 under maintenance"     accent="#06b6d4" />
        <KPI Icon={CoinIcon}     label="Revenue (MTD)"      value="R142.5K" sub="87% of monthly target"  accent="#f59e0b" />
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>

        {/* Project Status */}
        <div style={{
          background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9',
          boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Active Project Status</span>
            <button style={{ background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white', border: 'none', padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {PROJECTS.map((p) => (
              <div key={p.name} style={{ padding: '12px 24px', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.client}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: p.color,
                    background: p.color + '18', padding: '3px 10px', borderRadius: 100,
                    height: 'fit-content', marginTop: 2, whiteSpace: 'nowrap',
                  }}>{p.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 100 }}>
                    <div style={{ height: '100%', width: `${p.progress}%`, background: p.color, borderRadius: 100, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#334155', minWidth: 32 }}>{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Activity + Deadlines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Recent Activity */}
          <div style={{
            background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Recent Activity</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {ACTIVITY.slice(0, 4).map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '10px 18px',
                  borderBottom: i < 3 ? '1px solid #f8fafc' : 'none', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: a.accent, marginTop: 5, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{a.text}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div style={{
            background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Upcoming Deadlines</span>
            </div>
            {DEADLINES.map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px',
                borderBottom: i < DEADLINES.length - 1 ? '1px solid #f8fafc' : 'none',
              }}>
                <CalendarIcon size={16} color={d.urgent ? '#ef4444' : '#64748b'} strokeWidth={1.8} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{d.task}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{d.project}</div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: d.urgent ? '#ef4444' : '#64748b',
                  background: d.urgent ? '#fee2e2' : '#f1f5f9',
                  padding: '3px 10px', borderRadius: 100,
                }}>{d.date}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Avg Response Time', value: '38 min', sub: 'Emergency dispatch', icon: ClockIcon, accent: '#06b6d4' },
          { label: 'Jobs Completed MTD', value: '67', sub: 'First-fix rate: 91%', icon: CheckIcon, accent: '#10b981' },
          { label: 'Client Satisfaction', value: '4.7★', sub: '58 reviews this month', icon: StarIcon, accent: '#f5c518' },
          { label: 'Revenue Growth', value: '+18%', sub: 'vs same month last year', icon: TrendUpIcon, accent: '#8b5cf6' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(30,77,179,0.06)', padding: '18px 20px',
            display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: s.accent + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <s.icon size={22} color={s.accent} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{s.label}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
