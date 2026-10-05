import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import './TypeText.css'

interface TypeTextProps {
  children: string
  /** Typing begins once this is true (usually "the section is in view"). */
  start: boolean
  /** Milliseconds to wait after `start` before the first character. */
  delay?: number
  /** Milliseconds per character. */
  speed?: number
}

/**
 * Types its text in. The full text always stays in the DOM (sr-only copy for assistive
 * tech, invisible remainder for layout), so nothing reflows while it is being "written".
 */
export function TypeText({ children, start, delay = 0, speed = 28 }: TypeTextProps) {
  const reduced = useReducedMotion() === true
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start || reduced) return

    let raf = 0
    let last = -1
    const begin = performance.now() + delay

    const tick = (now: number) => {
      const next = Math.min(children.length, Math.max(0, Math.floor((now - begin) / speed)))
      if (next !== last) {
        last = next
        setCount(next)
      }
      if (next < children.length) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, reduced, children, delay, speed])

  const shown = reduced ? children.length : Math.min(count, children.length)
  const typing = start && !reduced && shown < children.length

  return (
    <span className="type">
      <span className="sr-only">{children}</span>
      <span className="type__visual" aria-hidden="true">
        <span className={typing ? 'type__done is-typing' : 'type__done'}>
          {children.slice(0, shown)}
        </span>
        <span className="type__rest">{children.slice(shown)}</span>
      </span>
    </span>
  )
}