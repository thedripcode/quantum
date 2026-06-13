'use client';
import { useState } from 'react';
import { BuildingIcon, CalendarIcon, UsersIcon, CameraIcon, FileIcon, PinIcon } from '@/components/okudingayo/OkuIcons';

const PROJECTS = [
  {
    id: 'PRJ-2026-001', name: 'Umhlanga Ridge Office Complex', client: 'Coastline Developments Ltd',
    type: 'Commercial Scaffolding', value: 'R 485,000', progress: 72, status: 'On Track',
    statusColor: '#10b981', start: 'Mar 1, 2026', end: 'Aug 15, 2026',
    site: 'Umhlanga, KZN', manager: 'Thulani Mthembu', team: 8, photos: 34, docs: 12,
    desc: 'Full facade scaffolding and access platforms for 12-storey commercial development.',
  },
  {
    id: 'PRJ-2026-002', name: 'Durban Harbour Scaffolding Phase 2', client: 'Transnet Port Authority',
    type: 'Industrial Scaffolding', value: 'R 1,240,000', progress: 45, status: 'In Progress',
    statusColor: '#3b82f6', start: 'Apr 10, 2026', end: 'Oct 30, 2026',
    site: 'Durban Harbour, KZN', manager: 'Bongani Nkosi', team: 12, photos: 57, docs: 18,
    desc: 'Maintenance scaffolding for cargo handling cranes and dock infrastructure.',
  },
  {
    id: 'PRJ-2026-003', name: 'Gateway Theatre Renovation', client: 'Hyprop Investments',
    type: 'Interior Scaffolding', value: 'R 320,000', progress: 89, status: 'Near Complete',
    statusColor: '#8b5cf6', start: 'Jan 20, 2026', end: 'Jun 30, 2026',
    site: 'Umhlanga, KZN', manager: 'Sello Mokoena', team: 5, photos: 89, docs: 9,
    desc: 'Interior access scaffolding for ceiling renovation and HVAC installation.',
  },
  {
    id: 'PRJ-2026-004', name: 'KwaMashu Industrial Park', client: 'EDTEA',
    type: 'New Construction', value: 'R 2,100,000', progress: 18, status: 'Early Stage',
    statusColor: '#f59e0b', start: 'May 15, 2026', end: 'Feb 28, 2027',
    site: 'KwaMashu, KZN', manager: 'Themba Khumalo', team: 15, photos: 12, docs: 7,
    desc: 'Large-scale scaffolding and construction support for new industrial complex.',
  },
  {
    id: 'PRJ-2026-005', name: 'Pietermaritzburg Municipal Works', client: 'uMgungundlovu DM',
    type: 'Infrastructure', value: 'R 670,000', progress: 61, status: 'On Track',
    statusColor: '#10b981', start: 'Feb 10, 2026', end: 'Sep 5, 2026',
    site: 'Pietermaritzburg, KZN', manager: 'Bongani Nkosi', team: 9, photos: 43, docs: 15,
    desc: 'Bridge and road infrastructure scaffolding and access systems.',
  },
  {
    id: 'PRJ-2026-006', name: 'Ballito Luxury Apartments', client: 'Seeff Coastal Properties',
    type: 'Residential Scaffolding', value: 'R 210,000', progress: 33, status: 'In Progress',
    statusColor: '#3b82f6', start: 'Apr 28, 2026', end: 'Aug 10, 2026',
    site: 'Ballito, KZN', manager: 'Siphamandla Dube', team: 4, photos: 18, docs: 5,
    desc: 'External scaffolding for plastering and painting of 4-storey residential block.',
  },
];

const STATUS_COLORS: Record<string, string> = {
  'On Track': '#10b981', 'In Progress': '#3b82f6', 'Near Complete': '#8b5cf6',
  'Early Stage': '#f59e0b', 'On Hold': '#ef4444', 'Completed': '#64748b',
};

export default function ProjectsTab() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filters = ['All', 'On Track', 'In Progress', 'Near Complete', 'Early Stage'];
  const filtered = PROJECTS.filter(p =>
    (filter === 'All' || p.status === filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header Bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search projects or clients..."
          style={{
            flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 100,
            border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none',
            background: 'white', color: '#334155',
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 100, border: '1.5px solid',
              borderColor: filter === f ? '#1e4db3' : '#e2e8f0',
              background: filter === f ? '#1e4db3' : 'white',
              color: filter === f ? 'white' : '#64748b',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{f}</button>
          ))}
        </div>
        <button style={{
          background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white',
          border: 'none', padding: '10px 22px', borderRadius: 100,
          fontWeight: 700, fontSize: 13, cursor: 'pointer',
        }}>+ New Project</button>
      </div>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Projects', value: '8', color: '#3b82f6' },
          { label: 'Contract Value', value: 'R 5.2M', color: '#10b981' },
          { label: 'On Schedule', value: '75%', color: '#8b5cf6' },
          { label: 'Avg Completion', value: '53%', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 12, border: '1.5px solid #f1f5f9',
            padding: '14px 18px', borderLeft: `4px solid ${s.color}`,
            boxShadow: '0 2px 8px rgba(30,77,179,0.05)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Project Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {filtered.map(p => (
          <div key={p.id} style={{
            background: 'white', borderRadius: 18, border: '1.5px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden',
            transition: 'box-shadow 0.2s', cursor: 'pointer',
          }}>
            {/* Card header */}
            <div style={{
              background: `linear-gradient(135deg, ${p.statusColor}22, ${p.statusColor}08)`,
              borderBottom: `2px solid ${p.statusColor}30`,
              padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4, fontWeight: 600, letterSpacing: '0.05em' }}>{p.id}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{p.client}</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, color: p.statusColor,
                background: p.statusColor + '20', padding: '4px 12px',
                borderRadius: 100, whiteSpace: 'nowrap', marginLeft: 8,
              }}>{p.status}</span>
            </div>

            <div style={{ padding: '16px 20px' }}>
              {/* Description */}
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: '0 0 14px' }}>{p.desc}</p>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { label: 'Contract Value', value: p.value },
                  { label: 'Project Type', value: p.type },
                  { label: 'Site Manager', value: p.manager },
                  { label: 'Completion', value: `${p.end}` },
                ].map(info => (
                  <div key={info.label}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginBottom: 2 }}>{info.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{info.value}</div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Progress</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: p.statusColor }}>{p.progress}%</span>
                </div>
                <div style={{ height: 7, background: '#f1f5f9', borderRadius: 100 }}>
                  <div style={{ height: '100%', width: `${p.progress}%`, background: p.statusColor, borderRadius: 100 }} />
                </div>
              </div>

              {/* Location & team */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <PinIcon size={13} color="#94a3b8" strokeWidth={1.8} />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{p.site}</span>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <UsersIcon size={13} color="#94a3b8" strokeWidth={1.8} />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{p.team}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CameraIcon size={13} color="#94a3b8" strokeWidth={1.8} />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{p.photos}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FileIcon size={13} color="#94a3b8" strokeWidth={1.8} />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{p.docs}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 20px', display: 'flex', gap: 8 }}>
              {['View Details', 'Site Report', 'Photos'].map(a => (
                <button key={a} style={{
                  flex: 1, padding: '7px 0', borderRadius: 100, cursor: 'pointer', fontSize: 11,
                  fontWeight: 600, border: '1.5px solid #e2e8f0', background: 'white', color: '#334155',
                }}>{a}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
