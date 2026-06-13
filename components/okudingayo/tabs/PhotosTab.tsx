'use client';
import { useState } from 'react';
import { CameraIcon, CalendarIcon, BuildingIcon } from '@/components/okudingayo/OkuIcons';

const PHOTOS = [
  { id: 1, project: 'Umhlanga Office Complex', desc: 'Facade scaffolding east elevation — floor 6-8 complete', date: 'Jun 7, 2026', tag: 'Progress', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=280&fit=crop&q=80' },
  { id: 2, project: 'Harbour Phase 2', desc: 'Crane maintenance access platform installation', date: 'Jun 5, 2026', tag: 'Setup', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=280&fit=crop&q=80' },
  { id: 3, project: 'Gateway Theatre', desc: 'Interior ceiling access — final inspection pass', date: 'Jun 3, 2026', tag: 'Inspection', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=280&fit=crop&q=80' },
  { id: 4, project: 'Umhlanga Office Complex', desc: 'Safety netting installation south face', date: 'Jun 1, 2026', tag: 'Safety', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=280&fit=crop&q=80' },
  { id: 5, project: 'KwaMashu Industrial Park', desc: 'Ground level excavation and foundation marking', date: 'May 30, 2026', tag: 'Progress', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop&q=80' },
  { id: 6, project: 'Harbour Phase 2', desc: 'Equipment delivery and staging area setup', date: 'May 28, 2026', tag: 'Setup', img: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=280&fit=crop&q=80' },
  { id: 7, project: 'Pietermaritzburg Municipal', desc: 'Bridge scaffolding west span — 80% complete', date: 'May 26, 2026', tag: 'Progress', img: 'https://images.unsplash.com/photo-1580793442838-8566c2f5e32e?w=400&h=280&fit=crop&q=80' },
  { id: 8, project: 'Ballito Apartments', desc: 'Residential block external scaffolding — before plastering', date: 'May 24, 2026', tag: 'Before', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=280&fit=crop&q=80' },
  { id: 9, project: 'Gateway Theatre', desc: 'HVAC installation access — theatre main hall', date: 'May 22, 2026', tag: 'Progress', img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=280&fit=crop&q=80' },
];

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'Progress':   { bg: '#dbeafe', color: '#1d4ed8' },
  'Setup':      { bg: '#fef3c7', color: '#b45309' },
  'Inspection': { bg: '#dcfce7', color: '#15803d' },
  'Safety':     { bg: '#fee2e2', color: '#dc2626' },
  'Before':     { bg: '#ede9fe', color: '#6d28d9' },
  'After':      { bg: '#cffafe', color: '#0e7490' },
};

const PROJECTS = ['All Projects', 'Umhlanga Office Complex', 'Harbour Phase 2', 'Gateway Theatre', 'KwaMashu Industrial Park', 'Pietermaritzburg Municipal', 'Ballito Apartments'];

export default function PhotosTab() {
  const [project, setProject] = useState('All Projects');
  const [tag, setTag] = useState('All');
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = PHOTOS.filter(p =>
    (project === 'All Projects' || p.project === project) &&
    (tag === 'All' || p.tag === tag)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Header */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flex: 1, overflowX: 'auto' }}>
          {PROJECTS.map(p => (
            <button key={p} onClick={() => setProject(p)} style={{
              padding: '8px 14px', borderRadius: 100, border: '1.5px solid',
              borderColor: project === p ? '#1e4db3' : '#e2e8f0',
              background: project === p ? '#1e4db3' : 'white',
              color: project === p ? 'white' : '#64748b',
              fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{p}</button>
          ))}
        </div>
        <button style={{
          background: 'linear-gradient(135deg,#1e4db3,#3b72d9)', color: 'white',
          border: 'none', padding: '10px 20px', borderRadius: 100, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>Upload Photos</button>
      </div>

      {/* Tag filter */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Filter:</span>
        {['All', 'Progress', 'Setup', 'Inspection', 'Safety', 'Before', 'After'].map(t => (
          <button key={t} onClick={() => setTag(t)} style={{
            padding: '6px 14px', borderRadius: 100, border: '1.5px solid',
            borderColor: tag === t ? '#1e4db3' : '#e2e8f0',
            background: tag === t ? '#eff6ff' : 'white',
            color: tag === t ? '#1e4db3' : '#64748b',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>{t}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{filtered.length} photos</span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Photos', value: '247', Icon: CameraIcon, color: '#3b82f6' },
          { label: 'Projects Covered', value: '8', Icon: BuildingIcon, color: '#10b981' },
          { label: 'This Month', value: '34', Icon: CalendarIcon, color: '#f59e0b' },
          { label: 'Storage Used', value: '1.8 GB', Icon: CameraIcon, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 12, border: '1.5px solid #f1f5f9',
            padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center',
            boxShadow: '0 2px 8px rgba(30,77,179,0.04)',
          }}>
            <s.Icon size={20} color={s.color} strokeWidth={1.8} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(photo => (
          <div key={photo.id} style={{ borderRadius: 16, overflow: 'hidden', background: 'white', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(30,77,179,0.06)', cursor: 'pointer' }} onClick={() => setSelected(selected === photo.id ? null : photo.id)}>
            <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.img} alt={photo.desc} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
              <span style={{
                position: 'absolute', top: 10, right: 10,
                fontSize: 10, fontWeight: 700,
                background: TAG_COLORS[photo.tag]?.bg || '#f1f5f9',
                color: TAG_COLORS[photo.tag]?.color || '#64748b',
                padding: '3px 10px', borderRadius: 100,
              }}>{photo.tag}</span>
              <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'white', lineHeight: 1.4 }}>{photo.desc}</div>
              </div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1e4db3' }}>{photo.project}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarIcon size={11} color="#94a3b8" strokeWidth={1.8} /> {photo.date}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['View', 'Download'].map(a => (
                    <button key={a} style={{
                      padding: '5px 11px', borderRadius: 100, border: '1.5px solid #e2e8f0',
                      background: 'white', color: '#334155', fontSize: 10, fontWeight: 600, cursor: 'pointer',
                    }}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
