import type { Metadata } from 'next'
import { AppShell } from '@/components/app-shell'
import WorkWorkspace from '@/components/work/work-workspace'

export const metadata:Metadata={title:'Work'}
export default function WorkPage(){return <AppShell><WorkWorkspace/></AppShell>}
