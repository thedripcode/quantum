'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const BG = '#0C0C0C', SURFACE = '#161616';
const GOLD = '#C9A84C', GOLD_DIM = 'rgba(201,168,76,0.10)', GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const RED = '#EF4444';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/admin/subjects').then(r => r.json()),
    ]).then(([u, s]) => {
      setTeachers((u.users ?? []).filter((x: any) => x.role === 'teacher'));
      setSubjects(s.subjects ?? []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Teachers</h2>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{loading ? 'Loading…' : `${teachers.length} educators`}</p>
        </div>
        <Link href="/admin/manage" style={{ padding: '10px 18px', borderRadius: 10, background: GOLD, color: '#000', textDecoration: 'none', fontFamily: FH, fontSize: 13, fontWeight: 700 }}>
          + Add / Remove
        </Link>
      </div>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 14 }}>Loading teachers…</p>
      ) : teachers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
          <GraduationCap size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>No teachers yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Create teacher accounts in Manage Data → People.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {teachers.map(t => {
            const taught = subjects.filter(s => s.teacherPortalId === t.portalId);
            return (
              <div key={t.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, opacity: t.active ? 1 : 0.45 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: GOLD }}>
                    {t.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: TEXT }}>
                      {t.name} {!t.active && <span style={{ fontSize: 10, color: RED, fontWeight: 700 }}>INACTIVE</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: FAINT }}>{t.portalId} · {t.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: FAINT, fontWeight: 600, marginBottom: 6 }}>SUBJECTS</div>
                {taught.length === 0 ? (
                  <span style={{ fontSize: 12, color: MUTED }}>None assigned — set in Manage Data → Subjects</span>
                ) : (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {taught.map(s => (
                      <span key={s.code} style={{ fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 6, background: s.color + '18', border: `1px solid ${s.color}44`, color: s.color }}>
                        {s.short}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
