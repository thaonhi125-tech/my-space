import type { SaveState } from '@/lib/models'

const labels = {
  idle: 'Saved in this browser',
  saved: 'Saved in this browser',
  saving: 'Saving…',
  error: 'Save failed',
  blocked: 'Not saving',
} as const

/**
 * Quiet save status: a dot while things are fine (details on hover), words
 * only when the user needs to act.
 */
export function SaveIndicator({ state, blocked = false }: { state: SaveState; blocked?: boolean }) {
  const key = blocked ? 'blocked' : state
  const problem = key === 'error' || key === 'blocked'
  return (
    <div className="save-state" data-state={problem ? 'error' : state} title={labels[key]} role={problem ? 'alert' : undefined}>
      <span className="dot" aria-hidden={!problem} />
      {problem ? labels[key] : <span className="sr-only">{labels[key]}</span>}
    </div>
  )
}
