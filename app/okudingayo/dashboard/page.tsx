'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SketchFilterDef,
  HomeIcon, DropIcon, UsersIcon, BoxIcon, CoinIcon, HatIcon,
  ChartIcon, ClipboardIcon, MegaphoneIcon,
  LightningIcon, CheckIcon, StarIcon, SignalIcon, RefreshIcon,
  TruckIcon, AlertIcon, WrenchIcon, ClockIcon, TargetIcon,
  SmileIcon, FileIcon, GlobeIcon, ShieldIcon, TrendUpIcon,
  PersonIcon, ReviewIcon, PinIcon, PhoneIcon,
} from '@/components/okudingayo/OkuIcons';

const NAV = [
  { Icon: HomeIcon,      label: 'Overview',   id: 'overview' },
  { Icon: DropIcon,      label: 'Jobs',        id: 'jobs' },
  { Icon: UsersIcon,     label: 'Customers',   id: 'customers' },
  { Icon: BoxIcon,       label: 'Inventory',   id: 'inventory' },
  { Icon: CoinIcon,      label: 'Financials',  id: 'financials' },
  { Icon: HatIcon,       label: 'Team',        id: 'team' },
  { Icon: ChartIcon,     label: 'Analytics',   id: 'analytics' },
  { Icon: ClipboardIcon, label: 'Compliance',  id: 'compliance' },
  { Icon: MegaphoneIcon, label: 'Marketing',   id: 'marketing' },
];

const JOBS = [
  { id: 'JOB-001', customer: 'Sipho Mthembu',   type: 'Emergency Leak',       status: 'In Progress', tech: 'Bongani N.',  priority: 'high' },
  { id: 'JOB-002', customer: 'Nomsa Dlamini',    type: 'Drain Cleaning',       status: 'Dispatched',  tech: 'Themba K.',   priority: 'normal' },
  { id: 'JOB-003', customer: 'Rajesh Pillay',    type: 'Water Heater Install', status: 'Completed',   tech: 'Sello M.',    priority: 'normal' },
  { id: 'JOB-004', customer: 'Zanele Khumalo',   type: 'Burst Pipe',           status: 'En Route',    tech: 'Bongani N.',  priority: 'high' },
  { id: 'JOB-005', customer: 'Ahmed Moosa',      type: 'COC Inspection',       status: 'Received',    tech: 'Unassigned',  priority: 'normal' },
  { id: 'JOB-006', customer: 'Linda Ntuli',       type: 'Toilet Repair',        status: 'Evaluating',  tech: 'Themba K.',   priority: 'normal' },
];

const STATUS_PILL: Record<string, { bg: string; color: string }> = {
  'In Progress': { bg: '#dbeafe', color: '#1d4ed8' },
  'Dispatched':  { bg: '#fef3c7', color: '#b45309' },
  'Completed':   { bg: '#dcfce7', color: '#15803d' },
  'En Route':    { bg: '#ede9fe', color: '#6d28d9' },
  'Received':    { bg: '#f1f5f9', color: '#475569' },
  'Evaluating':  { bg: '#ffedd5', color: '#c2410c' },
};

const INVENTORY = [
  { item: 'Copper Pipe (15mm)',   stock: 340, min: 100, unit: 'm',     cost: 'R12/m' },
  { item: 'Water Heater 150L',   stock: 4,   min: 5,   unit: 'units', cost: 'R3,200' },
  { item: 'Gate Valve 22mm',     stock: 82,  min: 20,  unit: 'units', cost: 'R45' },
  { item: 'PTFE Tape',           stock: 156, min: 50,  unit: 'rolls', cost: 'R8' },
  { item: 'Flexible Hose 600mm', stock: 12,  min: 15,  unit: 'units', cost: 'R85' },
  { item: 'Push-fit Elbow 22mm', stock: 245, min: 80,  unit: 'units', cost: 'R18' },
];

const TEAM = [
  { name: 'Bongani Nkosi',    role: 'Senior Plumber', rating: 4.9, jobs: 187, cert: 'COC Certified', status: 'On Job' },
  { name: 'Themba Khumalo',   role: 'Plumber',        rating: 4.7, jobs: 134, cert: 'COC Certified', status: 'On Job' },
  { name: 'Sello Mokoena',    role: 'Plumber',        rating: 4.8, jobs: 156, cert: 'COC Certified', status: 'Available' },
  { name: 'Siphamandla Dube', role: 'Apprentice',     rating: 4.5, jobs: 43,  cert: 'In Training',   status: 'Available' },
];

