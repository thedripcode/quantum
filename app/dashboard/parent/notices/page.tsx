'use client';

import { useEffect, useState } from 'react';
import { Bell, Pin } from 'lucide-react';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.50)'; const RED = '#EF4444';
const F_H = "'Bricolage Grotesque', sans-serif"; const F_B = "'Inter', sans-serif";

const CAT_COLOR: Record<string, string> = {
  Academic: '#3B82F6', Sport: '#10B981', Event: '#8B5CF6',
  Admin: GOLD, Urgent: RED,
};

interface Notice { id: string; title: string; body: string; category: string; pinned: boolean; createdAt: string }

export default function ParentNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/parent/child')
      .then(r => r.json())
      .then(d => { setNotices(d.notices ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '28px 24px', fontFamily: F_B, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: F_H, fontSize: 24, fontWeight: 800, color: TEXT, margin: '0 0 4px', letterSpacing: '-0.03em' }}>School Notices</h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Important updates from Sidelile High School</p>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: MUTED }}>Loading…</div>
      ) : notices.length === 0 ? (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 40, textAlign: 'center' }}>
          <Bell size={28} style={{ color: MUTED, marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>No notices for parents at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notices.map(n => {
            const catColor = CAT_COLOR[n.category] ?? GOLD;
            return (
              <div
                key={n.id}
                style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px', borderLeft: `3px solid ${catColor}` }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 6, background: `${catColor}18`, border: `1px solid ${catColor}30`, fontSize: 10, fontWeight: 700, color: catColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{n.category}</span>
                      {n.pinned && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: GOLD }}>
                          <Pin size={10} /> Pinned
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: MUTED, marginLeft: 'auto' }}>
                        {new Date(n.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: F_H, fontSize: 15, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.01em' }}>{n.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{n.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
