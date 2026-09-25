'use client'

import { Brush, ChevronLeft, ChevronRight, FileText, Moon, PanelsTopLeft, Sun } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from './theme-context'

const modes = [
  { href: '/write', label: 'Write', icon: FileText, shortcut: '1' },
  { href: '/create', label: 'Create', icon: Brush, shortcut: '2' },
  { href: '/work', label: 'Work', icon: PanelsTopLeft, shortcut: '3' },
] as const

export function AppShell({
  children,
  focus = false,
}: {
  children: React.ReactNode
  focus?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    localStorage.setItem('my-space:last-mode', pathname)
    const savedRail = localStorage.getItem('my-space:rail')
    if (savedRail) {
      setExpanded(savedRail === 'expanded')
    }
  }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault()
        const target = modes[Number(e.key) - 1]
        if (target) {
          router.push(target.href)
        }
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
        title={`${label} (⌘${shortcut})`}
      >
        <Icon size={20} />
        <span className="nav-label">{label}</span>
      </Link>
    )
  })

  return (
    <div className={`app-shell ${focus ? 'focus-mode' : ''}`}>
      {!focus && (
        <>
          <aside className={`rail ${expanded ? 'expanded' : ''}`} aria-label="Workspace navigation">
            <Link href="/" className="brand" title="My Space Home">
              <span className="brand-mark">T</span>
              <span className="brand-name">My Space</span>
            </Link>

            <nav className="rail-nav">
              {navLinks}
            </nav>

            <div className="rail-footer">
              <button
                className="icon-button"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
                aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              >
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                <span className="footer-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </button>

              <button
                className="icon-button"
                onClick={toggleRail}
                title={expanded ? 'Collapse navigation' : 'Expand navigation'}
                aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
              >
                {expanded ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}
                <span className="footer-label">Collapse</span>
              </button>
            </div>
          </aside>

          <nav className="mobile-nav" aria-label="Workspace navigation">
            {navLinks}
            <button
              className="icon-button mobile-theme-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </nav>
        </>
      )}

      <main className="workspace">
        {children}
      </main>
    </div>
  )
}
