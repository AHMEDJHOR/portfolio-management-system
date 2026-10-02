import { useEffect, useRef, type RefObject } from 'react'

export interface PointerOffset {
  x: number // -1 (left) … 1 (right)
  y: number // -1 (top) … 1 (bottom)
}

/**
 * Tracks the mouse over the Hero without React state: it writes to a ref (read by
 * the 3D scene each frame) and to --hero-px/--hero-py (read by CSS). No rerenders.
 */
export function useHeroPointer(
  sectionRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): RefObject<PointerOffset> {
  const offset = useRef<PointerOffset>({ x: 0, y: 0 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !enabled) return

    const update = (x: number, y: number) => {
      offset.current.x = x
      offset.current.y = y
      section.style.setProperty('--hero-px', x.toFixed(3))
      section.style.setProperty('--hero-py', y.toFixed(3))
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = section.getBoundingClientRect()
      update(
        ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      )
    }
    const handleLeave = () => update(0, 0)

    section.addEventListener('pointermove', handleMove, { passive: true })
    section.addEventListener('pointerleave', handleLeave)
    return () => {
      section.removeEventListener('pointermove', handleMove)
      section.removeEventListener('pointerleave', handleLeave)
      update(0, 0)
    }
  }, [sectionRef, enabled])

  return offset
}