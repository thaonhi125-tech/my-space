'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('my-space:theme') as Theme | null
    if (saved === 'dark' || saved === 'light') {
      setThemeState(saved)
      document.documentElement.setAttribute('data-theme', saved)
      document.documentElement.style.colorScheme = saved
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = prefersDark ? 'dark' : 'light'
      setThemeState(initial)
      document.documentElement.setAttribute('data-theme', initial)
      document.documentElement.style.colorScheme = initial
    }
  }, [])

  const applyThemeToDOM = (next: Theme) => {
    localStorage.setItem('my-space:theme', next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.style.colorScheme = next
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', next === 'dark' ? '#111111' : '#f4f6f5')
    }
  }

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyThemeToDOM(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      applyThemeToDOM(next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
