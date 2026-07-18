'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw, BookOpen, Calculator, FlaskConical, FileText, User } from 'lucide-react';
import { STUDENT, SUBJECTS, OVERALL_AVERAGE } from '@/data/studentData';

const BG = '#081420'; const SURFACE = '#0E1E30'; const S2 = '#14283E'; const S3 = '#1A3049';
const GOLD = '#60a5fa'; const GOLD_DIM = 'rgba(96,165,250,0.08)'; const GOLD_B = 'rgba(96,165,250,0.20)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const F_HEADING = "'Roboto Condensed', sans-serif"; const F_BODY = "'Inter', sans-serif";

interface Msg { role: 'user' | 'assistant'; content: string; id: string; }

// Simulated AI responses for demo mode (no API key required)
const DEMO_RESPONSES: Record<string, string> = {
  default: `I'm Thabo's AI Study Assistant, powered by Claude. I can help you with:

• **Understanding difficult concepts** in any of your 7 subjects
• **Exam preparation** — creating study plans and practice questions
• **Assignment help** — explaining how to approach tasks (not doing them for you!)
• **Performance analysis** — understanding your marks and what to improve
• **Study techniques** — time management, note-taking strategies

What would you like to work on today?`,

  math: `Let's work through Mathematics together!

Here are some key areas based on your Grade 11 curriculum:

**Quadratic Functions** (your current topic)
- A quadratic has the form f(x) = ax² + bx + c
- The vertex is at x = -b/(2a)
- The discriminant Δ = b² - 4ac tells you about roots:
  - Δ > 0: two real roots
  - Δ = 0: one repeated root
  - Δ < 0: no real roots

**Your current mark is 78%** — you're above the class average of 72%! To reach your 85% target, focus on:
1. Trigonometric identities (common exam trap)
2. Calculus basics — derivatives
3. Euclidean Geometry proofs

Which topic would you like to practice?`,

  physics: `Physical Sciences needs some attention — your current mark is 51%, which is below the 60% pass threshold. But don't worry, this is very common for Grade 11.

**Key areas to strengthen:**

**Newton's Laws (Term 3 focus)**
- First Law: An object at rest stays at rest unless acted upon by a net force
- Second Law: F = ma (net force = mass × acceleration)
- Third Law: Every action has an equal and opposite reaction

**Tips for improving:**
1. Attend Ms. van der Merwe's Thursday extra classes (15:00, Room C-205)
2. Do past papers — especially the Newton's Laws questions
3. For your Lab Report: use the IMRAD structure (Introduction, Method, Results, Analysis, Discussion)

**To pass with 60% in the term exam**, you need approximately **72%** in the upcoming exam given your current term mark.

Would you like me to give you some practice problems on Newton's Laws?`,

  study: `Here's a smart study plan for Thabo based on your current performance:

**PRIORITY 1 — AT RISK ⚠️**
- Physical Sciences (51%) — 45 min daily
- Information Technology (60%) — 30 min daily

**PRIORITY 2 — MAINTAIN**
- Mathematics (78%) — 30 min, 3x/week
- Accounting (74%) — 30 min, 3x/week

**PRIORITY 3 — STRONG (maintain)**
- Life Orientation (88%) ✓
- IsiZulu (85%) ✓
- English (82%) ✓

**Suggested Daily Schedule:**
- 16:00–16:45: Physical Sciences
- 17:00–17:30: IT or Accounting
- 17:30–18:00: Mathematics

**Exam Week Tips:**
1. Review past papers first — they're the best predictor
2. Focus on terms and definitions (easy marks)
3. Get 8 hours of sleep before each exam
4. Eat breakfast on exam morning

Want me to create a more detailed study plan for any specific subject?`,
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('math') || lower.includes('quadratic') || lower.includes('trigon')) return DEMO_RESPONSES.math;
  if (lower.includes('physics') || lower.includes('science') || lower.includes('newton') || lower.includes('lab')) return DEMO_RESPONSES.physics;
  if (lower.includes('study') || lower.includes('plan') || lower.includes('schedule') || lower.includes('exam')) return DEMO_RESPONSES.study;
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return `Hi Thabo! 👋 I'm your AI Study Assistant. I can see you're doing well in Life Orientation (88%) and IsiZulu (85%), but Physical Sciences (51%) and IT (60%) need some attention before the term exam. What would you like to work on first?`;
  if (lower.includes('accounting') || lower.includes('balance') || lower.includes('income statement')) return `Accounting — great choice! You're at 74%, which is good. For your current topic on **Year-End Financial Statements**:\n\n**Income Statement**\n- Start with Revenue (Turnover)\n- Deduct Cost of Sales → Gross Profit\n- Deduct Expenses → Net Profit/Loss\n\n**Balance Sheet**\n- Assets = Liabilities + Equity\n- Non-current Assets (fixed assets, investments)\n- Current Assets (stock, debtors, cash)\n\n**Common mistakes to avoid:**\n1. Forgetting to close the drawings account\n2. Accruals and prepayments direction\n3. Depreciation — always check the method\n\nWould you like practice questions on any of these?`;
  if (lower.includes('english') || lower.includes('essay') || lower.includes('macbeth')) return `English Home Language — you're doing great at 82%! For your **Macbeth essay on Ambition & Power**:\n\n**Essay Structure (600–800 words)**\n1. **Introduction** — Define ambition, introduce Macbeth, state your argument\n2. **Body Para 1** — Macbeth's initial ambition (Act 1, Scene 7 — "I have no spur")\n3. **Body Para 2** — Lady Macbeth as a catalyst for ambition (Act 1, Scene 5)\n4. **Body Para 3** — Consequences of unchecked ambition (Act 5)\n5. **Conclusion** — Tie back to your argument\n\n**Strong quotes to use:**\n- "Stars, hide your fires; Let not light see my black and deep desires" — Macbeth\n- "Unsex me here" — Lady Macbeth\n\nWould you like help with your introduction paragraph?`;
  return `That's a great question, Thabo! Based on your current performance across ${SUBJECTS.length} subjects with an overall average of ${OVERALL_AVERAGE}%, I'd recommend focusing on Physical Sciences and IT first as they're your highest-priority subjects right now.\n\nCould you tell me more specifically what you need help with? For example:\n- A specific topic or concept\n- How to approach an assignment\n- Study strategies for upcoming exams\n- Understanding your marks or feedback\n\nI'm here to help you succeed! 🎯`;
}

