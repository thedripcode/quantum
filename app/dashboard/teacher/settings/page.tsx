'use client';

import { useState } from 'react';
import { Save, Check, User, Bell, Palette, Lock } from 'lucide-react';
import { TEACHERS, CURRENT_TEACHER_ID } from '@/lib/teacher/mockData';

const BG='#0C0C0C',S1='#111111',S2='#171717';
const BORDER='rgba(255,255,255,0.07)',BORDER2='rgba(255,255,255,0.12)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";

const TEACHER = TEACHERS.find(t=>t._id===CURRENT_TEACHER_ID)!;

type Tab = 'profile'|'notifications'|'display'|'security';
const TABS: {id:Tab;label:string;icon:React.ElementType}[] = [
  {id:'profile',       label:'Profile',       icon:User},
  {id:'notifications', label:'Notifications', icon:Bell},
  {id:'display',       label:'Display',       icon:Palette},
  {id:'security',      label:'Security',      icon:Lock},
];

const inp: React.CSSProperties = {width:'100%',background:S2,border:`1px solid rgba(255,255,255,0.07)`,borderRadius:10,padding:'10px 14px',color:TEXT,fontFamily:"'Inter',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box'};

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return (
    <div onClick={()=>onChange(!on)}
      style={{width:40,height:22,borderRadius:11,background:on?'rgba(16,185,129,0.80)':'rgba(255,255,255,0.12)',border:`1px solid ${on?'rgba(16,185,129,0.50)':BORDER}`,cursor:'pointer',transition:'all 0.2s',position:'relative',flexShrink:0}}>
      <div style={{position:'absolute',top:2,left:on?20:2,width:16,height:16,borderRadius:'50%',background:TEXT,transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}}/>
    </div>
  );
}

