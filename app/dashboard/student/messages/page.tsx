'use client';

import { useCallback, useEffect, useState } from 'react';
import { Send, Inbox, Loader2, MessageSquare, ChevronLeft, Trash2 } from 'lucide-react';

const BG='#0C0C0C',SURFACE='#161616',S2='#1E1E1E';
const GOLD='#C9A84C',GOLD_DIM='rgba(201,168,76,0.10)',GOLD_B='rgba(201,168,76,0.22)';
const BORDER='rgba(255,255,255,0.07)',TEXT='#FFFFFF',MUTED='rgba(255,255,255,0.50)',FAINT='rgba(255,255,255,0.22)';
const GREEN='#10B981',BLUE='#3B82F6';
const FH="'Bricolage Grotesque', sans-serif",FB="'Inter', sans-serif";

const inp=(extra?:React.CSSProperties):React.CSSProperties=>({background:S2,border:`1px solid ${BORDER}`,borderRadius:9,color:TEXT,fontFamily:FB,fontSize:13,padding:'9px 12px',outline:'none',width:'100%',boxSizing:'border-box' as const,...extra});

interface Msg { id:string; subject:string; body:string; sentAt:string; readAt:string|null; sender:{name:string;role:string}; receiver:{name:string;role:string}; }
interface Contact { id:string; name:string; role:string; }

