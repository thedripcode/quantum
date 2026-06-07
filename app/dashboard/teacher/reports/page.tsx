'use client';

import { useState } from 'react';
import { Download, FileText, BarChart2, Users } from 'lucide-react';
import { BarChart,Bar,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer } from 'recharts';
import { STUDENTS, MARKS, ASSESSMENTS, SCHOOL_CLASSES } from '@/lib/teacher/mockData';

const BG='#0C0C0C',S1='#111111',S2='#171717',S3='#1E1E1E';
const BORDER='rgba(255,255,255,0.07)',BORDER2='rgba(255,255,255,0.12)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";
const GOLD='#C9A84C';

const tipStyle={contentStyle:{background:S2,border:'1px solid rgba(255,255,255,0.10)',borderRadius:10,fontSize:12,color:TEXT}};
const axisStyle={fill:'rgba(255,255,255,0.45)',fontSize:11};
const gridStyle={strokeDasharray:'3 3',stroke:'rgba(255,255,255,0.06)'};

const CLASSES=[
  {id:'cls-10b-math',label:'Grade 10B Mathematics'},
  {id:'cls-11a-math',label:'Grade 11A Mathematics'},
  {id:'cls-12d-math',label:'Grade 12D Mathematics'},
];

export default function ReportsPage() {
  const [classId,setClassId]=useState('cls-10b-math');
  const [generated,setGenerated]=useState(false);
  const [loading,setLoading]=useState(false);

  const cls=CLASSES.find(c=>c.id===classId)!;
  const students=STUDENTS.filter(s=>s.classId===classId);
  const assessments=ASSESSMENTS.filter(a=>a.classId===classId&&a.conductedDate!==null);

  const trendData=assessments.map(a=>{
    const marks=MARKS.filter(m=>m.assessmentId===a._id&&m.percentage!==null&&!m.isAbsent);
    const avg=marks.length?Math.round(marks.reduce((s,m)=>s+(m.percentage??0),0)/marks.length):0;
    const pass=Math.round((marks.filter(m=>(m.percentage??0)>=30).length/students.length)*100);
    return {name:a.title.slice(0,12)+'…',avg,pass};
  });

  const allMarks=MARKS.filter(m=>students.some(s=>s._id===m.studentId)&&m.percentage!==null&&!m.isAbsent);
  const classAvg=allMarks.length?Math.round(allMarks.reduce((s,m)=>s+(m.percentage??0),0)/allMarks.length):0;
  const passRate=students.length?Math.round((students.filter(s=>{
    const sm=MARKS.filter(m=>m.studentId===s._id&&m.percentage!==null&&!m.isAbsent);
    const avg=sm.length?sm.reduce((s,m)=>s+(m.percentage??0),0)/sm.length:0;
    return avg>=30;
  }).length/students.length)*100):0;
  const atRisk=students.filter(s=>{
    const sm=MARKS.filter(m=>m.studentId===s._id&&m.percentage!==null&&!m.isAbsent);
    const avg=sm.length?sm.reduce((s,m)=>s+(m.percentage??0),0)/sm.length:100;
    return avg<50;
  }).length;

  const generate=()=>{setLoading(true);setTimeout(()=>{setLoading(false);setGenerated(true);},1500);};

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:TEXT,margin:0,letterSpacing:'-0.03em'}}>Term Reports</h1>
          <p style={{fontSize:12,color:FAINT,margin:'4px 0 0'}}>Generate and download class performance reports</p>
        </div>
        {generated&&(
          <div style={{display:'flex',gap:8}}>
            <button style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:10,background:'rgba(201,168,76,0.10)',border:'1px solid rgba(201,168,76,0.25)',color:GOLD,fontFamily:FB,fontSize:12,fontWeight:600,cursor:'pointer'}}>
              <Download size={13}/> Download PDF
            </button>
            <button style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:10,background:'rgba(59,130,246,0.10)',border:'1px solid rgba(59,130,246,0.25)',color:'#3B82F6',fontFamily:FB,fontSize:12,fontWeight:600,cursor:'pointer'}}>
              <Download size={13}/> Export Excel
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,marginBottom:24,alignItems:'end'}}>
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:14,padding:'14px 16px'}}>
          <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Class</div>
          <select value={classId} onChange={e=>{setClassId(e.target.value);setGenerated(false);}}
            style={{background:'transparent',border:'none',outline:'none',color:TEXT,fontFamily:FH,fontSize:15,fontWeight:700,cursor:'pointer',width:'100%'}}>
            {CLASSES.map(c=><option key={c.id} value={c.id} style={{background:S2}}>{c.label}</option>)}
          </select>
        </div>
        <button onClick={generate} disabled={loading}
          style={{padding:'14px 28px',borderRadius:12,background:loading?S2:'rgba(201,168,76,0.12)',border:`1px solid ${loading?BORDER:'rgba(201,168,76,0.30)'}`,color:loading?MUTED:GOLD,fontFamily:FB,fontSize:13,fontWeight:700,cursor:loading?'default':'pointer',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>
          {loading?(<><div style={{width:14,height:14,borderRadius:'50%',border:'2px solid rgba(201,168,76,0.30)',borderTopColor:GOLD,animation:'spin 0.7s linear infinite'}}/>Generating…</>):(<><FileText size={14}/>Generate Report</>)}
        </button>
      </div>

      {generated&&(
        <>
          {/* KPIs */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
            {[
              {label:'Class Average',value:`${classAvg}%`,    color:GOLD},
              {label:'Pass Rate',    value:`${passRate}%`,    color:'#10B981'},
              {label:'At Risk',      value:atRisk,            color:'#EF4444'},
              {label:'Assessments',  value:assessments.length,color:'#3B82F6'},
            ].map(({label,value,color})=>(
              <div key={label} style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:14,padding:'14px 16px'}}>
                <div style={{fontFamily:FB,fontSize:11,color:MUTED,marginBottom:6}}>{label}</div>
                <div style={{fontFamily:FH,fontSize:28,fontWeight:800,color}}>{value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
            <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:16,padding:'20px 22px'}}>
              <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT,marginBottom:16}}>Average per Assessment</div>
              <div style={{height:180}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{top:4,right:10,left:0,bottom:4}}>
                    <CartesianGrid {...gridStyle}/><XAxis dataKey="name" tick={{...axisStyle,fontSize:9}}/><YAxis domain={[0,100]} tick={axisStyle}/>
                    <Tooltip {...tipStyle} formatter={(v:unknown)=>[`${v}%`,'']}/>
                    <Bar dataKey="avg" fill={GOLD} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:16,padding:'20px 22px'}}>
              <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT,marginBottom:16}}>Pass Rate Trend</div>
              <div style={{height:180}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{top:4,right:10,left:0,bottom:4}}>
                    <CartesianGrid {...gridStyle}/><XAxis dataKey="name" tick={{...axisStyle,fontSize:9}}/><YAxis domain={[0,100]} tick={axisStyle}/>
                    <Tooltip {...tipStyle} formatter={(v:unknown)=>[`${v}%`,'']}/>
                    <Line type="monotone" dataKey="pass" stroke="#10B981" strokeWidth={2} dot={{fill:'#10B981',r:3}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Student table */}
          <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden'}}>
            <div style={{padding:'13px 20px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:8}}>
              <Users size={14} style={{color:MUTED}}/><span style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT}}>{cls.label} — Learner Results</span>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${BORDER}`}}>
                    <th style={{padding:'10px 20px',textAlign:'left',fontFamily:FB,fontSize:11,fontWeight:600,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em'}}>Student</th>
                    {assessments.map(a=><th key={a._id} style={{padding:'10px 12px',textAlign:'center',fontFamily:FB,fontSize:10,fontWeight:600,color:FAINT,whiteSpace:'nowrap'}}>{a.title.slice(0,10)}</th>)}
                    <th style={{padding:'10px 20px',textAlign:'center',fontFamily:FB,fontSize:11,fontWeight:600,color:FAINT}}>Average</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s,i)=>{
                    const myMarks=assessments.map(a=>MARKS.find(m=>m.assessmentId===a._id&&m.studentId===s._id));
                    const valid=myMarks.filter(m=>m&&m.percentage!==null&&!m.isAbsent);
                    const avg=valid.length?Math.round(valid.reduce((sum,m)=>sum+(m?.percentage??0),0)/valid.length):null;
                    const risk=avg!==null&&avg<50;
                    return (
                      <tr key={s._id} style={{borderTop:i>0?`1px solid rgba(255,255,255,0.04)`:'none',background:risk?'rgba(239,68,68,0.03)':'transparent'}}>
                        <td style={{padding:'10px 20px'}}>
                          <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:risk?'#EF4444':TEXT}}>{s.firstName} {s.lastName}</div>
                          <div style={{fontFamily:FB,fontSize:10,color:FAINT}}>{s.studentNumber}</div>
                        </td>
                        {myMarks.map((m,mi)=>(
                          <td key={mi} style={{padding:'10px 12px',textAlign:'center',fontFamily:FB,fontSize:13,color:!m?FAINT:m.isAbsent?'#F59E0B':m.percentage===null?FAINT:(m.percentage??0)>=30?MUTED:'#EF4444'}}>
                            {!m?'—':m.isAbsent?'ABS':m.percentage===null?'—':`${m.percentage}%`}
                          </td>
                        ))}
                        <td style={{padding:'10px 20px',textAlign:'center',fontFamily:FH,fontSize:15,fontWeight:800,color:avg===null?FAINT:avg>=60?'#10B981':avg>=50?'#F59E0B':'#EF4444'}}>
                          {avg===null?'—':`${avg}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {!generated&&!loading&&(
        <div style={{textAlign:'center',padding:'60px 0',color:FAINT,border:`1px dashed ${BORDER}`,borderRadius:16}}>
          <BarChart2 size={40} style={{marginBottom:12,opacity:0.4}}/>
          <div style={{fontFamily:FH,fontSize:16,fontWeight:700,color:MUTED,marginBottom:6}}>Select a class and generate</div>
          <div style={{fontFamily:FB,fontSize:13}}>Your report will appear here</div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
