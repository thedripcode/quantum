'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Sidelile High School — Developer / Design Edit Mode
 *
 * Keyboard shortcut : Ctrl + Shift + E  (toggle)
 * Only active on    : localhost / 127.0.0.1
 *
 * Features:
 *   • Click any element → gold outline + inline text editing
 *   • Right panel → typography, color, spacing, border-radius controls
 *   • Section hover toolbar → move ↑↓ / hide / bg-color / duplicate
 *   • Export panel → "Copy Changes" logs a JSON diff to clipboard + console
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Utilities ────────────────────────────────────────────────────────────────

function rgbToHex(rgb: string): string {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return '#000000';
  return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
}

function pxVal(v: string) { return Math.round(parseFloat(v) || 0); }

const TEXT_TAGS = new Set(['H1','H2','H3','H4','H5','H6','P','SPAN','A','LI','BUTTON','LABEL','STRONG','EM','TD','TH','BLOCKQUOTE']);

function isText(el: HTMLElement) { return TEXT_TAGS.has(el.tagName); }

function getSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  const path: string[] = [];
  let cur: HTMLElement | null = el;
  while (cur && cur.tagName !== 'HTML' && cur.tagName !== 'BODY') {
    if (cur.id) { path.unshift(`#${cur.id}`); break; }
    const tag  = cur.tagName.toLowerCase();
    const par: HTMLElement | null = cur.parentElement;
    if (!par) break;
    const sibs = Array.from(par.children).filter((c: Element) => c.tagName === cur!.tagName);
    path.unshift(sibs.length > 1 ? `${tag}:nth-of-type(${sibs.indexOf(cur) + 1})` : tag);
    cur = par;
  }
  return path.join(' > ');
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectedEl { el: HTMLElement; selector: string; isText: boolean }

interface Styles {
  fontSize: number; fontWeight: string;
  color: string; backgroundColor: string;
  paddingTop: number; paddingRight: number; paddingBottom: number; paddingLeft: number;
  marginTop: number;  marginRight: number;  marginBottom: number;  marginLeft: number;
  borderRadius: number;
}

interface ChangeRecord {
  selector: string; type: string; property?: string; oldValue: string; newValue: string;
}

const BLANK_STYLES: Styles = {
  fontSize: 16, fontWeight: '400', color: '#000000', backgroundColor: '#ffffff',
  paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
  marginTop: 0,  marginRight: 0,  marginBottom: 0,  marginLeft: 0,
  borderRadius: 0,
};

