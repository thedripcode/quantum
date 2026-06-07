'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RotateCcw, Sparkles } from 'lucide-react';
import { F } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ChatContext = 'home' | 'student' | 'teacher';

interface Message {
  id:     number;
  from:   'bot' | 'user';
  text:   string;
  links?: { label: string; href: string }[];
}

interface QuickReply {
  label:   string;
  payload: string;
}

// ─── Context quick replies ─────────────────────────────────────────────────────
const QUICK_REPLIES: Record<ChatContext, QuickReply[]> = {
  home: [
    { label: 'Admissions',      payload: 'admissions'  },
    { label: 'Contact us',      payload: 'contact'     },
    { label: 'About school',    payload: 'about'       },
    { label: 'School hours',    payload: 'hours'       },
    { label: 'Matric results',  payload: 'results'     },
    { label: 'Get directions',  payload: 'directions'  },
  ],
  student: [
    { label: 'My results',      payload: 'my_results'  },
    { label: 'Timetable',       payload: 'timetable'   },
    { label: 'Assignments',     payload: 'assignments' },
    { label: 'Attendance',      payload: 'attendance'  },
    { label: 'Contact school',  payload: 'contact'     },
    { label: 'Get help',        payload: 'help'        },
  ],
  teacher: [
    { label: 'Capture marks',   payload: 'marks'       },
    { label: 'My classes',      payload: 'classes'     },
    { label: 'Reports',         payload: 'reports'     },
    { label: 'Timetable',       payload: 'timetable'   },
    { label: 'Contact admin',   payload: 'contact'     },
    { label: 'Get help',        payload: 'help'        },
  ],
};

// ─── Response bank ────────────────────────────────────────────────────────────
const RESPONSES: Record<ChatContext, Record<string, { text: string; links?: { label: string; href: string }[] }>> = {
  home: {
    admissions: {
      text: "Applications for 2026 are open!\n\nTo apply, visit our admissions page. You'll need your Grade 9 results and ID document. Our team will guide you through the rest.\n\nCall us on +27 39 970 7393 for more info.",
      links: [{ label: 'Apply Now →', href: '/apply' }],
    },
    contact: {
      text: "Here's how to reach us:\n\n📍 1253 Sidiya Highway, Umkomaas, KZN 4170\n📞 +27 39 970 7393\n📧 info@sidelile.edu.za\n🕐 Mon–Fri: 07:30–16:00",
      links: [{ label: 'Open Maps', href: 'https://maps.google.com/?q=1253+Sidiya+Highway+Umkomaas+KwaZulu-Natal+4170' }],
    },
    about: {
      text: "Sidelile High School is a leading public secondary school in KwaZulu-Natal.\n\nWe serve 1,200+ learners from Grade 8 to 12, with 85 qualified educators and a consistent 95%+ matric pass rate.\n\nOur motto: Sikhula Ngemfundo — We Grow Through Education.",
    },
    hours: {
      text: "School hours:\n\n• Learners: 07:30 – 14:45\n• Admin office: 07:30 – 16:00\n• Monday – Friday only\n\nClosed on public holidays and school vacations.",
    },
    results: {
      text: "We're proud of our learners!\n\n2024 Matric Results:\n• 95% overall pass rate\n• 85+ university endorsements\n• Top performers in the Umlazi district\n\nSidelile consistently ranks among the top schools in KwaZulu-Natal.",
    },
    directions: {
      text: "We're located at:\n📍 1253 Sidiya Highway, Umkomaas, Ethekwini, KwaZulu-Natal, 4170\n\nTap below to open Google Maps.",
      links: [{ label: 'Open Google Maps', href: 'https://maps.google.com/?q=1253+Sidiya+Highway+Umkomaas+KwaZulu-Natal+4170' }],
    },
  },
  student: {
    my_results: { text: "To view your results:\n\n1. Go to your Dashboard\n2. Click the 'Results' tab\n3. Select a subject or term\n\nIf something looks wrong, speak to your class teacher." },
    timetable:  { text: "Your timetable is in the 'Schedule' section of your student portal dashboard.\n\nIf it hasn't been updated yet, check with your grade head or the admin office." },
    assignments:{ text: "To find your assignments:\n\n1. Click 'Assignments' in your sidebar\n2. Filter by subject or due date\n3. Submit work directly through the portal\n\nAlways submit before the deadline." },
    attendance: { text: "Your attendance record is under 'Attendance' in your dashboard.\n\nIf you see an error, report it to your class teacher within 3 school days." },
    contact:    { text: "📞 Phone: +27 39 970 7393\n📧 Email: info@sidelile.edu.za\n🕐 Mon–Fri: 07:30–16:00\n\nFor urgent matters, speak to your class teacher or go to the admin block." },
    help:       { text: "Common fixes:\n• Forgot password → use 'Reset Password' on login page\n• Can't see results → your teacher may not have captured them yet\n• Wrong info → contact admin\n\nStill stuck? Call +27 39 970 7393." },
  },
  teacher: {
    marks:     { text: "To capture marks:\n\n1. Go to 'Classes' in your sidebar\n2. Select the class and subject\n3. Click 'Capture Marks'\n4. Enter each learner's mark\n5. Save & Submit\n\nMarks can be edited before the admin locks the term." },
    classes:   { text: "Your class lists are under the 'Classes' section.\n\nEach class shows learner names, attendance, assignment submissions, and mark breakdowns. Click any learner's name for their full profile." },
    reports:   { text: "To generate reports:\n\n1. Go to 'Reports' in the sidebar\n2. Select type: Progress / Term / Attendance\n3. Choose class and date range\n4. Click 'Generate'\n5. Export as PDF or Excel" },
    timetable: { text: "Your teaching schedule is under 'Timetable' in your dashboard.\n\nIf it needs updating, contact the deputy principal or admin office.\n📞 +27 39 970 7393" },
    contact:   { text: "Admin contact:\n📞 +27 39 970 7393\n📧 info@sidelile.edu.za\n🕐 Mon–Fri: 07:30–16:00\n\nThe admin block is the main building at the school entrance." },
    help:      { text: "Teacher portal help:\n• Forgot password → Reset Password on login\n• Can't see classes → contact admin to be assigned\n• System issues → email info@sidelile.edu.za with a screenshot" },
  },
};

