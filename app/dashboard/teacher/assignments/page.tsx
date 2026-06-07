'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Send, Eye, EyeOff, ChevronDown, ChevronUp,
  ClipboardList, CheckCircle2, Clock, Users, BookOpen,
} from 'lucide-react';
import {
  TeacherWork, Question, QuestionType,
  getWorks, saveWork, deleteWork, publishWork,
  getSubmissions, newId,
} from '@/lib/assignmentStore';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BG = '#0C0C0C', S1 = '#111111', S2 = '#171717', S3 = '#1E1E1E';
const BORDER = 'rgba(255,255,255,0.07)', BORDER2 = 'rgba(255,255,255,0.12)';
const TEXT = '#FFFFFF', MUTED = 'rgba(255,255,255,0.50)', FAINT = 'rgba(255,255,255,0.22)';
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const SUBJECTS = ['Mathematics','Physical Sciences','English HL','IsiZulu FAL','Life Orientation','History','Geography','Accounting','Business Studies'];
const GRADES   = ['8','9','10','11','12'];
const Q_TYPES: { value: QuestionType; label: string }[] = [
  { value:'short_answer', label:'Short Answer' },
  { value:'essay',        label:'Essay / Long Answer' },
  { value:'mcq',          label:'Multiple Choice' },
  { value:'calculation',  label:'Calculation / Show Work' },
];

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: S2, border:`1px solid ${BORDER}`, borderRadius:10,
  padding:'10px 14px', color:TEXT, fontFamily:FB, fontSize:13,
  outline:'none', width:'100%', boxSizing:'border-box' as const,
  ...extra,
});

