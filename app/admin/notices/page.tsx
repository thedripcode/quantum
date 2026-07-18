'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell, Plus, Trash2, Loader2 } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', AMBER = '#F59E0B';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

const input: React.CSSProperties = {
  background: S2, border: `1px solid ${BORDER}`, borderRadius: 9,
  color: TEXT, fontFamily: FB, fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box',
};
const label: React.CSSProperties = { fontSize: 11, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 };

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState(false);
  const [toast, setToast]     = useState('');
  const [form, setForm]       = useState({ title: '', body: '', category: 'Admin', audience: 'all', pinned: false });

  const load = useCallback(() => fetch('/api/notices').then(r => r.json()).then(d => setNotices(d.notices ?? [])).finally(() => setLoading(false)), []);
  useEffect(() => { load(); }, [load]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 4000); };

  const post = async () => {
    if (!form.title.trim() || !form.body.trim()) { flash('Fill in title and body.'); return; }
    setBusy(true);
    const res = await fetch('/api/notices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setBusy(false);
    if (!res.ok) { flash('Could not post notice.'); return; }
    flash('✓ Notice posted.');
    setForm({ title: '', body: '', category: 'Admin', audience: 'all', pinned: false });
    load();
  };

  const remove = async (n: any) => {
    if (!confirm(`Delete notice "${n.title}"?`)) return;
    const res = await fetch(`/api/notices?id=${n.id}`, { method: 'DELETE' });
    if (res.ok) { flash('✓ Notice deleted.'); load(); }
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Notices</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Post school-wide notices — students see them instantly.</p>
      </div>

      {toast && (
        <div style={{ marginBottom: 16, padding: '11px 16px', borderRadius: 10, background: toast.startsWith('✓') ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)', border: `1px solid ${toast.startsWith('✓') ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, fontSize: 13, color: toast.startsWith('✓') ? GREEN : AMBER }}>
          {toast}
        </div>
      )}

      <div className="portal-notice-grid">
        {/* Create */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>New Notice</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><span style={label}>TITLE</span><input style={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Parents Evening — 25 June" /></div>
            <div><span style={label}>CATEGORY</span>
              <select style={{ ...input, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Academic', 'Sport', 'Event', 'Admin', 'Urgent'].map(c => <option key={c} style={{ background: S2 }}>{c}</option>)}
              </select>
            </div>
            <div><span style={label}>AUDIENCE</span>
              <select style={{ ...input, cursor: 'pointer' }} value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}>
                {[{ v: 'all', l: 'Everyone' }, { v: 'students', l: 'Students only' }, { v: 'parents', l: 'Parents only' }, { v: 'teachers', l: 'Teachers only' }].map(({ v, l }) => (
                  <option key={v} value={v} style={{ background: S2 }}>{l}</option>
                ))}
              </select>
            </div>
            <div><span style={label}>BODY</span><textarea rows={5} style={{ ...input, resize: 'vertical' }} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write the notice…" /></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: MUTED }}>
              <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} style={{ accentColor: GOLD }} />
              Pin to top
            </label>
            <button onClick={post} disabled={busy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 22px', borderRadius: 10, cursor: busy ? 'default' : 'pointer', background: GOLD, border: 'none', color: '#000', fontFamily: FH, fontSize: 13.5, fontWeight: 700, opacity: busy ? 0.6 : 1 }}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Post Notice
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontFamily: FH, fontSize: 15, fontWeight: 600, color: TEXT, margin: '0 0 16px' }}>All Notices ({notices.length})</h3>
          {loading ? (
            <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>
          ) : notices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED }}>
              <Bell size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>No notices yet</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notices.map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: S2, borderRadius: 10, border: `1px solid ${n.pinned ? GOLD_B : BORDER}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT }}>{n.pinned ? '📌 ' : ''}{n.title}</div>
                    <div style={{ fontSize: 11, color: FAINT, margin: '3px 0 6px' }}>{n.category} · {n.audience ?? 'all'} · {n.author} · {n.date}</div>
                    <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>{n.body.length > 160 ? n.body.slice(0, 160) + '…' : n.body}</div>
                  </div>
                  <button onClick={() => remove(n)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>
                    <Trash2 size={12} />Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
