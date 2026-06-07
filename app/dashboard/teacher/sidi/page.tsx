'use client';

import { useState } from 'react';
import {
  Brain, FileText, ClipboardList, BarChart2, Sparkles,
  ChevronRight, Check, RotateCcw, BookOpen, Users,
} from 'lucide-react';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BG = '#0C0C0C', S1 = '#111111', S2 = '#171717', S3 = '#1E1E1E';
const BORDER = 'rgba(255,255,255,0.07)', BORDER2 = 'rgba(255,255,255,0.12)';
const TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

type Tool = 'home' | 'lesson' | 'quiz' | 'insights';

const TOOLS = [
  { id:'lesson'   as Tool, icon:BookOpen,     label:'Lesson Plan Generator', desc:'AI-crafted CAPS-aligned lesson plans in seconds',   color:'#3B82F6' },
  { id:'quiz'     as Tool, icon:ClipboardList, label:'Assessment Creator',    desc:'Generate quizzes, tests and rubrics by topic',       color:'#8B5CF6' },
  { id:'insights' as Tool, icon:BarChart2,     label:'Class Insights',        desc:'AI summary of your class performance & at-risk flags', color:'#10B981' },
];

// ─── Lesson Plan Generator ────────────────────────────────────────────────────
function LessonPlanTool() {
  const [grade, setGrade]         = useState('10');
  const [subject, setSubject]     = useState('Mathematics');
  const [topic, setTopic]         = useState('');
  const [duration, setDuration]   = useState('45');
  const [loading, setLoading]     = useState(false);
  const [plan, setPlan]           = useState<string | null>(null);

  const generate = () => {
    if (!topic.trim()) return;
    setLoading(true); setPlan(null);
    setTimeout(() => {
      setLoading(false);
      setPlan(`# Lesson Plan — ${topic}\n**Grade ${grade} ${subject} · ${duration} minutes · CAPS Aligned**\n\n## Learning Objectives\nBy the end of this lesson, learners will be able to:\n• Understand the core concept of ${topic}\n• Apply the relevant formulas / techniques to solve problems\n• Identify connections to previously covered content\n\n## Resources Needed\n• Whiteboard & markers\n• Textbook pp. 120–135 (as applicable)\n• Printed activity sheets\n• Calculator (if applicable)\n\n## Lesson Structure\n\n### 1. Introduction (${Math.round(+duration*0.15)} min)\n- Greet learners and settle the class\n- Recap previous lesson with 2–3 quick verbal questions\n- State today's objectives clearly\n\n### 2. Direct Teaching (${Math.round(+duration*0.35)} min)\n- Introduce ${topic} with a real-world example\n- Present key definitions and formulas\n- Work through 2 teacher-led examples on the board\n\n### 3. Guided Practice (${Math.round(+duration*0.25)} min)\n- Learners attempt 3 problems in pairs\n- Teacher circulates — check for misconceptions\n- Discuss common errors with the class\n\n### 4. Independent Practice (${Math.round(+duration*0.15)} min)\n- Individual classwork: 4 graded problems\n- Differentiate: extension task for advanced learners\n\n### 5. Closure (${Math.round(+duration*0.10)} min)\n- Exit ticket: one question to assess understanding\n- Preview next lesson\n- Set homework\n\n## Assessment\n- Observation during guided practice\n- Exit ticket reviewed before next class\n- Homework marked and returned within 2 days\n\n## Differentiation\n- **Support**: Provide a formula sheet, allow calculator use\n- **Extension**: Challenge problem involving ${topic} in a new context`);
    }, 2000);
  };

  const sel = (val: string, onChange: (v:string)=>void, opts: string[]): React.ReactNode => (
    <select value={val} onChange={e=>onChange(e.target.value)}
      style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:10, padding:'10px 14px', color:TEXT, fontFamily:FB, fontSize:13, outline:'none', cursor:'pointer' }}>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
        <div><div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Grade</div>
          {sel(grade, setGrade, ['8','9','10','11','12'])}</div>
        <div><div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Subject</div>
          {sel(subject, setSubject, ['Mathematics','Physical Sciences','English HL','History','Geography','Life Orientation','IsiZulu FAL'])}</div>
        <div><div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Duration</div>
          {sel(duration, setDuration, ['30','45','60'])}</div>
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Topic / Lesson Title</div>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Quadratic Equations, Newton's Laws of Motion…"
          style={{ width:'100%', background:S2, border:`1px solid ${BORDER}`, borderRadius:10, padding:'11px 14px', color:TEXT, fontFamily:FB, fontSize:13, outline:'none', boxSizing:'border-box' }}
          onFocus={e=>{(e.target as HTMLElement).style.borderColor=BORDER2;}}
          onBlur={e=>{(e.target as HTMLElement).style.borderColor=BORDER;}}
        />
      </div>
      <button onClick={generate} disabled={!topic.trim()||loading}
        style={{ padding:'12px 28px', borderRadius:12, background: (!topic.trim()||loading) ? S3 : 'rgba(59,130,246,0.12)', border:`1px solid ${(!topic.trim()||loading) ? BORDER : 'rgba(59,130,246,0.30)'}`, color: (!topic.trim()||loading) ? MUTED : '#3B82F6', fontFamily:FB, fontSize:13, fontWeight:700, cursor:(!topic.trim()||loading)?'default':'pointer', display:'inline-flex', alignItems:'center', gap:8, marginBottom: plan||loading ? 20 : 0 }}>
        {loading ? (<><div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid rgba(59,130,246,0.30)',borderTopColor:'#3B82F6',animation:'spin 0.7s linear infinite' }}/>Generating plan…</>) : (<><Sparkles size={14}/>Generate Lesson Plan</>)}
      </button>

      {plan && (
        <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:16, padding:'24px 28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:'#3B82F6', letterSpacing:'0.10em', textTransform:'uppercase' }}>AI-Generated · CAPS Aligned</div>
            <button onClick={()=>navigator.clipboard.writeText(plan)} style={{ background:'none', border:`1px solid ${BORDER}`, borderRadius:8, padding:'5px 12px', color:MUTED, fontFamily:FB, fontSize:12, cursor:'pointer' }}>Copy</button>
          </div>
          <div style={{ fontFamily:FB, fontSize:13, color:MUTED, lineHeight:1.9, whiteSpace:'pre-line' }}>
            {plan.split('\n').map((line, i) => {
              if (line.startsWith('# '))   return <h2 key={i} style={{ fontFamily:FH, fontSize:20, fontWeight:800, color:TEXT, margin:'0 0 4px', letterSpacing:'-0.02em' }}>{line.slice(2)}</h2>;
              if (line.startsWith('## '))  return <h3 key={i} style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:TEXT, margin:'20px 0 6px' }}>{line.slice(3)}</h3>;
              if (line.startsWith('### ')) return <h4 key={i} style={{ fontFamily:FB, fontSize:13, fontWeight:700, color:TEXT, margin:'14px 0 4px' }}>{line.slice(4)}</h4>;
              if (line.startsWith('• ') || line.startsWith('- ')) return <div key={i} style={{ paddingLeft:16, borderLeft:'2px solid rgba(255,255,255,0.07)', marginBottom:3, color:MUTED }}>{line.slice(2)}</div>;
              if (line.startsWith('**')) return <div key={i} style={{ fontWeight:600, color:TEXT, marginBottom:4 }}>{line.replace(/\*\*/g,'')}</div>;
              if (line === '') return <br key={i}/>;
              return <p key={i} style={{ margin:'0 0 4px', color:MUTED }}>{line}</p>;
            })}
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ─── Assessment Creator ───────────────────────────────────────────────────────
function AssessmentTool() {
  const [type, setType]         = useState('Quiz');
  const [grade, setGrade]       = useState('10');
  const [subject, setSubject]   = useState('Mathematics');
  const [topic, setTopic]       = useState('');
  const [numQ, setNumQ]         = useState('5');
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const generate = () => {
    if (!topic.trim()) return;
    setLoading(true); setDone(false);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  const SAMPLE_Q = [
    { q:`Define the term "${topic || 'the concept'}" in your own words.`, marks:2, type:'Short Answer' },
    { q:`Calculate and show all working. [3 marks]`, marks:3, type:'Calculation' },
    { q:`Which of the following is correct? A. ... B. ... C. ... D. ...`, marks:1, type:'MCQ' },
    { q:`Explain why this occurs, with reference to the principles of ${subject}.`, marks:4, type:'Paragraph' },
    { q:`Sketch a diagram and label all relevant parts.`, marks:3, type:'Diagram' },
  ].slice(0, +numQ);

  const sel = (val:string, onChange:(v:string)=>void, opts:string[]) => (
    <select value={val} onChange={e=>onChange(e.target.value)}
      style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:10, padding:'10px 14px', color:TEXT, fontFamily:FB, fontSize:13, outline:'none', cursor:'pointer' }}>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
        <div><div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Type</div>
          {sel(type, setType, ['Quiz','Test','Exam','Worksheet'])}</div>
        <div><div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Grade</div>
          {sel(grade, setGrade, ['8','9','10','11','12'])}</div>
        <div><div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Subject</div>
          {sel(subject, setSubject, ['Mathematics','Physical Sciences','English HL','History','Geography'])}</div>
        <div><div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Questions</div>
          {sel(numQ, setNumQ, ['3','5','8','10','15','20'])}</div>
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Topic</div>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Organic Chemistry, World War 2…"
          style={{ width:'100%', background:S2, border:`1px solid ${BORDER}`, borderRadius:10, padding:'11px 14px', color:TEXT, fontFamily:FB, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
      </div>
      <button onClick={generate} disabled={!topic.trim()||loading}
        style={{ padding:'12px 28px', borderRadius:12, background:(!topic.trim()||loading)?S3:'rgba(139,92,246,0.12)', border:`1px solid ${(!topic.trim()||loading)?BORDER:'rgba(139,92,246,0.30)'}`, color:(!topic.trim()||loading)?MUTED:'#8B5CF6', fontFamily:FB, fontSize:13, fontWeight:700, cursor:(!topic.trim()||loading)?'default':'pointer', display:'inline-flex', alignItems:'center', gap:8, marginBottom:done?20:0 }}>
        {loading?(<><div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid rgba(139,92,246,0.30)',borderTopColor:'#8B5CF6',animation:'spin 0.7s linear infinite' }}/>Creating assessment…</>):(<><Sparkles size={14}/>Generate {type}</>)}
      </button>

      {done && (
        <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:16, padding:'24px 28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:TEXT }}>{type}: {topic}</div>
              <div style={{ fontFamily:FB, fontSize:12, color:MUTED, marginTop:2 }}>Grade {grade} {subject} · Total: {SAMPLE_Q.reduce((a,q)=>a+q.marks,0)} marks</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ padding:'7px 14px', borderRadius:8, background:'rgba(139,92,246,0.10)', border:'1px solid rgba(139,92,246,0.25)', color:'#8B5CF6', fontFamily:FB, fontSize:12, fontWeight:600, cursor:'pointer' }}>Print</button>
              <button style={{ padding:'7px 14px', borderRadius:8, background:'transparent', border:`1px solid ${BORDER}`, color:MUTED, fontFamily:FB, fontSize:12, cursor:'pointer' }}>Export PDF</button>
            </div>
          </div>
          {SAMPLE_Q.map((q, i) => (
            <div key={i} style={{ padding:'16px 18px', background:S3, borderRadius:12, marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <span style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:MUTED, background:'rgba(255,255,255,0.06)', padding:'2px 8px', borderRadius:6 }}>Q{i+1}</span>
                  <span style={{ fontFamily:FB, fontSize:10, color:FAINT }}>{q.type}</span>
                </div>
                <p style={{ fontFamily:FB, fontSize:13, color:TEXT, margin:0, lineHeight:1.5 }}>{q.q}</p>
              </div>
              <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:'#8B5CF6', flexShrink:0, minWidth:60, textAlign:'right' }}>[{q.marks} {q.marks===1?'mark':'marks'}]</div>
            </div>
          ))}
          <div style={{ marginTop:16, padding:'12px 18px', background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.15)', borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
            <Check size={14} style={{ color:'#8B5CF6', flexShrink:0 }} />
            <span style={{ fontFamily:FB, fontSize:13, color:MUTED }}>Total: <strong style={{ color:TEXT }}>{SAMPLE_Q.reduce((a,q)=>a+q.marks,0)} marks</strong> · Estimated time: {+numQ * 3} minutes</span>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ─── Class Insights ───────────────────────────────────────────────────────────
function InsightsTool() {
  const INSIGHTS = [
    { label:'Class Average',        value:'71%',    sub:'Above school average (68%)',       color:'#10B981', good:true  },
    { label:'At-Risk Learners',     value:'4',      sub:'Below 50% in at least 1 subject',  color:'#EF4444', good:false },
    { label:'Assignments Overdue',  value:'7',      sub:'Across 3 learners',                color:'#F59E0B', good:false },
    { label:'Attendance Rate',      value:'94.2%',  sub:'Term 3 class average',             color:'#3B82F6', good:true  },
  ];
  const AT_RISK = [
    { name:'Sipho Dlamini',    mark:38, subject:'Mathematics',       issue:'Below pass mark — 2 consecutive fails' },
    { name:'Naledi Khumalo',   mark:44, subject:'Physical Sciences', issue:'Declining trend — down 12% this term'  },
    { name:'Bongani Mthembu',  mark:49, subject:'Mathematics',       issue:'Borderline — at risk of failing term'  },
    { name:'Zanele Ndlovu',    mark:41, subject:'Physical Sciences', issue:'High absenteeism affecting marks'       },
  ];

  return (
    <div>
      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {INSIGHTS.map(({ label, value, sub, color }) => (
          <div key={label} style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:14, padding:'16px 18px' }}>
            <div style={{ fontFamily:FB, fontSize:11, color:MUTED, marginBottom:6 }}>{label}</div>
            <div style={{ fontFamily:FH, fontSize:26, fontWeight:800, color, lineHeight:1 }}>{value}</div>
            <div style={{ fontFamily:FB, fontSize:11, color:FAINT, marginTop:6 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:14, padding:'20px 22px', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <Sparkles size={14} style={{ color:TEXT }} />
          <span style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:TEXT, textTransform:'uppercase', letterSpacing:'0.10em' }}>SIDI Class Summary</span>
        </div>
        <p style={{ fontFamily:FB, fontSize:13, color:MUTED, lineHeight:1.8, margin:0 }}>
          Your Grade 10B Mathematics class is performing <strong style={{ color:TEXT }}>above school average</strong> at 71%.
          Quadratic Functions remains a challenge — 6 learners scored below 50% on the last test.
          <strong style={{ color:'#EF4444' }}> 4 learners are at risk</strong> and require intervention before the term exam.
          Attendance is strong at 94.2% with no major concerns.
          Consider a focused revision lesson on factorisation before the next assessment.
        </p>
      </div>

      {/* At-risk table */}
      <div style={{ background:S2, border:`1px solid ${BORDER}`, borderRadius:14, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', gap:8 }}>
          <Users size={14} style={{ color:'#EF4444' }} />
          <span style={{ fontFamily:FB, fontSize:13, fontWeight:600, color:TEXT }}>At-Risk Learners</span>
          <span style={{ marginLeft:'auto', fontFamily:FB, fontSize:11, color:'#EF4444', fontWeight:600 }}>{AT_RISK.length} learners</span>
        </div>
        {AT_RISK.map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 20px', borderTop: i > 0 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.20)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:FB, fontSize:11, fontWeight:700, color:'#EF4444', flexShrink:0 }}>
              {s.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:FB, fontSize:13, fontWeight:600, color:TEXT }}>{s.name}</div>
              <div style={{ fontFamily:FB, fontSize:11, color:MUTED, marginTop:2 }}>{s.issue}</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:FH, fontSize:16, fontWeight:800, color:'#EF4444' }}>{s.mark}%</div>
              <div style={{ fontFamily:FB, fontSize:10, color:FAINT }}>{s.subject}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeacherSIDIPage() {
  const [tool, setTool] = useState<Tool>('home');

  return (
    <div style={{ padding:24, fontFamily:FB, background:BG, minHeight:'100%' }}>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {tool !== 'home' && (
            <button onClick={()=>setTool('home')} style={{ background:'none', border:'none', color:MUTED, cursor:'pointer', fontFamily:FB, fontSize:13, display:'flex', alignItems:'center', gap:4, padding:0 }}>
              ← Back
            </button>
          )}
          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.06)', border:`1px solid ${BORDER2}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Brain size={17} style={{ color:TEXT }} />
          </div>
          <div>
            <h1 style={{ fontFamily:FH, fontSize:20, fontWeight:800, color:TEXT, margin:0, letterSpacing:'-0.03em' }}>
              SIDI {tool !== 'home' && <span style={{ color:MUTED, fontWeight:400 }}>— {TOOLS.find(t=>t.id===tool)?.label}</span>}
            </h1>
            <p style={{ fontSize:12, color:FAINT, margin:0, marginTop:1 }}>Sidelile Intelligent Digital Intelligence · Teacher Tools</p>
          </div>
        </div>
      </div>

      {/* Home */}
      {tool === 'home' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {TOOLS.map(({ id, icon:Icon, label, desc, color }) => (
            <button key={id} onClick={()=>setTool(id)}
              style={{ background:S1, border:`1px solid ${BORDER}`, borderRadius:18, padding:'28px 24px', textAlign:'left', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=S2;(e.currentTarget as HTMLElement).style.borderColor=BORDER2;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=S1;(e.currentTarget as HTMLElement).style.borderColor=BORDER;}}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${color}18`, border:`1px solid ${color}33`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div style={{ fontFamily:FH, fontSize:17, fontWeight:700, color:TEXT, letterSpacing:'-0.01em', marginBottom:6 }}>{label}</div>
              <div style={{ fontFamily:FB, fontSize:13, color:MUTED, lineHeight:1.5, marginBottom:20 }}>{desc}</div>
              <div style={{ display:'flex', alignItems:'center', gap:4, color:FAINT, fontSize:12 }}>Open <ChevronRight size={12}/></div>
            </button>
          ))}
        </div>
      )}

      {/* Tool content */}
      {tool !== 'home' && (
        <div style={{ background:S1, border:`1px solid ${BORDER}`, borderRadius:20, padding:28 }}>
          {tool === 'lesson'   && <LessonPlanTool />}
          {tool === 'quiz'     && <AssessmentTool />}
          {tool === 'insights' && <InsightsTool />}
        </div>
      )}
    </div>
  );
}
