'use client';

import { useState } from 'react';
import { Check, Clock, X, AlertTriangle, Save, ChevronDown } from 'lucide-react';
import { STUDENTS, SCHOOL_CLASSES } from '@/lib/teacher/mockData';
import type { AttendanceStatus } from '@/types/teacher';

const BG='#0C0C0C',S1='#111111',S2='#171717',S3='#1E1E1E';
const BORDER='rgba(255,255,255,0.07)',BORDER2='rgba(255,255,255,0.12)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";

const STATUS_CFG: Record<AttendanceStatus,{label:string;color:string;bg:string;icon:React.ElementType}> = {
  present: { label:'Present', color:'#10B981', bg:'rgba(16,185,129,0.12)', icon:Check },
  late:    { label:'Late',    color:'#F59E0B', bg:'rgba(245,158,11,0.12)', icon:Clock },
  absent:  { label:'Absent',  color:'#EF4444', bg:'rgba(239,68,68,0.12)', icon:X },
  excused: { label:'Excused', color:'#6366F1', bg:'rgba(99,102,241,0.12)', icon:AlertTriangle },
};

const CLASSES = [
  { id:'cls-10b-math', label:'Grade 10B — Mathematics', room:'C12' },
  { id:'cls-11a-math', label:'Grade 11A — Mathematics', room:'B08' },
  { id:'cls-12d-math', label:'Grade 12D — Mathematics', room:'A04' },
];

export default function AttendancePage() {
  const [classId, setClassId]   = useState('cls-10b-math');
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved]       = useState(false);

  const cls = CLASSES.find(c=>c.id===classId)!;
  const students = STUDENTS.filter(s=>s.classId===classId);

  // Deterministic default attendance based on student + date
  const seed = (s:string,d:string) => {
    let h=0; for(const c of s+d){h=(h*31+c.charCodeAt(0))&0xffffffff;} return (h<0?h+0x100000000:h)/0x100000000;
  };
  const defaultStatus = (sid:string): AttendanceStatus => {
    const r = seed(sid,date);
    if(r<0.03) return 'absent';
    if(r<0.06) return 'late';
    if(r<0.07) return 'excused';
    return 'present';
  };

  const [statuses, setStatuses] = useState<Record<string,AttendanceStatus>>({});
  const getStatus = (sid:string): AttendanceStatus => statuses[sid] ?? defaultStatus(sid);
  const set = (sid:string, s:AttendanceStatus) => { setStatuses(p=>({...p,[sid]:s})); setSaved(false); };

  const counts = students.reduce((acc,s)=>{
    const st = getStatus(s._id);
    acc[st] = (acc[st]??0)+1;
    return acc;
  },{} as Record<AttendanceStatus,number>);

  const STATS = [
    { status:'present' as AttendanceStatus, label:'Present' },
    { status:'late'    as AttendanceStatus, label:'Late'    },
    { status:'absent'  as AttendanceStatus, label:'Absent'  },
    { status:'excused' as AttendanceStatus, label:'Excused' },
  ];

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:TEXT,margin:0,letterSpacing:'-0.03em'}}>Attendance</h1>
          <p style={{fontSize:12,color:FAINT,margin:'4px 0 0'}}>Capture daily attendance for your classes</p>
        </div>
        <button onClick={()=>setSaved(true)}
          style={{display:'flex',alignItems:'center',gap:7,padding:'10px 20px',borderRadius:12,background:saved?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.07)',border:`1px solid ${saved?'rgba(16,185,129,0.30)':BORDER2}`,color:saved?'#10B981':TEXT,fontFamily:FB,fontSize:13,fontWeight:700,cursor:'pointer',transition:'all 0.2s'}}>
          {saved?<><Check size={15}/>Saved!</>:<><Save size={15}/>Save Register</>}
        </button>
      </div>

      {/* Controls */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:14,padding:'14px 16px',display:'flex',alignItems:'center',gap:10}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>Class</div>
            <select value={classId} onChange={e=>{setClassId(e.target.value);setStatuses({});setSaved(false);}}
              style={{background:'transparent',border:'none',outline:'none',color:TEXT,fontFamily:FH,fontSize:15,fontWeight:700,cursor:'pointer',width:'100%'}}>
              {CLASSES.map(c=><option key={c.id} value={c.id} style={{background:S2}}>{c.label}</option>)}
            </select>
          </div>
          <ChevronDown size={14} style={{color:FAINT,flexShrink:0}}/>
        </div>
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:14,padding:'14px 16px'}}>
          <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>Date</div>
          <input type="date" value={date} onChange={e=>{setDate(e.target.value);setStatuses({});setSaved(false);}}
            style={{background:'transparent',border:'none',outline:'none',color:TEXT,fontFamily:FH,fontSize:15,fontWeight:700,cursor:'pointer',colorScheme:'dark',width:'100%'}}/>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {STATS.map(({status,label})=>{
          const cfg=STATUS_CFG[status];
          const Icon=cfg.icon;
          return (
            <div key={status} style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:14,padding:'14px 16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <span style={{fontFamily:FB,fontSize:11,color:MUTED}}>{label}</span>
                <Icon size={14} style={{color:cfg.color}}/>
              </div>
              <div style={{fontFamily:FH,fontSize:28,fontWeight:800,color:cfg.color}}>{counts[status]??0}</div>
              <div style={{fontFamily:FB,fontSize:11,color:FAINT,marginTop:4}}>
                {Math.round(((counts[status]??0)/students.length)*100)}% of {students.length}
              </div>
            </div>
          );
        })}
      </div>

      {/* Roster */}
      <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT}}>{cls.label}</span>
          <span style={{fontFamily:FB,fontSize:12,color:MUTED}}>Room {cls.room} · {students.length} learners</span>
        </div>
        {students.map((s,i)=>{
          const status = getStatus(s._id);
          const cfg = STATUS_CFG[status];
          return (
            <div key={s._id} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 20px',borderTop:i>0?`1px solid rgba(255,255,255,0.04)`:'none'}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,0.07)',border:`1px solid ${BORDER}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FB,fontSize:11,fontWeight:700,color:MUTED,flexShrink:0}}>
                {s.avatarInitials}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:TEXT}}>{s.firstName} {s.lastName}</div>
                <div style={{fontFamily:FB,fontSize:11,color:FAINT}}>{s.studentNumber}</div>
              </div>
              {/* Status buttons */}
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                {(['present','late','absent','excused'] as AttendanceStatus[]).map(st=>{
                  const c=STATUS_CFG[st];
                  const active=status===st;
                  const Icon=c.icon;
                  return (
                    <button key={st} onClick={()=>set(s._id,st)}
                      style={{display:'flex',alignItems:'center',gap:5,padding:'6px 12px',borderRadius:8,background:active?c.bg:'transparent',border:`1px solid ${active?c.color:BORDER}`,color:active?c.color:FAINT,fontFamily:FB,fontSize:11,fontWeight:active?700:400,cursor:'pointer',transition:'all 0.15s'}}>
                      <Icon size={11}/>{c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