// CSS injected into <head> while edit mode is active
const EDIT_CSS = `
  body.__em__ * { cursor: crosshair !important; }
  body.__em__ [contenteditable=true]  { cursor: text !important; user-select: text !important; outline: none !important; }
  body.__em__ a, body.__em__ button   { pointer-events: none !important; }
  body.__em__ [contenteditable=true]  { pointer-events: auto !important; }
  .__em_sel__ { outline: 2.5px solid #7C3AED !important; outline-offset: 2px !important; }
  .__em_hov__ { outline: 1.5px dashed rgba(124,58,237,0.5) !important; outline-offset: 2px !important; }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EditModeOverlay() {
  const [isDev,    setIsDev]    = useState(false);
  const [active,   setActive]   = useState(false);
  const [selected, setSelected] = useState<SelectedEl | null>(null);
  const [styles,   setStyles]   = useState<Styles>(BLANK_STYLES);
  const [changes,  setChanges]  = useState<ChangeRecord[]>([]);
  const [copied,   setCopied]   = useState(false);
  const [hSec,     setHSec]     = useState<HTMLElement | null>(null);
  const [tbPos,    setTbPos]    = useState({ top: 0, left: 0, width: 0 });
  const lastHov   = useRef<HTMLElement | null>(null);
  const origTexts = useRef(new Map<HTMLElement, string>());

  // ── Dev gate ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = window.location.hostname;
    setIsDev(h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.'));
  }, []);

  // ── Ctrl+Shift+E toggle ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isDev) return;
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        setActive(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDev]);

  // ── Inject / remove edit CSS ─────────────────────────────────────────────
  useEffect(() => {
    const CSS_ID = '__em_style__';
    if (active) {
      document.body.classList.add('__em__');
      if (!document.getElementById(CSS_ID)) {
        const s = document.createElement('style');
        s.id    = CSS_ID;
        s.textContent = EDIT_CSS;
        document.head.appendChild(s);
      }
    } else {
      document.body.classList.remove('__em__');
      document.getElementById(CSS_ID)?.remove();
      // strip all edit classes + contenteditable
      document.querySelectorAll('.__em_sel__, .__em_hov__').forEach(el => {
        el.classList.remove('__em_sel__', '__em_hov__');
        (el as HTMLElement).removeAttribute('contenteditable');
      });
      setSelected(null); setHSec(null);
      lastHov.current = null;
    }
  }, [active]);

  // ── Record a change (deduplicates by selector+property) ──────────────────
  const record = useCallback((rec: ChangeRecord) => {
    setChanges(prev => {
      const k = `${rec.selector}||${rec.type}||${rec.property ?? ''}`;
      return [...prev.filter(c => `${c.selector}||${c.type}||${c.property ?? ''}` !== k), rec];
    });
  }, []);

  // ── Select an element, populate panel ────────────────────────────────────
  const selectEl = useCallback((el: HTMLElement) => {
    document.querySelectorAll('.__em_sel__').forEach(e => {
      e.classList.remove('__em_sel__');
      (e as HTMLElement).removeAttribute('contenteditable');
    });
    el.classList.add('__em_sel__');

    const cs = window.getComputedStyle(el);
    const bg = cs.backgroundColor;
    const isTransparent = bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent';

    setSelected({ el, selector: getSelector(el), isText: isText(el) });
    setStyles({
      fontSize:  pxVal(cs.fontSize),
      fontWeight: cs.fontWeight,
      color:     rgbToHex(cs.color),
      backgroundColor: isTransparent ? '#ffffff' : rgbToHex(cs.backgroundColor),
      paddingTop:    pxVal(cs.paddingTop),
      paddingRight:  pxVal(cs.paddingRight),
      paddingBottom: pxVal(cs.paddingBottom),
      paddingLeft:   pxVal(cs.paddingLeft),
      marginTop:    pxVal(cs.marginTop),
      marginRight:  pxVal(cs.marginRight),
      marginBottom: pxVal(cs.marginBottom),
      marginLeft:   pxVal(cs.marginLeft),
      borderRadius: pxVal(cs.borderRadius),
    });

    if (isText(el)) {
      if (!origTexts.current.has(el)) origTexts.current.set(el, el.textContent ?? '');
      el.contentEditable = 'true';
      el.focus();

      const onBlur = () => {
        el.removeAttribute('contenteditable');
        const orig = origTexts.current.get(el) ?? '';
        const next = el.textContent ?? '';
        if (next !== orig) record({ selector: getSelector(el), type: 'text', oldValue: orig, newValue: next });
      };
      el.addEventListener('blur', onBlur, { once: true });
    }
  }, [record]);

  // ── Apply a style change to the DOM and record it ────────────────────────
  const applyStyle = useCallback((el: HTMLElement, selector: string, cssProp: string, cssVal: string) => {
    const old = (el.style as unknown as Record<string, string>)[cssProp] || (window.getComputedStyle(el) as unknown as Record<string, string>)[cssProp] || '';
    (el.style as unknown as Record<string, string>)[cssProp] = cssVal;
    record({ selector, type: 'style', property: cssProp, oldValue: old, newValue: cssVal });
  }, [record]);

  // ── Update style in state + DOM ───────────────────────────────────────────
  const updateStyle = useCallback(<K extends keyof Styles>(key: K, value: Styles[K]) => {
    setStyles(prev => ({ ...prev, [key]: value }));
    if (!selected) return;
    const { el, selector } = selected;
    const v = String(value);
    const needPx = key === 'fontSize' || key === 'borderRadius' || (key as string).startsWith('padding') || (key as string).startsWith('margin');
    const cssVal = needPx ? `${v}px` : v;
    applyStyle(el, selector, key as string, cssVal);
  }, [selected, applyStyle]);

  // ── Click handler (capture phase) ────────────────────────────────────────
  useEffect(() => {
    if (!active) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('#__em_panel__') || t.closest('#__em_tb__')) return;
      e.preventDefault(); e.stopPropagation();
      selectEl(t);
    };
    window.addEventListener('click', handler, true);
    return () => window.removeEventListener('click', handler, true);
  }, [active, selectEl]);

  // ── Hover outline ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!active) return;
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('#__em_panel__') || t.closest('#__em_tb__')) return;
      if (t === lastHov.current) return;
      lastHov.current?.classList.remove('__em_hov__');
      if (!t.classList.contains('__em_sel__')) { t.classList.add('__em_hov__'); lastHov.current = t; }
    };
    const out  = (e: MouseEvent) => (e.target as HTMLElement).classList.remove('__em_hov__');
    window.addEventListener('mouseover', over, true);
    window.addEventListener('mouseout',  out,  true);
    return () => { window.removeEventListener('mouseover', over, true); window.removeEventListener('mouseout', out, true); };
  }, [active]);

  // ── Section hover tracker ─────────────────────────────────────────────────
  useEffect(() => {
    if (!active) return;
    const move = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('#__em_panel__') || t.closest('#__em_tb__')) return;
      const sec = t.closest('main > section, main > div') as HTMLElement | null;
      setHSec(sec);
      if (sec) {
        const r = sec.getBoundingClientRect();
        setTbPos({ top: r.top, left: r.left, width: r.width });
      }
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [active]);

  // Update toolbar pos on scroll
  useEffect(() => {
    if (!active || !hSec) return;
    const onScroll = () => {
      const r = hSec.getBoundingClientRect();
      setTbPos({ top: r.top, left: r.left, width: r.width });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [active, hSec]);

  // ── Section operations ────────────────────────────────────────────────────
  const moveSection = (sec: HTMLElement, dir: 'up' | 'down') => {
    const par = sec.parentElement; if (!par) return;
    if (dir === 'up' && sec.previousElementSibling)
      par.insertBefore(sec, sec.previousElementSibling);
    else if (dir === 'down' && sec.nextElementSibling)
      par.insertBefore(sec.nextElementSibling, sec);
    record({ selector: getSelector(sec), type: 'reorder', oldValue: '', newValue: dir });
  };

  const toggleHide = (sec: HTMLElement) => {
    const hidden = sec.style.display === 'none';
    sec.style.display = hidden ? '' : 'none';
    record({ selector: getSelector(sec), type: 'visibility', oldValue: hidden ? 'none' : 'block', newValue: hidden ? 'block' : 'none' });
  };

  const duplicateSec = (sec: HTMLElement) => {
    const clone = sec.cloneNode(true) as HTMLElement;
    sec.parentElement?.insertBefore(clone, sec.nextSibling);
    record({ selector: getSelector(sec), type: 'duplicate', oldValue: '', newValue: 'duplicated' });
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const exportChanges = useCallback(() => {
    const out = {
      _instructions: 'Tell Claude Code: "Apply these design changes to the Sidelile homepage"',
      timestamp: new Date().toISOString(),
      totalChanges: changes.length,
      changes,
    };
    const json = JSON.stringify(out, null, 2);
    console.log('%c📋 Sidelile Edit Mode — Changes Export', 'font:bold 14px monospace;color:#7C3AED');
    console.log(json);
    navigator.clipboard.writeText(json).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  }, [changes]);

  // ── Not dev env: render nothing ───────────────────────────────────────────
  if (!isDev) return null;

  // ── Dev env but not active: show the hint badge ───────────────────────────
  if (!active) {
    return (
      <div
        style={{
          position: 'fixed', bottom: 14, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, pointerEvents: 'none',
          background: 'rgba(10,30,46,0.88)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20,
          padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'monospace', fontSize: 11, color: 'rgba(124,58,237,0.7)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <span>✏</span>
        <span>Press</span>
        <kbd style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 4, padding: '1px 5px', color: '#7C3AED', fontFamily: 'monospace' }}>
          Ctrl+Shift+E
        </kbd>
        <span>for edit mode</span>
      </div>
    );
  }

  // ── Active edit mode: render panel + toolbar + badge ─────────────────────
  return (
    <>
      {/* ── "Edit Mode Active" badge ── */}
      <div
        style={{
          position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10002, pointerEvents: 'none',
          background: 'rgba(10,30,46,0.94)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(124,58,237,0.4)', borderRadius: 20,
          padding: '5px 16px', display: 'flex', alignItems: 'center', gap: 7,
          fontFamily: '-apple-system,BlinkMacSystemFont,"Inter",monospace',
          fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
          textTransform: 'uppercase', color: '#7C3AED',
          boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C3AED', boxShadow: '0 0 6px #7C3AED', display: 'inline-block' }} />
        Edit Mode Active
      </div>

      {/* ── Section floating toolbar ── */}
      {hSec && (
        <div
          id="__em_tb__"
          style={{
            position: 'fixed',
            top: Math.max(58, tbPos.top + 10),
            left: tbPos.left + tbPos.width / 2,
            transform: 'translateX(-50%)',
            zIndex: 10001,
            pointerEvents: 'auto',
          }}
          onMouseEnter={() => {/* keep toolbar visible */}}
        >
          <div style={TB_WRAP}>
            {/* Tag label */}
            <span style={TB_LABEL}>{hSec.tagName.toLowerCase()}</span>
            <div style={TB_DIV} />

            {/* ↑ */}
            <button style={TB_BTN} title="Move section up"
              onClick={e => { e.stopPropagation(); moveSection(hSec, 'up'); }}>
              ↑
            </button>
            {/* ↓ */}
            <button style={TB_BTN} title="Move section down"
              onClick={e => { e.stopPropagation(); moveSection(hSec, 'down'); }}>
              ↓
            </button>

            <div style={TB_DIV} />

            {/* Hide/Show */}
            <button
              style={{ ...TB_BTN, color: hSec.style.display === 'none' ? '#10b981' : TB_BTN.color }}
              title={hSec.style.display === 'none' ? 'Show section' : 'Hide section'}
              onClick={e => { e.stopPropagation(); toggleHide(hSec); }}
            >
              {hSec.style.display === 'none' ? '👁' : '🚫'}
            </button>

            {/* BG color */}
            <label title="Section background" style={{ ...TB_BTN, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
              🎨
              <input
                type="color"
                defaultValue={rgbToHex(window.getComputedStyle(hSec).backgroundColor) || '#0a1e2e'}
                style={{ position: 'absolute', inset: '-4px', width: '200%', height: '200%', opacity: 0, cursor: 'pointer' }}
                onClick={e => e.stopPropagation()}
                onChange={e => {
                  hSec.style.backgroundColor = e.target.value;
                  record({ selector: getSelector(hSec), type: 'style', property: 'backgroundColor', oldValue: '', newValue: e.target.value });
                }}
              />
            </label>

            {/* Duplicate */}
            <button style={TB_BTN} title="Duplicate section"
              onClick={e => { e.stopPropagation(); duplicateSec(hSec); }}>
              ⧉
            </button>
          </div>
        </div>
      )}

      {/* ── Right edit panel ── */}
      <div
        id="__em_panel__"
        style={PANEL_WRAP}
        onClick={e => e.stopPropagation()}
      >
        {/* ─ Header ─ */}
        <div style={PANEL_HEADER}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', boxShadow: '0 0 6px #7C3AED', flexShrink: 0, display: 'inline-block' }} />
          <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', flex: 1 }}>
            Edit Mode
          </span>
          <span style={KBD_CHIP}>Ctrl+Shift+E</span>
          <button style={CLOSE_BTN} onClick={() => setActive(false)} title="Exit edit mode">✕</button>
        </div>

        {/* ─ Selected element badge ─ */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {selected ? (
            <>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginBottom: 5 }}>Selected element</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={TAG_CHIP}>&lt;{selected.el.tagName.toLowerCase()}&gt;</span>
                {selected.isText && <span style={TEXT_CHIP}>editable text</span>}
              </div>
              <div style={SEL_PATH}>
                {selected.selector.length > 48 ? '…' + selected.selector.slice(-48) : selected.selector}
              </div>
            </>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'center', padding: '10px 0', lineHeight: 1.7 }}>
              Click any element on the page<br />to select and edit it
            </div>
          )}
        </div>

        {/* ─ Style controls (scrollable) ─ */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
          {selected ? (
            <>
              {/* Typography */}
              <PanelSection label="Typography">
                <CtrlRow label="Size">
                  <input type="range" min={8} max={96} step={1}
                    value={styles.fontSize}
                    onChange={e => updateStyle('fontSize', Number(e.target.value))}
                    style={SLIDER} />
                  <Mono>{styles.fontSize}px</Mono>
                </CtrlRow>
                <CtrlRow label="Weight">
                  <select
                    value={styles.fontWeight}
                    onChange={e => updateStyle('fontWeight', e.target.value)}
                    style={SELECT}
                  >
                    {[['100','Thin'],['200','Extra Light'],['300','Light'],['400','Regular'],
                      ['500','Medium'],['600','Semi Bold'],['700','Bold'],['800','Extra Bold'],['900','Black']
                    ].map(([v,l]) => <option key={v} value={v}>{l} · {v}</option>)}
                  </select>
                </CtrlRow>
                <CtrlRow label="Color">
                  <ColorPick value={styles.color} onChange={v => updateStyle('color', v)} />
                </CtrlRow>
              </PanelSection>

              {/* Background */}
              <PanelSection label="Background">
                <CtrlRow label="Fill">
                  <ColorPick value={styles.backgroundColor} onChange={v => updateStyle('backgroundColor', v)} />
                </CtrlRow>
              </PanelSection>

              {/* Padding */}
              <PanelSection label="Padding">
                <BoxInputs
                  t={styles.paddingTop}    r={styles.paddingRight}
                  b={styles.paddingBottom} l={styles.paddingLeft}
                  onChange={(side, v) => {
                    const key = `padding${side}` as keyof Styles;
                    updateStyle(key, v);
                  }}
                />
              </PanelSection>

              {/* Margin */}
              <PanelSection label="Margin">
                <BoxInputs
                  t={styles.marginTop}    r={styles.marginRight}
                  b={styles.marginBottom} l={styles.marginLeft}
                  onChange={(side, v) => {
                    const key = `margin${side}` as keyof Styles;
                    updateStyle(key, v);
                  }}
                />
              </PanelSection>

              {/* Border radius */}
              <PanelSection label="Border Radius">
                <CtrlRow label="Radius">
                  <input type="range" min={0} max={100} step={1}
                    value={styles.borderRadius}
                    onChange={e => updateStyle('borderRadius', Number(e.target.value))}
                    style={SLIDER} />
                  <Mono>{styles.borderRadius}px</Mono>
                </CtrlRow>
              </PanelSection>
            </>
          ) : (
            /* No selection: show usage hints */
            <div style={{ padding: '16px 14px' }}>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, lineHeight: 2, letterSpacing: 0.3 }}>
                <div>🖱 <b style={{ color: 'rgba(255,255,255,0.4)' }}>Click</b> any text → edit inline</div>
                <div>📐 <b style={{ color: 'rgba(255,255,255,0.4)' }}>Hover</b> a section → section toolbar</div>
                <div>🎨 <b style={{ color: 'rgba(255,255,255,0.4)' }}>Select</b> element → style controls</div>
                <div>📋 <b style={{ color: 'rgba(255,255,255,0.4)' }}>Export</b> → JSON for Claude Code</div>
                <div style={{ marginTop: 8 }}>⎋ Press <kbd style={KBD_INLINE}>Ctrl+Shift+E</kbd> to exit</div>
              </div>
            </div>
          )}
        </div>

        {/* ─ Export footer (always visible) ─ */}
        <div style={EXPORT_FOOTER}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
              {changes.length} change{changes.length !== 1 ? 's' : ''} recorded
            </span>
            {changes.length > 0 && (
              <button
                onClick={() => setChanges([])}
                style={{ background: 'none', border: 'none', color: 'rgba(255,0,0,0.4)', cursor: 'pointer', fontSize: 10 }}
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={exportChanges}
            style={{
              width: '100%', padding: '9px 14px', borderRadius: 8, cursor: 'pointer',
              background: copied ? 'rgba(16,185,129,0.12)' : 'rgba(124,58,237,0.1)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'rgba(124,58,237,0.3)'}`,
              color: copied ? '#10b981' : '#7C3AED',
              fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
              transition: 'all 0.2s',
              fontFamily: '-apple-system,BlinkMacSystemFont,"Inter",sans-serif',
            }}
          >
            {copied ? '✓ Copied to clipboard!' : '📋 Copy Changes as JSON'}
          </button>
          <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: 9, marginTop: 6, textAlign: 'center', lineHeight: 1.6 }}>
            Paste into Claude Code to apply changes to the code
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PanelSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ padding: '9px 14px 3px', fontSize: 9, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
        {label}
      </div>
      <div style={{ padding: '2px 14px 10px' }}>{children}</div>
    </div>
  );
}

function CtrlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
      <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, width: 42, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>{children}</div>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: '#7C3AED', fontSize: 10, fontFamily: 'monospace', flexShrink: 0, minWidth: 36, textAlign: 'right' }}>
      {children}
    </span>
  );
}

function ColorPick({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1 }}>
      <span style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        border: '2px solid rgba(255,255,255,0.14)',
        background: value, display: 'block', position: 'relative', overflow: 'hidden',
      }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ position: 'absolute', inset: '-4px', width: '160%', height: '160%', opacity: 0, cursor: 'pointer' }} />
      </span>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: 'monospace' }}>{value}</span>
    </label>
  );
}

function BoxInputs({
  t, r, b, l,
  onChange,
}: { t: number; r: number; b: number; l: number; onChange: (side: 'Top' | 'Right' | 'Bottom' | 'Left', v: number) => void }) {
  const field = (lbl: string, val: number, side: 'Top' | 'Right' | 'Bottom' | 'Left') => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: 0.5 }}>{lbl}</span>
      <input
        type="number" min={0} max={300} value={val}
        onChange={e => onChange(side, Number(e.target.value))}
        style={{
          width: 46, padding: '4px 4px', textAlign: 'center',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 5, color: '#7C3AED', fontSize: 11, fontFamily: 'monospace', outline: 'none',
        }}
      />
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 8 }}>
      {field('T', t, 'Top')} {field('R', r, 'Right')} {field('B', b, 'Bottom')} {field('L', l, 'Left')}
    </div>
  );
}

