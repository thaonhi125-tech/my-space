'use client'

import { ExternalLink, RefreshCw, TimerReset } from 'lucide-react'
import { useEffect, useState } from 'react'
import './work.css'

const DEFAULT_URL='https://tanflow.lovable.app/'
export default function WorkWorkspace(){
 const url=process.env.NEXT_PUBLIC_TANFLOW_URL||DEFAULT_URL
 const [state,setState]=useState<'loading'|'ready'|'error'>('loading'),[key,setKey]=useState(0)
 useEffect(()=>{const timer=setTimeout(()=>setState(s=>s==='loading'?'error':s),12000);return()=>clearTimeout(timer)},[key])
 const reload=()=>{setState('loading');setKey(v=>v+1)}
 return <div className="work-mode"><header className="work-header"><div className="work-title"><span className="work-mark"><TimerReset/></span><div><span className="eyebrow">Work mode</span><strong>TanFlow</strong></div></div><span className="muted work-note">Focus tools, unchanged</span><a className="button" href={url} target="_blank" rel="noreferrer"><ExternalLink/>Open in new tab</a></header><div className="frame-stage">
  {state==='loading'&&<div className="frame-status"><div className="spinner"/><h2>Opening TanFlow</h2><p>The workspace is loaded only after you open Work mode.</p></div>}
  {state==='error'&&<div className="frame-status error"><h2>TanFlow could not be embedded</h2><p>The host may block iframes, be offline, or be taking too long. Your safest option is to open the original workspace directly.</p><div><a className="button primary" href={url} target="_blank" rel="noreferrer"><ExternalLink/>Open TanFlow</a><button className="button" onClick={reload}><RefreshCw/>Try again</button></div></div>}
  <iframe key={key} className={state==='ready'?'ready':''} src={url} title="TanFlow work workspace" allow="fullscreen" loading="eager" referrerPolicy="strict-origin-when-cross-origin" onLoad={()=>setState('ready')} onError={()=>setState('error')}/>
 </div></div>
}
