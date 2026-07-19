'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Youtube, PlayCircle, X } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', AMBER = '#F59E0B';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

const inp: React.CSSProperties = {
  background: S2, border: `1px solid ${BORDER}`, borderRadius: 9,
  color: TEXT, fontFamily: FB, fontSize: 13, padding: '9px 12px',
  outline: 'none', width: '100%', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  fontSize: 11, color: MUTED, fontWeight: 600, display: 'block',
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em',
};

const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

function thumb(v: any): string | null {
  if (v.provider === 'youtube' && v.videoId) return `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`;
  return null;
}
function embedUrl(v: any): string | null {
  if (v.provider === 'youtube' && v.videoId) return `https://www.youtube-nocookie.com/embed/${v.videoId}`;
  if (v.provider === 'vimeo' && v.videoId)   return `https://player.vimeo.com/video/${v.videoId}`;
  return null;
}

export default function TeacherVideosPage() {
  const [videos, setVideos]     = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [busy, setBusy]         = useState(false);
  const [toast, setToast]       = useState('');
  const [playing, setPlaying]   = useState<string | null>(null);   // video id being played inline
  const [form, setForm] = useState({
    title: '', url: '', subjectId: '', grade: '', description: '',
  });

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 5000); };

  const loadSubjects = useCallback(async () => {
    const r = await fetch('/api/teacher/roster');
    if (r.ok) { const d = await r.json(); setSubjects(d.subjects ?? []); }
  }, []);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/videos');
    if (r.ok) { const d = await r.json(); setVideos(d.videos ?? []); }
    setLoading(false);
  }, []);

  useEffect(() => { loadSubjects(); loadVideos(); }, [loadSubjects, loadVideos]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) { flash('Add a title and a video link.'); return; }
    setBusy(true);
    const res = await fetch('/api/videos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!res.ok) { const d = await res.json(); flash(d.error ?? 'Could not save the video.'); return; }
    flash('✓ Video added — students can see it now.');
    setForm(f => ({ ...f, title: '', url: '', description: '' }));
    loadVideos();
  };

  const remove = async (v: any) => {
    if (!confirm(`Remove "${v.title}"?`)) return;
    const res = await fetch(`/api/videos?id=${v.id}`, { method: 'DELETE' });
    if (res.ok) { flash('✓ Video removed.'); loadVideos(); }
    else { const d = await res.json(); flash(d.error ?? 'Could not delete.'); }
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Video Lessons</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Share YouTube (or Vimeo) lessons with your learners — they appear in the student portal instantly.</p>
      </div>

      {toast && (
        <div style={{ marginBottom: 16, padding: '11px 16px', borderRadius: 10, fontSize: 13, background: toast.startsWith('✓') ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)', border: `1px solid ${toast.startsWith('✓') ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, color: toast.startsWith('✓') ? GREEN : AMBER }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }} className="portal-notice-grid">

        {/* ── Add video form ── */}
        <form onSubmit={create} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Youtube size={16} style={{ color: GOLD }} />
            <span style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT }}>Add a Video</span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Video Link (YouTube / Vimeo)</label>
            <input style={inp} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=…" />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Title</label>
            <input style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Trigonometry basics — sin, cos, tan" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={lbl}>Subject</label>
              <select style={inp} value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
                <option value="">Any subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Grade</label>
              <select style={inp} value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                <option value="">All grades</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Note for students (optional)</label>
            <textarea style={{ ...inp, minHeight: 64, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Watch before Friday's lesson…" />
          </div>

          <button type="submit" disabled={busy} style={{ width: '100%', padding: '11px', borderRadius: 9, background: GOLD, border: 'none', color: '#06121f', fontFamily: FH, fontSize: 14, fontWeight: 700, cursor: busy ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: busy ? 0.7 : 1 }}>
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {busy ? 'Saving…' : 'Add Video'}
          </button>
        </form>

        {/* ── Video list ── */}
        <div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>{videos.length} video{videos.length === 1 ? '' : 's'}</div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: MUTED, padding: 30 }}>
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : videos.length === 0 ? (
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 40, textAlign: 'center', color: MUTED }}>
              <PlayCircle size={28} style={{ color: FAINT, margin: '0 auto 10px' }} />
              <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>No videos yet</div>
              <div style={{ fontSize: 13 }}>Paste a YouTube link on the left to share your first lesson.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {videos.map(v => (
                <div key={v.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>

                  {/* Player / thumbnail */}
                  {playing === v.id && embedUrl(v) ? (
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                      <iframe
                        src={`${embedUrl(v)}?autoplay=1`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      />
                      <button onClick={() => setPlaying(null)} aria-label="Close player" style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', padding: 6, display: 'flex' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => embedUrl(v) ? setPlaying(v.id) : window.open(v.url, '_blank')} style={{ display: 'block', width: '100%', padding: 0, border: 'none', background: '#000', cursor: 'pointer', position: 'relative' }}>
                      {thumb(v) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={thumb(v)!} alt={v.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', opacity: 0.85 }} />
                      ) : (
                        <div style={{ width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: S2 }}>
                          <PlayCircle size={34} style={{ color: FAINT }} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PlayCircle size={44} style={{ color: 'rgba(255,255,255,0.92)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
                      </div>
                    </button>
                  )}

                  {/* Meta */}
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontFamily: FH, fontSize: 14.5, fontWeight: 700, color: TEXT, lineHeight: 1.3, marginBottom: 6 }}>{v.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: v.description ? 8 : 0 }}>
                      {v.subject && (
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: GOLD, background: 'rgba(96,165,250,0.10)', border: '1px solid rgba(96,165,250,0.22)', borderRadius: 6, padding: '2px 8px' }}>{v.subject.short}</span>
                      )}
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: MUTED, background: S2, borderRadius: 6, padding: '2px 8px' }}>{v.grade || 'All grades'}</span>
                    </div>
                    {v.description && <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginBottom: 8 }}>{v.description}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: FAINT }}>{new Date(v.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })} · {v.addedBy?.name ?? ''}</span>
                      <button onClick={() => remove(v)} aria-label="Delete video" style={{ background: 'none', border: 'none', color: FAINT, cursor: 'pointer', padding: 4, display: 'flex' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = FAINT)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