// ─── Shared style constants ───────────────────────────────────────────────────

const FONT = '-apple-system,BlinkMacSystemFont,"Inter",sans-serif';

const PANEL_WRAP: React.CSSProperties = {
  position: 'fixed', top: 0, right: 0, bottom: 0, width: 272,
  zIndex: 10000, background: '#0f1623',
  borderLeft: '1px solid rgba(124,58,237,0.18)',
  display: 'flex', flexDirection: 'column',
  fontFamily: FONT, fontSize: 12,
  boxShadow: '-12px 0 48px rgba(0,0,0,0.6)',
};

const PANEL_HEADER: React.CSSProperties = {
  padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
  display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
};

const KBD_CHIP: React.CSSProperties = {
  fontSize: 9, color: 'rgba(255,255,255,0.28)',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 4, padding: '2px 5px', fontFamily: 'monospace',
};

const KBD_INLINE: React.CSSProperties = {
  ...KBD_CHIP, display: 'inline', color: 'rgba(255,255,255,0.4)', marginLeft: 4,
};

const CLOSE_BTN: React.CSSProperties = {
  width: 22, height: 22, borderRadius: 5,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 10, lineHeight: 1, padding: 0,
};

const TAG_CHIP: React.CSSProperties = {
  background: 'rgba(124,58,237,0.13)', color: '#7C3AED',
  padding: '2px 7px', borderRadius: 4, fontSize: 10,
  fontWeight: 600, fontFamily: 'monospace',
};

