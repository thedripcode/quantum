'use client';

import { useEffect, useState } from 'react';
import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Cell,LineChart,Line } from 'recharts';
import { Loader2, TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';

const BG='#0C0C0C',S2='#171717',S3='#1E1E1E';
const BORDER='rgba(255,255,255,0.07)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";
const GOLD='#C9A84C',GREEN='#10B981',RED='#EF4444',AMBER='#F59E0B',BLUE='#3B82F6';

const tipStyle={contentStyle:{background:S3,border:'1px solid rgba(255,255,255,0.10)',borderRadius:10,fontSize:12,color:TEXT}};
const axisProps={fill:MUTED,fontSize:11};

interface Mark { studentName:string; studentPortalId:string; grade:string|null; subject:string; subjectCode:string; color:string; score:number; total:number; date:string; term:number; }

function pct(m:Mark){ return (m.score/m.total)*100; }

export default function AnalyticsPage() {
  const [marks, setMarks]   = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade]   = useState<string>('all');

  useEffect(()=>{
    fetch('/api/marks?limit=5000').then(r=>r.json()).then(d=>{
      setMarks(d.marks??[]);
      setLoading(false);
    });
  },[]);

  if(loading){
    return <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><Loader2 size={24} className="animate-spin" style={{color:MUTED}}/></div>;
  }

  const grades=['all',...[...new Set(marks.map(m=>m.grade).filter(Boolean))].sort()] as string[];
  const filtered=grade==='all'?marks:marks.filter(m=>m.grade===grade);

  if(filtered.length===0){
    return(
      <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:'0 0 8px',letterSpacing:'-0.02em'}}>Analytics</h2>
        <p style={{fontSize:13,color:MUTED,margin:'0 0 20px'}}>No marks captured yet. Start by entering marks in the Capture page.</p>
      </div>
    );
  }

  // Grade distribution
  const BANDS=[{label:'0–39',min:0,max:39,color:RED},{label:'40–49',min:40,max:49,color:AMBER},{label:'50–59',min:50,max:59,color:'#F97316'},{label:'60–69',min:60,max:69,color:BLUE},{label:'70–79',min:70,max:79,color:GOLD},{label:'80–100',min:80,max:101,color:GREEN}];
  const studentAvgs: Record<string,number[]>={};
  for(const m of filtered){
    if(!studentAvgs[m.studentPortalId]) studentAvgs[m.studentPortalId]=[];
    studentAvgs[m.studentPortalId].push(pct(m));
  }
  const distData=BANDS.map(b=>{
    const count=Object.values(studentAvgs).filter(avgs=>{
      const a=avgs.reduce((s,v)=>s+v,0)/avgs.length;
      return a>=b.min&&a<b.max;
    }).length;
    return {...b,count};
  });

  // Subject averages
  const bySubject: Record<string,{name:string;color:string;pcts:number[]}> = {};
  for(const m of filtered){
    if(!bySubject[m.subjectCode]) bySubject[m.subjectCode]={name:m.subject,color:m.color,pcts:[]};
    bySubject[m.subjectCode].pcts.push(pct(m));
  }
  const subjectData=Object.entries(bySubject).map(([,s])=>({name:s.name.length>12?s.name.slice(0,12)+'…':s.name,avg:Math.round(s.pcts.reduce((a,b)=>a+b,0)/s.pcts.length),color:s.color})).sort((a,b)=>b.avg-a.avg);

  // Monthly trend
  const byMonth: Record<string,number[]>={};
  for(const m of filtered){
    const month=m.date.slice(0,7);
    if(!byMonth[month]) byMonth[month]=[];
    byMonth[month].push(pct(m));
  }
  const trendData=Object.entries(byMonth).sort(([a],[b])=>a.localeCompare(b)).map(([month,pcts])=>({month,avg:Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length)}));

  // KPIs
  const allAvg=Math.round(filtered.reduce((s,m)=>s+pct(m),0)/filtered.length);
  const passRate=Math.round((filtered.filter(m=>pct(m)>=30).length/filtered.length)*100);
  const distinctStudents=new Set(filtered.map(m=>m.studentPortalId)).size;
  const atRiskCount=Object.values(studentAvgs).filter(avgs=>avgs.reduce((s,v)=>s+v,0)/avgs.length<60).length;

  return(
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
        <div>
          <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:0,letterSpacing:'-0.02em'}}>Analytics</h2>
          <p style={{fontSize:13,color:MUTED,marginTop:4}}>Performance overview based on {filtered.length} captured marks.</p>
        </div>
        <select value={grade} onChange={e=>setGrade(e.target.value)}
          style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:10,color:TEXT,fontFamily:FB,fontSize:13,padding:'10px 16px',outline:'none',cursor:'pointer'}}>
          {grades.map(g=><option key={g} value={g} style={{background:S3}}>{g==='all'?'All Grades':g}</option>)}
        </select>
      </div>

      <div className="portal-stats-grid" style={{marginBottom:24}}>
        {[
          {label:'Overall Average',value:`${allAvg}%`,color:allAvg>=60?GREEN:RED,icon:TrendingUp},
          {label:'Pass Rate',value:`${passRate}%`,color:passRate>=70?GREEN:AMBER,icon:Award},
          {label:'Students',value:distinctStudents,color:TEXT,icon:Users},
          {label:'At Risk',value:atRiskCount,color:atRiskCount>0?AMBER:TEXT,icon:AlertTriangle},
        ].map(({label,value,color,icon:Icon})=>(
          <div key={label} style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:13,padding:'14px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontSize:11,color:MUTED,fontWeight:500}}>{label}</span><Icon size={14} style={{color}}/>
            </div>
            <div style={{fontFamily:FH,fontSize:26,fontWeight:700,color,letterSpacing:'-0.02em'}}>{value}</div>
          </div>
        ))}
      </div>

      <div className="portal-main-grid">
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Grade distribution */}
          <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:16,padding:'18px 20px'}}>
            <h3 style={{fontFamily:FH,fontSize:15,fontWeight:600,color:TEXT,margin:'0 0 16px'}}>Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
                <XAxis dataKey="label" tick={axisProps}/>
                <YAxis tick={axisProps}/>
                <Tooltip {...tipStyle}/>
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {distData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly trend */}
          {trendData.length>1&&(
            <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:16,padding:'18px 20px'}}>
              <h3 style={{fontFamily:FH,fontSize:15,fontWeight:600,color:TEXT,margin:'0 0 16px'}}>Monthly Average Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
                  <XAxis dataKey="month" tick={axisProps}/>
                  <YAxis domain={[0,100]} tick={axisProps}/>
                  <Tooltip {...tipStyle}/>
                  <Line type="monotone" dataKey="avg" stroke={GOLD} strokeWidth={2} dot={{fill:GOLD,r:4}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Subject averages sidebar */}
        <div style={{background:S2,border:`1px solid ${BORDER}`,borderRadius:16,padding:'18px 20px'}}>
          <h3 style={{fontFamily:FH,fontSize:15,fontWeight:600,color:TEXT,margin:'0 0 16px'}}>Average by Subject</h3>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {subjectData.map(s=>(
              <div key={s.name}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontSize:12,color:TEXT,fontWeight:500}}>{s.name}</span>
                  <span style={{fontSize:12,fontWeight:700,color:s.avg>=60?GREEN:RED}}>{s.avg}%</span>
                </div>
                <div style={{height:6,borderRadius:3,background:'rgba(255,255,255,0.05)',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${Math.min(s.avg,100)}%`,borderRadius:3,background:s.avg>=60?GREEN:RED,transition:'width 0.8s ease'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