// Typewriter effect
function useTypewriter(text: string, speed = 12) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(''); setDone(false);
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return { displayed, done };
}

function AssistantBubble({ content, isLatest }: { content: string; isLatest: boolean }) {
  const { displayed } = useTypewriter(isLatest ? content : content, isLatest ? 8 : 0);
  const text = isLatest ? displayed : content;

  // Simple markdown-ish formatting
  const formatted = text
    .split('\n')
    .map((line, i) => {
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <div key={i} style={{ display: 'flex', gap: 8, margin: '2px 0' }}><span style={{ color: GOLD, flexShrink: 0 }}>·</span><span dangerouslySetInnerHTML={{ __html: boldLine.slice(2) }} /></div>;
      }
      if (/^\d+\./.test(line)) {
        return <div key={i} style={{ display: 'flex', gap: 8, margin: '2px 0' }}><span style={{ color: GOLD, flexShrink: 0, fontWeight: 600 }}>{line.match(/^\d+/)?.[0]}.</span><span dangerouslySetInnerHTML={{ __html: boldLine.replace(/^\d+\. /, '') }} /></div>;
      }
      if (line === '') return <div key={i} style={{ height: 6 }} />;
      return <div key={i} dangerouslySetInnerHTML={{ __html: boldLine }} />;
    });

  return <>{formatted}</>;
}

