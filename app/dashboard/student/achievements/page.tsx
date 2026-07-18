'use client';

import { useMemo } from 'react';
import { Star, Lock, Zap, BookOpen, Award, TrendingUp, Shield, Target } from 'lucide-react';
import { useStudentData } from '@/lib/useStudentData';

const BG='#081420',SURFACE='#0E1E30',S2='#14283E';
const GOLD='#60a5fa',GOLD_DIM='rgba(96,165,250,0.10)',GOLD_B='rgba(96,165,250,0.25)';
const BORDER='rgba(255,255,255,0.07)',TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const GREEN='#10B981',BLUE='#3B82F6',PURPLE='#8B5CF6',RED='#EF4444',AMBER='#F59E0B';
const FH="'Roboto Condensed', sans-serif",FB="'Inter', sans-serif";

const RARITY_CONFIG={
  common:   {label:'Common',   color:'#9CA3AF',glow:'rgba(156,163,175,0.15)'},
  rare:     {label:'Rare',     color:BLUE,      glow:'rgba(59,130,246,0.20)'},
  epic:     {label:'Epic',     color:PURPLE,    glow:'rgba(139,92,246,0.22)'},
  legendary:{label:'Legendary',color:GOLD,      glow:'rgba(96,165,250,0.25)'},
};

interface Achievement { id:string; title:string; description:string; category:string; rarity:keyof typeof RARITY_CONFIG; unlocked:boolean; icon:React.ElementType; }

const CAT_COLORS:Record<string,string>={Academic:BLUE,Attendance:GREEN,Dedication:PURPLE,Excellence:GOLD,Resilience:AMBER};

function computeAchievements(data: ReturnType<typeof useStudentData>['data']): Achievement[] {
  // Flatten all marks from all subjects
  const allMarks = data.subjects.flatMap(s => s.marks);
  const att = data.attendanceRecords;
  // subject averages already computed in data.subjects
  const subjectAvgs = data.subjects.map(s => s.currentMark);

  const allPcts = allMarks.map(m => m.percentage);
  const overallAvg = allPcts.length ? Math.round(allPcts.reduce((a: number, b: number) => a + b, 0) / allPcts.length) : null;

  const presentDays = att.filter(r => r.status === 'present').length;
  const totalDays = att.length;
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : null;

  const has100 = allMarks.some(m => m.percentage >= 100);
  const has90  = allMarks.some(m => m.percentage >= 90);
  const hasSubjectHonour = data.subjects.some(s => s.currentMark >= 80);
  const allPassing = data.subjects.length > 0 && data.subjects.every(s => s.currentMark >= 50);
  const has5Marks = allMarks.length >= 5;
  const has10Marks = allMarks.length >= 10;
  const hasConsistentB = data.subjects.some(s => s.marks.length >= 3 && s.marks.every(m => m.percentage >= 70));

  return [
    { id:'first_mark', title:'First Assessment', description:'Received your first mark on the portal', category:'Academic', rarity:'common', unlocked:allMarks.length>0, icon:BookOpen },
    { id:'five_marks', title:'Getting Going', description:'Completed 5 or more assessments', category:'Dedication', rarity:'common', unlocked:has5Marks, icon:Shield },
    { id:'ten_marks', title:'Committed Learner', description:'Completed 10 or more assessments', category:'Dedication', rarity:'rare', unlocked:has10Marks, icon:Zap },
    { id:'score_90', title:'High Achiever', description:'Scored 90% or above on an assessment', category:'Academic', rarity:'rare', unlocked:has90, icon:TrendingUp },
    { id:'perfect_100', title:'Perfect Score', description:'Achieved 100% on an assessment', category:'Excellence', rarity:'epic', unlocked:has100, icon:Star },
    { id:'subject_honour', title:'Subject Honour', description:'Averaging 80%+ in at least one subject', category:'Academic', rarity:'rare', unlocked:hasSubjectHonour, icon:Award },
    { id:'consistent_b', title:'Consistent Performer', description:'3+ assessments all above 70% in one subject', category:'Excellence', rarity:'epic', unlocked:hasConsistentB, icon:Target },
    { id:'all_passing', title:'No Subject Left Behind', description:'Passing (50%+) in all enrolled subjects', category:'Resilience', rarity:'rare', unlocked:allPassing, icon:Shield },
    { id:'attend_80', title:'Regular Attendee', description:'Attendance rate of 80% or above', category:'Attendance', rarity:'common', unlocked:attendancePct!==null&&attendancePct>=80, icon:Star },
    { id:'attend_95', title:'Perfect Attendance', description:'Attendance rate of 95% or above', category:'Attendance', rarity:'legendary', unlocked:attendancePct!==null&&attendancePct>=95, icon:Award },
    { id:'overall_70', title:'B-Average Student', description:'Overall average of 70% across all subjects', category:'Academic', rarity:'epic', unlocked:overallAvg!==null&&overallAvg>=70, icon:TrendingUp },
    { id:'overall_80', title:'Academic Excellence', description:'Overall average of 80% or above', category:'Excellence', rarity:'legendary', unlocked:overallAvg!==null&&overallAvg>=80, icon:Star },
  ];
}

