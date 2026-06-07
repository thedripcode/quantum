'use client';

import { useState } from 'react';
import {
  BarChart,Bar,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,
  ResponsiveContainer,Cell,
} from 'recharts';
import { STUDENTS, MARKS, ASSESSMENTS, SCHOOL_CLASSES } from '@/lib/teacher/mockData';

const BG='#0C0C0C',S1='#111111',S2='#171717',S3='#1E1E1E';
const BORDER='rgba(255,255,255,0.07)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";
const GOLD='#C9A84C',BLUE='#3B82F6',GREEN='#10B981',RED='#EF4444',PURPLE='#8B5CF6';

const tipStyle={contentStyle:{background:S2,border:'1px solid rgba(255,255,255,0.10)',borderRadius:10,fontSize:12,color:TEXT}};
const axisStyle={fill:'rgba(255,255,255,0.45)',fontSize:11};
const gridStyle={strokeDasharray:'3 3',stroke:'rgba(255,255,255,0.06)'};

const CLASSES = [
  {id:'cls-10b-math',label:'Gr 10B',color:BLUE},
  {id:'cls-11a-math',label:'Gr 11A',color:GOLD},
  {id:'cls-12d-math',label:'Gr 12D',color:GREEN},
];

function classAvgForAssessment(classId:string, assessmentId:string): number|null {
  const marks = MARKS.filter(m=>m.assessmentId===assessmentId&&!m.isAbsent&&m.percentage!==null);
  const students = STUDENTS.filter(s=>s.classId===classId).map(s=>s._id);
  const myMarks = marks.filter(m=>students.includes(m.studentId));
  if(!myMarks.length) return null;
  return Math.round(myMarks.reduce((s,m)=>s+(m.percentage??0),0)/myMarks.length);
}

function gradeDistribution(classId:string) {
  const students = STUDENTS.filter(s=>s.classId===classId);
  const bands = [{label:'0-39',min:0,max:39},{label:'40-49',min:40,max:49},{label:'50-59',min:50,max:59},{label:'60-69',min:60,max:69},{label:'70-79',min:70,max:79},{label:'80-100',min:80,max:100}];
  return bands.map(b=>{
    const count = students.filter(s=>{
      const myMarks=MARKS.filter(m=>m.studentId===s._id&&m.percentage!==null&&!m.isAbsent);
      if(!myMarks.length) return false;
      const avg=myMarks.reduce((sum,m)=>sum+(m.percentage??0),0)/myMarks.length;
      return avg>=b.min&&avg<=b.max;
    }).length;
    return {...b,count};
  });
}