/* ── shared card ── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16,
      border: '1.5px solid #f1f5f9',
      boxShadow: '0 2px 16px rgba(30,77,179,0.06)',
      overflow: 'hidden', ...style,
    }}>{children}</div>
  );
}

/* ── KPI with sketch icon ── */
function KPI({ Icon, label, value, sub, accent }: {
  Icon: React.FC<any>; label: string; value: string; sub: string; accent: string;
}) {
  return (
    <div style={{
      background: 'white', borderRadius: 16,
      border: '1.5px solid #f1f5f9',
      boxShadow: '0 2px 16px rgba(30,77,179,0.06)',
      padding: '22px 24px',
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{ marginBottom: 12 }}>
        <Icon size={26} color={accent} strokeWidth={1.8} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginTop: 5 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3, letterSpacing: '0.02em' }}>{sub}</div>
    </div>
  );
}

function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{
      padding: '18px 24px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', borderBottom: '1px solid #f1f5f9',
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{title}</span>
      {action}
    </div>
  );
}

function BlueBtn({ label }: { label: string }) {
  return (
    <button style={{
      background: 'linear-gradient(135deg, #1e4db3, #3b72d9)',
      color: 'white', border: 'none', padding: '8px 18px',
      borderRadius: 100, cursor: 'pointer', fontWeight: 700,
      fontSize: 12, letterSpacing: '0.01em',
    }}>{label}</button>
  );
}

/* ════════ TABS ════════ */