const TEXT_CHIP: React.CSSProperties = {
  background: 'rgba(99,102,241,0.12)', color: '#818cf8',
  padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
};

const SEL_PATH: React.CSSProperties = {
  marginTop: 6, color: 'rgba(255,255,255,0.22)', fontSize: 9,
  fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6,
};

const EXPORT_FOOTER: React.CSSProperties = {
  position: 'absolute', bottom: 0, left: 0, right: 0,
  padding: '12px 14px', background: '#090e15',
  borderTop: '1px solid rgba(255,255,255,0.06)',
};

const SLIDER: React.CSSProperties = { flex: 1, accentColor: '#7C3AED', cursor: 'pointer', height: 3 };

const SELECT: React.CSSProperties = {
  flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.75)', borderRadius: 6, padding: '4px 6px',
  fontSize: 11, cursor: 'pointer', outline: 'none',
};

// Section toolbar styles
const TB_WRAP: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 3,
  background: '#0a1e2e', border: '1px solid rgba(124,58,237,0.4)',
  borderRadius: 9, padding: '4px 7px',
  boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
  backdropFilter: 'blur(8px)',
};

const TB_LABEL: React.CSSProperties = {
  fontSize: 9, color: 'rgba(124,58,237,0.6)', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: 1, padding: '0 3px',
  fontFamily: 'monospace',
};

const TB_DIV: React.CSSProperties = { width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 2px' };

const TB_BTN: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
  color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
  padding: '3px 7px', borderRadius: 5, fontSize: 13,
  lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s',
};