const SUGGESTIONS = [
  { label: 'Help with Physics',      icon: FlaskConical, prompt: 'Help me understand Newton\'s Laws for Physical Sciences' },
  { label: 'Maths practice',         icon: Calculator,   prompt: 'Give me practice problems for quadratic functions in Mathematics' },
  { label: 'Create a study plan',    icon: BookOpen,     prompt: 'Create a study plan to help me improve my marks before the term exam' },
  { label: 'Essay writing tips',     icon: FileText,     prompt: 'Help me write a strong introduction for my Macbeth essay on ambition and power' },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', id: 'welcome', content: DEMO_RESPONSES.default },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestId, setLatestId] = useState('welcome');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');

    const userId = Date.now().toString();
    setMessages(prev => [...prev, { role: 'user', id: userId, content: msg }]);
    setLoading(true);

    setTimeout(() => {
      const response = getResponse(msg);
      const aiId = Date.now().toString();
      setMessages(prev => [...prev, { role: 'assistant', id: aiId, content: response }]);
      setLatestId(aiId);
      setLoading(false);
    }, 800 + Math.random() * 600);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const reset = () => {
    setMessages([{ role: 'assistant', id: 'welcome-new', content: DEMO_RESPONSES.default }]);
    setLatestId('welcome-new');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', fontFamily: F_BODY, background: BG }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12, background: SURFACE }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={18} style={{ color: GOLD }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F_HEADING }}>Sidelile AI Assistant</div>
          <div style={{ fontSize: 11, color: MUTED }}>Powered by Claude · Personalised for {STUDENT.firstName}</div>
        </div>
        <button onClick={reset} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: S2, border: `1px solid ${BORDER}`, borderRadius: 8, cursor: 'pointer', color: MUTED, fontSize: 12 }}>
          <RotateCcw size={12} /> New Chat
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.length === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 8 }}>
            {SUGGESTIONS.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={() => send(s.prompt)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s, background .15s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = GOLD_B; el.style.background = GOLD_DIM; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = BORDER; el.style.background = SURFACE; }}
                >
                  <Icon size={15} style={{ color: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: MUTED }}>{s.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}
          >
            {/* Avatar */}
            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'assistant' ? GOLD_DIM : S3, border: `1px solid ${msg.role === 'assistant' ? GOLD_B : BORDER}` }}>
              {msg.role === 'assistant'
                ? <Sparkles size={14} style={{ color: GOLD }} />
                : <User size={14} style={{ color: MUTED }} />
              }
            </div>
            {/* Bubble */}
            <div style={{ maxWidth: '78%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: msg.role === 'user' ? GOLD_DIM : SURFACE, border: `1px solid ${msg.role === 'user' ? GOLD_B : BORDER}`, fontSize: 13, color: TEXT, lineHeight: 1.65 }}>
              {msg.role === 'assistant'
                ? <AssistantBubble content={msg.content} isLatest={msg.id === latestId} />
                : msg.content
              }
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: GOLD_DIM, border: `1px solid ${GOLD_B}` }}>
              <Sparkles size={14} style={{ color: GOLD }} />
            </div>
            <div style={{ padding: '14px 18px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '14px 14px 14px 4px' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: GOLD, animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px 24px 20px', borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: S2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '10px 10px 10px 14px', transition: 'border-color .15s' }}
          onFocus={() => {}} // styled via state would be ideal
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything about your studies…"
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 13, color: TEXT, lineHeight: 1.5, fontFamily: F_BODY, maxHeight: 120, overflowY: 'auto' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            style={{ width: 36, height: 36, borderRadius: 9, background: input.trim() && !loading ? GOLD : 'rgba(255,255,255,0.05)', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .15s' }}
          >
            <Send size={15} style={{ color: input.trim() && !loading ? '#000' : FAINT }} />
          </button>
        </div>
        <div style={{ fontSize: 10, color: FAINT, textAlign: 'center', marginTop: 8 }}>
          AI responses are for educational guidance only. Always verify with your teacher.
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
