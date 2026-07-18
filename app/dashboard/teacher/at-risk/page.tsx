'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingDown, Loader2, Users } from 'lucide-react';

const BG='#081420',S2='#0F2032',S3='#14283E';
const BORDER='rgba(255,255,255,0.07)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Roboto Condensed', sans-serif",FB="'Inter', sans-serif";
const RED='#EF4444',AMBER='#F59E0B',INDIGO='#6366F1';

type RiskBand='critical'|'high'|'moderate';
const BAND_CFG: Record<RiskBand,{label:string;color:string;bg:string;range:string}> = {
  critical:{label:'Critical', color:RED,   bg:'rgba(239,68,68,0.10)',   range:'< 40%'},
  high:    {label:'High Risk',color:AMBER, bg:'rgba(245,158,11,0.10)',  range:'40–49%'},
  moderate:{label:'Moderate', color:INDIGO,bg:'rgba(99,102,241,0.10)', range:'50–59%'},
};

interface Mark { studentName:string; studentPortalId:string; grade:string|null; subject:string; score:number; total:number; date:string; }
interface RiskStudent { name:string; portalId:string; grade:string; average:number; band:RiskBand; subjectCount:number; lowestSubject:string; lowestAvg:number; }

function computeAtRisk(marks:Mark[]): RiskStudent[] {
  const byStudent: Record<string,{name:string;grade:string;bySubject:Record<string,number[]>}> = {};
  for(const m of marks){
    if(!byStudent[m.studentPortalId]) byStudent[m.studentPortalId]={name:m.studentName,grade:m.grade??'',bySubject:{}};
    if(!byStudent[m.studentPortalId].bySubject[m.subject]) byStudent[m.studentPortalId].bySubject[m.subject]=[];
    byStudent[m.studentPortalId].bySubject[m.subject].push((m.score/m.total)*100);
  }
  const result: RiskStudent[]=[];
  for(const [portalId,data] of Object.entries(byStudent)){
    const subjectAvgs=Object.entries(data.bySubject).map(([sub,pcts])=>({sub,avg:Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length)}));
    if(!subjectAvgs.length) continue;
    const overall=Math.round(subjectAvgs.reduce((a,s)=>a+s.avg,0)/subjectAvgs.length);
    if(overall>=60) continue;
    const band:RiskBand=overall<40?'critical':overall<50?'high':'moderate';
    const lowest=subjectAvgs.sort((a,b)=>a.avg-b.avg)[0];
    result.push({name:data.name,portalId,grade:data.grade,average:overall,band,subjectCount:subjectAvgs.length,lowestSubject:lowest.sub,lowestAvg:lowest.avg});
  }
  return result.sort((a,b)=>a.average-b.average);
}

export default function AtRiskPage() {
  const [marks, setMarks]       = useState<Mark[]>([]);
  const [loading, setLoading]   = useState(true);
  const [band, setBand]         = useState<RiskBand|'all'>('all');
  const [selected, setSelected] = useState<RiskStudent|null>(null);

  useEffect(()=>{
    fetch('/api/marks?limit=5000').then(r=>r.json()).then(d=>{
      setMarks(d.marks??[]);
      setLoading(false);
    });
  },[]);

  if(loading){
    return <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><Loader2 size={24} className="animate-spin" style={{color:MUTED}}/></div>;
  }

  const ALL_RISK=computeAtRisk(marks);
  const filtered=band==='all'?ALL_RISK:ALL_RISK.filter(r=>r.band===band);
  const counts={all:ALL_RISK.length,critical:ALL_RISK.filter(r=>r.band==='critical').length,high:ALL_RISK.filter(r=>r.band==='high').length,moderate:ALL_RISK.filter(r=>r.band==='moderate').length};

  return(
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:0,letterSpacing:'-0.02em'}}>At-Risk Students</h2>
        <p style={{fontSize:13,color:MUTED,marginTop:4}}>Students averaging below 60% across their subjects.</p>
      </div>

      {ALL_RISK.length===0?(
        <div style={{background:'#0F2032',border:`1px solid ${BORDER}`,borderRadius:16,padding:60,textAlign:'center'}}>
          <Users size={36} style={{color:MUTED,marginBottom:12,opacity:0.5}}/>
          <div style={{fontSize:15,fontWeight:600,color:TEXT}}>No at-risk students</div>
          <div style={{fontSize:13,color:MUTED,marginTop:4}}>{marks.length===0?'No marks captured yet.':'All students are performing above 60%.'}</div>
        </div>
      ):(
        <>
          <div className="portal-stats-grid" style={{marginBottom:20}}>
            {(Object.entries(BAND_CFG) as [RiskBand,typeof BAND_CFG[RiskBand]][]).map(([key,cfg])=>(
              <div key={key} style={{background:S2,border:`1px solid ${band===key?cfg.color+'40':BORDER}`,borderRadius:13,padding:'14px 16px',cursor:'pointer'}} onClick={()=>setBand(b=>b===key?'all':key)}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontSize:11,color:MUTED,fontWeight:500}}>{cfg.label}</span>
                  <span style={{fontSize:10,color:cfg.color,fontWeight:600}}>{cfg.range}</span>
                </div>
                <div style={{fontFamily:FH,fontSize:26,fontWeight:700,color:counts[key]>0?cfg.color:TEXT,letterSpacing:'-0.02em'}}>{counts[key]}</div>
              </div>
            ))}
          </div>

          <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 110px 100px',gap:12,padding:'11px 20px',borderBottom:`1px solid ${BORDER}`}}>
              {['Student','Grade','Average','Lowest Subject','Band'].map(h=>(
                <div key={h} style={{fontSize:10,fontWeight:700,color:FAINT,letterSpacing:'0.08em',textTransform:'uppercase'}}>{h}</div>
              ))}
            </div>
            {filtered.map((r,i)=>{
              const cfg=BAND_CFG[r.band];
              return(
                <div key={r.portalId} onClick={()=>setSelected(s=>s?.portalId===r.portalId?null:r)}
                  style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 110px 100px',gap:12,padding:'13px 20px',borderBottom:i<filtered.length-1?`1px solid ${BORDER}`:'none',cursor:'pointer',background:selected?.portalId===r.portalId?S3:'transparent'}}
                  onMouseEnter={e=>{if(selected?.portalId!==r.portalId)e.currentTarget.style.background=S3}}
                  onMouseLeave={e=>{if(selected?.portalId!==r.portalId)e.currentTarget.style.background='transparent'}}>
                  <div>
                    <div style={{fontSize:13.5,fontWeight:600,color:TEXT}}>{r.name}</div>
                    <div style={{fontSize:11,color:FAINT,marginTop:1}}>{r.portalId}</div>
                  </div>
                  <div style={{fontSize:13,color:MUTED,alignSelf:'center'}}>{r.grade}</div>
                  <div style={{fontSize:14,fontWeight:700,color:cfg.color,alignSelf:'center'}}>{r.average}%</div>
                  <div style={{alignSelf:'center'}}>
                    <div style={{fontSize:12,color:TEXT}}>{r.lowestSubject}</div>
                    <div style={{fontSize:11,color:RED}}>{r.lowestAvg}%</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:20,background:cfg.bg,width:'fit-content',alignSelf:'center'}}>
                    <AlertTriangle size={10} style={{color:cfg.color}}/>
                    <span style={{fontSize:11,fontWeight:600,color:cfg.color}}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
