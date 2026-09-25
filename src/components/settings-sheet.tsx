'use client'

import { Check, ExternalLink, MonitorDown, Pipette } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ACCENTS, applyAccent, isHex, readAccent, resolveAccent } from '@/lib/accent'
import { useInstallFlow } from './install-app'
import { Modal } from './modal'
import { QUOTES_EVENT, QUOTES_KEY, readQuoteSetting, type QuoteSetting } from './mascot'
import { useTheme, type ThemeChoice } from './theme-context'

export const REPO_URL = 'https://github.com/vanductan-NLT/my-space'

const THEMES: { value: ThemeChoice; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Match device' },
]

/**
 * Phone settings, opened from the Settings tab: things that are not modes and
 * so don't belong in the bottom bar.
 */
export function SettingsSheet({
  open,
  onClose,
  mascotOn,
  onMascotChange,
}: {
  open: boolean
  onClose: () => void
  mascotOn: boolean
  onMascotChange: (on: boolean) => void
}) {
  const { choice, setChoice, theme } = useTheme()
  const [accent, setAccent] = useState('mint')
  const [quotes, setQuotes] = useState<QuoteSetting>('en')
  useEffect(() => {
    setAccent(readAccent())
    setQuotes(readQuoteSetting())
  }, [open])

  const pickQuotes = (value: QuoteSetting) => {
    setQuotes(value)
    try {
      localStorage.setItem(QUOTES_KEY, value)
    } catch {}
    window.dispatchEvent(new Event(QUOTES_EVENT))
  }

  const pickAccent = (value: string) => {
    setAccent(value)
    applyAccent(value)
  }

  const { installed, start, guideModal } = useInstallFlow()

  return (
    <>
      {open && (
        <Modal title="Settings" onClose={onClose} sheet>
          <section className="settings-group" aria-labelledby="settings-appearance">
            <h4 id="settings-appearance">Appearance</h4>
            <div className="segmented" role="group" aria-labelledby="settings-appearance">
              {THEMES.map(t => (
                <button key={t.value} type="button" aria-pressed={choice === t.value} onClick={() => setChoice(t.value)} data-autofocus={choice === t.value || undefined}>
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-group" aria-labelledby="settings-accent">
            <h4 id="settings-accent">Accent colour</h4>
            <div className="swatches" role="group" aria-labelledby="settings-accent">
              {ACCENTS.map(a => (
                <button
                  key={a.id}
                  type="button"
                  className="swatch"
                  style={{ background: theme === 'dark' ? a.dark : a.light }}
                  aria-label={a.name}
                  title={a.name}
                  aria-pressed={accent === a.id}
                  onClick={() => pickAccent(a.id)}
                >
                  {accent === a.id && <Check size={16} />}
                </button>
              ))}
              <label
                className="swatch custom"
                title="Any colour"
                style={isHex(accent) ? { background: resolveAccent(accent)[theme] } : undefined}
                data-selected={isHex(accent) || undefined}
              >
                {isHex(accent) ? <Check size={16} /> : <Pipette size={16} />}
                <input
                  type="color"
                  aria-label="Pick any colour"
                  value={isHex(accent) ? accent : '#99e5b7'}
                  onChange={e => pickAccent(e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="settings-group">
            <button type="button" className="settings-row" role="switch" aria-checked={mascotOn} onClick={() => onMascotChange(!mascotOn)}>
              <span>
                <strong>Mascot</strong>
                <small>The little friend in the corner</small>
              </span>
              <span className="switch" aria-hidden="true" />
            </button>

            {mascotOn && (
              <div className="settings-sub" role="group" aria-labelledby="settings-quotes">
                <span id="settings-quotes">Encouragement from the mascot</span>
                <div className="segmented">
                  {(
                    [
                      ['vi', 'Tiếng Việt'],
                      ['en', 'English'],
                      ['off', 'Off'],
                    ] as const
                  ).map(([value, label]) => (
                    <button key={value} type="button" aria-pressed={quotes === value} onClick={() => pickQuotes(value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!installed && (
              <button
                type="button"
                className="settings-row"
                onClick={() => {
                  onClose()
                  void start()
                }}
              >
                <span>
                  <strong>Install app</strong>
                  <small>Open My Space from your home screen</small>
                </span>
                <MonitorDown size={18} aria-hidden="true" />
              </button>
            )}

            <a className="settings-row" href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <span>
                <strong>Open source</strong>
                <small>Clone or contribute on GitHub</small>
              </span>
              <ExternalLink size={18} aria-hidden="true" />
            </a>
          </section>
        </Modal>
      )}
      {guideModal}
    </>
  )
}
