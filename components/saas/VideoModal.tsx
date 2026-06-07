'use client';

import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

// ── Swap this URL for your actual product demo video ─────────────────────────
// Format: https://www.youtube.com/embed/VIDEO_ID?autoplay=1&rel=0&modestbranding=1
const VIDEO_EMBED = 'https://www.youtube.com/embed/MTL8xAFVBgA?autoplay=1&rel=0&modestbranding=1&color=white';

interface Props {
  children: React.ReactNode;
  duration?: string;
}

export default function VideoModal({ children, duration = '2:41' }: Props) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      {/* ── Mockup wrapper with play overlay ── */}
      <div
        className="relative group/video cursor-pointer select-none"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Watch product demo"
        onKeyDown={e => e.key === 'Enter' && setOpen(true)}
      >
        {/* The dashboard mockup (children) */}
        {children}

        {/* Hover darkening tint over the mockup */}
        <div className="absolute inset-0 rounded-xl bg-zinc-900/0 group-hover/video:bg-zinc-900/[0.07] transition-all duration-300 pointer-events-none" />

        {/* Floating play pill — bottom center of mockup */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
          <div
            className="flex items-center gap-2.5 px-4 py-[9px] rounded-full
                        bg-white/95 backdrop-blur-md
                        border border-zinc-200/90
                        shadow-[0_4px_20px_rgba(0,0,0,0.10)]
                        group-hover/video:shadow-[0_8px_32px_rgba(0,0,0,0.16)]
                        group-hover/video:scale-105
                        transition-all duration-300"
          >
            {/* Play circle */}
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-900 group-hover/video:bg-indigo-600 flex items-center justify-center transition-colors duration-200">
              <Play className="w-3 h-3 text-white fill-white translate-x-[1px]" />
            </span>

            <span className="text-[13px] font-medium text-zinc-800 whitespace-nowrap">
              Watch product demo
            </span>

            {/* Duration badge */}
            <span className="text-[11px] text-zinc-400 tabular-nums">{duration}</span>
          </div>
        </div>
      </div>

      {/* ── Video modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 lg:p-12"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            className="relative z-10 w-full max-w-5xl rounded-2xl overflow-hidden
                        bg-zinc-950
                        shadow-[0_40px_120px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.06)]"
            style={{ aspectRatio: '16 / 9' }}
            onClick={e => e.stopPropagation()}
          >
            <iframe
              src={VIDEO_EMBED}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Kairos product demo"
            />

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute top-3 right-3 z-10
                         w-9 h-9 rounded-full
                         bg-black/50 backdrop-blur-md
                         border border-white/[0.12]
                         flex items-center justify-center
                         text-white/60 hover:text-white
                         hover:bg-black/70
                         transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Keyboard hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100">
              <kbd className="text-[10px] text-white/30 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 font-mono">
                ESC
              </kbd>
              <span className="text-[10px] text-white/30">to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
