import { useEffect, useRef, useState } from 'react'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DURATION = 420 // ms

function randomFor(char: string): string {
  if (/[0-9]/.test(char)) return String(Math.floor(Math.random() * 10))
  const pool = char === char.toLowerCase() ? LOWER : UPPER
  return pool[Math.floor(Math.random() * pool.length)] ?? char
}

/** Wrap a label's text. Hovering or focusing the parent link/button scrambles it, then restores it. */
export function ScrambleText({ children }: { children: string }) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const [frame, setFrame] = useState<string | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const trigger = root?.closest<HTMLElement>('a, button')
    if (!trigger) return

    let raf = 0
    let running = false

    const run = () => {
      if (running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      running = true
      const startedAt = performance.now()

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / DURATION, 1)
        if (progress >= 1) {
          running = false
          setFrame(null)
          return
        }
        const settled = Math.floor(progress * children.length)
        setFrame(
          Array.from(children, (char, index) =>
            index < settled || !/[a-z0-9]/i.test(char) ? char : randomFor(char),
          ).join(''),
        )
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    trigger.addEventListener('mouseenter', run)
    trigger.addEventListener('focus', run)
    return () => {
      cancelAnimationFrame(raf)
      trigger.removeEventListener('mouseenter', run)
      trigger.removeEventListener('focus', run)
    }
  }, [children])

  return (
    <span ref={rootRef} className="scramble">
      <span className={frame === null ? 'scramble__text' : 'scramble__text is-hidden'}>{children}</span>
      {frame !== null && (
        <span className="scramble__live" aria-hidden="true">
          {frame}
        </span>
      )}
    </span>
  )
}