'use client'

import { MonitorDown } from 'lucide-react'
import { useState } from 'react'
import { isIos, usePwaInstall } from '@/lib/use-pwa-install'
import { Modal } from './modal'

/**
 * "Install app" button. Opens the browser's own install dialog when there is
 * one; otherwise explains the two or three taps. Hidden once installed.
 */
export function InstallApp({ className, compactLabel }: { className: string; compactLabel?: boolean }) {
  const { canPrompt, installed, install } = usePwaInstall()
  const [guide, setGuide] = useState(false)

  if (installed) return null

  const onClick = async () => {
    if (canPrompt && (await install()) !== null) return
    setGuide(true)
  }

  const ios = guide && isIos()
  const android = guide && /android/i.test(navigator.userAgent)

  return (
    <>
      <button type="button" className={className} onClick={() => void onClick()} title="Install My Space as an app" aria-label="Install My Space as an app">
        <MonitorDown size={19} />
        <span className={compactLabel ? undefined : 'footer-label'}>{compactLabel ? 'Install' : 'Install app'}</span>
      </button>

      {guide && (
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
      )}
    </>
  )
}
