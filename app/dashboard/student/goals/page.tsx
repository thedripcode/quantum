'use client';

import { useCallback, useEffect, useState } from 'react';
import { Target, TrendingUp, CheckCircle2, AlertTriangle, Save, Loader2 } from 'lucide-react';

const BG='#081420',SURFACE='#0E1E30',S2='#14283E';
const GOLD='#60a5fa',GOLD_DIM='rgba(96,165,250,0.10)',GOLD_B='rgba(96,165,250,0.22)';
const BORDER='rgba(255,255,255,0.07)',TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const GREEN='#10B981',RED='#EF4444',AMBER='#F59E0B';
const FH="'Roboto Condensed', sans-serif",FB="'Inter', sans-serif";

interface GoalEntry { subjectId:string; subjectCode:string; subjectName:string; subjectShort:string; color:string; targetMark:number; note:string|null; goalId:string|null; currentAvg:number|null; }

export default function GoalsPage() {
  const [goals, setGoals]   = useState<GoalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string|null>(null);
  const [toast, setToast]     = useState('');
  const [edits, setEdits]     = useState<Record<string,{target:number;note:string}>>({});

  const flash=(m:string)=>{ setToast(m); setTimeout(()=>setToast(''),4000); };

  const load = useCallback(()=>{
    fetch('/api/goals').then(r=>r.json()).then(d=>{
      const g:GoalEntry[]=d.goals??[];
      setGoals(g);
      const e:Record<string,{target:number;note:string}>={};
      for(const g2 of g) e[g2.subjectId]={target:g2.targetMark,note:g2.note??''};
      setEdits(e);
      setLoading(false);
    });
  },[]);

  useEffect(()=>{ load(); },[load]);

  const save = async (subjectId:string) => {
    const ed=edits[subjectId];
    if(!ed) return;
    setSaving(subjectId);
    const res=await fetch('/api/goals',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subjectId,targetMark:ed.target,note:ed.note||null})});
    setSaving(null);
    if(res.ok){ flash('✓ Goal saved.'); load(); }
    else flash('Could not save goal.');
  };

  if(loading){
    return <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><Loader2 size={24} className="animate-spin" style={{color:MUTED}}/></div>;
  }

  if(goals.length===0){
    return(
      <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:'0 0 8px',letterSpacing:'-0.02em'}}>Goals</h2>
        <p style={{fontSize:13,color:MUTED}}>You are not enrolled in any subjects yet. Goals will appear here once subjects are assigned.</p>
      </div>
    );
  }

  const achieved=goals.filter(g=>g.currentAvg!==null&&g.currentAvg>=(edits[g.subjectId]?.target??g.targetMark)).length;
  const onTrack=goals.filter(g=>g.currentAvg!==null&&g.currentAvg>=(edits[g.subjectId]?.target??g.targetMark)*0.9&&g.currentAvg<(edits[g.subjectId]?.target??g.targetMark)).length;
  const needsWork=goals.filter(g=>g.currentAvg!==null&&g.currentAvg<(edits[g.subjectId]?.target??g.targetMark)*0.9).length;

  return(
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:0,letterSpacing:'-0.02em'}}>Academic Goals</h2>
        <p style={{fontSize:13,color:MUTED,marginTop:4}}>Set target marks and track your progress per subject.</p>
      </div>

      {toast&&<div style={{marginBottom:16,padding:'11px 16px',borderRadius:10,background:toast.startsWith('✓')?'rgba(16,185,129,0.10)':'rgba(245,158,11,0.10)',border:`1px solid ${toast.startsWith('✓')?'rgba(16,185,129,0.30)':'rgba(245,158,11,0.30)'}`,fontSize:13,color:toast.startsWith('✓')?GREEN:AMBER}}>{toast}</div>}

      <div className="portal-stats-grid" style={{marginBottom:24}}>
        {[
          {label:'Achieved',value:achieved,color:GREEN,icon:CheckCircle2},
          {label:'On Track',value:onTrack,  color:GOLD,  icon:TrendingUp},
          {label:'Needs Work',value:needsWork,color:RED,icon:AlertTriangle},
          {label:'Total Subjects',value:goals.length,color:TEXT,icon:Target},
        ].map(({label,value,color,icon:Icon})=>(
          <div key={label} style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:13,padding:'14px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontSize:11,color:MUTED,fontWeight:500}}>{label}</span><Icon size={14} style={{color}}/>
            </div>
            <div style={{fontFamily:FH,fontSize:26,fontWeight:700,color:value>0?color:TEXT,letterSpacing:'-0.02em'}}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {goals.map(g=>{
          const ed=edits[g.subjectId]??{target:g.targetMark,note:g.note??''};
          const target=ed.target;
          const current=g.currentAvg;
          const pct=current!==null?Math.round((current/target)*100):null;
          const achieved=current!==null&&current>=target;
          const barColor=current===null?'rgba(255,255,255,0.10)':achieved?GREEN:current>=target*0.9?GOLD:current>=target*0.7?AMBER:RED;
          return(
            <div key={g.subjectId} style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:16,padding:'18px 20px'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:14}}>
                <div style={{width:4,height:44,borderRadius:2,background:g.color,flexShrink:0,marginTop:2}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:TEXT}}>{g.subjectName}</div>
                  <div style={{fontSize:11,color:MUTED,marginTop:1}}>{g.subjectShort}</div>
                </div>
                {current!==null&&(
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:11,color:MUTED}}>Current</div>
                    <div style={{fontFamily:FH,fontSize:22,fontWeight:700,color:barColor,letterSpacing:'-0.02em'}}>{Math.round(current)}%</div>
                  </div>
                )}
              </div>

              {current!==null&&(
                <div style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:11,color:MUTED}}>Progress to goal</span>
                    <span style={{fontSize:11,fontWeight:600,color:barColor}}>{Math.min(pct!,100)}%</span>
                  </div>
                  <div style={{height:8,borderRadius:4,background:'rgba(255,255,255,0.05)',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${Math.min(pct!,100)}%`,borderRadius:4,background:barColor,transition:'width 0.8s ease'}}/>
                  </div>
                  {achieved&&<div style={{fontSize:11,color:GREEN,marginTop:5,fontWeight:600}}>✓ Goal achieved!</div>}
                </div>
              )}
              {current===null&&(
                <div style={{fontSize:12,color:FAINT,marginBottom:14}}>No marks captured yet — your progress appears once assessments are entered.</div>
              )}

              <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:140}}>
                  <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.06em',marginBottom:4}}>TARGET MARK (%)</div>
                  <input type="number" min={0} max={100} value={ed.target}
                    onChange={e=>setEdits(p=>({...p,[g.subjectId]:{...ed,target:Number(e.target.value)}}))}
                    style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:9,color:TEXT,fontFamily:FB,fontSize:14,fontWeight:700,padding:'8px 12px',outline:'none',width:'100%',boxSizing:'border-box'}}/>
                </div>
                <div style={{flex:2,minWidth:200}}>
                  <div style={{fontSize:10,color:FAINT,fontWeight:600,letterSpacing:'0.06em',marginBottom:4}}>NOTE (optional)</div>
                  <input value={ed.note} onChange={e=>setEdits(p=>({...p,[g.subjectId]:{...ed,note:e.target.value}}))}
                    placeholder="e.g. Focus on algebra"
                    style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:9,color:TEXT,fontFamily:FB,fontSize:13,padding:'8px 12px',outline:'none',width:'100%',boxSizing:'border-box'}}/>
                </div>
                <button onClick={()=>save(g.subjectId)} disabled={saving===g.subjectId}
                  style={{display:'flex',alignItems:'center',gap:6,padding:'9px 16px',borderRadius:9,background:GOLD,border:'none',color:'#000',fontFamily:FH,fontSize:12,fontWeight:700,cursor:saving===g.subjectId?'default':'pointer',opacity:saving===g.subjectId?0.6:1,marginTop:16,flexShrink:0}}>
                  {saving===g.subjectId?<Loader2 size={12} className="animate-spin"/>:<Save size={12}/>}Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
