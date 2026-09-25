'use client'

import { Brush, ChevronLeft, ChevronRight, FileText, PanelsTopLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const modes=[{href:'/write',label:'Write',icon:FileText},{href:'/create',label:'Create',icon:Brush},{href:'/work',label:'Work',icon:PanelsTopLeft}] as const
export function AppShell({children,focus=false}:{children:React.ReactNode;focus?:boolean}){
 const pathname=usePathname(),router=useRouter();const [expanded,setExpanded]=useState(false)
 useEffect(()=>{localStorage.setItem('my-space:last-mode',pathname);setExpanded(localStorage.getItem('my-space:rail')==='expanded')},[pathname])
 useEffect(()=>{const handler=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&['1','2','3'].includes(e.key)){e.preventDefault();router.push(modes[Number(e.key)-1].href)}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[router])
 const toggle=()=>setExpanded(v=>{localStorage.setItem('my-space:rail',!v?'expanded':'collapsed');return !v})
 const nav=<>{modes.map(({href,label,icon:Icon})=><Link key={href} className={`nav-link ${pathname===href?'active':''}`} href={href} aria-current={pathname===href?'page':undefined} title={`${label} (⌘${modes.findIndex(m=>m.href===href)+1})`}><Icon size={20}/><span className="nav-label">{label}</span></Link>)}</>
 return <div className="app-shell">
  {!focus&&<><aside className={`rail ${expanded?'expanded':''}`} aria-label="Workspace navigation"><div className="brand"><span className="brand-mark">T</span><span className="brand-name">My Space</span></div><nav className="rail-nav">{nav}</nav><div className="rail-footer"><button className="icon-button" onClick={toggle} aria-label={expanded?'Collapse navigation':'Expand navigation'}>{expanded?<ChevronLeft/>:<ChevronRight/>}</button></div></aside><nav className="mobile-nav" aria-label="Workspace navigation">{nav}</nav></>}
  <main className="workspace">{children}</main>
 </div>
}
