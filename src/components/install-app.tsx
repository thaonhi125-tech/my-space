'use client'

import { MonitorDown, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { isIos, usePwaInstall } from '@/lib/use-pwa-install'
import { Modal } from './modal'

const DISMISSED_KEY = 'my-space:install-card-dismissed'

/** Browser install dialog when available, otherwise a short how-to. */
function useInstallFlow() {
  const { canPrompt, installed, install } = usePwaInstall()
  const [guide, setGuide] = useState(false)

  const start = async () => {
    if (canPrompt && (await install()) !== null) return
    setGuide(true)
  }

  const ios = guide && isIos()
  const android = guide && /android/i.test(navigator.userAgent)

  const guideModal = guide && (
    <Modal title="Install My Space" onClose={() => setGuide(false)}>
      <ol className="install-steps">
        {ios ? (
          <>
            <li>Tap the <strong>Share</strong> button in Safari&apos;s toolbar.</li>
            <li>Choose <strong>Add to Home Screen</strong>.</li>
            <li>Tap <strong>Add</strong>, then open My Space from the new icon.</li>
          </>
        ) : android ? (
          <>
            <li>Open Chrome&apos;s <strong>⋮</strong> menu.</li>
            <li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
          </>
        ) : (
          <>
            <li>In Chrome or Edge, click the install icon in the address bar, or open the browser menu.</li>
            <li>Choose <strong>Install My Space</strong>. In Safari on Mac: <strong>File → Add to Dock</strong>.</li>
          </>
        )}
      </ol>
      <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>
        It opens in its own window like an app. Your documents and boards stay in this browser either way.
      </p>
      <div className="modal-footer">
        <button type="button" className="button primary" onClick={() => setGuide(false)} data-autofocus>
          Got it
        </button>
      </div>
    </Modal>
  )

  return { installed, start, guideModal }
}

/** Desktop: a quiet entry in the rail footer, next to the theme switch. */
export function InstallApp({ className }: { className: string }) {
  const { installed, start, guideModal } = useInstallFlow()
  if (installed) return null
  return (
    <>
      <button type="button" className={className} onClick={() => void start()} title="Install My Space as an app" aria-label="Install My Space as an app">
        <MonitorDown size={19} />
        <span className="footer-label">Install app</span>
      </button>
      {guideModal}
    </>
  )
}

/**
 * Phones: a one-time card above the bottom bar instead of a nav item (which
 * read like a fourth mode). Gone for good after Install or Not now.
 */
export function InstallCard() {
  const { installed, start, guideModal } = useInstallFlow()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISSED_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {}
  }

  if (installed) return null

  return (
    <>
      {!dismissed && (
        <div className="install-card" role="region" aria-label="Install My Space">
          <MonitorDown size={18} />
          <span>Use My Space as an app</span>
          <button
            type="button"
            className="button primary"
            onClick={() => {
              dismiss()
              void start()
            }}
          >
            Install
          </button>
          <button type="button" className="icon-button" onClick={dismiss} aria-label="Not now">
            <X size={16} />
          </button>
        </div>
      )}
      {guideModal}
    </>
  )
}