export default function AnalyticsPage() {
  const [classId,setClassId]=useState('cls-10b-math');
  const cls = CLASSES.find(c=>c.id===classId)!;
  const students = STUDENTS.filter(s=>s.classId===classId);
  const classAssessments = ASSESSMENTS.filter(a=>a.classId===classId&&a.conductedDate!==null);

  // Trend line data
  const trendData = classAssessments.map(a=>({
    name: a.title.length>16?a.title.slice(0,16)+'…':a.title,
    avg: classAvgForAssessment(classId,a._id)??0,
    pass: Math.round((MARKS.filter(m=>m.assessmentId===a._id&&(m.percentage??0)>=30&&!m.isAbsent).length/students.length)*100),
  }));

  // Overall per-student averages
  const studentAvgs = students.map(s=>{
    const myMarks=MARKS.filter(m=>m.studentId===s._id&&m.percentage!==null&&!m.isAbsent&&classAssessments.some(a=>a._id===m.assessmentId));
    const avg=myMarks.length?Math.round(myMarks.reduce((sum,m)=>sum+(m.percentage??0),0)/myMarks.length):null;
    return {name:`${s.firstName.slice(0,1)}.${s.lastName}`,avg};
  }).sort((a,b)=>(b.avg??0)-(a.avg??0));

  const dist = gradeDistribution(classId);
  const overallAvg = Math.round(studentAvgs.reduce((s,x)=>s+(x.avg??0),0)/studentAvgs.filter(x=>x.avg!==null).length);
  const passRate = Math.round((studentAvgs.filter(x=>(x.avg??0)>=30).length/students.length)*100);
  const atRisk = studentAvgs.filter(x=>(x.avg??0)<50&&x.avg!==null).length;

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:TEXT,margin:0,letterSpacing:'-0.03em'}}>Performance Analytics</h1>
          <p style={{fontSize:12,color:FAINT,margin:'4px 0 0'}}>Class performance insights and trends</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          {CLASSES.map(c=>(
            <button key={c.id} onClick={()=>setClassId(c.id)}
              style={{padding:'8px 16px',borderRadius:10,background:classId===c.id?`${c.color}18`:'transparent',border:`1px solid ${classId===c.id?c.color:BORDER}`,color:classId===c.id?c.color:MUTED,fontFamily:FB,fontSize:13,fontWeight:classId===c.id?700:400,cursor:'pointer',transition:'all 0.15s'}}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
        {[
          {label:'Class Average',    value:`${overallAvg}%`,  color:GOLD},
          {label:'Pass Rate',        value:`${passRate}%`,    color:GREEN},
          {label:'At Risk (<50%)',   value:atRisk,            color:RED},
          {label:'Students',         value:students.length,   color:BLUE},
        ].map(({label,value,color})=>(
          <div key={label} style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:14,padding:'14px 16px'}}>
            <div style={{fontFamily:FB,fontSize:11,color:MUTED,marginBottom:6}}>{label}</div>
            <div style={{fontFamily:FH,fontSize:28,fontWeight:800,color}}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        {/* Average trend */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:16,padding:'20px 22px'}}>
          <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT,marginBottom:4}}>Class Average — Assessment Trend</div>
          <div style={{fontFamily:FB,fontSize:12,color:MUTED,marginBottom:16}}>Average % per assessment</div>
          <div style={{height:200}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{top:4,right:10,left:0,bottom:4}}>
                <CartesianGrid {...gridStyle}/>
                <XAxis dataKey="name" tick={{...axisStyle,fontSize:10}}/>
                <YAxis domain={[0,100]} tick={axisStyle}/>
                <Tooltip {...tipStyle} formatter={(v:unknown)=>[`${v}%`,'']}/>
                <Line type="monotone" dataKey="avg" stroke={cls.color} strokeWidth={2} dot={{fill:cls.color,r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade distribution */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:16,padding:'20px 22px'}}>
          <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT,marginBottom:4}}>Grade Distribution</div>
          <div style={{fontFamily:FB,fontSize:12,color:MUTED,marginBottom:16}}>Number of learners per band</div>
          <div style={{height:200}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dist} margin={{top:4,right:10,left:0,bottom:4}}>
                <CartesianGrid {...gridStyle}/>
                <XAxis dataKey="label" tick={axisStyle}/>
                <YAxis tick={axisStyle}/>
                <Tooltip {...tipStyle} formatter={(v:unknown)=>[`${v} learners`,'']}/>
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {dist.map((_,i)=><Cell key={i} fill={['#EF4444','#EF4444','#F59E0B','#3B82F6','#10B981','#10B981'][i]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Per-student bar */}
      <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:16,padding:'20px 22px'}}>
        <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:TEXT,marginBottom:4}}>Individual Student Averages</div>
        <div style={{fontFamily:FB,fontSize:12,color:MUTED,marginBottom:16}}>Ranked by performance</div>
        <div style={{height:220}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentAvgs} margin={{top:4,right:10,left:0,bottom:40}}>
              <CartesianGrid {...gridStyle}/>
              <XAxis dataKey="name" tick={{...axisStyle,fontSize:9}} angle={-35} textAnchor="end"/>
              <YAxis domain={[0,100]} tick={axisStyle}/>
              <Tooltip {...tipStyle} formatter={(v:unknown)=>[`${v}%`,'']}/>
              <Bar dataKey="avg" radius={[3,3,0,0]}>
                {studentAvgs.map((s,i)=><Cell key={i} fill={(s.avg??0)>=60?GREEN:(s.avg??0)>=50?BLUE:RED}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
