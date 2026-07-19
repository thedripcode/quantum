'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, PlayCircle, Sparkles, Youtube, ExternalLink, X, Search } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const AMBER = '#F59E0B';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

function thumb(v: any): string | null {
  if (v.provider === 'youtube' && v.videoId) return `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`;
  return null;
}
function embedUrl(v: any): string | null {
  if (v.provider === 'youtube' && v.videoId) return `https://www.youtube-nocookie.com/embed/${v.videoId}`;
  if (v.provider === 'vimeo' && v.videoId)   return `https://player.vimeo.com/video/${v.videoId}`;
  return null;
}

interface Rec {
  title: string; channel: string | null; why: string | null;
  search: string; searchUrl: string;
}

export default function StudentVideosPage() {
  const { data: session } = useSession();
  const grade = (session?.user as any)?.grade as string | undefined;

  const [videos, setVideos]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  const [filter, setFilter]   = useState('All');

  // Sidi recommendation state
  const [topic, setTopic]     = useState('');
  const [asking, setAsking]   = useState(false);
  const [recs, setRecs]       = useState<Rec[] | null>(null);
  const [recErr, setRecErr]   = useState('');

  const loadVideos = useCallback(async () => {
    setLoading(true);
    const qs = grade ? `?grade=${encodeURIComponent(grade)}` : '';
    const r = await fetch(`/api/videos${qs}`);
    if (r.ok) { const d = await r.json(); setVideos(d.videos ?? []); }
    setLoading(false);
  }, [grade]);

  useEffect(() => { loadVideos(); }, [loadVideos]);

  const askSidi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || asking) return;
    setAsking(true); setRecErr(''); setRecs(null);
    const res = await fetch('/api/videos/recommend', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic.trim(), grade }),
    });
    const d = await res.json();
    setAsking(false);
    if (!res.ok) { setRecErr(d.error ?? 'Sidi could not find videos — try again.'); return; }
    setRecs(d.recommendations ?? []);
  };

  const subjectShorts = ['All', ...Array.from(new Set(videos.map(v => v.subject?.short).filter(Boolean)))] as string[];
  const filtered = filter === 'All' ? videos : videos.filter(v => v.subject?.short === filter);

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Video Lessons</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Lessons your teachers shared{grade ? ` for ${grade}` : ''} — plus AI-recommended videos on any topic.</p>
      </div>

      {/* ── Ask Sidi for a video ── */}
      <div style={{ background: `linear-gradient(135deg, rgba(96,165,250,0.10) 0%, ${SURFACE} 55%)`, border: `1px solid ${GOLD_B}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Sparkles size={16} style={{ color: GOLD }} />
          <span style={{ fontFamily: FH, fontSize: 15.5, fontWeight: 700, color: TEXT }}>Ask Sidi for a video</span>
        </div>
        <p style={{ fontSize: 12.5, color: MUTED, margin: '0 0 14px' }}>
          Stuck on a topic? Tell Sidi what you&apos;re studying and it will recommend the best videos to watch.
        </p>

        <form onSubmit={askSidi} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder='e.g. "trigonometry identities" or "photosynthesis"'
            style={{ flex: 1, minWidth: 220, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, color: TEXT, fontFamily: FB, fontSize: 13.5, padding: '11px 14px', outline: 'none' }}
          />
          <button type="submit" disabled={asking || !topic.trim()} style={{ padding: '11px 22px', borderRadius: 9, background: GOLD, border: 'none', color: '#06121f', fontFamily: FH, fontSize: 14, fontWeight: 700, cursor: asking ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: asking || !topic.trim() ? 0.7 : 1 }}>
            {asking ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {asking ? 'Thinking…' : 'Recommend'}
          </button>
        </form>

        {recErr && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 9, fontSize: 13, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.30)', color: AMBER }}>
            {recErr}
          </div>
        )}

        {recs && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sidi recommends</span>
              <button onClick={() => setRecs(null)} aria-label="Clear recommendations" style={{ background: 'none', border: 'none', color: FAINT, cursor: 'pointer', display: 'flex' }}><X size={14} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {recs.length === 0 ? (
                <span style={{ fontSize: 13, color: MUTED }}>No suggestions came back — try a more specific topic.</span>
              ) : recs.map((r, i) => (
                <a key={i} href={r.searchUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: S2, border: `1px solid ${BORDER}`, borderRadius: 11, padding: '13px 15px', textDecoration: 'none', transition: 'border-color 0.15s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD_B)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, lineHeight: 1.35 }}>{r.title}</span>
                    <ExternalLink size={13} style={{ color: FAINT, flexShrink: 0, marginTop: 2 }} />
                  </div>
                  {r.channel && <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}><Youtube size={12} style={{ color: '#FF0000' }} /><span style={{ fontSize: 12, fontWeight: 600, color: GOLD }}>{r.channel}</span></div>}
                  {r.why && <div style={{ fontSize: 12, color: MUTED, marginTop: 6, lineHeight: 1.5 }}>{r.why}</div>}
                  <div style={{ fontSize: 11, color: FAINT, marginTop: 8 }}>Opens YouTube search →</div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Teacher videos library ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: TEXT }}>From your teachers</span>
        {subjectShorts.length > 1 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {subjectShorts.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FB, background: filter === s ? GOLD : 'transparent', color: filter === s ? '#06121f' : MUTED, border: `1px solid ${filter === s ? GOLD : BORDER}` }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: MUTED, padding: 30 }}>
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 40, textAlign: 'center', color: MUTED }}>
          <PlayCircle size={28} style={{ color: FAINT, margin: '0 auto 10px' }} />
          <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>No videos yet</div>
          <div style={{ fontSize: 13 }}>When your teachers share video lessons, they&apos;ll show up here.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(v => (
            <div key={v.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
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

              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ fontFamily: FH, fontSize: 14.5, fontWeight: 700, color: TEXT, lineHeight: 1.3, marginBottom: 6 }}>{v.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: v.description ? 8 : 0 }}>
                  {v.subject && (
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: GOLD, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 6, padding: '2px 8px' }}>{v.subject.short}</span>
                  )}
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: MUTED, background: S2, borderRadius: 6, padding: '2px 8px' }}>{v.grade || 'All grades'}</span>
                </div>
                {v.description && <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>{v.description}</div>}
                <div style={{ fontSize: 11, color: FAINT, marginTop: 8 }}>Shared by {v.addedBy?.name ?? 'your teacher'} · {new Date(v.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
