import { useEffect, useState } from 'react'

/** Returns the id of the section crossing the upper-middle of the viewport. */
export function useActiveSection(ids: readonly string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (entry.isIntersecting) setActive(id)
          else setActive((current) => (current === id ? null : current))
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [ids, enabled])

  return enabled ? active : null
}