function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
        <KPI Icon={DropIcon}      label="Active Jobs"     value="24"      sub="↑ 3 from yesterday"   accent="#3b82f6" />
        <KPI Icon={LightningIcon} label="Emergency Jobs"  value="3"       sub="Avg response: 22 min" accent="#ef4444" />
        <KPI Icon={CheckIcon}     label="Completed Today" value="11"      sub="First-fix rate: 94%"  accent="#10b981" />
        <KPI Icon={CoinIcon}      label="Revenue (Month)" value="R142.5K" sub="↑ 12% vs last month"  accent="#f59e0b" />
        <KPI Icon={HatIcon}       label="Techs Active"    value="8 / 10"  sub="2 on standby"         accent="#8b5cf6" />
        <KPI Icon={StarIcon}      label="Avg Rating"      value="4.8"     sub="142 reviews"           accent="#f5c518" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <CardHeader title="Live Job Feed" action={<BlueBtn label="+ New Job" />} />
          <div style={{ padding: '0 24px' }}>
            {JOBS.slice(0, 4).map((job, i) => (
              <div key={job.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: i < 3 ? '1px solid #f8fafc' : 'none',
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: '#f0f5ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <WrenchIcon size={16} color="#1e4db3" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{job.customer}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{job.type} · {job.tech}</div>
                  </div>
                </div>
                <span style={{
                  background: STATUS_PILL[job.status].bg, color: STATUS_PILL[job.status].color,
                  padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                }}>{job.status}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Low Stock Alerts" />
          <div style={{ padding: '0 24px' }}>
            {INVENTORY.filter(i => i.stock <= i.min).map((item, i, arr) => (
              <div key={item.item} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none',
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, background: '#fff5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <AlertIcon size={16} color="#ef4444" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.item}</div>
                    <div style={{ fontSize: 11, color: '#ef4444', marginTop: 1 }}>{item.stock} {item.unit} left (min {item.min})</div>
                  </div>
                </div>
                <button style={{
                  background: '#eff6ff', color: '#1e4db3', border: 'none',
                  padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}>Reorder</button>
              </div>
            ))}
            <div style={{ padding: '14px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#15803d', fontWeight: 600 }}>
              <CheckIcon size={14} color="#15803d" strokeWidth={2} />
              4 other items fully stocked
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function JobsTab() {
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Received', 'Dispatched', 'En Route', 'In Progress', 'Evaluating', 'Completed'];
  const filtered = filter === 'All' ? JOBS : JOBS.filter(j => j.status === filter);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              background: filter === s ? '#1e4db3' : '#f1f5f9',
              color: filter === s ? 'white' : '#475569',
            }}>{s}</button>
          ))}
        </div>
        <BlueBtn label="+ New Job" />
      </div>
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Job ID', 'Customer', 'Service Type', 'Technician', 'Status', 'Priority'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DropIcon size={14} color="#1e4db3" strokeWidth={2} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e4db3' }}>{job.id}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{job.customer}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{job.type}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PersonIcon size={14} color="#64748b" strokeWidth={1.8} />
                    <span style={{ fontSize: 13, color: '#475569' }}>{job.tech}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ background: STATUS_PILL[job.status].bg, color: STATUS_PILL[job.status].color, padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{job.status}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    background: job.priority === 'high' ? '#fef2f2' : '#f0fdf4',
                    color: job.priority === 'high' ? '#dc2626' : '#15803d',
                    padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                  }}>{job.priority === 'high' ? 'Emergency' : 'Normal'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function CustomersTab() {
  const customers = [
    { name: 'Sipho Mthembu',  area: 'Pinetown',   jobs: 8,  spend: 'R14,200', last: '2 days ago',  rating: 5, color: '#1e4db3' },
    { name: 'Nomsa Dlamini',  area: 'Umlazi',     jobs: 3,  spend: 'R5,400',  last: '1 week ago',  rating: 5, color: '#0891b2' },
    { name: 'Rajesh Pillay',  area: 'Chatsworth', jobs: 12, spend: 'R32,800', last: 'Today',        rating: 4, color: '#7c3aed' },
    { name: 'Zanele Khumalo', area: 'KwaMashu',   jobs: 5,  spend: 'R8,900',  last: 'Today',        rating: 5, color: '#059669' },
    { name: 'Ahmed Moosa',    area: 'Westville',  jobs: 7,  spend: 'R21,500', last: '3 days ago',  rating: 5, color: '#b45309' },
    { name: 'Linda Ntuli',    area: 'Isipingo',   jobs: 2,  spend: 'R3,100',  last: '2 weeks ago', rating: 4, color: '#0891b2' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input placeholder="Search customers..." style={{
          padding: '10px 16px', borderRadius: 100,
          border: '1.5px solid #e2e8f0', fontSize: 13, width: 260, outline: 'none',
        }} />
        <BlueBtn label="+ Add Customer" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
        {customers.map(c => (
          <Card key={c.name} style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%', background: c.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 18, flexShrink: 0,
              }}>{c.name[0]}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <PinIcon size={11} color="#94a3b8" strokeWidth={2} /> {c.area}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Total Jobs</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{c.jobs}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Total Spend</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d', letterSpacing: '-0.02em' }}>{c.spend}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', alignItems: 'center' }}>
              <span>Last: {c.last}</span>
              <div style={{ display: 'flex', gap: 1 }}>
                {[1,2,3,4,5].map(i => (
                  <StarIcon key={i} size={12} color={i <= c.rating ? '#f5c518' : '#e2e8f0'} strokeWidth={1.5} />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InventoryTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <KPI Icon={BoxIcon}    label="Total SKUs"  value="142"    sub="Across 3 locations" accent="#3b82f6" />
        <KPI Icon={AlertIcon}  label="Low Stock"   value="2"      sub="Reorder needed"     accent="#ef4444" />
        <KPI Icon={CoinIcon}   label="Stock Value" value="R84.2K" sub="Current inventory"  accent="#10b981" />
      </div>
      <Card>
        <CardHeader title="Stock Levels" action={<BlueBtn label="+ Add Item" />} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Item', 'In Stock', 'Min Level', 'Unit', 'Unit Cost', 'Status'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVENTORY.map(item => {
              const low = item.stock <= item.min;
              return (
                <tr key={item.item} style={{ borderBottom: '1px solid #f8fafc', background: low ? '#fff8f8' : 'white' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: low ? '#fff0f0' : '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <WrenchIcon size={14} color={low ? '#ef4444' : '#1e4db3'} strokeWidth={1.8} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.item}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 800, color: low ? '#dc2626' : '#15803d', letterSpacing: '-0.02em' }}>{item.stock}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{item.min}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{item.unit}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{item.cost}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: low ? '#fef2f2' : '#f0fdf4', color: low ? '#dc2626' : '#15803d', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                      {low ? 'Reorder' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function FinancialsTab() {
  const invoices = [
    { id: 'INV-0842', customer: 'Rajesh Pillay',  amount: 'R4,800', status: 'Paid',    due: '2026-05-28', method: 'EFT' },
    { id: 'INV-0843', customer: 'Sipho Mthembu',  amount: 'R1,200', status: 'Pending', due: '2026-06-10', method: 'PayFast' },
    { id: 'INV-0844', customer: 'Ahmed Moosa',    amount: 'R7,500', status: 'Paid',    due: '2026-05-30', method: 'SnapScan' },
    { id: 'INV-0845', customer: 'Zanele Khumalo', amount: 'R2,300', status: 'Overdue', due: '2026-05-20', method: 'Cash' },
    { id: 'INV-0846', customer: 'Nomsa Dlamini',  amount: 'R890',   status: 'Pending', due: '2026-06-15', method: 'PayFast' },
  ];
  const sc: Record<string, { bg: string; color: string }> = {
    Paid:    { bg: '#dcfce7', color: '#15803d' },
    Pending: { bg: '#fef3c7', color: '#b45309' },
    Overdue: { bg: '#fef2f2', color: '#dc2626' },
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <KPI Icon={TrendUpIcon}  label="Monthly Revenue" value="R142.5K" sub="+12% vs last month"      accent="#10b981" />
        <KPI Icon={FileIcon}     label="Open Invoices"   value="R16.4K"  sub="3 invoices pending"      accent="#f59e0b" />
        <KPI Icon={AlertIcon}    label="Overdue"         value="R2,300"  sub="1 invoice overdue"       accent="#ef4444" />
        <KPI Icon={RefreshIcon}  label="Recurring (MRC)" value="R28.2K"  sub="14 maintenance contracts" accent="#8b5cf6" />
      </div>
      <Card>
        <CardHeader title="Recent Invoices" action={<BlueBtn label="+ New Invoice" />} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Invoice', 'Customer', 'Amount', 'Due Date', 'Method', 'Status'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileIcon size={14} color="#1e4db3" strokeWidth={1.8} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e4db3' }}>{inv.id}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{inv.customer}</td>
                <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{inv.amount}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{inv.due}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{inv.method}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ background: sc[inv.status].bg, color: sc[inv.status].color, padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{inv.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function TeamTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <KPI Icon={PersonIcon}  label="Total Staff"   value="10"  sub="8 active today"     accent="#3b82f6" />
        <KPI Icon={ShieldIcon}  label="COC Certified" value="8"   sub="2 in training"      accent="#10b981" />
        <KPI Icon={StarIcon}    label="Avg Rating"    value="4.7" sub="All reviews"         accent="#f5c518" />
        <KPI Icon={ChartIcon}   label="Jobs (Month)"  value="186" sub="Avg 18.6 per tech"   accent="#8b5cf6" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
        {TEAM.map(t => (
          <Card key={t.name} style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e4db3, #3b72d9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: 20,
                }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
              <span style={{
                background: t.status === 'On Job' ? '#eff6ff' : '#f0fdf4',
                color: t.status === 'On Job' ? '#1e4db3' : '#15803d',
                padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
              }}>{t.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { l: 'Rating', v: String(t.rating), Icon: StarIcon, c: '#f5c518' },
                { l: 'Jobs',   v: String(t.jobs),   Icon: ChartIcon, c: '#1e4db3' },
                { l: 'Cert',   v: t.cert === 'COC Certified' ? 'Certified' : 'Training', Icon: ShieldIcon, c: '#10b981' },
              ].map(({ l, v, Icon, c }) => (
                <div key={l} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                  <Icon size={14} color={c} strokeWidth={1.8} style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const bars = [
    { label: 'Mon', jobs: 22 }, { label: 'Tue', jobs: 18 }, { label: 'Wed', jobs: 31 },
    { label: 'Thu', jobs: 25 }, { label: 'Fri', jobs: 28 }, { label: 'Sat', jobs: 20 }, { label: 'Sun', jobs: 8 },
  ];
  const max = Math.max(...bars.map(b => b.jobs));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <KPI Icon={ClockIcon}  label="Avg Response"  value="22 min" sub="Target: 30 min"    accent="#10b981" />
        <KPI Icon={TargetIcon} label="First-Fix Rate" value="94%"   sub="+2% vs last month"  accent="#3b82f6" />
        <KPI Icon={TruckIcon}  label="Jobs / Week"   value="152"    sub="8% growth"           accent="#f59e0b" />
        <KPI Icon={SmileIcon}  label="NPS Score"     value="74"     sub="World-class level"   accent="#8b5cf6" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <CardHeader title="Jobs Completed — This Week" />
          <div style={{ padding: '24px', display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
            {bars.map(b => (
              <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1e4db3' }}>{b.jobs}</span>
                <div style={{
                  width: '100%', borderRadius: '6px 6px 0 0',
                  background: 'linear-gradient(180deg, #1e4db3, #3b72d9)',
                  height: `${(b.jobs / max) * 128}px`, minHeight: 4,
                }} />
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Job Type Breakdown" />
          <div style={{ padding: '20px 24px' }}>
            {[
              { type: 'Emergency Leaks', pct: 32, color: '#ef4444', Icon: LightningIcon },
              { type: 'Drain Cleaning',  pct: 24, color: '#3b82f6', Icon: DropIcon },
              { type: 'Water Heater',    pct: 18, color: '#f59e0b', Icon: WrenchIcon },
              { type: 'COC Inspections', pct: 14, color: '#10b981', Icon: ClipboardIcon },
              { type: 'General Repairs', pct: 12, color: '#8b5cf6', Icon: ToolIcon },
            ].map(({ type, pct, color, Icon }) => (
              <div key={type} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Icon size={13} color={color} strokeWidth={2} />
                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{type}</span>
                  </div>
                  <span style={{ fontWeight: 800, color, fontSize: 13, letterSpacing: '-0.01em' }}>{pct}%</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: 100, height: 7 }}>
                  <div style={{ background: color, width: `${pct}%`, height: 7, borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ToolIcon({ size = 16, color = 'currentColor', strokeWidth = 1.8 }: { size?: number; color?: string; strokeWidth?: number }) {
  return <WrenchIcon size={size} color={color} strokeWidth={strokeWidth} />;
}

function ComplianceTab() {
  const docs = [
    { name: 'COC — Rajesh Pillay',    type: 'Certificate', date: '2026-05-28', expires: '2027-05-28', status: 'Valid' },
    { name: 'COC — Ahmed Moosa',      type: 'Certificate', date: '2026-04-12', expires: '2027-04-12', status: 'Valid' },
    { name: 'H&S Incident Report',    type: 'Report',      date: '2026-05-10', expires: 'N/A',        status: 'Filed' },
    { name: 'Insurance Claim #INC44', type: 'Claim',       date: '2026-05-15', expires: 'N/A',        status: 'Pending' },
    { name: 'Bongani COC License',    type: 'License',     date: '2024-08-01', expires: '2026-08-01', status: 'Valid' },
  ];
  const sc: Record<string, { bg: string; color: string }> = {
    Valid:   { bg: '#dcfce7', color: '#15803d' },
    Filed:   { bg: '#dbeafe', color: '#1d4ed8' },
    Pending: { bg: '#fef3c7', color: '#b45309' },
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <KPI Icon={ClipboardIcon} label="COC Documents" value="18"   sub="All valid"            accent="#10b981" />
        <KPI Icon={ClockIcon}     label="Expiring Soon" value="1"    sub="Within 90 days"       accent="#f59e0b" />
        <KPI Icon={ShieldIcon}    label="POPIA Status"  value="OK"   sub="Last audit: May 2026" accent="#3b82f6" />
        <KPI Icon={FileIcon}      label="Total Docs"    value="42"   sub="Retained per law"     accent="#8b5cf6" />
      </div>
      <Card>
        <CardHeader title="Compliance Documents" action={<BlueBtn label="+ Generate COC" />} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Document', 'Type', 'Date Issued', 'Expires', 'Status'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map(d => (
              <tr key={d.name} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ClipboardIcon size={14} color="#1e4db3" strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{d.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{d.type}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{d.date}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{d.expires}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ background: sc[d.status].bg, color: sc[d.status].color, padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function MarketingTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <KPI Icon={StarIcon}      label="Google Rating"    value="4.8" sub="142 reviews"         accent="#f5c518" />
        <KPI Icon={ReviewIcon}    label="Review Requests"  value="28"  sub="Sent this month"     accent="#3b82f6" />
        <KPI Icon={FileIcon}      label="Blog Posts"       value="12"  sub="4 drafts pending"    accent="#10b981" />
        <KPI Icon={TrendUpIcon}   label="Lead Conversion"  value="34%" sub="+5% vs last month"   accent="#8b5cf6" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <CardHeader title="Review Platforms" />
          <div style={{ padding: '0 24px' }}>
            {[
              { platform: 'Google',     rating: 4.8, reviews: 98,  color: '#4285f4' },
              { platform: 'Trustpilot', rating: 4.7, reviews: 31,  color: '#00b67a' },
              { platform: 'Facebook',   rating: 4.9, reviews: 13,  color: '#1877f2' },
            ].map((p, i, arr) => (
              <div key={p.platform} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: p.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlobeIcon size={16} color={p.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{p.platform}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{p.reviews} reviews</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <StarIcon size={16} color="#f5c518" strokeWidth={1.5} />
                  <span style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', letterSpacing: '-0.02em' }}>{p.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Blog Posts" action={<BlueBtn label="+ New Post" />} />
          <div style={{ padding: '0 24px' }}>
            {[
              { title: '5 Signs Your Water Heater Needs Replacing', status: 'Published', views: 842 },
              { title: 'How to Prevent Burst Pipes in Winter',       status: 'Published', views: 1204 },
              { title: 'KZN Rainy Season Plumbing Checklist',        status: 'Draft',     views: 0 },
              { title: 'Understanding Your Plumbing COC',            status: 'Published', views: 563 },
            ].map((post, i, arr) => (
              <div key={post.title} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none',
              }}>
                <div style={{ flex: 1, marginRight: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>{post.title}</div>
                  {post.views > 0 && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{post.views.toLocaleString()} views</div>}
                </div>
                <span style={{
                  background: post.status === 'Published' ? '#dcfce7' : '#fef3c7',
                  color: post.status === 'Published' ? '#15803d' : '#b45309',
                  padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{post.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ════════ MAIN ════════ */
export default function OkuDashboard() {
  const router = useRouter();
  const [tab, setTab]       = useState('overview');
  const [collapsed, setCol] = useState(false);
  const [user, setUser]     = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('oku_user');
    if (!stored) { router.push('/okudingayo/login'); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  if (!user) return null;

  const currentLabel = NAV.find(n => n.id === tab)?.label ?? 'Dashboard';
  const CurrentIcon  = NAV.find(n => n.id === tab)?.Icon ?? HomeIcon;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Inject sketch SVG filter once */}
      <SketchFilterDef />

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 68 : 232, flexShrink: 0, transition: 'width 0.22s',
        background: '#1e4db3', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Noise */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px', mixBlendMode: 'overlay', opacity: 0.6,
        }} />

        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <div style={{
            width: 36, height: 36, background: '#f5e85e', borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 15, color: '#1a1a1a',
          }}>O</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Okudingayo</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Trading Enterprise</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', position: 'relative' }}>
          {!collapsed && (
            <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 12px 8px', margin: 0 }}>
              Main Menu
            </p>
          )}
          {NAV.map(({ Icon, label, id }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 12, padding: collapsed ? '11px 18px' : '10px 14px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                marginBottom: 2, transition: 'background 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}>
                <Icon
                  size={18}
                  color={active ? '#f5e85e' : 'rgba(255,255,255,0.55)'}
                  strokeWidth={active ? 2 : 1.6}
                />
                {!collapsed && (
                  <span style={{
                    fontSize: 13, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap',
                    color: active ? 'white' : 'rgba(255,255,255,0.58)',
                  }}>{label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.10)', position: 'relative' }}>
          {!collapsed && (
            <div style={{ padding: '0 14px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 13, flexShrink: 0,
              }}>{user.email[0].toUpperCase()}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.role}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
              </div>
            </div>
          )}
          <button onClick={() => { localStorage.removeItem('oku_user'); router.push('/okudingayo/login'); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,255,255,0.45)', fontSize: 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <PhoneIcon size={16} color="rgba(255,255,255,0.45)" strokeWidth={1.6} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          background: 'white', borderBottom: '1px solid #f1f5f9',
          padding: '0 28px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, boxShadow: '0 1px 8px rgba(30,77,179,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setCol(!collapsed)} style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#f1f5f9', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 15,
            }}>☰</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CurrentIcon size={20} color="#1e4db3" strokeWidth={2} />
              <div>
                <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{currentLabel}</h1>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Okudingayo Trading Enterprise</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 100, padding: '6px 14px',
            }}>
              <LightningIcon size={13} color="#dc2626" strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>3 Emergency Jobs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e4db3, #3b72d9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 14,
              }}>{user.email[0].toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{user.role}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{user.email}</div>
              </div>
            </div>
            <Link href="/okudingayo" style={{
              background: '#f1f5f9', color: '#475569',
              padding: '8px 16px', borderRadius: 100,
              fontWeight: 600, fontSize: 12, textDecoration: 'none',
            }}>← Back to site</Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          {tab === 'overview'   && <OverviewTab />}
          {tab === 'jobs'       && <JobsTab />}
          {tab === 'customers'  && <CustomersTab />}
          {tab === 'inventory'  && <InventoryTab />}
          {tab === 'financials' && <FinancialsTab />}
          {tab === 'team'       && <TeamTab />}
          {tab === 'analytics'  && <AnalyticsTab />}
          {tab === 'compliance' && <ComplianceTab />}
          {tab === 'marketing'  && <MarketingTab />}
        </main>
      </div>
    </div>
  );
}
