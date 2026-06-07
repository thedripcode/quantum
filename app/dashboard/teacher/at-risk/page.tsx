'use client';

import { useState } from 'react';
import { AlertTriangle, Phone, Mail, TrendingDown, ChevronDown, FileText } from 'lucide-react';
import { STUDENTS, MARKS, ASSESSMENTS } from '@/lib/teacher/mockData';

const BG='#0C0C0C',S1='#111111',S2='#171717',S3='#1E1E1E';
const BORDER='rgba(255,255,255,0.07)',BORDER2='rgba(255,255,255,0.12)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";
const RED='#EF4444',AMBER='#F59E0B',GREEN='#10B981';

type RiskBand = 'critical'|'high'|'moderate';

interface RiskStudent {
  student: typeof STUDENTS[0];
  average: number;
  lowestMark: number;
  lowestAssessment: string;
  band: RiskBand;
  trend: 'declining'|'stable';
}

function computeAtRisk(): RiskStudent[] {
  const result: RiskStudent[] = [];
  for(const student of STUDENTS){
    const myMarks = MARKS.filter(m=>m.studentId===student._id && m.percentage!==null && !m.isAbsent);
    if(myMarks.length===0) continue;
    const avg = Math.round(myMarks.reduce((s,m)=>s+(m.percentage??0),0)/myMarks.length);
    if(avg>=60) continue;
    const sorted = [...myMarks].sort((a,b)=>(a.percentage??0)-(b.percentage??0));
    const lowest = sorted[0];
    const assessment = ASSESSMENTS.find(a=>a._id===lowest.assessmentId);
    const band: RiskBand = avg<40?'critical':avg<50?'high':'moderate';
    result.push({
      student, average:avg,
      lowestMark: lowest.percentage??0,
      lowestAssessment: assessment?.title??'Unknown',
      band,
      trend: myMarks.length>=2 && (myMarks[myMarks.length-1].percentage??0)<(myMarks[0].percentage??0) ? 'declining':'stable',
    });
  }
  return result.sort((a,b)=>a.average-b.average);
}

const ALL_RISK = computeAtRisk();

const BAND_CFG: Record<RiskBand,{label:string;color:string;bg:string}> = {
  critical: {label:'Critical',  color:RED,   bg:'rgba(239,68,68,0.10)'},
  high:     {label:'High Risk', color:AMBER, bg:'rgba(245,158,11,0.10)'},
  moderate: {label:'Moderate',  color:'#6366F1', bg:'rgba(99,102,241,0.10)'},
};

