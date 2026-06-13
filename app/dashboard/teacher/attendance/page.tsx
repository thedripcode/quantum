'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Clock, X, AlertTriangle, Save, Loader2, RefreshCw } from 'lucide-react';

const BG='#0C0C0C',S2='#171717';
const BORDER='rgba(255,255,255,0.07)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";
const GREEN='#10B981',AMBER='#F59E0B',RED='#EF4444',INDIGO='#6366F1';

type AttStatus = 'present'|'late'|'absent'|'excused';
const STATUS_CFG: Record<AttStatus,{label:string;color:string;bg:string;icon:React.ElementType}> = {
  present:{label:'Present',color:GREEN, bg:'rgba(16,185,129,0.12)',icon:Check},
  late:   {label:'Late',   color:AMBER, bg:'rgba(245,158,11,0.12)',icon:Clock},
  absent: {label:'Absent', color:RED,   bg:'rgba(239,68,68,0.12)', icon:X},
  excused:{label:'Excused',color:INDIGO,bg:'rgba(99,102,241,0.12)',icon:AlertTriangle},
};

interface Student { portalId:string; name:string; grade:string|null; }

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading]   = useState(true);
  const [grade, setGrade]       = useState('');
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0]);
  const [statuses, setStatuses] = useState<Record<string,AttStatus>>({});
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');

  const flash = (m:string) => { setToast(m); setTimeout(()=>setToast(''),4000); };

  useEffect(() => {
    fetch('/api/teacher/roster').then(r=>r.json()).then(d => {
      setStudents(d.students ?? []);
      setLoading(false);
    });
  }, []);

  const grades = [...new Set(students.map(s=>s.grade).filter(Boolean))].sort() as string[];
  useEffect(() => { if (grades.length && !grade) setGrade(grades[0]); }, [grades.join(',')]);

  const loadExisting = useCallback(() => {
    if (!grade||!date) return;
    fetch('/api/attendance').then(r=>r.json()).then(d => {
      const recs: any[] = d.records??[];
      const map: Record<string,AttStatus>={};
      for (const r of recs) {
        if (r.date===date && r.grade===grade) map[r.studentPortalId]=r.status;
      }
      setStatuses(map);
    });
  }, [grade,date]);

  useEffect(() => { loadExisting(); }, [loadExisting]);

  const gradeStudents = students.filter(s=>s.grade===grade);
  const getStatus = (pid:string):AttStatus => statuses[pid]??'present';
  const setS = (pid:string,s:AttStatus) => setStatuses(p=>({...p,[pid]:s}));

  const counts = gradeStudents.reduce((acc,s)=>({...acc,[getStatus(s.portalId)]:(acc[getStatus(s.portalId)]||0)+1}),{} as Record<AttStatus,number>);

  const saveAll = async () => {
    setSaving(true);
    let ok=0,fail=0;
    for (const s of gradeStudents) {
      const res = await fetch('/api/attendance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentPortalId:s.portalId,date,status:getStatus(s.portalId)})});
      if(res.ok) ok++; else fail++;
    }
    setSaving(false);
    flash(fail===0?`✓ Saved attendance for ${ok} student${ok!==1?'s':''}.`:`Saved ${ok}, failed ${fail}.`);
  };

  if (loading) {
    return <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><Loader2 size={24} className="animate-spin" style={{color:MUTED}}/></div>;
  }

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:0,letterSpacing:'-0.02em'}}>Attendance Register</h2>
        <p style={{fontSize:13,color:MUTED,marginTop:4}}>Mark daily attendance for a class.</p>
      </div>

      {toast&&<div style={{marginBottom:16,padding:'11px 16px',borderRadius:10,background:toast.startsWith('✓')?'rgba(16,185,129,0.10)':'rgba(245,158,11,0.10)',border:`1px solid ${toast.startsWith('✓')?'rgba(16,185,129,0.30)':'rgba(245,158,11,0.30)'}`,fontSize:13,color:toast.startsWith('✓')?GREEN:AMBER}}>{toast}</div>}

      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
        <select value={grade} onChange={e=>{setGrade(e.target.value);setStatuses({});}}
          style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:10,color:TEXT,fontFamily:FB,fontSize:13,padding:'10px 16px',outline:'none',cursor:'pointer'}}>
          {grades.map(g=><option key={g} value={g} style={{background:S2}}>{g}</option>)}
        </select>
        <input type="date" value={date} onChange={e=>{setDate(e.target.value);setStatuses({});}}
          style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:10,color:TEXT,fontFamily:FB,fontSize:13,padding:'10px 14px',outline:'none'}}/>
        <button onClick={loadExisting} style={{display:'flex',alignItems:'center',gap:6,padding:'10px 14px',borderRadius:10,background:S2,border:`1px solid ${BORDER}`,color:MUTED,fontFamily:FB,fontSize:13,cursor:'pointer'}}>
          <RefreshCw size={13}/>Load Saved
        </button>
        <button onClick={saveAll} disabled={saving||gradeStudents.length===0}
          style={{display:'flex',alignItems:'center',gap:6,padding:'10px 20px',borderRadius:10,background:'#C9A84C',border:'none',color:'#000',fontFamily:FH,fontSize:13,fontWeight:700,cursor:saving?'default':'pointer',opacity:saving?0.6:1,marginLeft:'auto'}}>
          {saving?<Loader2 size={13} className="animate-spin"/>:<Save size={13}/>}{saving?'Saving…':'Save Register'}
        </button>
      </div>

      <div className="portal-stats-grid" style={{marginBottom:20}}>
        {(Object.entries(STATUS_CFG) as [AttStatus,typeof STATUS_CFG[AttStatus]][]).map(([key,cfg])=>{
          const Icon=cfg.icon;
          return(
            <div key={key} style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:13,padding:'14px 16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:11,color:MUTED,fontWeight:500}}>{cfg.label}</span><Icon size={13} style={{color:cfg.color}}/>
              </div>
              <div style={{fontFamily:FH,fontSize:26,fontWeight:700,color:cfg.color,letterSpacing:'-0.02em'}}>{counts[key]??0}</div>
            </div>
          );
        })}
      </div>

      {gradeStudents.length===0?(
        <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:16,padding:40,textAlign:'center',color:MUTED,fontSize:13}}>{grades.length===0?'No students in the system yet.':'No students found for '+grade+'.'}</div>
      ):(
        <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden'}}>
          <div style={{display:'flex',justifyContent:'space-between',padding:'11px 20px',borderBottom:`1px solid ${BORDER}`}}>
            <div style={{fontSize:10,fontWeight:700,color:FAINT,letterSpacing:'0.08em',textTransform:'uppercase'}}>Student ({gradeStudents.length})</div>
            <div style={{fontSize:10,fontWeight:700,color:FAINT,letterSpacing:'0.08em',textTransform:'uppercase'}}>Status</div>
          </div>
          {gradeStudents.map((s,i)=>{
            const cur=getStatus(s.portalId);
            return(
              <div key={s.portalId} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderBottom:i<gradeStudents.length-1?`1px solid ${BORDER}`:'none'}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:TEXT}}>{s.name}</div>
                  <div style={{fontSize:11,color:FAINT,marginTop:1}}>{s.portalId}</div>
                </div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'flex-end'}}>
                  {(Object.entries(STATUS_CFG) as [AttStatus,typeof STATUS_CFG[AttStatus]][]).map(([key,cfg])=>{
                    const Icon=cfg.icon; const active=cur===key;
                    return(
                      <button key={key} onClick={()=>setS(s.portalId,key)} title={cfg.label}
                        style={{display:'flex',alignItems:'center',gap:4,padding:'6px 10px',borderRadius:8,border:`1px solid ${active?cfg.color+'60':BORDER}`,cursor:'pointer',background:active?cfg.bg:'transparent',color:active?cfg.color:FAINT,fontSize:11,fontWeight:600,fontFamily:FB}}>
                        <Icon size={11}/><span style={{display:'none'}}>{cfg.label}</span>
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
