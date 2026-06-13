'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Brain, BookOpen, ClipboardList, FileText, MessageSquare,
  ChevronRight, ChevronLeft, RotateCcw, Check, X,
  Timer, Star, Zap, Trophy, ArrowRight, Sparkles, Send,
  Inbox, Clock, CalendarCheck, AlertTriangle,
} from 'lucide-react';
import { STUDENT, SUBJECTS } from '@/data/studentData';
import {
  TeacherWork, StudentAnswer, Submission,
  getWorks, saveSubmission, getSubmissions, generateSIDIAnalysis, newId,
} from '@/lib/assignmentStore';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BG = '#0C0C0C', S1 = '#111111', S2 = '#171717', S3 = '#1E1E1E';
const BORDER = 'rgba(255,255,255,0.07)', BORDER2 = 'rgba(255,255,255,0.12)';
const TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.25)';
const ACCENT = 'rgba(255,255,255,0.90)';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

// ─── Study Data ───────────────────────────────────────────────────────────────

const SUBJECT_TOPICS: Record<string, string[]> = {
  MATH:     ['Quadratic Functions', 'Trigonometry', 'Euclidean Geometry', 'Calculus Intro', 'Statistics'],
  SCI:      ['Newton\'s Laws', 'Waves & Sound', 'Chemical Bonding', 'Electrochemistry', 'Organic Chemistry'],
  ENG:      ['Poetry Analysis', 'Novel Study', 'Language Structures', 'Writing Skills', 'Visual Literacy'],
  ZUL:      ['Izikhuliso', 'Imibongo', 'Imithetho Yokubhala', 'Ukufunda', 'Ilimi'],
  LIFE_ORI: ['Health & Wellbeing', 'Career Choices', 'Democracy & HR', 'Environmental Issues', 'Life Skills'],
  HIST:     ['Cold War', 'SA Transition', 'Apartheid', 'Independence Movements', 'Global Context'],
  GEOG:     ['Climate Systems', 'Geomorphology', 'Settlement Geography', 'Economic Geography', 'Resources'],
};

const FLASHCARDS: Record<string, { q: string; a: string }[]> = {
  MATH: [
    { q: 'What is the quadratic formula?', a: 'x = (−b ± √(b²−4ac)) / 2a\n\nUsed to find roots when ax² + bx + c = 0' },
    { q: 'What does the discriminant tell you?', a: 'Δ = b² − 4ac\n• Δ > 0 → two real roots\n• Δ = 0 → one repeated root\n• Δ < 0 → no real roots' },
    { q: 'What is sin²θ + cos²θ equal to?', a: 'sin²θ + cos²θ = 1\n\nThis is the Pythagorean identity — you must memorise this for Matric!' },
    { q: 'What is the derivative of xⁿ?', a: 'f(x) = xⁿ  →  f\'(x) = nxⁿ⁻¹\n\nExample: f(x) = x³  →  f\'(x) = 3x²' },
    { q: 'State the Theorem of Pythagoras', a: 'In a right-angled triangle:\na² + b² = c²\nwhere c is the hypotenuse (longest side)' },
  ],
  SCI: [
    { q: 'State Newton\'s First Law of Motion', a: 'An object remains at rest or moves at constant velocity unless acted upon by a net external force.\n\n(The Law of Inertia)' },
    { q: 'What is the formula for work done?', a: 'W = F × d × cos θ\n\nWhere F = force (N), d = displacement (m), θ = angle between force and displacement' },
    { q: 'Define electronegativity', a: 'The ability of an atom to attract shared electrons towards itself in a covalent bond.\n\nIncreases across a period, decreases down a group.' },
    { q: 'What is Ohm\'s Law?', a: 'V = I × R\n\nVoltage (V) = Current (A) × Resistance (Ω)\n\nValid when temperature is constant.' },
    { q: 'Define a catalyst', a: 'A substance that speeds up a chemical reaction without being consumed in the process.\n\nIt lowers the activation energy.' },
  ],
  ENG: [
    { q: 'What is a metaphor?', a: 'A figure of speech that directly compares two unlike things without using "like" or "as".\n\nExample: "Life is a journey."' },
    { q: 'What is the difference between theme and plot?', a: 'Plot = the sequence of events in a story.\nTheme = the central message or idea the author explores.\n\nExample theme: the corrupting power of greed.' },
    { q: 'What is dramatic irony?', a: 'When the audience knows something that the characters do not.\n\nCreates tension, humour or tragedy in literature.' },
    { q: 'Define diction', a: 'The author\'s deliberate choice of specific words to create a particular effect, tone or meaning in a text.' },
    { q: 'What is a complex sentence?', a: 'A sentence with one independent clause and at least one dependent (subordinate) clause.\n\nExample: "Although it was raining, she went for a run."' },
  ],
};

