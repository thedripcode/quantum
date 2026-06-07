'use client';

import { useState } from 'react';
import { Download, FileText, Users, ClipboardList, BarChart2, Check } from 'lucide-react';
import { STUDENTS, SCHOOL_CLASSES } from '@/lib/teacher/mockData';

const BG='#0C0C0C',S1='#111111',S2='#171717';
const BORDER='rgba(255,255,255,0.07)',BORDER2='rgba(255,255,255,0.12)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";

const DOC_TYPES = [
  { id:'report-cards',  label:'Individual Report Cards',   desc:'One page per learner with marks, attendance and teacher comment', icon:FileText,     color:'#C9A84C' },
  { id:'class-results', label:'Class Results Summary',     desc:'Full class mark sheet with averages and grade distribution',        icon:BarChart2,    color:'#3B82F6' },
  { id:'class-list',    label:'Class Register',            desc:'Printable register with learner names, numbers and contact info',   icon:Users,        color:'#10B981' },
  { id:'assessment',    label:'Assessment Mark Sheet',     desc:'Blank or pre-filled assessment recording sheet',                    icon:ClipboardList,color:'#8B5CF6' },
];

const CLASSES = [
  {id:'cls-10b-math',label:'Grade 10B — Mathematics'},
  {id:'cls-11a-math',label:'Grade 11A — Mathematics'},
  {id:'cls-12d-math',label:'Grade 12D — Mathematics'},
];

export default function PDFPage() {
  const [docType,setDocType]   = useState('report-cards');
  const [classId,setClassId]   = useState('cls-10b-math');
  const [loading,setLoading]   = useState(false);
  const [done,setDone]         = useState(false);
  const [comment,setComment]   = useState('This learner has shown consistent effort throughout the term. Continued focus on problem-solving techniques is recommended.');

  const students = STUDENTS.filter(s=>s.classId===classId);
  const doc = DOC_TYPES.find(d=>d.id===docType)!;

  const generate = () => {
    setLoading(true); setDone(false);
    setTimeout(()=>{ setLoading(false); setDone(true); }, 2000);
  };

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:TEXT,margin:0,letterSpacing:'-0.03em'}}>Generate PDF</h1>
        <p style={{fontSize:12,color:FAINT,margin:'4px 0 0'}}>Export reports, registers and mark sheets as PDF</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20}}>
        {/* Options */}
        <div>
          {/* Doc type */}
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:FB,fontSize:11,fontWeight:600,color:MUTED,textTransform:'uppercase',letterSpacing:'0.10em',marginBottom:12}}>Document Type</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {DOC_TYPES.map(d=>{
                const Icon=d.icon;
                const active=docType===d.id;
                return (
                  <button key={d.id} onClick={()=>{setDocType(d.id);setDone(false);}}
                    style={{display:'flex',gap:14,padding:'16px 18px',borderRadius:14,background:active?`${d.color}10`:S1,border:`1px solid ${active?d.color:BORDER}`,textAlign:'left',cursor:'pointer',transition:'all 0.2s',alignItems:'flex-start'}}>
                    <div style={{width:38,height:38,borderRadius:10,background:`${d.color}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <Icon size={18} style={{color:d.color}}/>
                    </div>
                    <div>
                      <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:active?d.color:TEXT,marginBottom:4}}>{d.label}</div>
                      <div style={{fontFamily:FB,fontSize:11,color:FAINT,lineHeight:1.5}}>{d.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class */}
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:FB,fontSize:11,fontWeight:600,color:MUTED,textTransform:'uppercase',letterSpacing:'0.10em',marginBottom:10}}>Class</div>
            <div style={{display:'flex',gap:8}}>
              {CLASSES.map(c=>(
                <button key={c.id} onClick={()=>{setClassId(c.id);setDone(false);}}
                  style={{flex:1,padding:'11px',borderRadius:10,background:classId===c.id?'rgba(255,255,255,0.08)':'transparent',border:`1px solid ${classId===c.id?BORDER2:BORDER}`,color:classId===c.id?TEXT:MUTED,fontFamily:FB,fontSize:12,fontWeight:classId===c.id?600:400,cursor:'pointer',transition:'all 0.15s'}}>
                  {c.label.split(' — ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher comment (for report cards) */}
          {docType==='report-cards'&&(
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:FB,fontSize:11,fontWeight:600,color:MUTED,textTransform:'uppercase',letterSpacing:'0.10em',marginBottom:10}}>General Teacher Comment</div>
              <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3}
                style={{width:'100%',background:S1,border:`1px solid ${BORDER}`,borderRadius:12,padding:'12px 14px',color:TEXT,fontFamily:FB,fontSize:13,outline:'none',resize:'vertical',boxSizing:'border-box',lineHeight:1.6}}/>
              <div style={{fontFamily:FB,fontSize:11,color:FAINT,marginTop:6}}>This comment will appear on all {students.length} report cards for this class</div>
            </div>
          )}

          <button onClick={generate} disabled={loading}
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'13px 32px',borderRadius:12,background:loading?S2:`${doc.color}14`,border:`1px solid ${loading?BORDER:doc.color+'50'}`,color:loading?MUTED:doc.color,fontFamily:FB,fontSize:14,fontWeight:700,cursor:loading?'default':'pointer',transition:'all 0.2s'}}>
            {loading?(<><div style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${doc.color}30`,borderTopColor:doc.color,animation:'spin 0.7s linear infinite'}}/>Generating PDF…</>):done?(<><Check size={16}/>Ready to Download</>):(<><FileText size={16}/>Generate PDF</>)}
          </button>
          <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
        </div>

        {/* Preview panel */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,padding:20,height:'fit-content',position:'sticky',top:24}}>
          <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT,marginBottom:16}}>Preview</div>
          {done?(
            <>
              {/* Mock PDF preview */}
              <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:12,padding:'16px 18px',marginBottom:12}}>
                <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:TEXT,marginBottom:4}}>{doc.label}</div>
                <div style={{fontFamily:FB,fontSize:11,color:MUTED}}>{CLASSES.find(c=>c.id===classId)?.label} · {students.length} learner{students.length!==1?'s':''}</div>
                <div style={{fontFamily:FB,fontSize:11,color:FAINT,marginTop:2}}>Term 3 · 2024</div>
                <div style={{marginTop:12,height:120,background:S1,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <FileText size={32} style={{color:doc.color,opacity:0.6}}/>
                </div>
              </div>
              <div style={{fontFamily:FB,fontSize:12,color:'#10B981',marginBottom:14,display:'flex',alignItems:'center',gap:6}}>
                <Check size={13}/> {students.length} page{students.length!==1?'s':''} ready
              </div>
              <button style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px',borderRadius:10,background:`${doc.color}14`,border:`1px solid ${doc.color}40`,color:doc.color,fontFamily:FB,fontSize:13,fontWeight:700,cursor:'pointer',marginBottom:8}}>
                <Download size={14}/> Download PDF
              </button>
              <button style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'10px',borderRadius:10,background:'transparent',border:`1px solid ${BORDER}`,color:MUTED,fontFamily:FB,fontSize:12,cursor:'pointer'}}>
                Print
              </button>
            </>
          ):(
            <div style={{textAlign:'center',padding:'40px 20px',color:FAINT}}>
              <FileText size={32} style={{marginBottom:10,opacity:0.4}}/>
              <div style={{fontFamily:FB,fontSize:12}}>Generate a PDF to see the preview</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