export default function MessagesPage() {
  const [tab, setTab]           = useState<'inbox'|'compose'>('inbox');
  const [msgs, setMsgs]         = useState<Msg[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Msg|null>(null);
  const [toast, setToast]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [form, setForm]         = useState({receiverId:'',subject:'',body:''});

  const flash=(m:string)=>{ setToast(m); setTimeout(()=>setToast(''),4000); };

  const load = useCallback(()=>{
    Promise.all([
      fetch('/api/messages?box=inbox').then(r=>r.json()),
      fetch('/api/admin/users').then(r=>r.json()),
    ]).then(([md,ud])=>{
      setMsgs(md.messages??[]);
      const all:Contact[]=(ud.users??[]).filter((u:any)=>u.role==='teacher'||u.role==='admin').map((u:any)=>({id:u.id,name:u.name,role:u.role}));
      setContacts(all);
      if(all.length&&!form.receiverId) setForm(f=>({...f,receiverId:all[0].id}));
      setLoading(false);
    });
  },[]);

  useEffect(()=>{ load(); },[load]);

  const markRead = async (msg:Msg) => {
    if(!msg.readAt){
      await fetch('/api/messages',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:msg.id})});
      setMsgs(ms=>ms.map(m=>m.id===msg.id?{...m,readAt:new Date().toISOString()}:m));
    }
    setSelected(msg);
  };

  const del = async (id:string) => {
    await fetch(`/api/messages?id=${id}`,{method:'DELETE'});
    setMsgs(ms=>ms.filter(m=>m.id!==id));
    if(selected?.id===id) setSelected(null);
    flash('✓ Message deleted.');
  };

  const send = async () => {
    if(!form.receiverId||!form.subject.trim()||!form.body.trim()){ flash('Fill in all fields.'); return; }
    setBusy(true);
    const res=await fetch('/api/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    setBusy(false);
    if(res.ok){ flash('✓ Message sent.'); setForm(f=>({...f,subject:'',body:''})); setTab('inbox'); load(); }
    else flash('Could not send message.');
  };

  const unread=msgs.filter(m=>!m.readAt).length;

  return(
    <div style={{padding:24,fontFamily:FB,background:BG,minHeight:'100%'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:TEXT,margin:0,letterSpacing:'-0.02em'}}>Messages</h2>
        <p style={{fontSize:13,color:MUTED,marginTop:4}}>Inbox from teachers and school administration.</p>
      </div>

      {toast&&<div style={{marginBottom:16,padding:'11px 16px',borderRadius:10,background:toast.startsWith('✓')?'rgba(16,185,129,0.10)':'rgba(245,158,11,0.10)',border:`1px solid ${toast.startsWith('✓')?'rgba(16,185,129,0.30)':'rgba(245,158,11,0.30)'}`,fontSize:13,color:toast.startsWith('✓')?GREEN:GOLD}}>{toast}</div>}

      <div style={{display:'flex',gap:6,marginBottom:20,background:SURFACE,padding:5,borderRadius:12,border:`1px solid ${BORDER}`,width:'fit-content'}}>
        {([['inbox','Inbox',Inbox],['compose','Compose',Send]] as const).map(([id,label,Icon])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{display:'flex',alignItems:'center',gap:7,padding:'8px 16px',borderRadius:8,border:'none',cursor:'pointer',background:tab===id?S2:'transparent',color:tab===id?TEXT:MUTED,fontFamily:FB,fontSize:13,fontWeight:tab===id?600:400}}>
            <Icon size={13}/>{label}{id==='inbox'&&unread>0&&<span style={{fontSize:10,background:GOLD,color:'#000',borderRadius:10,padding:'1px 6px',fontWeight:700}}>{unread}</span>}
          </button>
        ))}
      </div>

      {tab==='inbox'&&(
        loading?(
          <div style={{display:'flex',justifyContent:'center',padding:40}}><Loader2 size={24} className="animate-spin" style={{color:MUTED}}/></div>
        ):selected?(
          <div style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:10}}>
              <button onClick={()=>setSelected(null)} style={{display:'flex',alignItems:'center',gap:5,background:'none',border:'none',cursor:'pointer',color:MUTED,fontFamily:FB,fontSize:13,padding:0}}>
                <ChevronLeft size={16}/>Back
              </button>
            </div>
            <div style={{padding:'24px 24px'}}>
              <div style={{fontFamily:FH,fontSize:17,fontWeight:700,color:TEXT,marginBottom:6}}>{selected.subject}</div>
              <div style={{fontSize:12,color:MUTED,marginBottom:20}}>From {selected.sender.name} ({selected.sender.role}) · {new Date(selected.sentAt).toLocaleString('en-ZA')}</div>
              <div style={{fontSize:14,color:TEXT,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.body}</div>
              <button onClick={()=>del(selected.id)} style={{marginTop:20,display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,cursor:'pointer',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#EF4444',fontSize:12,fontWeight:600,fontFamily:FB}}>
                <Trash2 size={12}/>Delete
              </button>
            </div>
          </div>
        ):msgs.length===0?(
          <div style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:16,padding:60,textAlign:'center'}}>
            <MessageSquare size={36} style={{color:MUTED,marginBottom:12,opacity:0.5}}/>
            <div style={{fontSize:15,fontWeight:600,color:TEXT}}>No messages yet</div>
            <div style={{fontSize:13,color:MUTED,marginTop:4}}>Your inbox is empty.</div>
          </div>
        ):(
          <div style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden'}}>
            {msgs.map((m,i)=>(
              <div key={m.id} onClick={()=>markRead(m)}
                style={{display:'flex',alignItems:'flex-start',gap:12,padding:'15px 20px',borderBottom:i<msgs.length-1?`1px solid ${BORDER}`:'none',cursor:'pointer',background:!m.readAt?'rgba(201,168,76,0.04)':'transparent'}}
                onMouseEnter={e=>e.currentTarget.style.background=S2}
                onMouseLeave={e=>e.currentTarget.style.background=!m.readAt?'rgba(201,168,76,0.04)':'transparent'}>
                <div style={{width:8,height:8,borderRadius:4,background:!m.readAt?GOLD:'transparent',marginTop:5,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',gap:8}}>
                    <span style={{fontSize:13.5,fontWeight:!m.readAt?700:500,color:TEXT,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.subject}</span>
                    <span style={{fontSize:11,color:FAINT,flexShrink:0}}>{new Date(m.sentAt).toLocaleDateString('en-ZA',{day:'numeric',month:'short'})}</span>
                  </div>
                  <div style={{fontSize:12,color:MUTED,marginTop:2}}>From {m.sender.name}</div>
                  <div style={{fontSize:12,color:FAINT,marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.body}</div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab==='compose'&&(
        <div style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:16,padding:20,maxWidth:600}}>
          <h3 style={{fontFamily:FH,fontSize:15,fontWeight:600,color:TEXT,margin:'0 0 16px'}}>New Message</h3>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <div style={{fontSize:11,color:MUTED,fontWeight:600,marginBottom:5}}>TO</div>
              <select value={form.receiverId} onChange={e=>setForm(f=>({...f,receiverId:e.target.value}))} style={inp()}>
                {contacts.map(c=><option key={c.id} value={c.id} style={{background:S2}}>{c.name} ({c.role})</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:MUTED,fontWeight:600,marginBottom:5}}>SUBJECT</div>
              <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Subject…" style={inp()}/>
            </div>
            <div>
              <div style={{fontSize:11,color:MUTED,fontWeight:600,marginBottom:5}}>MESSAGE</div>
              <textarea rows={6} value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} placeholder="Write your message…" style={{...inp(),resize:'vertical'}}/>
            </div>
            <button onClick={send} disabled={busy}
              style={{display:'flex',alignItems:'center',gap:7,padding:'11px 22px',borderRadius:10,background:GOLD,border:'none',color:'#000',fontFamily:FH,fontSize:13.5,fontWeight:700,cursor:busy?'default':'pointer',opacity:busy?0.6:1,width:'fit-content'}}>
              {busy?<Loader2 size={14} className="animate-spin"/>:<Send size={14}/>}{busy?'Sending…':'Send Message'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