const QUIZZES: Record<string, { q: string; options: string[]; answer: number; explanation: string }[]> = {
  MATH: [
    { q: 'What is the value of sin 30°?', options: ['√3/2', '1/2', '√2/2', '1'], answer: 1, explanation: 'sin 30° = 1/2. Remember the special angles: 30°, 45°, 60°, 90°.' },
    { q: 'The equation x² − 5x + 6 = 0 has roots:', options: ['x = 2 and x = 3', 'x = 1 and x = 6', 'x = −2 and x = −3', 'x = 5 and x = 1'], answer: 0, explanation: 'Factorise: (x−2)(x−3) = 0, so x = 2 or x = 3.' },
    { q: 'What is f\'(x) if f(x) = 3x² + 2x?', options: ['6x + 2', '6x', '3x + 2', '6x² + 2'], answer: 0, explanation: 'Use the power rule: d/dx(3x²) = 6x and d/dx(2x) = 2. So f\'(x) = 6x + 2.' },
    { q: 'Which is the correct formula for the area of a triangle?', options: ['A = b × h', 'A = ½ × b × h', 'A = πr²', 'A = l × w'], answer: 1, explanation: 'Area of a triangle = ½ × base × perpendicular height.' },
  ],
  SCI: [
    { q: 'Which of the following is NOT a vector quantity?', options: ['Force', 'Velocity', 'Speed', 'Displacement'], answer: 2, explanation: 'Speed is a scalar (magnitude only). Force, velocity and displacement are vectors (magnitude + direction).' },
    { q: 'An atom of sodium has 11 protons. How many electrons does Na⁺ have?', options: ['12', '10', '11', '9'], answer: 1, explanation: 'Na⁺ has lost one electron. 11 − 1 = 10 electrons.' },
    { q: 'What type of reaction is: A + BC → AC + B?', options: ['Synthesis', 'Decomposition', 'Single displacement', 'Double displacement'], answer: 2, explanation: 'A displaces B in compound BC. This is a single displacement (substitution) reaction.' },
    { q: 'The unit of electric current is:', options: ['Volt', 'Ohm', 'Watt', 'Ampere'], answer: 3, explanation: 'Current is measured in Amperes (A). Volt = potential difference, Ohm = resistance, Watt = power.' },
  ],
  ENG: [
    { q: 'Which literary device is used in: "The wind whispered through the trees"?', options: ['Simile', 'Personification', 'Metaphor', 'Alliteration'], answer: 1, explanation: 'Personification gives human qualities to non-human things. Wind cannot whisper, but the author gives it that human ability.' },
    { q: 'What is the correct definition of a "protagonist"?', options: ['The villain of the story', 'A minor character', 'The main character', 'The narrator'], answer: 2, explanation: 'The protagonist is the main character — not necessarily the "hero", but the central figure the story revolves around.' },
    { q: 'Which sentence contains a simile?', options: ['"He was a lion in battle."', '"Her smile lit up the room."', '"She ran like the wind."', '"Time flies."'], answer: 2, explanation: 'A simile uses "like" or "as" to compare. "She ran like the wind" uses "like" — that is a simile.' },
  ],
};

// ─── Mode config ──────────────────────────────────────────────────────────────
type Mode = 'home' | 'flashcards' | 'quiz' | 'exam' | 'notes' | 'chat' | 'mywork';

