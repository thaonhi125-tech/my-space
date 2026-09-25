import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-context'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'My Space', template: '%s · My Space' },
  description: 'A private, local-first workspace for writing, creating, and focused work.',
}

export const viewport: Viewport = {
  themeColor: '#111111',
  colorScheme: 'dark light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
