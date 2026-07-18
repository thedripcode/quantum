'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Search, X } from 'lucide-react';
import { STUDENTS, TEACHERS } from '@/lib/teacher/mockData';

const BG='#081420',S1='#0C1A2B',S2='#0F2032',S3='#14283E';
const BORDER='rgba(255,255,255,0.07)',BORDER2='rgba(255,255,255,0.12)';
const TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const FH="'Roboto Condensed', sans-serif",FB="'Inter', sans-serif";

interface Contact { id:string; name:string; initials:string; role:string; color:string; }
interface Msg { id:string; from:'me'|'them'; text:string; time:string; }

const COLORS=['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#EC4899','#06B6D4'];

const CONTACTS: Contact[] = [
  ...STUDENTS.slice(0,10).map((s,i)=>({
    id:s._id, name:`${s.firstName} ${s.lastName}`,
    initials:s.avatarInitials, role:`Grade ${s.grade} Student`,
    color:COLORS[i%COLORS.length],
  })),
  ...TEACHERS.filter(t=>t._id!=='t-001').map((t,i)=>({
    id:t._id, name:`${t.title} ${t.firstName} ${t.lastName}`,
    initials:t.avatarInitials, role:'Colleague',
    color:COLORS[(i+3)%COLORS.length],
  })),
];

const STARTER_MSGS: Record<string,Msg[]> = {
  default: [{ id:'1', from:'them', text:'Hello Mr. Nkosi, thank you for reaching out.', time:'09:14' }],
};

const studentName = (id:string) => CONTACTS.find(c=>c.id===id)?.name ?? 'Unknown';

export default function MessagesPage() {
  const [search,setSearch]=useState('');
  const [contactId,setContactId]=useState(CONTACTS[0].id);
  const [threads,setThreads]=useState<Record<string,Msg[]>>(STARTER_MSGS);
  const [input,setInput]=useState('');
  const endRef=useRef<HTMLDivElement>(null);

  const contact = CONTACTS.find(c=>c.id===contactId)!;
  const msgs = threads[contactId]??[{id:'1',from:'them',text:`Hi Mr. Nkosi! How can I help?`,time:'09:00'}];
  const filtered = CONTACTS.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs,contactId]);

  const send = () => {
    if(!input.trim()) return;
    const msg: Msg = { id:Date.now().toString(), from:'me', text:input.trim(), time:new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'}) };
    setThreads(p=>({...p,[contactId]:[...(p[contactId]??[{id:'1',from:'them',text:`Hi Mr. Nkosi!`,time:'09:00'}]),msg]}));
    setInput('');
    // Auto-reply
    setTimeout(()=>{
      const reply: Msg = { id:(Date.now()+1).toString(), from:'them', text:`Thank you for your message, I'll get back to you shortly.`, time:new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'}) };
      setThreads(p=>({...p,[contactId]:[...(p[contactId]??[]),reply]}));
    },1200);
  };

  return (
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%',display:'flex',flexDirection:'column',height:'calc(100vh - 56px)'}}>
      <div style={{marginBottom:16}}>
        <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:TEXT,margin:0,letterSpacing:'-0.03em'}}>Messages</h1>
        <p style={{fontSize:12,color:FAINT,margin:'4px 0 0'}}>Direct messaging with students, parents and colleagues</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:16,flex:1,minHeight:0}}>
        {/* Contacts */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'12px 14px',borderBottom:`1px solid ${BORDER}`}}>
            <div style={{display:'flex',alignItems:'center',gap:8,background:S2,border:`1px solid ${BORDER}`,borderRadius:10,padding:'8px 12px'}}>
              <Search size={13} style={{color:MUTED,flexShrink:0}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contacts…"
                style={{flex:1,background:'transparent',border:'none',outline:'none',fontSize:12,color:TEXT,fontFamily:FB}}/>
              {search&&<button onClick={()=>setSearch('')} style={{background:'none',border:'none',cursor:'pointer',color:MUTED,display:'flex'}}><X size={11}/></button>}
            </div>
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {filtered.map((c,i)=>(
              <div key={c.id} onClick={()=>setContactId(c.id)}
                style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',cursor:'pointer',background:contactId===c.id?'rgba(255,255,255,0.05)':'transparent',borderTop:i>0?`1px solid rgba(255,255,255,0.03)`:'none',transition:'background 0.15s'}}
                onMouseEnter={e=>{if(contactId!==c.id)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.03)';}}
                onMouseLeave={e=>{if(contactId!==c.id)(e.currentTarget as HTMLElement).style.background='transparent';}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:`${c.color}22`,border:`1px solid ${c.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:c.color,flexShrink:0}}>
                  {c.initials}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:FB,fontSize:12,fontWeight:600,color:TEXT,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
                  <div style={{fontFamily:FB,fontSize:10,color:FAINT}}>{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div style={{background:S1,border:`1px solid ${BORDER}`,borderRadius:18,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {/* Header */}
          <div style={{padding:'14px 20px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:`${contact.color}22`,border:`1px solid ${contact.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:contact.color,flexShrink:0}}>
              {contact.initials}
            </div>
            <div>
              <div style={{fontFamily:FB,fontSize:13,fontWeight:700,color:TEXT}}>{contact.name}</div>
              <div style={{fontFamily:FB,fontSize:11,color:FAINT}}>{contact.role}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:10}}>
            {msgs.map(m=>(
              <div key={m.id} style={{display:'flex',justifyContent:m.from==='me'?'flex-end':'flex-start'}}>
                <div style={{maxWidth:'70%'}}>
                  <div style={{padding:'10px 14px',borderRadius:m.from==='me'?'18px 18px 4px 18px':'18px 18px 18px 4px',background:m.from==='me'?'rgba(255,255,255,0.09)':S2,border:`1px solid ${BORDER}`,fontFamily:FB,fontSize:13,color:TEXT,lineHeight:1.5}}>
                    {m.text}
                  </div>
                  <div style={{fontFamily:FB,fontSize:10,color:FAINT,marginTop:4,textAlign:m.from==='me'?'right':'left'}}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={endRef}/>
          </div>

          {/* Input */}
          <div style={{padding:'12px 16px',borderTop:`1px solid ${BORDER}`,display:'flex',gap:10,flexShrink:0}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
              placeholder={`Message ${contact.name.split(' ')[0]}…`}
              style={{flex:1,background:S2,border:`1px solid ${BORDER}`,borderRadius:12,padding:'11px 14px',color:TEXT,fontFamily:FB,fontSize:13,outline:'none'}}
              onFocus={e=>{(e.target as HTMLElement).style.borderColor=BORDER2;}}
              onBlur={e=>{(e.target as HTMLElement).style.borderColor=BORDER;}}/>
            <button onClick={send}
              style={{width:42,height:42,borderRadius:12,background:'rgba(255,255,255,0.08)',border:`1px solid ${BORDER2}`,color:TEXT,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Send size={15}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
