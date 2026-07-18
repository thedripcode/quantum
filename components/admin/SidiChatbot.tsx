'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { X, Send, RotateCcw, Bot } from 'lucide-react';

const SURFACE = '#0E1E30';
const S2 = '#14283E';
const GOLD = '#60a5fa';
const GOLD_DIM = 'rgba(96,165,250,0.10)';
const GOLD_B = 'rgba(96,165,250,0.22)';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.50)';
const FAINT = 'rgba(255,255,255,0.22)';

const dotBounce = keyframes`
  0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
  40%          { transform: scale(1);   opacity: 1; }
`;

const FabBtn = styled(motion.button)`
  position: fixed; bottom: 24px; right: 24px; z-index: 999;
  width: 56px; height: 56px; border-radius: 50%;
  background: ${GOLD}; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(96,165,250,0.35);
`;

const Panel = styled(motion.div)`
  position: fixed; bottom: 92px; right: 24px; z-index: 998;
  width: 400px; height: 580px;
  background: ${SURFACE}; border: 1px solid ${GOLD_B}; border-radius: 20px;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
`;

const PanelHeader = styled.div`
  display: flex; align-items: center; gap: 10px; padding: 16px 18px;
  border-bottom: 1px solid ${BORDER}; flex-shrink: 0;
`;

const Dot = styled.div`
  width: 36px; height: 36px; border-radius: 50%; background: ${GOLD};
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`;

const Messages = styled.div`
  flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 2px; }
`;

const Bubble = styled.div<{ $user: boolean }>`
  max-width: 85%; padding: 10px 14px; border-radius: ${p => p.$user ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  background: ${p => p.$user ? GOLD_DIM : S2};
  border: 1px solid ${p => p.$user ? GOLD_B : BORDER};
  font-size: 13px; color: ${TEXT}; line-height: 1.55;
  align-self: ${p => p.$user ? 'flex-end' : 'flex-start'};
`;

const SuggestRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px;
`;

const Sug = styled.button`
  font-size: 11px; padding: 5px 12px; border-radius: 9999px;
  background: ${S2}; border: 1px solid ${BORDER}; color: ${MUTED};
  cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
  &:hover { color: ${GOLD}; border-color: ${GOLD_B}; background: ${GOLD_DIM}; }
`;

const InputRow = styled.div`
  display: flex; gap: 8px; padding: 12px 16px;
  border-top: 1px solid ${BORDER}; flex-shrink: 0;
`;

const Input = styled.textarea`
  flex: 1; background: ${S2}; border: 1px solid ${BORDER}; border-radius: 12px;
  padding: 10px 14px; font-size: 13px; color: ${TEXT};
  font-family: 'Inter', sans-serif; resize: none; outline: none; line-height: 1.4;
  &::placeholder { color: ${FAINT}; }
  &:focus { border-color: ${GOLD_B}; }
`;

const SendBtn = styled.button`
  width: 42px; background: ${GOLD}; border: none; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
`;

const DotsWrap = styled.div`
  display: flex; gap: 4px; padding: 4px 2px;
`;

const Dot2 = styled.span<{ $d: number }>`
  width: 6px; height: 6px; border-radius: 50%; background: ${MUTED};
  animation: ${dotBounce} 1.2s ease infinite;
  animation-delay: ${p => p.$d}s;
`;

const SUGGESTIONS = [
  'Draft rejection email',
  'Write welcome message',
  'Draft exam notice',
  'Explain stream options',
  'Write parent newsletter',
];

type Msg = { role: 'user' | 'assistant'; text: string };

const SYSTEM = `You are SIDI — the AI assistant for Sidelile High School's admin team in KwaZulu-Natal, South Africa. You help with:
- Drafting parent emails and school notices
- Answering questions about school data and operations
- Stream placement recommendations based on student marks
- Writing rejection or approval messages for applications
- School policy and CAPS curriculum questions
- Summarising application and student data
- Generating report narratives
- Any general admin support

Keep responses concise, professional, and appropriate for a South African high school context. Use friendly but professional language.`;

export default function SidiChatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: 'Hi! I\'m SIDI, your Sidelile admin assistant. I can help you draft emails, write notices, recommend stream placements, and more. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: 'user', text };
    setMsgs(p => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/sidi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM,
          messages: [...msgs, userMsg].map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      setMsgs(p => [...p, { role: 'assistant', text: data.content || 'Sorry, I could not process that.' }]);
    } catch {
      setMsgs(p => [...p, { role: 'assistant', text: 'Sorry, I\'m having trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <Panel
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
          >
            {/* Header */}
            <PanelHeader>
              <Dot><Bot size={18} style={{ color: '#000' }} /></Dot>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: 14, color: GOLD }}>SIDI Admin</div>
                <div style={{ fontSize: 11, color: MUTED }}>AI Assistant · Sidelile High School</div>
              </div>
              <button onClick={() => setMsgs([msgs[0]])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 4 }}>
                <RotateCcw size={13} />
              </button>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FAINT, display: 'flex', padding: 4 }}>
                <X size={15} />
              </button>
            </PanelHeader>

            {/* Messages */}
            <Messages>
              {msgs.map((m, i) => (
                <Bubble key={i} $user={m.role === 'user'}>{m.text}</Bubble>
              ))}
              {loading && (
                <Bubble $user={false}>
                  <DotsWrap>
                    <Dot2 $d={0} /><Dot2 $d={0.2} /><Dot2 $d={0.4} />
                  </DotsWrap>
                </Bubble>
              )}
              <div ref={bottomRef} />
            </Messages>

            {/* Suggestions */}
            {msgs.length <= 1 && (
              <SuggestRow>
                {SUGGESTIONS.map(s => (
                  <Sug key={s} onClick={() => send(s)}>{s}</Sug>
                ))}
              </SuggestRow>
            )}

            {/* Input */}
            <InputRow>
              <Input
                value={input} rows={2}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask SIDI anything…"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              />
              <SendBtn onClick={() => send(input)}>
                <Send size={15} style={{ color: '#000' }} />
              </SendBtn>
            </InputRow>
          </Panel>
        )}
      </AnimatePresence>

      {/* FAB */}
      <FabBtn
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {open ? <X size={20} style={{ color: '#000' }} /> : <Bot size={22} style={{ color: '#000' }} />}
      </FabBtn>
    </>
  );
}
