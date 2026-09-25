import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: { default: 'My Space', template: '%s · My Space' }, description: 'A private, local-first workspace for writing, creating, and focused work.' }
export const viewport: Viewport = { themeColor: '#111111', colorScheme: 'dark' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
