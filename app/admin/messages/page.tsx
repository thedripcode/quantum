'use client';

import { useState } from 'react';
import { Search, X, Send } from 'lucide-react';

const BG = '#081420', SURFACE = '#0E1E30', S2 = '#14283E', S3 = '#1A3049';
const GOLD = '#60a5fa', GOLD_DIM = 'rgba(96,165,250,0.10)', GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)', TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const GREEN = '#10B981', RED = '#EF4444', AMBER = '#F59E0B', BLUE = '#3B82F6';
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

type Contact = {
  id: string;
  name: string;
  role: string;
  color: string;
  initials: string;
  unread: number;
};

type Message = { from: 'admin' | 'other'; text: string; time: string };

const INIT_CONTACTS: Contact[] = [
  { id: 'C1', name: 'Mr. Dlamini', role: 'Math Teacher', color: '#3B82F6', initials: 'JD', unread: 2 },
  { id: 'C2', name: 'Mrs. Khumalo', role: 'English Teacher', color: '#10B981', initials: 'SK', unread: 0 },
  { id: 'C3', name: 'Mrs. Nkosi', role: 'Parent of Thabo', color: '#F59E0B', initials: 'ZN', unread: 1 },
  { id: 'C4', name: 'Dr. Mokoena', role: 'Deputy Principal', color: '#8B5CF6', initials: 'DM', unread: 0 },
  { id: 'C5', name: 'Ms. van der Merwe', role: 'Sciences Teacher', color: '#EC4899', initials: 'VM', unread: 0 },
];

const INIT_THREADS: Record<string, Message[]> = {
  C1: [
    { from: 'other', text: 'Good morning. I submitted the Grade 10 test results for your review.', time: '08:05' },
    { from: 'admin', text: 'Thank you, Mr. Dlamini. I will review them this morning.', time: '08:20' },
    { from: 'other', text: 'Also, two students were absent on the day of the test. Can we arrange a catch-up date?', time: '08:35' },
    { from: 'other', text: 'Please let me know when you have a moment to discuss the Grade 11 syllabus changes.', time: '08:36' },
  ],
  C2: [
    { from: 'other', text: 'The English term essay submissions are in. I have uploaded them to the shared drive.', time: 'Tue' },
    { from: 'admin', text: 'Great, Mrs. Khumalo. I will check them before end of week.', time: 'Tue' },
  ],
  C3: [
    { from: 'other', text: 'Good day. I would like to schedule a meeting regarding Thabo\'s recent progress. When are you available?', time: '10:14' },
  ],
  C4: [
    { from: 'other', text: 'Please send the updated enrolment figures for the district report by Friday.', time: 'Mon' },
    { from: 'admin', text: 'Understood, Dr. Mokoena. I will have them ready by Thursday afternoon.', time: 'Mon' },
    { from: 'other', text: 'Thank you. Also please confirm the venue for the staff meeting next week.', time: 'Mon' },
    { from: 'admin', text: 'The meeting will be held in the main hall at 14:00.', time: 'Mon' },
  ],
  C5: [],
};

export default function MessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>(INIT_CONTACTS);
  const [threads, setThreads] = useState<Record<string, Message[]>>(INIT_THREADS);
  const [selectedId, setSelectedId] = useState<string>('C1');
  const [reply, setReply] = useState('');
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selected = contacts.find(c => c.id === selectedId)!;
  const currentThread = threads[selectedId] || [];

  const filteredContacts = contacts.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const sendReply = () => {
    if (!reply.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setThreads(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), { from: 'admin', text: reply.trim(), time }],
    }));
    setReply('');
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', fontFamily: FB, background: BG, overflow: 'hidden' }}>

      {/* ── Left panel ── */}
      <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', background: SURFACE }}>

        {/* Header + search */}
        <div style={{ padding: '16px 14px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ fontFamily: FH, fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 12, letterSpacing: '-0.02em' }}>Messages</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: S2, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 10px' }}>
            <Search size={12} color={FAINT} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FB }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                <X size={10} color={FAINT} />
              </button>
            )}
          </div>
        </div>

        {/* Contact list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredContacts.map(c => {
            const lastMsg = threads[c.id]?.slice(-1)[0];
            const isActive = selectedId === c.id;
            const isHovered = hoveredId === c.id && !isActive;
            return (
              <div
                key={c.id}
                onClick={() => handleSelect(c.id)}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '11px 14px',
                  cursor: 'pointer',
                  background: isActive ? S3 : isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderBottom: `1px solid rgba(255,255,255,0.03)`,
                  borderLeft: isActive ? `2px solid ${GOLD}` : '2px solid transparent',
                  transition: 'background 0.12s',
                }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: c.color + '22',
                    border: `1px solid ${c.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: c.color,
                    letterSpacing: '0.02em',
                  }}>
                    {c.initials}
                  </div>
                  {c.unread > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: GOLD,
                      border: `2px solid ${SURFACE}`,
                    }} />
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: c.unread > 0 ? 700 : 500,
                      color: c.unread > 0 ? TEXT : MUTED,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 120,
                    }}>
                      {c.name}
                    </span>
                    {lastMsg && (
                      <span style={{ fontSize: 10, color: FAINT, flexShrink: 0, marginLeft: 4 }}>{lastMsg.time}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: FAINT, marginBottom: 2 }}>{c.role}</div>
                  {lastMsg && (
                    <div style={{ fontSize: 11, color: FAINT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lastMsg.from === 'admin' ? 'You: ' : ''}{lastMsg.text.length > 36 ? lastMsg.text.slice(0, 36) + '…' : lastMsg.text}
                    </div>
                  )}
                  {!lastMsg && (
                    <div style={{ fontSize: 11, color: FAINT, fontStyle: 'italic' }}>No messages yet</div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredContacts.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: FAINT, fontSize: 12 }}>No contacts found</div>
          )}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: BG }}>

        {/* Thread header */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: SURFACE }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: selected.color + '22',
            border: `1px solid ${selected.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: selected.color,
          }}>
            {selected.initials}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: FH, letterSpacing: '-0.01em' }}>{selected.name}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{selected.role}</div>
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {currentThread.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: FAINT, fontSize: 13 }}>
                <div style={{ marginBottom: 6, fontSize: 22 }}>💬</div>
                No messages yet. Start a conversation with {selected.name}.
              </div>
            </div>
          )}

          {currentThread.map((msg, i) => {
            const isAdmin = msg.from === 'admin';
            return (
              <div key={i} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '68%' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isAdmin ? GOLD_DIM : S2,
                    border: `1px solid ${isAdmin ? GOLD_B : BORDER}`,
                    fontSize: 13,
                    color: TEXT,
                    lineHeight: 1.55,
                    wordBreak: 'break-word',
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 10, color: FAINT, marginTop: 4, textAlign: isAdmin ? 'right' : 'left' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply input */}
        <div style={{
          padding: '12px 20px',
          borderTop: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          flexShrink: 0,
          background: SURFACE,
        }}>
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendReply();
              }
            }}
            placeholder={`Reply to ${selected.name}…`}
            rows={2}
            style={{
              flex: 1,
              background: S2,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 13,
              color: TEXT,
              fontFamily: FB,
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={sendReply}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: GOLD,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              marginBottom: 2,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <Send size={14} color="#000" />
          </button>
        </div>
      </div>
    </div>
  );
}
