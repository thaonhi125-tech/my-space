'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * My Space's mascot: a small mint blob with two eyes, after the idea of
 * jeremy-prt/bloub (MIT) but drawn for this design system. Its life is quiet on
 * purpose — it blinks and its gaze drifts now and then; it looks at the cursor
 * when you hover it and does a happy hop when clicked. No animation library,
 * nothing runs while the tab is hidden, and it holds still for reduced motion.
 */

type Mood = 'idle' | 'curious' | 'happy'

const MAX_GAZE = 2.4 // viewBox units the eyes may travel from centre
const rand = (min: number, max: number) => min + Math.random() * (max - min)

export function Mascot({ size = 32 }: { size?: number }) {
  const [gaze, setGaze] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const [mood, setMood] = useState<Mood>('idle')
  const root = useRef<SVGSVGElement>(null)
  const moodRef = useRef(mood)
  moodRef.current = mood

  // Idle life: blinks and occasional glances, paused when hidden or when the
  // user prefers reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timers: ReturnType<typeof setTimeout>[] = []
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms))

    const scheduleBlink = () =>
      later(() => {
        if (!document.hidden) {
          setBlink(true)
          later(() => setBlink(false), 130)
          // Now and then a double blink.
          if (Math.random() < 0.2) {
            later(() => setBlink(true), 260)
            later(() => setBlink(false), 390)
          }
        }
        scheduleBlink()
      }, rand(2600, 6200))

    const scheduleGlance = () =>
      later(() => {
        if (!document.hidden && moodRef.current === 'idle') {
          const back = Math.random() < 0.35
          const angle = rand(0, Math.PI * 2)
          const dist = back ? 0 : rand(0.8, MAX_GAZE)
          setGaze({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist * 0.7 })
        }
        scheduleGlance()
      }, rand(1800, 4600))

    scheduleBlink()
    scheduleGlance()
    return () => timers.forEach(clearTimeout)
  }, [])

  const lookAt = (clientX: number, clientY: number) => {
    const box = root.current?.getBoundingClientRect()
    if (!box) return
    const dx = clientX - (box.left + box.width / 2)
    const dy = clientY - (box.top + box.height / 2)
    const len = Math.hypot(dx, dy) || 1
    const reach = Math.min(1, len / 40) * MAX_GAZE
    setGaze({ x: (dx / len) * reach, y: (dy / len) * reach * 0.7 })
  }

  return (
    <svg
      ref={root}
      className={`mascot mascot-${mood} ${blink ? 'mascot-blink' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      onPointerEnter={e => {
        setMood('curious')
        lookAt(e.clientX, e.clientY)
      }}
      onPointerMove={e => moodRef.current === 'curious' && lookAt(e.clientX, e.clientY)}
      onPointerLeave={() => {
        setMood(m => (m === 'curious' ? 'idle' : m))
        setGaze({ x: 0, y: 0 })
      }}
      onPointerDown={() => {
        setMood('happy')
        setTimeout(() => setMood('idle'), 900)
      }}
    >
      <g className="mascot-bounce">
        <circle className="mascot-body" cx="16" cy="16" r="15" />
        <g className="mascot-eyes" style={{ transform: `translate(${gaze.x}px, ${gaze.y}px)` }}>
          {mood === 'happy' ? (
            <>
              <path className="mascot-smile" d="M10.6 16.4 Q12.6 13.2 14.6 16.4" />
              <path className="mascot-smile" d="M17.4 16.4 Q19.4 13.2 21.4 16.4" />
            </>
          ) : (
            <>
              <rect className="mascot-eye" x="11" y="11" width="3.4" height="8" rx="1.7" />
              <rect className="mascot-eye" x="17.6" y="11" width="3.4" height="8" rx="1.7" />
            </>
          )}
        </g>
      </g>
    </svg>
  )
}
