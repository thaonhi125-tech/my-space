'use client'

import { Brush, ChevronLeft, ChevronRight, FileText, Moon, PanelsTopLeft, Sun } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { InstallApp, InstallCard } from './install-app'
import { useTheme } from './theme-context'

const WorkWorkspace = dynamic(() => import('./work/work-workspace'))

const modes = [
  { href: '/write', label: 'Write', icon: FileText, shortcut: '1' },
  { href: '/create', label: 'Create', icon: Brush, shortcut: '2' },
  { href: '/work', label: 'Work', icon: PanelsTopLeft, shortcut: '3' },
] as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [modKey, setModKey] = useState('Ctrl+')
  const { theme, toggleTheme } = useTheme()
  const onWork = pathname === '/work'
  // TanFlow is loaded the first time Work is opened, then kept alive while
  // other modes are shown so a running timer is not reset.
  const [workOpened, setWorkOpened] = useState(onWork)

  useEffect(() => {
    localStorage.setItem('my-space:last-mode', pathname)
    if (pathname === '/work') setWorkOpened(true)
  }, [pathname])

  useEffect(() => {
    setExpanded(localStorage.getItem('my-space:rail') === 'expanded')
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setModKey('⌘')
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault()
        const target = modes[Number(e.key) - 1]
        if (target) router.push(target.href)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router])

  const toggleRail = () => {
    setExpanded(v => {
      const next = !v
      localStorage.setItem('my-space:rail', next ? 'expanded' : 'collapsed')
      return next
    })
  }

  const navLinks = modes.map(({ href, label, icon: Icon, shortcut }) => {
    const isActive = pathname === href
    return (
      <Link
        key={href}
        className={`nav-link ${isActive ? 'active' : ''}`}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        title={`${label} (${modKey}${shortcut})`}
      >
        <Icon size={20} />
        <span className="nav-label">{label}</span>
      </Link>
    )
  })

  const themeLabel = theme === 'dark' ? 'Light mode' : 'Dark mode'

  return (
    <div className={`app-shell ${expanded ? 'rail-expanded' : ''}`}>
      <aside className={`rail ${expanded ? 'expanded' : ''}`} aria-label="Workspace navigation">
        <Link href="/" className="brand" title="My Space">
          <span className="brand-mark">T</span>
          <span className="brand-name">My Space</span>
        </Link>

        <nav className="rail-nav">{navLinks}</nav>

        <div className="rail-footer">
          <InstallApp className="icon-button" />

          <button className="icon-button" onClick={toggleTheme} title={`Switch to ${themeLabel}`} aria-label={`Switch to ${themeLabel}`}>
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            <span className="footer-label">{themeLabel}</span>
          </button>

          <button
            className="icon-button"
            onClick={toggleRail}
            title={expanded ? 'Collapse navigation' : 'Expand navigation'}
            aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}
            <span className="footer-label">Collapse</span>
          </button>
        </div>
      </aside>

      {/* Phones: modes only. Theme follows the phone's setting; install is a one-time card. */}
      <nav className="mobile-nav" aria-label="Workspace navigation">
        {navLinks}
      </nav>
      <InstallCard />

      <main className="workspace">
        {children}
        {workOpened && (
          <div className="work-host" hidden={!onWork}>
            <WorkWorkspace />
          </div>
        )}
      </main>
    </div>
  )
}
