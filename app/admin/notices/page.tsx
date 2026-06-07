'use client';

import { useState } from 'react';
import { ADMIN_NOTICES } from '@/data/adminData';

const BG = '#0C0C0C', SURFACE = '#161616', S2 = '#1E1E1E', S3 = '#272727';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const CATEGORY_CONFIG: Record<string, { color: string; bg: string }> = {
  Urgent:   { color: RED,   bg: 'rgba(239,68,68,0.12)' },
  Academic: { color: BLUE,  bg: 'rgba(59,130,246,0.12)' },
  Event:    { color: GREEN, bg: 'rgba(16,185,129,0.12)' },
  Admin:    { color: MUTED, bg: 'rgba(255,255,255,0.06)' },
  General:  { color: AMBER, bg: 'rgba(245,158,11,0.12)' },
};

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Admin' | 'Event' | 'Urgent' | 'General';
  target: string;
  priority: 'normal' | 'important' | 'urgent';
  publishedDate: string;
  author: string;
  active: boolean;
  pinned?: boolean;
  views?: number;
  status: 'published' | 'draft' | 'scheduled';
  scheduledDate?: string;
}

type FilterStatus = 'all' | 'published' | 'draft' | 'scheduled' | 'urgent';

const STATUS_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'published', label: 'Published' },
  { key: 'draft',     label: 'Draft'     },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'urgent',    label: 'Urgent'    },
];

const TARGET_OPTIONS = ['All','All Students','All Teachers','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','Parents'];
const PRIORITY_OPTIONS: { value: NoticeItem['priority']; label: string }[] = [
  { value: 'normal',    label: 'Normal'    },
  { value: 'important', label: 'Important' },
  { value: 'urgent',    label: 'Urgent'    },
];

function getPriorityBorderStyle(priority: string): React.CSSProperties {
  if (priority === 'urgent')    return { borderLeft: `3px solid ${RED}` };
  if (priority === 'important') return { borderLeft: `2px solid ${AMBER}` };
  return { borderLeft: '3px solid transparent' };
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === 'urgent') return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(239,68,68,0.15)', color: RED, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      Urgent
    </span>
  );
  if (priority === 'important') return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(245,158,11,0.15)', color: AMBER, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      Important
    </span>
  );
  return null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    published: { color: GREEN, bg: 'rgba(16,185,129,0.12)' },
    draft:     { color: FAINT, bg: 'rgba(255,255,255,0.06)' },
    scheduled: { color: BLUE,  bg: 'rgba(59,130,246,0.12)' },
  };
  const s = map[status] || map['draft'];
  return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: s.bg, color: s.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
      {status}
    </span>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: S2,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: TEXT,
  fontFamily: FB,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, color: FAINT,
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5,
  display: 'block',
};