export default function AtRiskPage() {
  const [band, setBand] = useState<RiskBand|'all'>('all');
  const [selected, setSelected] = useState<RiskStudent|null>(null);
  const [note, setNote] = useState('');

  const filtered = band==='all' ? ALL_RISK : ALL_RISK.filter(r=>r.band===band);
  const critCount = ALL_RISK.filter(r=>r.band==='critical').length;
  const highCount = ALL_RISK.filter(r=>r.band==='high').length;
  const modCount  = ALL_RISK.filter(r=>r.band==='moderate').length;

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:TEXT,margin:0,letterSpacing:'-0.03em'}}>At-Risk Learners</h1>
        <p style={{fontSize:12,color:FAINT,margin:'4px 0 0'}}>Students requiring immediate academic intervention</p>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {[
          {label:'Total At-Risk',  value:ALL_RISK.length,  color:TEXT},
          {label:'Critical (<40%)',value:critCount,         color:RED},
          {label:'High Risk (<50%)',value:highCount,        color:AMBER},
          {label:'Moderate (<60%)',value:modCount,          color:'#6366F1'},
        ].map(({label,value,color})=>(
          <div key={label} style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:14,padding:'14px 16px'}}>
            <div style={{fontFamily:FB,fontSize:11,color:MUTED,marginBottom:6}}>{label}</div>
            <div style={{fontFamily:FH,fontSize:28,fontWeight:800,color}}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {(['all','critical','high','moderate'] as const).map(b=>(
          <button key={b} onClick={()=>setBand(b)}
            style={{padding:'7px 16px',borderRadius:9,background:band===b?'rgba(255,255,255,0.10)':'transparent',border:`1px solid ${band===b?BORDER2:BORDER}`,color:band===b?TEXT:MUTED,fontFamily:FB,fontSize:12,fontWeight:band===b?600:400,cursor:'pointer',textTransform:'capitalize'}}>
            {b==='all'?'All At-Risk':BAND_CFG[b].label}
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:selected?'1fr 360px':'1fr',gap:16}}>
        {/* List */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,overflow:'hidden'}}>
          <div style={{padding:'13px 20px',borderBottom:`1px solid ${BORDER}`,fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT}}>
            {filtered.length} learner{filtered.length!==1?'s':''} {band!=='all'?`· ${BAND_CFG[band].label}`:''}
          </div>
          {filtered.length===0 ? (
            <div style={{textAlign:'center',padding:'40px',color:FAINT,fontFamily:FB,fontSize:13}}>No learners in this category</div>
          ) : filtered.map((r,i)=>{
            const cfg=BAND_CFG[r.band];
            const isSelected=selected?.student._id===r.student._id;
            return (
              <div key={r.student._id}
                onClick={()=>setSelected(isSelected?null:r)}
                style={{display:'flex',alignItems:'center',gap:14,padding:'14px 20px',borderTop:i>0?`1px solid rgba(255,255,255,0.04)`:'none',cursor:'pointer',background:isSelected?'rgba(255,255,255,0.04)':'transparent',transition:'background 0.15s'}}
                onMouseEnter={e=>{if(!isSelected)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.03)';}}
                onMouseLeave={e=>{if(!isSelected)(e.currentTarget as HTMLElement).style.background='transparent';}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:`${cfg.color}18`,border:`1px solid ${cfg.color}33`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FB,fontSize:11,fontWeight:700,color:cfg.color,flexShrink:0}}>
                  {r.student.avatarInitials}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                    <span style={{fontFamily:FB,fontSize:13,fontWeight:600,color:TEXT}}>{r.student.firstName} {r.student.lastName}</span>
                    <span style={{fontFamily:FB,fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',padding:'2px 7px',borderRadius:5,background:cfg.bg,color:cfg.color}}>{cfg.label}</span>
                    {r.trend==='declining' && <TrendingDown size={12} style={{color:RED}}/>}
                  </div>
                  <div style={{fontFamily:FB,fontSize:11,color:FAINT}}>
                    Grade {r.student.grade}{r.student.classCode} · Avg: <span style={{color:cfg.color,fontWeight:600}}>{r.average}%</span> · Lowest: {r.lowestMark}% in {r.lowestAssessment}
                  </div>
                </div>
                <div style={{fontFamily:FH,fontSize:22,fontWeight:800,color:cfg.color,flexShrink:0}}>{r.average}%</div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,padding:20,height:'fit-content',position:'sticky',top:24}}>
            <div style={{fontFamily:FH,fontSize:16,fontWeight:700,color:TEXT,marginBottom:4}}>{selected.student.firstName} {selected.student.lastName}</div>
            <div style={{fontFamily:FB,fontSize:12,color:MUTED,marginBottom:18}}>{selected.student.studentNumber} · Grade {selected.student.grade}{selected.student.classCode}</div>

            {/* Mini stats */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
              {[
                {label:'Current Average',value:`${selected.average}%`,color:BAND_CFG[selected.band].color},
                {label:'Lowest Mark',value:`${selected.lowestMark}%`,color:RED},
                {label:'Risk Level',value:BAND_CFG[selected.band].label,color:BAND_CFG[selected.band].color},
                {label:'Trend',value:selected.trend==='declining'?'Declining':'Stable',color:selected.trend==='declining'?RED:GREEN},
              ].map(({label,value,color})=>(
                <div key={label} style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:12,padding:'12px 14px'}}>
                  <div style={{fontFamily:FB,fontSize:10,color:FAINT,marginBottom:4}}>{label}</div>
                  <div style={{fontFamily:FH,fontSize:15,fontWeight:700,color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div style={{marginBottom:14}}>
              <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>Parent Contact</div>
              <div style={{display:'flex',gap:8}}>
                <a href={`tel:${selected.student.parentPhone}`}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'9px',borderRadius:10,background:'rgba(16,185,129,0.10)',border:'1px solid rgba(16,185,129,0.25)',color:GREEN,fontFamily:FB,fontSize:12,fontWeight:600,textDecoration:'none'}}>
                  <Phone size={13}/> Call Parent
                </a>
                <a href={`mailto:${selected.student.parentEmail}`}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'9px',borderRadius:10,background:'rgba(59,130,246,0.10)',border:'1px solid rgba(59,130,246,0.25)',color:'#3B82F6',fontFamily:FB,fontSize:12,fontWeight:600,textDecoration:'none'}}>
                  <Mail size={13}/> Email
                </a>
              </div>
            </div>

            {/* Intervention note */}
            <div style={{marginBottom:14}}>
              <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Intervention Note</div>
              <textarea value={note} onChange={e=>setNote(e.target.value)}
                placeholder="Record intervention steps, parent discussions, support given…"
                rows={3} style={{width:'100%',background:S2,border:`1px solid ${BORDER}`,borderRadius:10,padding:'10px 12px',color:TEXT,fontFamily:FB,fontSize:12,outline:'none',resize:'vertical',boxSizing:'border-box',lineHeight:1.6}}/>
            </div>
            <button style={{width:'100%',padding:'10px',borderRadius:10,background:'rgba(255,255,255,0.06)',border:`1px solid ${BORDER}`,color:TEXT,fontFamily:FB,fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
              <FileText size={13}/> Save Note & Flag for HOD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
