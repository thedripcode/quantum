'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, ClipboardList, Loader2, ChevronDown } from 'lucide-react';

const BG='#081420',S2='#0F2032',S3='#14283E';
const BORDER='rgba(255,255,255,0.07)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Roboto Condensed', sans-serif",FB="'Inter', sans-serif";
const GOLD='#60a5fa',AMBER='#F59E0B',RED='#EF4444',GREEN='#10B981',BLUE='#3B82F6';

const PRIORITY_COLORS={high:RED,medium:AMBER,low:GREEN};
const A_TYPES=['Assignment','Project','Essay','Practical','Test'];

interface Assignment { id:string; subject:string; subjectShort:string; color:string; title:string; type:string; dueDate:string; total:number; priority:string; }
interface Subject { code:string; name:string; short:string; color:string; }

const inp=(extra?:React.CSSProperties):React.CSSProperties=>({background:S3,border:`1px solid ${BORDER}`,borderRadius:10,padding:'10px 14px',color:TEXT,fontFamily:FB,fontSize:13,outline:'none',width:'100%',boxSizing:'border-box' as const,...extra});

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects]       = useState<Subject[]>([]);
  const [loading, setLoading]         = useState(true);
  const [busy, setBusy]               = useState(false);
  const [toast, setToast]             = useState('');
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({subjectCode:'',title:'',type:'Assignment',dueDate:'',total:'100',priority:'medium',description:''});

  const flash=(m:string)=>{ setToast(m); setTimeout(()=>setToast(''),4000); };

  const load = useCallback(()=>{
    Promise.all([
      fetch('/api/assignments').then(r=>r.json()),
      fetch('/api/teacher/roster').then(r=>r.json()),
    ]).then(([ad,rd])=>{
      setAssignments(ad.assignments??[]);
      setSubjects(rd.subjects??[]);
      setLoading(false);
      if(rd.subjects?.length&&!form.subjectCode) setForm(f=>({...f,subjectCode:rd.subjects[0].code}));
    });
  },[]);

  useEffect(()=>{ load(); },[load]);

  const create = async () => {
    if(!form.subjectCode||!form.title.trim()||!form.dueDate){ flash('Subject, title and due date are required.'); return; }
    setBusy(true);
    const res=await fetch('/api/assignments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      subjectCode:form.subjectCode, title:form.title.trim(), description:form.description.trim()||undefined,
      type:form.type, dueDate:form.dueDate, total:Number(form.total)||100, priority:form.priority,
    })});
    setBusy(false);
    if(res.ok){ flash('✓ Assignment created.'); setShowForm(false); setForm(f=>({...f,title:'',description:'',dueDate:''})); load(); }
    else flash('Could not create assignment.');
  };

  const remove = async (a:Assignment) => {
    if(!confirm(`Delete "${a.title}"?`)) return;
    const res=await fetch(`/api/assignments?id=${a.id}`,{method:'DELETE'});
    if(res.ok){ flash('✓ Assignment deleted.'); load(); }
    else flash('Could not delete.');
  };

  const today=new Date().toISOString().split('T')[0];
  const upcoming=assignments.filter(a=>a.dueDate>=today);
  const past=assignments.filter(a=>a.dueDate<today);

  return(
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,gap:10,flexWrap:'wrap'}}>
        <div>
          <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:0,letterSpacing:'-0.02em'}}>Assignments</h2>
          <p style={{fontSize:13,color:MUTED,marginTop:4}}>Manage assignments across your subjects.</p>
        </div>
        <button onClick={()=>setShowForm(s=>!s)}
          style={{display:'flex',alignItems:'center',gap:7,padding:'10px 20px',borderRadius:10,background:GOLD,border:'none',color:'#000',fontFamily:FH,fontSize:13,fontWeight:700,cursor:'pointer'}}>
          <Plus size={14}/>{showForm?'Cancel':'New Assignment'}
        </button>
      </div>

      {toast&&<div style={{marginBottom:16,padding:'11px 16px',borderRadius:10,background:toast.startsWith('✓')?'rgba(16,185,129,0.10)':'rgba(245,158,11,0.10)',border:`1px solid ${toast.startsWith('✓')?'rgba(16,185,129,0.30)':'rgba(245,158,11,0.30)'}`,fontSize:13,color:toast.startsWith('✓')?GREEN:AMBER}}>{toast}</div>}

      {showForm&&(
        <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:16,padding:20,marginBottom:20}}>
          <h3 style={{fontFamily:FH,fontSize:15,fontWeight:600,color:TEXT,margin:'0 0 16px'}}>New Assignment</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:12}}>
            <div>
              <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.08em',marginBottom:5}}>SUBJECT</div>
              <select value={form.subjectCode} onChange={e=>setForm(f=>({...f,subjectCode:e.target.value}))} style={inp()}>
                {subjects.map(s=><option key={s.code} value={s.code} style={{background:S3}}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.08em',marginBottom:5}}>TYPE</div>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={inp()}>
                {A_TYPES.map(t=><option key={t} value={t} style={{background:S3}}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.08em',marginBottom:5}}>DUE DATE</div>
              <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} style={inp()}/>
            </div>
            <div>
              <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.08em',marginBottom:5}}>TOTAL MARKS</div>
              <input type="number" min={1} value={form.total} onChange={e=>setForm(f=>({...f,total:e.target.value}))} style={inp()}/>
            </div>
            <div>
              <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.08em',marginBottom:5}}>PRIORITY</div>
              <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} style={inp()}>
                {['high','medium','low'].map(p=><option key={p} value={p} style={{background:S3}}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.08em',marginBottom:5}}>TITLE</div>
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Term 2 Investigation" style={inp()}/>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.08em',marginBottom:5}}>DESCRIPTION (optional)</div>
            <textarea rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Instructions for students…" style={{...inp(),resize:'vertical'}}/>
          </div>
          <button onClick={create} disabled={busy}
            style={{display:'flex',alignItems:'center',gap:7,padding:'10px 22px',borderRadius:10,background:GOLD,border:'none',color:'#000',fontFamily:FH,fontSize:13,fontWeight:700,cursor:busy?'default':'pointer',opacity:busy?0.6:1}}>
            {busy?<Loader2 size={14} className="animate-spin"/>:<Plus size={14}/>}{busy?'Creating…':'Create Assignment'}
          </button>
        </div>
      )}

      {loading?(
        <div style={{display:'flex',justifyContent:'center',padding:40}}><Loader2 size={24} className="animate-spin" style={{color:MUTED}}/></div>
      ):assignments.length===0?(
        <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:16,padding:60,textAlign:'center'}}>
          <ClipboardList size={36} style={{color:MUTED,marginBottom:12,opacity:0.5}}/>
          <div style={{fontSize:15,fontWeight:600,color:TEXT}}>No assignments yet</div>
          <div style={{fontSize:13,color:MUTED,marginTop:4}}>Create your first assignment above.</div>
        </div>
      ):(
        <>
          {upcoming.length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:700,color:FAINT,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Upcoming ({upcoming.length})</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {upcoming.map(a=>(<AssignmentRow key={a.id} a={a} onDelete={()=>remove(a)}/>))}
              </div>
            </div>
          )}
          {past.length>0&&(
            <div>
              <div style={{fontSize:11,fontWeight:700,color:FAINT,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Past ({past.length})</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {past.map(a=>(<AssignmentRow key={a.id} a={a} onDelete={()=>remove(a)}/>))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AssignmentRow({a,onDelete}:{a:Assignment;onDelete:()=>void}) {
  const dueDate=new Date(a.dueDate+'T00:00:00');
  const today=new Date(); today.setHours(0,0,0,0);
  const diff=Math.ceil((dueDate.getTime()-today.getTime())/86400000);
  const isOverdue=diff<0;
  const pColor=(PRIORITY_COLORS as any)[a.priority]??AMBER;
  return(
    <div style={{background:S2,border:`1px solid ${isOverdue?'rgba(239,68,68,0.25)':BORDER}`,borderRadius:13,padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
      <div style={{width:4,height:40,borderRadius:2,background:a.color,flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
          <span style={{fontSize:13,fontWeight:600,color:TEXT,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</span>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:'0.08em',color:pColor,background:pColor+'18',padding:'2px 5px',borderRadius:4,flexShrink:0,textTransform:'uppercase'}}>{a.priority}</span>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <span style={{fontSize:11,color:a.color,fontWeight:500}}>{a.subject}</span>
          <span style={{fontSize:11,color:FAINT}}>·</span>
          <span style={{fontSize:11,color:MUTED}}>{a.type}</span>
          <span style={{fontSize:11,color:FAINT}}>·</span>
          <span style={{fontSize:11,color:MUTED}}>{a.total} marks</span>
        </div>
      </div>
      <div style={{textAlign:'right',flexShrink:0}}>
        <div style={{fontSize:12,fontWeight:600,color:isOverdue?RED:diff<=3?AMBER:MUTED}}>
          {isOverdue?`${Math.abs(diff)}d overdue`:diff===0?'Due today':diff===1?'Due tomorrow':`Due in ${diff}d`}
        </div>
        <div style={{fontSize:11,color:FAINT,marginTop:2}}>{a.dueDate}</div>
      </div>
      <button onClick={onDelete}
        style={{display:'flex',alignItems:'center',gap:5,padding:'7px 12px',borderRadius:8,cursor:'pointer',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:RED,fontSize:11,fontWeight:600,flexShrink:0}}>
        <Trash2 size={12}/>
      </button>
    </div>
  );
}
