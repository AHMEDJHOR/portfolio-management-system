import { useEffect, useState } from 'react'
import type { Tone } from './config'

export type ToneColors = Record<Tone, string>

function readColors(): ToneColors {
  const style = getComputedStyle(document.documentElement)
  const read = (name: string) => style.getPropertyValue(name).trim()
  return {
    primary: read('--color-primary'),
    secondary: read('--color-secondary'),
    tertiary: read('--color-tertiary'),
    neutral: read('--color-text-secondary'),
  }
}

// Reads the site's semantic tokens and re-reads them when ThemeProvider flips
// data-theme, so the scene never owns a second palette.
export function useSceneColors(): ToneColors {
  const [colors, setColors] = useState(readColors)

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readColors()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return colors
}