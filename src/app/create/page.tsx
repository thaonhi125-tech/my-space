import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { AppShell } from '@/components/app-shell'

export const metadata:Metadata={title:'Create'}
const CreativeWorkspace=dynamic(()=>import('@/components/create/creative-workspace'),{loading:()=> <div className="center-state"><div className="spinner"/><p>Opening canvas…</p></div>})
export default function CreatePage(){return <AppShell><CreativeWorkspace/></AppShell>}