export default function SettingsPage() {
  const [tab,setTab]=useState<Tab>('profile');
  const [saved,setSaved]=useState(false);

  // Profile state
  const [firstName,setFirstName]=useState(TEACHER.firstName);
  const [lastName,setLastName]=useState(TEACHER.lastName);
  const [email,setEmail]=useState(TEACHER.email);
  const [phone,setPhone]=useState(TEACHER.phone);
  const [bio,setBio]=useState('HOD Mathematics & Science at Sidelile High School. Passionate about developing mathematical thinking in young South Africans.');

  // Notification state
  const [notifs,setNotifs]=useState({
    atRiskAlerts: true, submissionNotifs: true, parentMessages: true,
    systemUpdates: false, weeklyDigest: true, examReminders: true,
  });

  // Display
  const [fontSize,setFontSize]=useState('medium');
  const [compactMode,setCompactMode]=useState(false);

  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);};

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:TEXT,margin:0,letterSpacing:'-0.03em'}}>Settings</h1>
          <p style={{fontSize:12,color:FAINT,margin:'4px 0 0'}}>Manage your profile and preferences</p>
        </div>
        <button onClick={save}
          style={{display:'flex',alignItems:'center',gap:7,padding:'10px 20px',borderRadius:12,background:saved?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.07)',border:`1px solid ${saved?'rgba(16,185,129,0.30)':BORDER2}`,color:saved?'#10B981':TEXT,fontFamily:FB,fontSize:13,fontWeight:700,cursor:'pointer',transition:'all 0.2s'}}>
          {saved?<><Check size={15}/>Saved!</>:<><Save size={15}/>Save Changes</>}
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:20}}>
        {/* Sidebar tabs */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:16,padding:8,height:'fit-content'}}>
          {TABS.map(t=>{
            const Icon=t.icon;
            const active=tab===t.id;
            return (
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'10px 12px',borderRadius:10,background:active?'rgba(255,255,255,0.08)':'transparent',border:'none',color:active?TEXT:MUTED,fontFamily:FB,fontSize:13,fontWeight:active?600:400,cursor:'pointer',marginBottom:2,transition:'all 0.15s',textAlign:'left'}}>
                <Icon size={15}/>{t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,padding:24}}>

          {tab==='profile'&&(
            <div>
              {/* Avatar */}
              <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:28,paddingBottom:24,borderBottom:`1px solid ${BORDER}`}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(255,255,255,0.08)',border:`2px solid ${BORDER2}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FH,fontSize:22,fontWeight:800,color:TEXT}}>
                  {TEACHER.avatarInitials}
                </div>
                <div>
                  <div style={{fontFamily:FH,fontSize:17,fontWeight:700,color:TEXT}}>{TEACHER.title} {firstName} {lastName}</div>
                  <div style={{fontFamily:FB,fontSize:12,color:MUTED}}>{TEACHER.role==='hod'?'Head of Department':'Educator'} · {TEACHER.department}</div>
                  <div style={{fontFamily:FB,fontSize:11,color:FAINT,marginTop:2}}>Employee: {TEACHER.employeeNumber}</div>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {[
                  {label:'First Name',value:firstName,set:setFirstName},
                  {label:'Last Name', value:lastName, set:setLastName},
                ].map(({label,value,set})=>(
                  <div key={label}>
                    <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>{label}</div>
                    <input value={value} onChange={e=>set(e.target.value)} style={inp}/>
                  </div>
                ))}
                <div>
                  <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Email</div>
                  <input value={email} onChange={e=>setEmail(e.target.value)} style={inp}/>
                </div>
                <div>
                  <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Phone</div>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} style={inp}/>
                </div>
                <div style={{gridColumn:'span 2'}}>
                  <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Bio</div>
                  <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} style={{...inp,resize:'vertical' as const}}/>
                </div>
              </div>
            </div>
          )}

          {tab==='notifications'&&(
            <div>
              <div style={{fontFamily:FH,fontSize:15,fontWeight:700,color:TEXT,marginBottom:20}}>Notification Preferences</div>
              {[
                {key:'atRiskAlerts',     label:'At-Risk Student Alerts',       desc:'Get notified when a student drops below 50%'},
                {key:'submissionNotifs', label:'Assignment Submissions',        desc:'When students submit work through SIDI'},
                {key:'parentMessages',   label:'Parent Messages',               desc:'New messages from parents or guardians'},
                {key:'systemUpdates',    label:'System Updates',                desc:'Platform updates and new features'},
                {key:'weeklyDigest',     label:'Weekly Class Summary',          desc:'Weekly email digest of class performance'},
                {key:'examReminders',    label:'Exam Reminders',                desc:'Reminders 3 days before assessments are due'},
              ].map(({key,label,desc})=>(
                <div key={key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,padding:'14px 0',borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <div>
                    <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:TEXT}}>{label}</div>
                    <div style={{fontFamily:FB,fontSize:11,color:FAINT,marginTop:2}}>{desc}</div>
                  </div>
                  <Toggle on={notifs[key as keyof typeof notifs]} onChange={v=>setNotifs(p=>({...p,[key]:v}))}/>
                </div>
              ))}
            </div>
          )}

          {tab==='display'&&(
            <div>
              <div style={{fontFamily:FH,fontSize:15,fontWeight:700,color:TEXT,marginBottom:20}}>Display Preferences</div>
              <div style={{marginBottom:20}}>
                <div style={{fontFamily:FB,fontSize:11,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Font Size</div>
                <div style={{display:'flex',gap:8}}>
                  {['small','medium','large'].map(s=>(
                    <button key={s} onClick={()=>setFontSize(s)}
                      style={{flex:1,padding:'10px',borderRadius:10,background:fontSize===s?'rgba(255,255,255,0.10)':'transparent',border:`1px solid ${fontSize===s?BORDER2:BORDER}`,color:fontSize===s?TEXT:MUTED,fontFamily:FB,fontSize:13,fontWeight:fontSize===s?600:400,cursor:'pointer',textTransform:'capitalize'}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderTop:`1px solid ${BORDER}`}}>
                <div>
                  <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:TEXT}}>Compact Mode</div>
                  <div style={{fontFamily:FB,fontSize:11,color:FAINT,marginTop:2}}>Reduce spacing to show more content on screen</div>
                </div>
                <Toggle on={compactMode} onChange={setCompactMode}/>
              </div>
            </div>
          )}

          {tab==='security'&&(
            <div>
              <div style={{fontFamily:FH,fontSize:15,fontWeight:700,color:TEXT,marginBottom:20}}>Security</div>
              {['Current Password','New Password','Confirm New Password'].map(label=>(
                <div key={label} style={{marginBottom:14}}>
                  <div style={{fontFamily:FB,fontSize:10,color:FAINT,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>{label}</div>
                  <input type="password" placeholder="••••••••" style={inp}/>
                </div>
              ))}
              <button onClick={save} style={{padding:'11px 24px',borderRadius:10,background:'rgba(255,255,255,0.07)',border:`1px solid ${BORDER}`,color:TEXT,fontFamily:FB,fontSize:13,fontWeight:600,cursor:'pointer'}}>
                Update Password
              </button>
              <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${BORDER}`}}>
                <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:'#EF4444',marginBottom:8}}>Danger Zone</div>
                <button style={{padding:'10px 20px',borderRadius:10,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#EF4444',fontFamily:FB,fontSize:12,fontWeight:600,cursor:'pointer'}}>
                  Sign Out of All Devices
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
