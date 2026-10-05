import { useRef, type ReactNode } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import './Reveal.css'

export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const reduced = useReducedMotion() === true

  return (
    <div ref={ref} className={inView || reduced ? 'reveal is-in' : 'reveal'}>
      {children}
    </div>
  )
}