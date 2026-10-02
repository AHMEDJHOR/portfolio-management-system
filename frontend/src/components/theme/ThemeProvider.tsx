import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme, type ThemeContextValue } from './theme-context'

// Must match the key used by the inline script in index.html.
const STORAGE_KEY = 'theme'
const LIGHT_QUERY = '(prefers-color-scheme: light)'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark'
}

function getInitialTheme(): Theme {
  // The inline script in index.html has already resolved the theme before
  // first paint; reading it back keeps React and the DOM in agreement.
  const applied = document.documentElement.dataset.theme
  return isTheme(applied) ? applied : (readStoredTheme() ?? getSystemTheme())
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Follow OS changes only while the user has not made an explicit choice.
  useEffect(() => {
    const query = window.matchMedia(LIGHT_QUERY)
    const handleChange = () => {
      if (readStoredTheme() === null) {
        setThemeState(getSystemTheme())
      }
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable (private mode, blocked): the theme still applies for this session.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}