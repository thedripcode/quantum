'use client';

import { useState } from 'react';
import { Send, Phone, AlertTriangle, Clock, CheckCircle2, Bell } from 'lucide-react';
import { STUDENTS } from '@/lib/teacher/mockData';

const BG='#081420',S1='#0C1A2B',S2='#0F2032';
const BORDER='rgba(255,255,255,0.07)',BORDER2='rgba(255,255,255,0.12)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Roboto Condensed', sans-serif",FB="'Inter', sans-serif";

const TEMPLATES = [
  { id:'at-risk',  label:'Academic At-Risk',     color:'#EF4444', icon:AlertTriangle, msg:'Your child is currently performing below the required pass mark in Mathematics. Immediate support and intervention are recommended. Please contact us to arrange a meeting.' },
  { id:'absent',   label:'Excessive Absence',    color:'#F59E0B', icon:Clock,         msg:'We have noticed that your child has been absent from school for several days. Please contact us urgently to discuss this matter.' },
  { id:'positive', label:'Positive Achievement', color:'#10B981', icon:CheckCircle2,  msg:'We are delighted to share that your child has shown excellent progress in Mathematics this term. Please encourage them to keep up the great work!' },
  { id:'meeting',  label:'Meeting Request',      color:'#3B82F6', icon:Bell,          msg:'We would like to schedule a parent-teacher meeting to discuss your child\'s academic progress. Please contact the school office to arrange a suitable time.' },
];

interface SentAlert { id:string; student:string; parent:string; type:string; date:string; msg:string; status:'sent'|'delivered'; }

const INITIAL_ALERTS: SentAlert[] = [
  { id:'1', student:'Sipho Mthembu',    parent:'+27 72 100 0002', type:'Academic At-Risk',     date:'2024-09-12', msg:'Your child is performing below the pass mark…', status:'delivered' },
  { id:'2', student:'Stefan Pretorius', parent:'+27 77 110 0004', type:'Academic At-Risk',     date:'2024-09-10', msg:'Your child is performing below the pass mark…', status:'delivered' },
  { id:'3', student:'Amahle Dlamini',   parent:'+27 71 100 0001', type:'Positive Achievement', date:'2024-09-08', msg:'Excellent progress this term…',                 status:'delivered' },
];