function BadgeCard({ badge }: { badge: Achievement }) {
  const rarity  = RARITY_CONFIG[badge.rarity];
  const catColor = CAT_COLORS[badge.category] || GOLD;
  const Icon = badge.icon;

  return(
    <div style={{
      background:badge.unlocked?SURFACE:S2,
      border:`1px solid ${badge.unlocked?rarity.color+'40':BORDER}`,
      borderRadius:16, padding:'20px 18px',
      boxShadow:badge.unlocked?`0 0 20px ${rarity.glow}`:'none',
      opacity:badge.unlocked?1:0.5,
      transition:'all 0.2s',
    }}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div style={{width:46,height:46,borderRadius:12,background:badge.unlocked?`${rarity.color}20`:BORDER,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${badge.unlocked?rarity.color+'40':BORDER}`}}>
          {badge.unlocked?<Icon size={22} style={{color:rarity.color}}/>:<Lock size={18} style={{color:FAINT}}/>}
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:'0.08em',color:rarity.color,background:`${rarity.color}18`,padding:'3px 8px',borderRadius:10,textTransform:'uppercase'}}>{rarity.label}</span>
          <span style={{fontSize:9,fontWeight:600,color:catColor,background:`${catColor}15`,padding:'2px 7px',borderRadius:8}}>{badge.category}</span>
        </div>
      </div>
      <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:badge.unlocked?TEXT:MUTED,marginBottom:5}}>{badge.title}</div>
      <div style={{fontSize:12,color:FAINT,lineHeight:1.5}}>{badge.description}</div>
      {badge.unlocked&&<div style={{marginTop:10,fontSize:10,fontWeight:700,color:rarity.color,letterSpacing:'0.04em'}}>✓ UNLOCKED</div>}
    </div>
  );
}

export default function AchievementsPage() {
  const { data, loading } = useStudentData();
  const achievements = useMemo(()=>computeAchievements(data),[data]);

  if(loading){
    return <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:MUTED,fontSize:14}}>Loading achievements…</span></div>;
  }

  const unlocked=achievements.filter(a=>a.unlocked);
  const locked=achievements.filter(a=>!a.unlocked);

  return(
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:0,letterSpacing:'-0.02em'}}>Achievements</h2>
        <p style={{fontSize:13,color:MUTED,marginTop:4}}>{unlocked.length} of {achievements.length} badges earned based on your real academic data.</p>
      </div>

      <div className="portal-stats-grid" style={{marginBottom:24}}>
        {(['legendary','epic','rare','common'] as const).map(r=>{
          const cfg=RARITY_CONFIG[r];
          const count=unlocked.filter(a=>a.rarity===r).length;
          return(
            <div key={r} style={{background:count>0?`${cfg.color}12`:SURFACE,border:`1px solid ${count>0?cfg.color+'35':BORDER}`,borderRadius:13,padding:'14px 16px'}}>
              <div style={{fontSize:11,color:MUTED,fontWeight:500,marginBottom:6,textTransform:'capitalize'}}>{cfg.label}</div>
              <div style={{fontFamily:FH,fontSize:26,fontWeight:700,color:count>0?cfg.color:TEXT,letterSpacing:'-0.02em'}}>{count}</div>
            </div>
          );
        })}
      </div>

      {unlocked.length>0&&(
        <div style={{marginBottom:28}}>
          <div style={{fontSize:11,fontWeight:700,color:FAINT,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:12}}>Earned ({unlocked.length})</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14}}>
            {unlocked.map(a=><BadgeCard key={a.id} badge={a}/>)}
          </div>
        </div>
      )}

      {locked.length>0&&(
        <div>
          <div style={{fontSize:11,fontWeight:700,color:FAINT,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:12}}>Locked ({locked.length})</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14}}>
            {locked.map(a=><BadgeCard key={a.id} badge={a}/>)}
          </div>
        </div>
      )}
    </div>
  );
}
