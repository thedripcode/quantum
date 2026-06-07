'use client';

import { useState } from 'react';
import { Pin, ChevronDown, ChevronUp, Calendar, User } from 'lucide-react';
import { NOTICES, Notice } from '@/data/studentData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const RED = '#EF4444';
const F_HEADING = "'Bricolage Grotesque', sans-serif"; const F_BODY = "'Inter', sans-serif";

type FilterType = Notice['category'] | 'All';

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Urgent:   { bg: 'rgba(239,68,68,0.12)',    text: '#EF4444',  border: 'rgba(239,68,68,0.30)' },
  Academic: { bg: 'rgba(59,130,246,0.12)',   text: '#3B82F6',  border: 'rgba(59,130,246,0.30)' },
  Event:    { bg: 'rgba(139,92,246,0.12)',   text: '#8B5CF6',  border: 'rgba(139,92,246,0.30)' },
  Admin:    { bg: 'rgba(245,158,11,0.12)',   text: '#F59E0B',  border: 'rgba(245,158,11,0.30)' },
  Sport:    { bg: 'rgba(16,185,129,0.12)',   text: '#10B981',  border: 'rgba(16,185,129,0.30)' },
};

function NoticeCard({ notice }: { notice: Notice }) {
  const [open, setOpen] = useState(notice.pinned);
  const cat = CAT_COLORS[notice.category] || CAT_COLORS.Admin;

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${notice.pinned ? GOLD_B : notice.category === 'Urgent' ? 'rgba(239,68,68,0.25)' : BORDER}`,
      borderLeft: `4px solid ${notice.pinned ? GOLD : notice.category === 'Urgent' ? RED : 'transparent'}`,
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 10,
    }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
      >
        {/* Category + pinned */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: cat.bg, color: cat.text, border: `1px solid ${cat.border}`, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {notice.category}
          </span>
          {notice.pinned && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Pin size={10} style={{ color: GOLD }} />
              <span style={{ fontSize: 9, color: GOLD, fontWeight: 600 }}>Pinned</span>
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 6px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>{notice.title}</h3>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED }}>
              <Calendar size={11} /> {notice.date}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED }}>
              <User size={11} /> {notice.author}
            </div>
          </div>
          {!open && (
            <p style={{ fontSize: 13, color: MUTED, margin: '8px 0 0', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
              {notice.body}
            </p>
          )}
        </div>

        <div style={{ flexShrink: 0, color: MUTED }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {open && (
        <div style={{ padding: '0 18px 18px 18px', borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{notice.body}</p>
        </div>
      )}
    </div>
  );
}

export default function NoticesPage() {
  const [filter, setFilter] = useState<FilterType>('All');

  const categories: FilterType[] = ['All', 'Urgent', 'Academic', 'Event', 'Admin', 'Sport'];
  const filtered = NOTICES.filter(n => filter === 'All' || n.category === filter);
  const pinned    = filtered.filter(n => n.pinned);
  const rest      = filtered.filter(n => !n.pinned);

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {categories.map(cat => {
          const count = cat === 'All' ? NOTICES.length : NOTICES.filter(n => n.category === cat).length;
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '7px 14px', borderRadius: 9, border: `1px solid ${active ? (cat === 'All' ? GOLD_B : CAT_COLORS[cat]?.border || GOLD_B) : BORDER}`,
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                background: active ? (cat === 'All' ? GOLD_DIM : CAT_COLORS[cat]?.bg || GOLD_DIM) : SURFACE,
                color: active ? (cat === 'All' ? GOLD : CAT_COLORS[cat]?.text || GOLD) : MUTED,
                transition: 'all .15s',
              }}
            >
              {cat} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: GOLD, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pin size={11} /> Pinned
          </div>
          {pinned.map(n => <NoticeCard key={n.id} notice={n} />)}
        </div>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <div>
          {pinned.length > 0 && (
            <div style={{ fontSize: 11, fontWeight: 600, color: FAINT, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>
              All Notices
            </div>
          )}
          {rest.map(n => <NoticeCard key={n.id} notice={n} />)}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📢</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No notices found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Check back later.</div>
        </div>
      )}
    </div>
  );
}