export default function AlertsPage() {
  const [studentId,setStudentId]   = useState(STUDENTS[0]._id);
  const [templateId,setTemplateId] = useState('at-risk');
  const [msg,setMsg]               = useState(TEMPLATES[0].msg);
  const [sent,setSent]             = useState(false);
  const [history,setHistory]       = useState<SentAlert[]>(INITIAL_ALERTS);

  const student = STUDENTS.find(s=>s._id===studentId)!;
  const template = TEMPLATES.find(t=>t.id===templateId)!;

  const selectTemplate = (id:string) => {
    const t = TEMPLATES.find(t=>t.id===id)!;
    setTemplateId(id);
    setMsg(t.msg);
    setSent(false);
  };

  const sendAlert = () => {
    const alert: SentAlert = {
      id: Date.now().toString(),
      student:`${student.firstName} ${student.lastName}`,
      parent: student.parentPhone,
      type: template.label,
      date: new Date().toISOString().split('T')[0],
      msg,
      status:'sent',
    };
    setHistory(p=>[alert,...p]);
    setSent(true);
  };

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:TEXT,margin:0,letterSpacing:'-0.03em'}}>Parent Alerts</h1>
        <p style={{fontSize:12,color:FAINT,margin:'4px 0 0'}}>Send direct alerts and notifications to parents</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 400px',gap:20}}>
        {/* Composer */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,padding:22}}>
          <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT,marginBottom:16}}>New Alert</div>

          {/* Student picker */}
          <div style={{marginBottom:14}}>
            <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Student</div>
            <select value={studentId} onChange={e=>{setStudentId(e.target.value);setSent(false);}}
              style={{width:'100%',background:S2,border:`1px solid ${BORDER}`,borderRadius:10,padding:'10px 14px',color:TEXT,fontFamily:FB,fontSize:13,outline:'none'}}>
              {STUDENTS.map(s=><option key={s._id} value={s._id} style={{background:S2}}>{s.firstName} {s.lastName} — Gr {s.grade}{s.classCode}</option>)}
            </select>
          </div>

          {/* Parent info */}
          <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:12,padding:'12px 14px',marginBottom:14,display:'flex',gap:16}}>
            <div>
              <div style={{fontFamily:FB,fontSize:10,color:FAINT,marginBottom:3}}>Parent Phone</div>
              <div style={{fontFamily:FB,fontSize:13,color:TEXT,fontWeight:600}}>{student.parentPhone}</div>
            </div>
            <div>
              <div style={{fontFamily:FB,fontSize:10,color:FAINT,marginBottom:3}}>Parent Email</div>
              <div style={{fontFamily:FB,fontSize:13,color:TEXT}}>{student.parentEmail}</div>
            </div>
          </div>

          {/* Templates */}
          <div style={{marginBottom:14}}>
            <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>Alert Type</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {TEMPLATES.map(t=>{
                const Icon=t.icon;
                const active=templateId===t.id;
                return (
                  <button key={t.id} onClick={()=>selectTemplate(t.id)}
                    style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:10,background:active?`${t.color}12`:'transparent',border:`1px solid ${active?t.color:BORDER}`,color:active?t.color:MUTED,fontFamily:FB,fontSize:12,fontWeight:active?600:400,cursor:'pointer',transition:'all 0.15s',textAlign:'left'}}>
                    <Icon size={13}/>{t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Message</div>
            <textarea value={msg} onChange={e=>{setMsg(e.target.value);setSent(false);}} rows={4}
              style={{width:'100%',background:S2,border:`1px solid ${BORDER}`,borderRadius:10,padding:'11px 14px',color:TEXT,fontFamily:FB,fontSize:13,outline:'none',resize:'vertical',boxSizing:'border-box',lineHeight:1.6}}/>
          </div>

          <div style={{display:'flex',gap:10}}>
            <button onClick={sendAlert} disabled={sent}
              style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'12px',borderRadius:12,background:sent?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.07)',border:`1px solid ${sent?'rgba(16,185,129,0.30)':BORDER2}`,color:sent?'#10B981':TEXT,fontFamily:FB,fontSize:13,fontWeight:700,cursor:sent?'default':'pointer',transition:'all 0.2s'}}>
              {sent?<><CheckCircle2 size={14}/>Alert Sent!</>:<><Send size={14}/>Send Alert</>}
            </button>
            <a href={`tel:${student.parentPhone}`}
              style={{display:'flex',alignItems:'center',gap:7,padding:'12px 18px',borderRadius:12,background:'rgba(16,185,129,0.10)',border:'1px solid rgba(16,185,129,0.25)',color:'#10B981',fontFamily:FB,fontSize:13,fontWeight:600,textDecoration:'none'}}>
              <Phone size={14}/> Call
            </a>
          </div>
        </div>

        {/* History */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:`1px solid ${BORDER}`,fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT}}>Alert History</div>
          <div style={{overflowY:'auto',maxHeight:500}}>
            {history.map((a,i)=>(
              <div key={a.id} style={{padding:'14px 18px',borderTop:i>0?`1px solid rgba(255,255,255,0.04)`:'none'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10,marginBottom:6}}>
                  <div>
                    <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:TEXT}}>{a.student}</div>
                    <div style={{fontFamily:FB,fontSize:11,color:FAINT}}>{a.type} · {a.date}</div>
                  </div>
                  <span style={{fontFamily:FB,fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',padding:'2px 7px',borderRadius:5,background:'rgba(16,185,129,0.12)',color:'#10B981',flexShrink:0,whiteSpace:'nowrap'}}>
                    {a.status}
                  </span>
                </div>
                <p style={{fontFamily:FB,fontSize:12,color:MUTED,margin:0,lineHeight:1.5,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                  {a.msg}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