function NoticeCard({
  n,
  expanded,
  setExpanded,
  togglePin,
  toggleActive,
  deleteNotice,
}: {
  n: NoticeItem;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  togglePin: (id: string) => void;
  toggleActive: (id: string) => void;
  deleteNotice: (id: string) => void;
}) {
  const cfg = CATEGORY_CONFIG[n.category] || CATEGORY_CONFIG['General'];
  const isExpanded = expanded === n.id;

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${n.pinned ? GOLD_B : BORDER}`,
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 10,
      ...getPriorityBorderStyle(n.priority),
    }}>
      {/* Card header */}
      <div
        style={{ padding: '13px 16px', cursor: 'pointer' }}
        onClick={() => setExpanded(isExpanded ? null : n.id)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7, flexWrap: 'wrap' }}>
          <PriorityBadge priority={n.priority} />
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
            background: cfg.bg, color: cfg.color,
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            {n.category}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
            background: 'rgba(255,255,255,0.05)', color: FAINT,
          }}>
            {n.target}
          </span>
          <StatusBadge status={n.status} />
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: FAINT }}>{n.publishedDate}</span>
          {n.views !== undefined && (
            <span style={{ fontSize: 10, color: FAINT }}>{n.views} views</span>
          )}
          {/* Pin button */}
          <button
            onClick={e => { e.stopPropagation(); togglePin(n.id); }}
            title={n.pinned ? 'Unpin' : 'Pin'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px', fontSize: 13, color: n.pinned ? GOLD : FAINT, lineHeight: 1 }}
          >
            📌
          </button>
          {/* Delete button */}
          <button
            onClick={e => { e.stopPropagation(); deleteNotice(n.id); }}
            title="Delete"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px', fontSize: 13, color: FAINT, lineHeight: 1 }}
          >
            🗑
          </button>
          {/* Expand chevron */}
          <span style={{ fontSize: 12, color: FAINT, lineHeight: 1, userSelect: 'none' }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 14,
          fontFamily: FH,
          fontWeight: 700,
          color: TEXT,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {n.title}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.75, marginTop: 12, marginBottom: 10 }}>
            {n.content}
          </p>
          <div style={{ fontSize: 10, color: FAINT, marginBottom: 12 }}>
            Posted by {n.author}
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <button
              onClick={e => e.stopPropagation()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: GOLD, fontSize: 12, fontWeight: 600, fontFamily: FB, padding: 0 }}
            >
              Edit
            </button>
            <button
              onClick={e => { e.stopPropagation(); toggleActive(n.id); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: n.active ? RED : GREEN, fontSize: 12, fontWeight: 600, fontFamily: FB, padding: 0 }}
            >
              {n.active ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>(
    ADMIN_NOTICES.map(n => ({ ...n, pinned: n.pinned ?? false }))
  );
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [formTitle,         setFormTitle]         = useState('');
  const [formCategory,      setFormCategory]      = useState<NoticeItem['category']>('Academic');
  const [formTarget,        setFormTarget]        = useState('All Students');
  const [formPriority,      setFormPriority]      = useState<NoticeItem['priority']>('normal');
  const [formContent,       setFormContent]       = useState('');
  const [formPinned,        setFormPinned]        = useState(false);
  const [formScheduled,     setFormScheduled]     = useState(false);
  const [formScheduledDate, setFormScheduledDate] = useState('');

  const resetForm = () => {
    setFormTitle(''); setFormCategory('Academic'); setFormTarget('All Students');
    setFormPriority('normal'); setFormContent(''); setFormPinned(false);
    setFormScheduled(false); setFormScheduledDate('');
  };

  const handlePublish = (asDraft = false) => {
    if (!formTitle.trim()) return;
    const now = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    const newNotice: NoticeItem = {
      id:            `n-${Date.now()}`,
      title:         formTitle,
      content:       formContent,
      category:      formCategory,
      target:        formTarget,
      priority:      formPriority,
      publishedDate: now,
      author:        'School Admin',
      active:        !asDraft,
      pinned:        formPinned,
      views:         0,
      status:        asDraft ? 'draft' : formScheduled ? 'scheduled' : 'published',
      scheduledDate: formScheduled ? formScheduledDate : undefined,
    };
    setNotices(prev => [newNotice, ...prev]);
    resetForm();
    setShowForm(false);
  };

  const deleteNotice  = (id: string) => setNotices(prev => prev.filter(n => n.id !== id));
  const togglePin     = (id: string) => setNotices(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const toggleActive  = (id: string) => setNotices(prev => prev.map(n => n.id === id ? { ...n, active: !n.active, status: n.active ? 'draft' : 'published' } : n));

  // Apply filters
  let filtered = [...notices];
  if (filterStatus === 'urgent') {
    filtered = filtered.filter(n => n.priority === 'urgent');
  } else if (filterStatus !== 'all') {
    filtered = filtered.filter(n => n.status === filterStatus);
  }
  if (categoryFilter !== 'All') {
    filtered = filtered.filter(n => n.category === categoryFilter);
  }

  const pinnedItems  = filtered.filter(n => n.pinned);
  const regularItems = filtered.filter(n => !n.pinned);
  const publishedCount = notices.filter(n => n.status === 'published').length;

  return (
    <div style={{ padding: 28, fontFamily: FB, background: BG, minHeight: '100%' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>
            Notices
          </h2>
          <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0' }}>
            {publishedCount} published
          </p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); if (showForm) resetForm(); }}
          style={{ background: GOLD, color: '#000', borderRadius: 9999, padding: '9px 20px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: FB, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Create Notice
        </button>
      </div>

      {/* ── Create form ── */}
      {showForm && (
        <div style={{ background: SURFACE, border: `1px solid ${GOLD_B}`, borderRadius: 16, padding: 22, marginBottom: 22 }}>
          <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 18 }}>
            New Notice
          </div>

          {/* Title */}
          <div style={{ marginBottom: 14 }}>
            <span style={labelStyle}>Title</span>
            <input
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="Notice title…"
              style={inputStyle}
            />
          </div>

          {/* Category · Target · Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <span style={labelStyle}>Category</span>
              <select value={formCategory} onChange={e => setFormCategory(e.target.value as NoticeItem['category'])} style={{ ...inputStyle, cursor: 'pointer' }}>
                {(['Urgent','Academic','Event','Admin','General'] as NoticeItem['category'][]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <span style={labelStyle}>Target Audience</span>
              <select value={formTarget} onChange={e => setFormTarget(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {TARGET_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <span style={labelStyle}>Priority</span>
              <select value={formPriority} onChange={e => setFormPriority(e.target.value as NoticeItem['priority'])} style={{ ...inputStyle, cursor: 'pointer' }}>
                {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {/* Content */}
          <div style={{ marginBottom: 14 }}>
            <span style={labelStyle}>Content</span>
            <textarea
              value={formContent}
              onChange={e => setFormContent(e.target.value)}
              rows={4}
              placeholder="Write the notice content…"
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
            />
          </div>

          {/* Pin + Schedule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 18, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: MUTED }}>
              <input
                type="checkbox"
                checked={formPinned}
                onChange={e => setFormPinned(e.target.checked)}
                style={{ accentColor: GOLD, width: 14, height: 14 }}
              />
              Pin this notice
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: MUTED }}>
              <input
                type="checkbox"
                checked={formScheduled}
                onChange={e => setFormScheduled(e.target.checked)}
                style={{ accentColor: GOLD, width: 14, height: 14 }}
              />
              Schedule
            </label>
            {formScheduled && (
              <input
                type="datetime-local"
                value={formScheduledDate}
                onChange={e => setFormScheduledDate(e.target.value)}
                style={{ ...inputStyle, width: 'auto', padding: '7px 10px', fontSize: 12 }}
              />
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              onClick={() => { setShowForm(false); resetForm(); }}
              style={{ padding: '8px 18px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 9999, color: MUTED, fontSize: 12, cursor: 'pointer', fontFamily: FB }}
            >
              Cancel
            </button>
            <button
              onClick={() => handlePublish(true)}
              style={{ padding: '8px 18px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 9999, color: MUTED, fontSize: 12, cursor: 'pointer', fontFamily: FB }}
            >
              Save Draft
            </button>
            <button
              onClick={() => handlePublish(false)}
              style={{ background: GOLD, color: '#000', borderRadius: 9999, padding: '9px 20px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: FB }}
            >
              Publish
            </button>
          </div>
        </div>
      )}

      {/* ── Status filter tabs ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: '5px 14px', borderRadius: 9999,
              background: filterStatus === tab.key ? GOLD_DIM : S2,
              border: `1px solid ${filterStatus === tab.key ? GOLD_B : BORDER}`,
              color: filterStatus === tab.key ? GOLD : MUTED,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Category sub-filter ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
        {['All','Urgent','Academic','Event','Admin','General'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: '4px 12px', borderRadius: 9999,
              background: categoryFilter === cat ? GOLD_DIM : 'transparent',
              border: `1px solid ${categoryFilter === cat ? GOLD_B : 'transparent'}`,
              color: categoryFilter === cat ? GOLD : FAINT,
              fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FB,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Pinned section ── */}
      {pinnedItems.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: '0.10em',
            textTransform: 'uppercase', marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>📌</span> Pinned
          </div>
          {pinnedItems.map(n => (
            <NoticeCard
              key={n.id} n={n}
              expanded={expanded} setExpanded={setExpanded}
              togglePin={togglePin} toggleActive={toggleActive} deleteNotice={deleteNotice}
            />
          ))}
        </div>
      )}

      {/* ── Regular notices ── */}
      {regularItems.length === 0 && pinnedItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: MUTED, fontSize: 14 }}>
          No notices found.
        </div>
      ) : (
        <div>
          {pinnedItems.length > 0 && regularItems.length > 0 && (
            <div style={{ fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>
              All Notices
            </div>
          )}
          {regularItems.map(n => (
            <NoticeCard
              key={n.id} n={n}
              expanded={expanded} setExpanded={setExpanded}
              togglePin={togglePin} toggleActive={toggleActive} deleteNotice={deleteNotice}
            />
          ))}
        </div>
      )}
    </div>
  );
}
