'use client';

import { useState } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import { MESSAGES, Message, STUDENT } from '@/data/studentData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E'; const S3 = '#272727';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.10)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const F_HEADING = "'Bricolage Grotesque', sans-serif"; const F_BODY = "'Inter', sans-serif";

function MessageThread({ msg, replyText, setReplyText, onSend }: {
  msg: Message;
  replyText: string;
  setReplyText: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, background: SURFACE, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: msg.fromColor + '22', border: `1px solid ${msg.fromColor + '44'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: msg.fromColor }}>
            {msg.fromInitials}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{msg.from}</div>
            <div style={{ fontSize: 11, color: MUTED, textTransform: 'capitalize' }}>{msg.fromRole}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontFamily: F_HEADING, fontSize: 16, fontWeight: 600, color: TEXT, letterSpacing: '-0.01em' }}>{msg.subject}</div>
      </div>

      {/* Thread */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {msg.thread.map((t, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: t.isStudent ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: t.isStudent ? GOLD_DIM : msg.fromColor + '22', border: `1px solid ${t.isStudent ? GOLD_B : msg.fromColor + '44'}`, color: t.isStudent ? GOLD : msg.fromColor }}>
              {t.isStudent ? STUDENT.avatarInitials : msg.fromInitials}
            </div>
            <div style={{ maxWidth: '72%' }}>
              <div style={{ padding: '10px 14px', borderRadius: t.isStudent ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: t.isStudent ? GOLD_DIM : S2, border: `1px solid ${t.isStudent ? GOLD_B : BORDER}`, fontSize: 13, color: TEXT, lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                {t.body}
              </div>
              <div style={{ fontSize: 10, color: FAINT, marginTop: 4, textAlign: t.isStudent ? 'right' : 'left' }}>{t.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply input */}
      <div style={{ padding: '14px 20px', borderTop: `1px solid ${BORDER}`, background: SURFACE, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: S2, borderRadius: 12, border: `1px solid ${BORDER}`, padding: '10px 10px 10px 14px' }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={`Reply to ${msg.from}…`}
            rows={2}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 13, color: TEXT, lineHeight: 1.5, fontFamily: F_BODY }}
          />
          <button
            onClick={onSend}
            disabled={!replyText.trim()}
            style={{ width: 36, height: 36, borderRadius: 9, background: replyText.trim() ? GOLD : 'rgba(255,255,255,0.05)', border: 'none', cursor: replyText.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .15s' }}
          >
            <Send size={14} style={{ color: replyText.trim() ? '#000' : FAINT }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [messages, setMessages] = useState(MESSAGES);
  const [selected, setSelected] = useState<string>(MESSAGES[0].id);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [showThread, setShowThread] = useState(false);

  const current = messages.find(m => m.id === selected)!;

  const handleSelect = (id: string) => {
    setSelected(id);
    setShowThread(true);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleSend = () => {
    const text = replies[selected]?.trim();
    if (!text) return;
    setMessages(prev => prev.map(m => m.id === selected
      ? { ...m, thread: [...m.thread, { from: STUDENT.firstName + ' ' + STUDENT.lastName, body: text, date: new Date().toISOString().slice(0, 10), isStudent: true }] }
      : m
    ));
    setReplies(prev => ({ ...prev, [selected]: '' }));
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', fontFamily: F_BODY, background: BG }}>
      {/* Left: conversation list */}
      <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', background: SURFACE }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontFamily: F_HEADING, fontSize: 15, fontWeight: 700, color: TEXT }}>Inbox</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{messages.filter(m => !m.read).length} unread</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {messages.map(m => {
            const isActive = m.id === selected;
            return (
              <div
                key={m.id}
                onClick={() => handleSelect(m.id)}
                style={{ display: 'flex', gap: 10, padding: '12px 14px', cursor: 'pointer', borderBottom: `1px solid ${BORDER}`, background: isActive ? S2 : 'transparent', borderLeft: `3px solid ${isActive ? GOLD : 'transparent'}`, transition: 'background .15s' }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: m.fromColor + '22', color: m.fromColor, border: `1px solid ${m.fromColor + '44'}` }}>
                  {m.fromInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: m.read ? 400 : 700, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.from}</span>
                    <span style={{ fontSize: 10, color: FAINT, flexShrink: 0 }}>{m.date.slice(5)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{m.subject}</div>
                  <div style={{ fontSize: 11, color: FAINT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{m.preview}</div>
                  {!m.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: GOLD, marginTop: 4 }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: thread */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {current
          ? <MessageThread
              msg={current}
              replyText={replies[current.id] || ''}
              setReplyText={v => setReplies(p => ({ ...p, [current.id]: v }))}
              onSend={handleSend}
            />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: MUTED, fontSize: 14 }}>
              Select a conversation
            </div>
        }
      </div>
    </div>
  );
}