const MODES = [
  { id: 'mywork'     as Mode, icon: Inbox,          label: 'My Work',        desc: 'Submit assignments & exams from teacher', color: '#F59E0B' },
  { id: 'flashcards' as Mode, icon: BookOpen,        label: 'Flashcards',     desc: 'Flip-card revision for any topic',        color: '#3B82F6' },
  { id: 'quiz'       as Mode, icon: Brain,           label: 'Quiz Me',        desc: 'Multiple-choice questions & scoring',     color: '#8B5CF6' },
  { id: 'exam'       as Mode, icon: ClipboardList,   label: 'Exam Practice',  desc: 'Timed practice exams by subject',         color: '#EF4444' },
  { id: 'notes'      as Mode, icon: FileText,        label: 'Study Notes',    desc: 'AI-generated notes for any topic',        color: '#10B981' },
  { id: 'chat'       as Mode, icon: MessageSquare,   label: 'Ask SIDI',       desc: 'Chat with your AI study companion',       color: '#6366F1' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FlashcardMode({ subject }: { subject: string }) {
  const cards = FLASHCARDS[subject] ?? FLASHCARDS.MATH;
  const [idx, setIdx]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = cards[idx];
  const progress = Math.round((known.size / cards.length) * 100);

  const next = () => { setFlipped(false); setTimeout(() => setIdx(i => Math.min(i + 1, cards.length - 1)), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setIdx(i => Math.max(i - 1, 0)), 150); };
  const reset = () => { setIdx(0); setFlipped(false); setKnown(new Set()); };

  return (
    <div>
      {/* Progress */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <span style={{ fontFamily:FB, fontSize:13, color:MUTED }}>Card {idx+1} of {cards.length}</span>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:120, height:4, borderRadius:4, background:'rgba(255,255,255,0.08)' }}>
            <div style={{ width:`${progress}%`, height:'100%', borderRadius:4, background:'#10B981', transition:'width 0.3s' }} />
          </div>
          <span style={{ fontFamily:FB, fontSize:12, color:'#10B981', fontWeight:600 }}>{known.size}/{cards.length} known</span>
        </div>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          background: flipped ? S3 : S2,
          border: `1px solid ${flipped ? BORDER2 : BORDER}`,
          borderRadius: 20, padding: '48px 40px', minHeight: 240,
          cursor: 'pointer', transition: 'all 0.3s ease',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', position: 'relative',
        }}
      >
        <div style={{ position:'absolute', top:16, left:20, fontFamily:FB, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color: flipped ? '#10B981' : FAINT }}>
          {flipped ? 'Answer' : 'Question — click to reveal'}
        </div>
        <p style={{ fontFamily: flipped ? FB : FH, fontSize: flipped ? 15 : 20, fontWeight: flipped ? 400 : 700, color: TEXT, lineHeight: 1.6, margin: 0, whiteSpace:'pre-line' }}>
          {flipped ? card.a : card.q}
        </p>
        <Zap size={14} style={{ position:'absolute', bottom:16, right:20, color:FAINT }} />
      </div>

      {/* Controls */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:20 }}>
        <button onClick={prev} disabled={idx===0} style={navBtn(idx===0)}>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => { setKnown(s => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n; }); next(); }}
          style={{ flex:1, padding:'11px 0', borderRadius:12, background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#EF4444', fontFamily:FB, fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
        >
          <X size={14} /> Still Learning
        </button>
        <button
          onClick={() => { setKnown(s => { const n = new Set(s); n.add(idx); return n; }); next(); }}
          style={{ flex:1, padding:'11px 0', borderRadius:12, background:'rgba(16,185,129,0.10)', border:'1px solid rgba(16,185,129,0.25)', color:'#10B981', fontFamily:FB, fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
        >
          <Check size={14} /> Got It
        </button>
        <button onClick={next} disabled={idx===cards.length-1} style={navBtn(idx===cards.length-1)}>
          <ChevronRight size={16} />
        </button>
        <button onClick={reset} style={{ ...navBtn(false), color: MUTED }} title="Reset">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* All cards known */}
      {known.size === cards.length && (
        <div style={{ marginTop:20, padding:'16px 20px', borderRadius:14, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.20)', display:'flex', alignItems:'center', gap:12 }}>
          <Trophy size={20} style={{ color:'#10B981', flexShrink:0 }} />
          <div>
            <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:'#10B981' }}>All cards mastered!</div>
            <div style={{ fontFamily:FB, fontSize:12, color:MUTED, marginTop:2 }}>You've got all {cards.length} cards. Try Quiz Mode to test yourself properly.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizMode({ subject }: { subject: string }) {
  const questions = QUIZZES[subject] ?? QUIZZES.MATH;
  const [idx, setIdx]       = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore]   = useState(0);
  const [done, setDone]     = useState(false);
  const [answers, setAnswers] = useState<(number|null)[]>(Array(questions.length).fill(null));

  const q = questions[idx];
  const answered = selected !== null;
  const correct  = selected === q.answer;

  const handleAnswer = (i: number) => {
    if (answered) return;
    setSelected(i);
    const newAnswers = [...answers]; newAnswers[idx] = i; setAnswers(newAnswers);
    if (i === q.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); }
    else setDone(true);
  };

  const reset = () => { setIdx(0); setSelected(null); setScore(0); setDone(false); setAnswers(Array(questions.length).fill(null)); };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const grade = pct >= 80 ? { label:'Excellent!', color:'#10B981' } : pct >= 60 ? { label:'Good Work', color:'#3B82F6' } : { label:'Keep Studying', color:'#EF4444' };
    return (
      <div style={{ textAlign:'center', padding:'40px 20px' }}>
        <Trophy size={48} style={{ color: grade.color, marginBottom:16 }} />
        <div style={{ fontFamily:FH, fontSize:32, fontWeight:800, color: grade.color, letterSpacing:'-0.03em' }}>{pct}%</div>
        <div style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:TEXT, marginTop:4 }}>{grade.label}</div>
        <div style={{ fontFamily:FB, fontSize:14, color:MUTED, marginTop:8 }}>You got {score} out of {questions.length} correct</div>
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:28 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: answers[i] === q.answer ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border:`1px solid ${answers[i] === q.answer ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
              {answers[i] === q.answer ? <Check size={14} style={{ color:'#10B981' }} /> : <X size={14} style={{ color:'#EF4444' }} />}
            </div>
          ))}
        </div>
        <button onClick={reset} style={{ marginTop:28, padding:'11px 28px', borderRadius:12, background:'rgba(255,255,255,0.07)', border:`1px solid ${BORDER2}`, color:TEXT, fontFamily:FB, fontSize:13, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8 }}>
          <RotateCcw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <span style={{ fontFamily:FB, fontSize:13, color:MUTED }}>Question {idx+1} of {questions.length}</span>
        <span style={{ fontFamily:FB, fontSize:13, color:'#10B981', fontWeight:600 }}>Score: {score}</span>
      </div>
      <div style={{ height:3, borderRadius:3, background:'rgba(255,255,255,0.06)', marginBottom:24 }}>
        <div style={{ width:`${((idx+1)/questions.length)*100}%`, height:'100%', borderRadius:3, background:'#8B5CF6', transition:'width 0.3s' }} />
      </div>

      {/* Question */}
      <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:16, padding:'24px 28px', marginBottom:16 }}>
        <p style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:TEXT, margin:0, lineHeight:1.4 }}>{q.q}</p>
      </div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
        {q.options.map((opt, i) => {
          let bg = 'transparent', border = BORDER, color = MUTED;
          if (answered) {
            if (i === q.answer) { bg = 'rgba(16,185,129,0.10)'; border = 'rgba(16,185,129,0.40)'; color = '#10B981'; }
            else if (i === selected) { bg = 'rgba(239,68,68,0.10)'; border = 'rgba(239,68,68,0.40)'; color = '#EF4444'; }
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:12, background:bg, border:`1px solid ${border}`, color, fontFamily:FB, fontSize:14, fontWeight:500, cursor: answered ? 'default' : 'pointer', textAlign:'left', transition:'all 0.2s' }}
              onMouseEnter={e => { if (!answered) (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!answered) (e.currentTarget as HTMLElement).style.background='transparent'; }}
            >
              <span style={{ width:26, height:26, borderRadius:'50%', background:'rgba(255,255,255,0.05)', border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, color }}>
                {String.fromCharCode(65+i)}
              </span>
              {opt}
              {answered && i === q.answer && <Check size={14} style={{ marginLeft:'auto', color:'#10B981' }} />}
              {answered && i === selected && i !== q.answer && <X size={14} style={{ marginLeft:'auto', color:'#EF4444' }} />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div style={{ padding:'14px 18px', borderRadius:12, background: correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border:`1px solid ${correct ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, marginBottom:16 }}>
          <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color: correct ? '#10B981' : '#EF4444', marginBottom:4 }}>
            {correct ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          <p style={{ fontFamily:FB, fontSize:13, color:MUTED, margin:0, lineHeight:1.6 }}>{q.explanation}</p>
        </div>
      )}

      {answered && (
        <button onClick={next} style={{ width:'100%', padding:'13px', borderRadius:12, background:'rgba(255,255,255,0.07)', border:`1px solid ${BORDER2}`, color:TEXT, fontFamily:FB, fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {idx < questions.length-1 ? 'Next Question' : 'See Results'} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

function ExamMode({ subject }: { subject: string }) {
  const questions = QUIZZES[subject] ?? QUIZZES.MATH;
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(questions.length * 90); // 90s per question
  const [selected, setSelected] = useState<(number|null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);

  const startExam = () => {
    setStarted(true);
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); setSubmitted(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const score = submitted ? selected.filter((s, i) => s === questions[i].answer).length : 0;
  const mm = String(Math.floor(timeLeft/60)).padStart(2,'0');
  const ss = String(timeLeft%60).padStart(2,'0');

  if (!started) return (
    <div style={{ textAlign:'center', padding:'40px 20px' }}>
      <ClipboardList size={48} style={{ color:'#EF4444', marginBottom:20 }} />
      <div style={{ fontFamily:FH, fontSize:22, fontWeight:800, color:TEXT, letterSpacing:'-0.02em' }}>Practice Exam</div>
      <div style={{ fontFamily:FB, fontSize:14, color:MUTED, marginTop:8, marginBottom:28 }}>
        {questions.length} questions · {Math.round(questions.length * 1.5)} minutes · Exam conditions
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, maxWidth:380, margin:'0 auto 28px', textAlign:'left' }}>
        {[
          { label:'Questions', value: questions.length },
          { label:'Time Limit', value: `${Math.round(questions.length*1.5)} min` },
          { label:'Pass Mark', value: '50%' },
        ].map(({ label, value }) => (
          <div key={label} style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:12, padding:'14px 16px' }}>
            <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</div>
            <div style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:TEXT, marginTop:4 }}>{value}</div>
          </div>
        ))}
      </div>
      <button onClick={startExam} style={{ padding:'13px 36px', borderRadius:14, background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.30)', color:'#EF4444', fontFamily:FB, fontSize:14, fontWeight:700, cursor:'pointer' }}>
        Start Exam
      </button>
    </div>
  );

  if (submitted) {
    const pct = Math.round((score/questions.length)*100);
    const passed = pct >= 50;
    return (
      <div style={{ textAlign:'center', padding:'40px 20px' }}>
        <div style={{ fontFamily:FH, fontSize:40, fontWeight:800, color: passed ? '#10B981' : '#EF4444', letterSpacing:'-0.04em' }}>{pct}%</div>
        <div style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:TEXT, marginTop:4 }}>{passed ? 'Passed ✓' : 'Failed — Keep Practising'}</div>
        <div style={{ fontFamily:FB, fontSize:14, color:MUTED, marginTop:8 }}>{score}/{questions.length} correct</div>
        <button onClick={() => { setStarted(false); setSubmitted(false); setSelected(Array(questions.length).fill(null)); setCurrent(0); setTimeLeft(questions.length*90); }}
          style={{ marginTop:24, padding:'11px 28px', borderRadius:12, background:'rgba(255,255,255,0.07)', border:`1px solid ${BORDER2}`, color:TEXT, fontFamily:FB, fontSize:13, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8 }}>
          <RotateCcw size={14} /> Retry Exam
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div>
      {/* Timer bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background: timeLeft < 60 ? 'rgba(239,68,68,0.10)' : S2, border:`1px solid ${timeLeft < 60 ? 'rgba(239,68,68,0.30)' : BORDER}`, borderRadius:10, padding:'6px 14px' }}>
          <Timer size={13} style={{ color: timeLeft < 60 ? '#EF4444' : MUTED }} />
          <span style={{ fontFamily:'monospace', fontSize:14, fontWeight:700, color: timeLeft < 60 ? '#EF4444' : TEXT }}>{mm}:{ss}</span>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width:28, height:28, borderRadius:7, background: selected[i] !== null ? 'rgba(59,130,246,0.20)' : i===current ? 'rgba(255,255,255,0.10)' : 'transparent', border:`1px solid ${i===current ? BORDER2 : BORDER}`, color: selected[i] !== null ? '#3B82F6' : MUTED, fontFamily:FB, fontSize:11, fontWeight:700, cursor:'pointer' }}>
              {i+1}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:16, padding:'24px 28px', marginBottom:14 }}>
        <p style={{ fontFamily:FH, fontSize:17, fontWeight:700, color:TEXT, margin:0, lineHeight:1.4 }}>{q.q}</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:20 }}>
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => { const n=[...selected]; n[current]=i; setSelected(n); }}
            style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 18px', borderRadius:12, background: selected[current]===i ? 'rgba(59,130,246,0.10)' : 'transparent', border:`1px solid ${selected[current]===i ? 'rgba(59,130,246,0.40)' : BORDER}`, color: selected[current]===i ? '#3B82F6' : MUTED, fontFamily:FB, fontSize:14, fontWeight:500, cursor:'pointer', textAlign:'left' }}>
            <span style={{ width:24, height:24, borderRadius:'50%', background:'rgba(255,255,255,0.05)', border:`1px solid ${selected[current]===i ? 'rgba(59,130,246,0.40)' : BORDER}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0, color: selected[current]===i ? '#3B82F6' : MUTED }}>{String.fromCharCode(65+i)}</span>
            {opt}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => setCurrent(c => Math.max(0,c-1))} disabled={current===0} style={navBtn(current===0)}><ChevronLeft size={16}/></button>
        {current < questions.length-1
          ? <button onClick={() => setCurrent(c => c+1)} style={{ flex:1, padding:'11px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:`1px solid ${BORDER}`, color:TEXT, fontFamily:FB, fontSize:13, fontWeight:600, cursor:'pointer' }}>Next <ChevronRight size={14} style={{ display:'inline', verticalAlign:'middle' }} /></button>
          : <button onClick={() => setSubmitted(true)} style={{ flex:1, padding:'11px', borderRadius:12, background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.30)', color:'#EF4444', fontFamily:FB, fontSize:13, fontWeight:700, cursor:'pointer' }}>Submit Exam</button>
        }
      </div>
    </div>
  );
}

function NotesMode({ subject }: { subject: string }) {
  const topics = SUBJECT_TOPICS[subject] ?? SUBJECT_TOPICS.MATH;
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [loading, setLoading] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const generate = async () => {
    setLoading(true); setNoteContent('');
    try {
      const res = await fetch('/api/sidi', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          messages: [{
            role:'user',
            content:`Generate comprehensive CAPS-aligned study notes for Grade 10-12 students on the topic: "${selectedTopic}". Include key concepts, formulas or definitions, worked examples, and exam tips. Format with clear headings and bullet points.`,
          }],
        }),
      });
      const data = await res.json();
      setNoteContent(data.content || 'Could not generate notes. Please try again.');
    } catch {
      setNoteContent('Error generating notes. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (text: string) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('# '))  return <h2 key={i} style={{ fontFamily:FH, fontSize:20, fontWeight:800, color:TEXT, margin:'0 0 16px', letterSpacing:'-0.02em' }}>{line.slice(2)}</h2>;
      if (line.startsWith('## ')) return <h3 key={i} style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:TEXT, margin:'20px 0 8px', letterSpacing:'-0.01em' }}>{line.slice(3)}</h3>;
      if (line.startsWith('### ')) return <h4 key={i} style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:TEXT, margin:'14px 0 6px' }}>{line.slice(4)}</h4>;
      if (line.startsWith('- **') || line.startsWith('* **')) return <div key={i} style={{ paddingLeft:16, borderLeft:'2px solid rgba(255,255,255,0.08)', marginBottom:4, color:MUTED, fontFamily:FB, fontSize:13 }}>{line.slice(2)}</div>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <div key={i} style={{ paddingLeft:16, borderLeft:'2px solid rgba(255,255,255,0.08)', marginBottom:4, color:MUTED, fontFamily:FB, fontSize:13 }}>{line.slice(2)}</div>;
      if (line === '') return <br key={i} />;
      return <p key={i} style={{ margin:'0 0 6px', color:MUTED, fontFamily:FB, fontSize:13, lineHeight:1.7 }}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
    });

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        {topics.map(t => (
          <button key={t} onClick={() => { setSelectedTopic(t); setNoteContent(''); }}
            style={{ padding:'7px 14px', borderRadius:8, background: selectedTopic===t ? 'rgba(255,255,255,0.10)' : 'transparent', border:`1px solid ${selectedTopic===t ? BORDER2 : BORDER}`, color: selectedTopic===t ? TEXT : MUTED, fontFamily:FB, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>

      {!noteContent ? (
        <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:16, padding:'48px 40px', textAlign:'center' }}>
          <Sparkles size={36} style={{ color:'#10B981', marginBottom:16 }} />
          <div style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:TEXT, marginBottom:8 }}>Generate Study Notes</div>
          <div style={{ fontFamily:FB, fontSize:14, color:MUTED, marginBottom:24 }}>
            SIDI will create CAPS-aligned notes for <strong style={{ color:TEXT }}>{selectedTopic}</strong>
          </div>
          <button onClick={generate} disabled={loading}
            style={{ padding:'12px 32px', borderRadius:12, background: loading ? S3 : 'rgba(16,185,129,0.12)', border:`1px solid ${loading ? BORDER : 'rgba(16,185,129,0.30)'}`, color: loading ? MUTED : '#10B981', fontFamily:FB, fontSize:13, fontWeight:700, cursor: loading ? 'default':'pointer', display:'inline-flex', alignItems:'center', gap:8 }}>
            {loading ? (<><div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid rgba(16,185,129,0.30)', borderTopColor:'#10B981', animation:'spin 0.7s linear infinite' }} />Generating notes…</>) : (<><Sparkles size={14}/>Generate Notes</>)}
          </button>
        </div>
      ) : (
        <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:16, padding:'28px 32px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:'#10B981', letterSpacing:'0.10em', textTransform:'uppercase' }}>AI-Generated · CAPS Aligned</div>
            <button onClick={() => setNoteContent('')} style={{ background:'none', border:'none', color:FAINT, cursor:'pointer', fontFamily:FB, fontSize:12 }}>Regenerate</button>
          </div>
          <div style={{ lineHeight:1.9 }}>{renderContent(noteContent)}</div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}

function ChatMode() {
  const [msgs, setMsgs] = useState<{role:'user'|'assistant'; text:string}[]>([
    { role:'assistant', text:'Hi! I\'m SIDI, your AI study companion at Sidelile High School. I can help you with any CAPS subject — maths problems, science concepts, essay writing, past paper questions, and more. What would you like to study today?' }
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, loading]);

  const send = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    const userMsg = { role: 'user' as const, text: userText };
    setMsgs(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/sidi', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: [...msgs, userMsg].map(m => ({ role:m.role, content:m.text })) }),
      });
      const data = await res.json();
      setMsgs(m => [...m, { role:'assistant', text: data.content || data.error || 'Sorry, I could not process that.' }]);
    } catch {
      setMsgs(m => [...m, { role:'assistant', text:'Sorry, I\'m having trouble connecting right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK = ['Explain quadratic equations','How does photosynthesis work?','Tips for essay writing','What is Newton\'s First Law?','Summarise the Cold War'];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:480 }}>
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:12, padding:'4px 0', marginBottom:14 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
            {m.role==='assistant' && (
              <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:`1px solid ${BORDER2}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginRight:10, alignSelf:'flex-end' }}>
                <Sparkles size={12} style={{ color:TEXT }} />
              </div>
            )}
            <div style={{ maxWidth:'78%', padding:'12px 16px', borderRadius: m.role==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.role==='user' ? 'rgba(255,255,255,0.08)' : S2, border:`1px solid ${BORDER}`, fontFamily:FB, fontSize:13, color: m.role==='user' ? TEXT : MUTED, lineHeight:1.65, whiteSpace:'pre-wrap' }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:`1px solid ${BORDER2}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Sparkles size={12} style={{ color:TEXT }} />
            </div>
            <div style={{ padding:'12px 16px', borderRadius:'18px 18px 18px 4px', background:S2, border:`1px solid ${BORDER}`, display:'flex', gap:4 }}>
              {[0,0.2,0.4].map((d,i) => (
                <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:MUTED, animation:`bounce 1.2s ease ${d}s infinite`, display:'block' }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {msgs.length <= 1 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
          {QUICK.map(s => (
            <button key={s} onClick={() => send(s)} style={{ fontFamily:FB, fontSize:11, padding:'5px 12px', borderRadius:9999, background:S2, border:`1px solid ${BORDER}`, color:MUTED, cursor:'pointer' }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div style={{ display:'flex', gap:10 }}>
        <textarea
          value={input} rows={2} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
          placeholder="Ask SIDI anything about your studies…"
          style={{ flex:1, background:S2, border:`1px solid ${BORDER}`, borderRadius:12, padding:'10px 14px', fontFamily:FB, fontSize:13, color:TEXT, outline:'none', resize:'none' }}
        />
        <button onClick={() => send()} disabled={loading} style={{ width:44, background:'rgba(255,255,255,0.08)', border:`1px solid ${BORDER2}`, borderRadius:12, color:TEXT, cursor: loading ? 'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Send size={15} />
        </button>
      </div>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }`}</style>
    </div>
  );
}

// ─── My Work Mode ─────────────────────────────────────────────────────────────
type WorkView = 'list' | 'submit' | 'results';

function MyWorkMode() {
  const [works, setWorks]       = useState<TeacherWork[]>([]);
  const [selected, setSelected] = useState<TeacherWork | null>(null);
  const [view, setView]         = useState<WorkView>('list');
  const [answers, setAnswers]   = useState<StudentAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [submission, setSubmission]   = useState<Submission | null>(null);
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const published = getWorks().filter(w => w.published);
    setWorks(published);
    const myIds = new Set(getSubmissions().map(s => s.workId));
    setSubmittedIds(myIds);
  }, []);

  // Countdown timer for exams
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft]);

  const openWork = (w: TeacherWork) => {
    setSelected(w);
    setAnswers(w.questions.map(q => ({ questionId: q.id, answer: '', selectedOption: undefined })));
    if (w.type === 'exam' && w.timeLimit) {
      setTimeLeft(w.timeLimit * 60);
      setTimerActive(true);
    }
    setView('submit');
  };

  const setAnswer = (questionId: string, answer: string, selectedOption?: number) => {
    setAnswers(prev => prev.map(a => a.questionId === questionId ? { ...a, answer, selectedOption } : a));
  };

  const submit = () => {
    if (!selected) return;
    setTimerActive(false);
    const analysis = generateSIDIAnalysis(selected, answers);
    const sub: Submission = {
      id: newId(),
      workId: selected.id,
      studentName: `${STUDENT.firstName} ${STUDENT.lastName}`,
      answers,
      submittedAt: new Date().toISOString(),
      analysis,
    };
    saveSubmission(sub);
    setSubmission(sub);
    setSubmittedIds(prev => new Set([...prev, selected.id]));
    setView('results');
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2,'0');
  const ss2 = String(timeLeft % 60).padStart(2,'0');
  const timeWarning = timeLeft < 300 && timeLeft > 0;

  // ── List view ──────────────────────────────────────────────────────────────
  if (view === 'list') return (
    <div>
      {works.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:FAINT, border:`1px dashed ${BORDER}`, borderRadius:16 }}>
          <Inbox size={36} style={{ marginBottom:12, opacity:0.4 }}/>
          <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:MUTED, marginBottom:6 }}>Nothing here yet</div>
          <div style={{ fontFamily:FB, fontSize:13 }}>Your teacher hasn't published any assignments or exams</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {works.map(w => {
            const done = submittedIds.has(w.id);
            const isExam = w.type === 'exam';
            return (
              <div key={w.id} style={{ background:S2, border:`1px solid ${done ? 'rgba(16,185,129,0.25)' : isExam ? 'rgba(239,68,68,0.20)' : BORDER}`, borderRadius:16, padding:'18px 20px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <div style={{ width:28, height:28, borderRadius:8, background: isExam ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', border:`1px solid ${isExam ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {isExam ? <CalendarCheck size={13} style={{ color:'#EF4444' }}/> : <ClipboardList size={13} style={{ color:'#F59E0B' }}/>}
                      </div>
                      <span style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:TEXT, letterSpacing:'-0.01em' }}>{w.title}</span>
                      <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', padding:'2px 7px', borderRadius:5, flexShrink:0,
                        background: done ? 'rgba(16,185,129,0.12)' : isExam ? 'rgba(239,68,68,0.10)' : 'rgba(245,158,11,0.10)',
                        color: done ? '#10B981' : isExam ? '#EF4444' : '#F59E0B' }}>
                        {done ? 'Submitted' : isExam ? 'Exam' : 'Assignment'}
                      </span>
                    </div>
                    <div style={{ fontFamily:FB, fontSize:12, color:MUTED, marginBottom:8 }}>
                      {w.subject} · Grade {w.grade} · {w.totalMarks} marks
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, fontFamily:FB, fontSize:11, color:FAINT }}>
                        <Clock size={11}/> Due {w.dueDate}
                      </div>
                      {isExam && w.timeLimit && (
                        <div style={{ display:'flex', alignItems:'center', gap:5, fontFamily:FB, fontSize:11, color:FAINT }}>
                          <Timer size={11}/> {w.timeLimit} min
                        </div>
                      )}
                      <div style={{ fontFamily:FB, fontSize:11, color:FAINT }}>{w.questions.length} question{w.questions.length!==1?'s':''}</div>
                    </div>
                    {w.instructions && (
                      <div style={{ fontFamily:FB, fontSize:12, color:FAINT, marginTop:8, lineHeight:1.5, fontStyle:'italic' }}>
                        {w.instructions.slice(0, 120)}{w.instructions.length > 120 ? '…' : ''}
                      </div>
                    )}
                  </div>
                  <div style={{ flexShrink:0 }}>
                    {done ? (
                      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.20)', fontFamily:FB, fontSize:12, color:'#10B981' }}>
                        <Check size={13}/> Done
                      </div>
                    ) : (
                      <button onClick={() => openWork(w)}
                        style={{ padding:'9px 18px', borderRadius:10, background: isExam ? 'rgba(239,68,68,0.10)' : 'rgba(245,158,11,0.10)', border:`1px solid ${isExam ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`, color: isExam ? '#EF4444' : '#F59E0B', fontFamily:FB, fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
                        {isExam ? 'Start Exam' : 'Submit Work'} <ArrowRight size={13}/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Submit view ────────────────────────────────────────────────────────────
  if (view === 'submit' && selected) return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:TEXT, letterSpacing:'-0.01em' }}>{selected.title}</div>
          <div style={{ fontFamily:FB, fontSize:12, color:MUTED, marginTop:2 }}>
            {selected.subject} · {selected.totalMarks} marks
            {selected.type === 'exam' && ` · ${selected.timeLimit} min`}
          </div>
        </div>
        {selected.type === 'exam' && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:12, background: timeWarning ? 'rgba(239,68,68,0.10)' : S2, border:`1px solid ${timeWarning ? 'rgba(239,68,68,0.30)' : BORDER}` }}>
            <Timer size={14} style={{ color: timeWarning ? '#EF4444' : MUTED }}/>
            <span style={{ fontFamily:'monospace', fontSize:16, fontWeight:700, color: timeWarning ? '#EF4444' : TEXT }}>{mm}:{ss2}</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      {selected.instructions && (
        <div style={{ background:S3, border:`1px solid ${BORDER}`, borderRadius:12, padding:'12px 16px', marginBottom:20, fontFamily:FB, fontSize:13, color:MUTED, lineHeight:1.6 }}>
          <strong style={{ color:TEXT }}>Instructions: </strong>{selected.instructions}
        </div>
      )}

      {/* Questions */}
      {selected.questions.map((q, i) => {
        const ans = answers.find(a => a.questionId === q.id);
        return (
          <div key={q.id} style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:16, padding:'20px 22px', marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:10, flex:1 }}>
                <div style={{ width:26, height:26, borderRadius:7, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:FB, fontSize:11, fontWeight:700, color:MUTED, flexShrink:0 }}>{i+1}</div>
                <p style={{ fontFamily:FH, fontSize:15, fontWeight:600, color:TEXT, margin:0, lineHeight:1.4 }}>{q.text}</p>
              </div>
              <span style={{ fontFamily:FB, fontSize:11, color:FAINT, flexShrink:0, marginLeft:12 }}>[{q.marks} mk{q.marks!==1?'s':''}]</span>
            </div>

            {q.type === 'mcq' && q.options ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {q.options.map((opt, oi) => (
                  <button key={oi} onClick={() => setAnswer(q.id, opt, oi)}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderRadius:10, background: ans?.selectedOption===oi ? 'rgba(255,255,255,0.08)' : 'transparent', border:`1px solid ${ans?.selectedOption===oi ? BORDER2 : BORDER}`, color: ans?.selectedOption===oi ? TEXT : MUTED, fontFamily:FB, fontSize:13, cursor:'pointer', textAlign:'left' }}>
                    <span style={{ width:22, height:22, borderRadius:'50%', background:'rgba(255,255,255,0.05)', border:`1px solid ${ans?.selectedOption===oi ? BORDER2 : BORDER}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>{String.fromCharCode(65+oi)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={ans?.answer ?? ''}
                onChange={e => setAnswer(q.id, e.target.value)}
                placeholder={q.type === 'essay' ? 'Write your full response here…' : q.type === 'calculation' ? 'Show all working and calculations…' : 'Your answer…'}
                rows={q.type === 'essay' ? 5 : 3}
                style={{ width:'100%', background:S3, border:`1px solid ${BORDER}`, borderRadius:10, padding:'12px 14px', color:TEXT, fontFamily:FB, fontSize:13, outline:'none', resize:'vertical', boxSizing:'border-box', lineHeight:1.6 }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor=BORDER2; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor=BORDER; }}
              />
            )}
          </div>
        );
      })}

      {/* Submit */}
      <div style={{ display:'flex', gap:10, marginTop:20 }}>
        <button onClick={() => { setView('list'); setTimerActive(false); }}
          style={{ padding:'12px 20px', borderRadius:12, background:'transparent', border:`1px solid ${BORDER}`, color:MUTED, fontFamily:FB, fontSize:13, cursor:'pointer' }}>
          ← Back
        </button>
        <button onClick={submit}
          style={{ flex:1, padding:'13px', borderRadius:12, background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.30)', color:'#10B981', fontFamily:FB, fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <Send size={14}/> Submit to SIDI for Analysis
        </button>
      </div>
    </div>
  );

  // ── Results / SIDI Analysis ────────────────────────────────────────────────
  if (view === 'results' && submission?.analysis) {
    const { percentage, score, totalMarks, overallFeedback, weakAreas, flashcards, practiceProblems, studyTopics } = submission.analysis;
    const color = percentage >= 80 ? '#10B981' : percentage >= 60 ? '#3B82F6' : '#EF4444';
    const [activeTab, setActiveTab] = useState<'feedback' | 'flashcards' | 'practice'>('feedback');
    const [flipIdx, setFlipIdx] = useState<number | null>(null);

    return (
      <div>
        {/* Score banner */}
        <div style={{ background: `${color}10`, border:`1px solid ${color}33`, borderRadius:18, padding:'24px', marginBottom:20, textAlign:'center' }}>
          <div style={{ fontFamily:FH, fontSize:48, fontWeight:800, color, letterSpacing:'-0.04em', lineHeight:1 }}>{percentage}%</div>
          <div style={{ fontFamily:FB, fontSize:14, color:MUTED, marginTop:6 }}>{score} / {totalMarks} marks · {selected?.title}</div>
          <p style={{ fontFamily:FB, fontSize:13, color:MUTED, lineHeight:1.7, margin:'16px auto 0', maxWidth:520 }}>{overallFeedback}</p>
        </div>

        {/* SIDI tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {([['feedback','SIDI Feedback'],['flashcards','Flashcards'],['practice','Practice Problems']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding:'8px 18px', borderRadius:10, background: activeTab===tab ? 'rgba(255,255,255,0.10)' : 'transparent', border:`1px solid ${activeTab===tab ? BORDER2 : BORDER}`, color: activeTab===tab ? TEXT : MUTED, fontFamily:FB, fontSize:13, fontWeight: activeTab===tab ? 600 : 400, cursor:'pointer' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Feedback tab */}
        {activeTab === 'feedback' && (
          <div>
            {weakAreas.length > 0 && (
              <div style={{ background:S2, border:`1px solid rgba(239,68,68,0.20)`, borderRadius:14, padding:'16px 20px', marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <AlertTriangle size={14} style={{ color:'#EF4444' }}/>
                  <span style={{ fontFamily:FB, fontSize:12, fontWeight:700, color:'#EF4444', textTransform:'uppercase', letterSpacing:'0.08em' }}>Areas Needing Attention</span>
                </div>
                {weakAreas.map((area, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderTop: i>0 ? `1px solid rgba(255,255,255,0.04)` : 'none', fontFamily:FB, fontSize:13, color:MUTED }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:'#EF4444', flexShrink:0 }}/> {area}
                  </div>
                ))}
              </div>
            )}
            <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:14, padding:'16px 20px' }}>
              <div style={{ fontFamily:FB, fontSize:12, fontWeight:700, color:MUTED, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Recommended Topics to Revise</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {studyTopics.map((t,i) => (
                  <span key={i} style={{ fontFamily:FB, fontSize:12, color:TEXT, background:'rgba(255,255,255,0.07)', border:`1px solid ${BORDER}`, padding:'5px 12px', borderRadius:8 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Flashcards tab */}
        {activeTab === 'flashcards' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {flashcards.map((fc, i) => (
              <div key={i} onClick={() => setFlipIdx(flipIdx===i ? null : i)}
                style={{ background: flipIdx===i ? S3 : S2, border:`1px solid ${BORDER}`, borderRadius:14, padding:'18px 20px', cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>
                  {flipIdx===i ? '✓ Answer' : `Q${i+1} — click to reveal answer`}
                </div>
                <p style={{ fontFamily: flipIdx===i ? FB : FH, fontSize: flipIdx===i ? 13 : 14, fontWeight: flipIdx===i ? 400 : 600, color:TEXT, margin:0, lineHeight:1.6, whiteSpace:'pre-line' }}>
                  {flipIdx===i ? fc.a : fc.q}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Practice problems tab */}
        {activeTab === 'practice' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {practiceProblems.map((pp, i) => (
              <div key={i} style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:14, padding:'18px 20px' }}>
                <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:TEXT, marginBottom:10 }}>{pp.question}</div>
                <div style={{ background:S3, borderRadius:10, padding:'12px 14px', fontFamily:FB, fontSize:13, color:MUTED, lineHeight:1.6 }}>
                  <span style={{ color:FAINT, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 }}>SIDI Guidance</span>
                  {pp.answer}
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setView('list')}
          style={{ marginTop:20, width:'100%', padding:'12px', borderRadius:12, background:'transparent', border:`1px solid ${BORDER}`, color:MUTED, fontFamily:FB, fontSize:13, cursor:'pointer' }}>
          ← Back to My Work
        </button>
      </div>
    );
  }

  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function navBtn(disabled: boolean): React.CSSProperties {
  return { width:40, height:40, borderRadius:10, background: disabled ? 'transparent' : S2, border:`1px solid ${disabled ? 'transparent' : BORDER}`, color: disabled ? FAINT : MUTED, cursor: disabled ? 'default' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SIDIPage() {
  const [subject, setSubject] = useState('MATH');
  const [mode, setMode] = useState<Mode>('home');

  const subjectLabels: Record<string, string> = {
    MATH:'Mathematics', SCI:'Physical Sciences', ENG:'English HL',
    ZUL:'IsiZulu FAL', LIFE_ORI:'Life Orientation', HIST:'History', GEOG:'Geography',
  };

  return (
    <div style={{ padding:24, fontFamily:FB, background:BG, minHeight:'100%' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
          {mode !== 'home' && (
            <button onClick={() => setMode('home')} style={{ background:'none', border:'none', color:MUTED, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:FB, fontSize:13, padding:0 }}>
              <ChevronLeft size={16}/> Back
            </button>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.06)', border:`1px solid ${BORDER2}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Sparkles size={17} style={{ color:TEXT }} />
            </div>
            <div>
              <h1 style={{ fontFamily:FH, fontSize:20, fontWeight:800, color:TEXT, margin:0, letterSpacing:'-0.03em' }}>
                SIDI {mode !== 'home' && <span style={{ color:MUTED, fontWeight:400 }}>— {MODES.find(m2=>m2.id===mode)?.label}</span>}
              </h1>
              <p style={{ fontSize:12, color:FAINT, margin:0, marginTop:1 }}>Sidelile Intelligent Digital Intelligence · Study Companion</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Subject selector ── */}
      {mode !== 'chat' && mode !== 'mywork' && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
          {Object.entries(subjectLabels).map(([code, label]) => (
            <button
              key={code}
              onClick={() => setSubject(code)}
              style={{ padding:'6px 14px', borderRadius:8, background: subject===code ? 'rgba(255,255,255,0.10)' : 'transparent', border:`1px solid ${subject===code ? BORDER2 : BORDER}`, color: subject===code ? TEXT : MUTED, fontFamily:FB, fontSize:12, fontWeight: subject===code ? 600 : 400, cursor:'pointer', transition:'all 0.15s' }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Home — mode cards ── */}
      {mode === 'home' && (
        <>
          {/* Quick stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
            {[
              { label:'Study Streak', value:'12 days', icon:Star,     color:'#F59E0B' },
              { label:'Flashcards Done', value:'48',    icon:BookOpen, color:'#3B82F6' },
              { label:'Quiz Average',  value:'76%',     icon:Brain,    color:'#8B5CF6' },
              { label:'Notes Created', value:'9',       icon:FileText, color:'#10B981' },
            ].map(({ label, value, icon:Icon, color }) => (
              <div key={label} style={{ background:S1, border:`1px solid ${BORDER}`, borderRadius:14, padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ fontSize:11, color:MUTED }}>{label}</div>
                  <Icon size={14} style={{ color }} />
                </div>
                <div style={{ fontFamily:FH, fontSize:22, fontWeight:800, color, lineHeight:1, marginTop:8 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Mode cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
            {MODES.map(({ id, icon:Icon, label, desc, color }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                style={{ background:S1, border:`1px solid ${BORDER}`, borderRadius:18, padding:'24px', textAlign:'left', cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', gap:14 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background=S2; (e.currentTarget as HTMLElement).style.borderColor=BORDER2; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background=S1; (e.currentTarget as HTMLElement).style.borderColor=BORDER; }}
              >
                <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, border:`1px solid ${color}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:TEXT, letterSpacing:'-0.01em' }}>{label}</div>
                  <div style={{ fontFamily:FB, fontSize:13, color:MUTED, marginTop:4 }}>{desc}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:4, color:FAINT, fontSize:12, marginTop:'auto' }}>
                  <span>Start</span><ChevronRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Active mode content ── */}
      {mode !== 'home' && (
        <div style={{ background:S1, border:`1px solid ${BORDER}`, borderRadius:20, padding:28 }}>
          {mode === 'mywork'     && <MyWorkMode />}
          {mode === 'flashcards' && <FlashcardMode subject={subject} />}
          {mode === 'quiz'       && <QuizMode      subject={subject} />}
          {mode === 'exam'       && <ExamMode      subject={subject} />}
          {mode === 'notes'      && <NotesMode     subject={subject} />}
          {mode === 'chat'       && <ChatMode />}
        </div>
      )}
    </div>
  );
}