// ─── Question Builder ─────────────────────────────────────────────────────────
function QuestionRow({ q, idx, onChange, onDelete }: {
  q: Question; idx: number;
  onChange: (q: Question) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ background:S3, border:`1px solid ${BORDER}`, borderRadius:14, marginBottom:10, overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', cursor:'pointer' }} onClick={() => setOpen(o=>!o)}>
        <div style={{ width:24, height:24, borderRadius:7, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:FB, fontSize:11, fontWeight:700, color:MUTED, flexShrink:0 }}>
          {idx+1}
        </div>
        <span style={{ flex:1, fontFamily:FB, fontSize:13, color: q.text ? TEXT : FAINT, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {q.text || 'New question…'}
        </span>
        <span style={{ fontFamily:FB, fontSize:11, color:MUTED, flexShrink:0 }}>{q.marks} mk{q.marks!==1?'s':''}</span>
        <button onClick={e=>{e.stopPropagation();onDelete();}} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(239,68,68,0.50)', padding:4, display:'flex' }}>
          <Trash2 size={13}/>
        </button>
        {open ? <ChevronUp size={14} style={{color:FAINT}}/> : <ChevronDown size={14} style={{color:FAINT}}/>}
      </div>

      {open && (
        <div style={{ padding:'0 16px 16px', borderTop:`1px solid ${BORDER}`, paddingTop:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:10, marginBottom:12 }}>
            <div>
              <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Question Type</div>
              <select value={q.type} onChange={e=>onChange({...q, type:e.target.value as QuestionType, options: e.target.value==='mcq' ? ['','','',''] : undefined})}
                style={inp()}>
                {Q_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Marks</div>
              <input type="number" min={1} max={100} value={q.marks}
                onChange={e=>onChange({...q, marks:+e.target.value||1})}
                style={{...inp(), width:72}}/>
            </div>
          </div>

          <div style={{ marginBottom:10 }}>
            <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Question Text</div>
            <textarea value={q.text} onChange={e=>onChange({...q, text:e.target.value})}
              placeholder="Type your question here…" rows={2}
              style={{...inp(), resize:'vertical' as const}}/>
          </div>

          {q.type === 'mcq' && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Answer Options</div>
              {(q.options ?? ['','','','']).map((opt, oi) => (
                <div key={oi} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <span style={{ fontFamily:FB, fontSize:12, color:MUTED, width:20, flexShrink:0 }}>{String.fromCharCode(65+oi)}.</span>
                  <input value={opt} onChange={e=>{const opts=[...(q.options??['','','',''])]; opts[oi]=e.target.value; onChange({...q, options:opts});}}
                    placeholder={`Option ${String.fromCharCode(65+oi)}`}
                    style={{...inp(), flex:1}}/>
                </div>
              ))}
            </div>
          )}

          <div>
            <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Answer Hint (shown to SIDI after submission)</div>
            <input value={q.hint??''} onChange={e=>onChange({...q, hint:e.target.value})}
              placeholder="Key points SIDI should highlight when reviewing this question…"
              style={inp()}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Create / Edit Form ───────────────────────────────────────────────────────
function AssignmentForm({ onSaved, editing }: {
  onSaved: () => void;
  editing?: TeacherWork | null;
}) {
  const blank: TeacherWork = editing ?? {
    id:'', type:'assignment', title:'', subject:'Mathematics', subjectCode:'MATH',
    grade:'10', dueDate:'', totalMarks:0, instructions:'', questions:[], published:false,
    createdAt: new Date().toISOString(), teacherName:'Mr. Nkosi',
  };

  const [form, setForm] = useState<TeacherWork>(blank);

  useEffect(() => { if (editing) setForm(editing); }, [editing]);

  const addQ = () => setForm(f=>({...f, questions:[...f.questions, { id:newId(), text:'', type:'short_answer', marks:5 }]}));
  const updateQ = (idx:number, q:Question) => setForm(f=>({...f, questions:f.questions.map((q2,i)=>i===idx?q:q2)}));
  const removeQ = (idx:number) => setForm(f=>({...f, questions:f.questions.filter((_,i)=>i!==idx)}));

  const total = form.questions.reduce((s,q)=>s+q.marks, 0);

  const save = (publish=false) => {
    if (!form.title.trim() || !form.dueDate) return;
    const work: TeacherWork = {
      ...form,
      id: form.id || newId(),
      totalMarks: total,
      published: publish || form.published,
      createdAt: form.createdAt || new Date().toISOString(),
    };
    saveWork(work);
    onSaved();
  };

  return (
    <div>
      <div style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:TEXT, marginBottom:18, letterSpacing:'-0.01em' }}>
        {editing ? 'Edit Assignment' : 'New Assignment'}
      </div>

      {/* Basic info */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Title</div>
          <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
            placeholder="e.g. Chapter 3 Assignment" style={inp()}/>
        </div>
        <div>
          <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Due Date</div>
          <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))}
            style={{...inp(), colorScheme:'dark'}}/>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Subject</div>
          <select value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} style={inp()}>
            {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Grade</div>
          <select value={form.grade} onChange={e=>setForm(f=>({...f,grade:e.target.value}))} style={inp()}>
            {GRADES.map(g=><option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontFamily:FB, fontSize:10, color:FAINT, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>Instructions for Students</div>
        <textarea value={form.instructions} onChange={e=>setForm(f=>({...f,instructions:e.target.value}))}
          placeholder="Describe what students need to do, materials needed, how to format their responses…"
          rows={3} style={{...inp(), resize:'vertical' as const}}/>
      </div>

      {/* Questions */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{ fontFamily:FB, fontSize:13, fontWeight:600, color:TEXT }}>Questions</div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {total > 0 && <span style={{ fontFamily:FB, fontSize:12, color:MUTED }}>{form.questions.length} questions · {total} marks total</span>}
          <button onClick={addQ}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:9, background:'rgba(255,255,255,0.06)', border:`1px solid ${BORDER2}`, color:TEXT, fontFamily:FB, fontSize:12, fontWeight:600, cursor:'pointer' }}>
            <Plus size={13}/> Add Question
          </button>
        </div>
      </div>

      {form.questions.length === 0 && (
        <div style={{ textAlign:'center', padding:'28px 0', color:FAINT, fontFamily:FB, fontSize:13, border:`1px dashed ${BORDER}`, borderRadius:12, marginBottom:18 }}>
          No questions yet — click "Add Question" to get started
        </div>
      )}

      {form.questions.map((q,i) => (
        <QuestionRow key={q.id} q={q} idx={i}
          onChange={nq=>updateQ(i,nq)}
          onDelete={()=>removeQ(i)}/>
      ))}

      {/* Actions */}
      <div style={{ display:'flex', gap:10, marginTop:20 }}>
        <button onClick={()=>save(false)}
          disabled={!form.title.trim()||!form.dueDate}
          style={{ flex:1, padding:'12px', borderRadius:12, background: (!form.title.trim()||!form.dueDate) ? S3 : 'rgba(255,255,255,0.06)', border:`1px solid ${BORDER}`, color: (!form.title.trim()||!form.dueDate) ? FAINT : MUTED, fontFamily:FB, fontSize:13, fontWeight:600, cursor:(!form.title.trim()||!form.dueDate)?'default':'pointer' }}>
          Save Draft
        </button>
        <button onClick={()=>save(true)}
          disabled={!form.title.trim()||!form.dueDate||form.questions.length===0}
          style={{ flex:1, padding:'12px', borderRadius:12, background:(!form.title.trim()||!form.dueDate||form.questions.length===0) ? S3 : 'rgba(16,185,129,0.12)', border:`1px solid ${(!form.title.trim()||!form.dueDate||form.questions.length===0) ? BORDER : 'rgba(16,185,129,0.30)'}`, color:(!form.title.trim()||!form.dueDate||form.questions.length===0) ? FAINT : '#10B981', fontFamily:FB, fontSize:13, fontWeight:700, cursor:(!form.title.trim()||!form.dueDate||form.questions.length===0)?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
          <Send size={13}/> Publish to Students
        </button>
      </div>
    </div>
  );
}

// ─── Assignment Card ──────────────────────────────────────────────────────────
function WorkCard({ work, onEdit, onDelete, onTogglePublish, subCount }: {
  work: TeacherWork;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  subCount: number;
}) {
  const due = new Date(work.dueDate);
  const past = due < new Date();

  return (
    <div style={{ background:S1, border:`1px solid ${work.published ? 'rgba(16,185,129,0.20)' : BORDER}`, borderRadius:14, padding:'16px 18px', marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:TEXT, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {work.title}
            </div>
            <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'2px 7px', borderRadius:5, flexShrink:0,
              background: work.published ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.06)',
              color: work.published ? '#10B981' : MUTED }}>
              {work.published ? 'Live' : 'Draft'}
            </span>
          </div>
          <div style={{ fontFamily:FB, fontSize:12, color:MUTED }}>
            Grade {work.grade} · {work.subject} · {work.questions.length} questions · {work.totalMarks} marks
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, fontFamily:FB, fontSize:11, color: past ? '#EF4444' : FAINT }}>
              <Clock size={11}/> Due {work.dueDate}
            </div>
            {work.published && (
              <div style={{ display:'flex', alignItems:'center', gap:5, fontFamily:FB, fontSize:11, color: subCount > 0 ? '#10B981' : FAINT }}>
                <Users size={11}/> {subCount} submission{subCount!==1?'s':''}
              </div>
            )}
          </div>
        </div>
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <button onClick={onTogglePublish}
            style={{ padding:'6px 10px', borderRadius:8, background:'transparent', border:`1px solid ${BORDER}`, color:MUTED, cursor:'pointer', display:'flex', alignItems:'center' }}
            title={work.published ? 'Unpublish' : 'Publish'}>
            {work.published ? <EyeOff size={13}/> : <Eye size={13}/>}
          </button>
          <button onClick={onEdit}
            style={{ padding:'6px 12px', borderRadius:8, background:'transparent', border:`1px solid ${BORDER}`, color:MUTED, fontFamily:FB, fontSize:12, cursor:'pointer' }}>
            Edit
          </button>
          <button onClick={onDelete}
            style={{ padding:'6px 10px', borderRadius:8, background:'transparent', border:'1px solid rgba(239,68,68,0.20)', color:'rgba(239,68,68,0.60)', cursor:'pointer', display:'flex', alignItems:'center' }}>
            <Trash2 size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeacherAssignmentsPage() {
  const [works, setWorks]     = useState<TeacherWork[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing]  = useState<TeacherWork | null>(null);
  const [subs, setSubs]        = useState<Record<string,number>>({});

  const load = () => {
    const all = getWorks().filter(w => w.type === 'assignment');
    setWorks(all);
    const counts: Record<string,number> = {};
    all.forEach(w => { counts[w.id] = getSubmissions(w.id).length; });
    setSubs(counts);
  };

  useEffect(() => { load(); }, []);

  const handleTogglePublish = (id: string, published: boolean) => {
    const works2 = getWorks().map(w => w.id === id ? { ...w, published: !published } : w);
    localStorage.setItem('sidelile_teacher_works', JSON.stringify(works2));
    load();
  };

  const stats = [
    { label:'Total Assignments', value: works.length,                                            icon:ClipboardList, color:'#3B82F6' },
    { label:'Published',         value: works.filter(w=>w.published).length,                     icon:CheckCircle2, color:'#10B981' },
    { label:'Pending Submissions',value: Object.values(subs).reduce((a,b)=>a+b,0),               icon:Clock,        color:'#F59E0B' },
    { label:'Drafts',            value: works.filter(w=>!w.published).length,                    icon:BookOpen,     color:MUTED as string },
  ];

  return (
    <div style={{ padding:24, fontFamily:FB, background:BG, minHeight:'100%' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h1 style={{ fontFamily:FH, fontSize:20, fontWeight:800, color:TEXT, margin:0, letterSpacing:'-0.03em' }}>Assignments</h1>
          <p style={{ fontSize:12, color:FAINT, margin:'4px 0 0' }}>Create and manage assignments for your classes</p>
        </div>
        <button onClick={() => { setEditing(null); setCreating(true); }}
          style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:12, background:'rgba(255,255,255,0.07)', border:`1px solid ${BORDER2}`, color:TEXT, fontFamily:FB, fontSize:13, fontWeight:700, cursor:'pointer' }}>
          <Plus size={15}/> New Assignment
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {stats.map(({ label, value, icon:Icon, color }) => (
          <div key={label} style={{ background:S1, border:`1px solid ${BORDER}`, borderRadius:14, padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontFamily:FB, fontSize:11, color:MUTED }}>{label}</span>
              <Icon size={14} style={{ color }}/>
            </div>
            <div style={{ fontFamily:FH, fontSize:26, fontWeight:800, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: (creating || editing) ? '1fr 420px' : '1fr', gap:20 }}>
        {/* List */}
        <div>
          {works.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:FAINT, border:`1px dashed ${BORDER}`, borderRadius:16 }}>
              <ClipboardList size={36} style={{ marginBottom:12, opacity:0.4 }}/>
              <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, marginBottom:6, color:MUTED }}>No assignments yet</div>
              <div style={{ fontFamily:FB, fontSize:13 }}>Click "New Assignment" to create your first one</div>
            </div>
          ) : (
            works.map(w => (
              <WorkCard
                key={w.id}
                work={w}
                subCount={subs[w.id]??0}
                onEdit={() => { setEditing(w); setCreating(true); }}
                onDelete={() => { deleteWork(w.id); load(); }}
                onTogglePublish={() => handleTogglePublish(w.id, w.published)}
              />
            ))
          )}
        </div>

        {/* Form panel */}
        {(creating || editing) && (
          <div style={{ background:S1, border:`1px solid ${BORDER}`, borderRadius:18, padding:22, height:'fit-content', position:'sticky', top:24 }}>
            <AssignmentForm
              editing={editing}
              onSaved={() => { setCreating(false); setEditing(null); load(); }}
            />
            <button onClick={() => { setCreating(false); setEditing(null); }}
              style={{ width:'100%', marginTop:12, padding:'9px', borderRadius:10, background:'transparent', border:`1px solid ${BORDER}`, color:MUTED, fontFamily:FB, fontSize:12, cursor:'pointer' }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