const GREETINGS: Record<ChatContext, string> = {
  home:    "Hi! I'm Llama, Sidelile's AI assistant.\n\nHow can I help you today? Choose a topic below or type your question.",
  student: "Hey! I'm Llama, your student portal assistant.\n\nWhat do you need help with?",
  teacher: "Hello! I'm Llama, your teacher portal assistant.\n\nWhat can I help you with?",
};

// ─── Theming (Apple dark system palette, always dark) ─────────────────────────
const T = {
  panel:       'rgba(28, 28, 30, 0.96)',
  header:      '#1C1C1E',
  surface:     '#2C2C2E',
  surfaceHigh: '#3A3A3C',
  botBubble:   '#2C2C2E',
  userBubble:  '#FFFFFF',
  userText:    '#1C1C1E',
  botText:     'rgba(255,255,255,0.88)',
  mutedText:   'rgba(255,255,255,0.40)',
  border:      'rgba(255,255,255,0.08)',
  inputBg:     '#2C2C2E',
  chipBg:      'rgba(255,255,255,0.07)',
  chipBorder:  'rgba(255,255,255,0.12)',
  chipText:    'rgba(255,255,255,0.70)',
  sendBtn:     '#FFFFFF',
  sendIcon:    '#1C1C1E',
  fabBg:       '#1C1C1E',
  fabBorder:   'rgba(255,255,255,0.16)',
  glow:        'rgba(255,255,255,0.08)',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatBot({ context = 'home' }: { context?: ChatContext }) {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const [msgId,    setMsgId]    = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) addBotMessage(GREETINGS[context]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  function addBotMessage(text: string, links?: { label: string; href: string }[]) {
    setMsgId(id => {
      const newId = id + 1;
      setMessages(prev => [...prev, { id: newId, from: 'bot', text, links }]);
      return newId;
    });
  }

  function handleQuickReply(payload: string) {
    const label = QUICK_REPLIES[context].find(q => q.payload === payload)?.label ?? payload;
    setMsgId(id => {
      const newId = id + 1;
      setMessages(prev => [...prev, { id: newId, from: 'user', text: label }]);
      return newId;
    });
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const resp = RESPONSES[context][payload];
      addBotMessage(resp?.text ?? "I'm not sure about that yet — call us on +27 39 970 7393!", resp?.links);
    }, 850);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMsgId(id => {
      const newId = id + 1;
      setMessages(prev => [...prev, { id: newId, from: 'user', text }]);
      return newId;
    });
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();
      const matched = Object.entries(RESPONSES[context]).find(([key]) =>
        lower.includes(key) ||
        (key === 'admissions'  && /apply|admission|enrol/i.test(lower)) ||
        (key === 'contact'     && /phone|email|contact|reach/i.test(lower)) ||
        (key === 'about'       && /about|school|info/i.test(lower)) ||
        (key === 'hours'       && /hour|time|open|close/i.test(lower)) ||
        (key === 'results'     && /result|pass|matric/i.test(lower)) ||
        (key === 'directions'  && /where|address|location|map|direction/i.test(lower)) ||
        (key === 'my_results'  && /result|mark|grade/i.test(lower)) ||
        (key === 'timetable'   && /timetable|schedule|period/i.test(lower)) ||
        (key === 'assignments' && /assignment|homework|submit/i.test(lower)) ||
        (key === 'attendance'  && /attendance|absent|present/i.test(lower)) ||
        (key === 'marks'       && /mark|capture|score/i.test(lower)) ||
        (key === 'classes'     && /class|learner|student/i.test(lower)) ||
        (key === 'reports'     && /report|pdf|export/i.test(lower)) ||
        (key === 'help'        && /help|problem|issue|stuck/i.test(lower))
      );
      if (matched) {
        addBotMessage(matched[1].text, matched[1].links);
      } else {
        addBotMessage("I didn't quite catch that.\n\nTry one of the quick reply buttons, or call us on +27 39 970 7393 — we're happy to help!");
      }
    }, 800);
  }

  function handleReset() {
    setMessages([]);
    setTyping(false);
    setTimeout(() => addBotMessage(GREETINGS[context]), 100);
  }

  // ─── Avatar ───────────────────────────────────────────────────────────────
  const Avatar = () => (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: T.surface,
      border: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      <Image src="/images/llama-bot.svg" alt="Llama" width={18} height={18} />
    </div>
  );

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 80 }}>

      {/* ── FAB ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setOpen(true)}
            aria-label="Open Llama assistant"
            style={{
              width: 60, height: 60, borderRadius: '50%',
              background: T.fabBg,
              border: `1px solid ${T.fabBorder}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.30)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Breathing glow */}
            <motion.div
              animate={{ scale: [1, 1.45], opacity: [0.40, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: -2, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            />
            <Image src="/images/llama-bot.svg" alt="Llama" width={34} height={34} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 376,
              maxWidth: 'calc(100vw - 24px)',
              borderRadius: 22,
              overflow: 'hidden',
              background: T.panel,
              backdropFilter: 'blur(48px)',
              WebkitBackdropFilter: 'blur(48px)',
              border: `1px solid ${T.border}`,
              boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 4px 16px rgba(0,0,0,0.30)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              background: T.header,
              borderBottom: `1px solid ${T.border}`,
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              {/* Bot avatar — large version */}
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: T.surface,
                border: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
              }}>
                <Image src="/images/llama-bot.svg" alt="Llama" width={28} height={28} />
                {/* Online indicator */}
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 11, height: 11, borderRadius: '50%',
                  background: '#34C759',
                  border: `2px solid ${T.header}`,
                }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: F.heading, fontWeight: 700, fontSize: 14.5, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    Llama
                  </span>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    background: 'rgba(255,255,255,0.07)',
                    border: `1px solid ${T.border}`,
                    borderRadius: 999, padding: '1px 7px',
                  }}>
                    <Sparkles size={9} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.50)' }} />
                    <span style={{ fontFamily: F.body, fontSize: 10, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.04em' }}>AI</span>
                  </div>
                </div>
                <div style={{ fontFamily: F.body, fontSize: 11.5, color: T.mutedText, marginTop: 2 }}>
                  Sidelile School Assistant
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { icon: <RotateCcw size={12} strokeWidth={1.5} />, action: handleReset,          label: 'Restart' },
                  { icon: <X         size={13} strokeWidth={1.5} />, action: () => setOpen(false), label: 'Close'   },
                ].map(({ icon, action, label }) => (
                  <button
                    key={label}
                    onClick={action}
                    aria-label={label}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: T.surfaceHigh,
                      border: `1px solid ${T.border}`,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: T.mutedText,
                      transition: 'background 0.18s ease, color 0.18s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)';
                      (e.currentTarget as HTMLElement).style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = T.surfaceHigh;
                      (e.currentTarget as HTMLElement).style.color = T.mutedText;
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Messages ── */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px 14px',
              display: 'flex', flexDirection: 'column', gap: 10,
              minHeight: 220, maxHeight: 360,
              scrollbarWidth: 'none',
            }}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
                  style={{
                    display: 'flex',
                    flexDirection: msg.from === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 8,
                  }}
                >
                  {msg.from === 'bot' && <Avatar />}

                  <div style={{ maxWidth: '82%' }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.from === 'user'
                        ? '18px 18px 5px 18px'
                        : '5px 18px 18px 18px',
                      background: msg.from === 'user' ? T.userBubble : T.botBubble,
                      color: msg.from === 'user' ? T.userText : T.botText,
                      fontSize: 13.5,
                      fontFamily: F.body,
                      lineHeight: 1.58,
                      whiteSpace: 'pre-line',
                      fontWeight: 400,
                    }}>
                      {msg.text}
                    </div>

                    {msg.links && msg.links.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {msg.links.map(link => (
                          <a
                            key={link.href}
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            style={{
                              padding: '7px 16px',
                              borderRadius: 999,
                              background: '#FFFFFF',
                              color: '#1C1C1E',
                              fontSize: 12.5,
                              fontFamily: F.body,
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-block',
                              transition: 'opacity 0.18s ease',
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.82')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}
                >
                  <Avatar />
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '5px 18px 18px 18px',
                    background: T.botBubble,
                    display: 'flex', gap: 5, alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.75, delay: i * 0.14 }}
                        style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: 'rgba(255,255,255,0.50)',
                          display: 'block',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Quick replies ── */}
            <div style={{
              padding: '10px 14px 8px',
              borderTop: `1px solid ${T.border}`,
              display: 'flex', flexWrap: 'wrap', gap: 6,
            }}>
              {QUICK_REPLIES[context].map(qr => (
                <button
                  key={qr.payload}
                  onClick={() => handleQuickReply(qr.payload)}
                  style={{
                    padding: '5px 13px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontFamily: F.body,
                    fontWeight: 500,
                    background: T.chipBg,
                    border: `1px solid ${T.chipBorder}`,
                    color: T.chipText,
                    transition: 'background 0.16s ease, color 0.16s ease, border-color 0.16s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.14)';
                    el.style.color = '#fff';
                    el.style.borderColor = 'rgba(255,255,255,0.24)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = T.chipBg;
                    el.style.color = T.chipText;
                    el.style.borderColor = T.chipBorder;
                  }}
                >
                  {qr.label}
                </button>
              ))}
            </div>

            {/* ── Input row ── */}
            <div style={{
              padding: '8px 14px 16px',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Ask Llama anything…"
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 999,
                  background: T.inputBg,
                  border: `1px solid ${T.border}`,
                  color: '#fff',
                  fontSize: 13.5,
                  fontFamily: F.body,
                  outline: 'none',
                  transition: 'border-color 0.18s ease',
                }}
                onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.24)')}
                onBlur={e  => ((e.currentTarget as HTMLElement).style.borderColor = T.border)}
              />
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
                onClick={handleSend}
                aria-label="Send"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: 'none',
                  background: input.trim() ? T.sendBtn : 'rgba(255,255,255,0.18)',
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.18s ease',
                }}
              >
                <Send size={15} strokeWidth={2} color={input.trim() ? T.sendIcon : 'rgba(255,255,255,0.40)'} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
