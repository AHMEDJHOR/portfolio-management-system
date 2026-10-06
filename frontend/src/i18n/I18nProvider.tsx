import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18nContextValue } from './i18n-context'
import { messages, type Language, type MessageKey } from './messages'

const STORAGE_KEY = 'language'

function initialLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'am') return stored
  } catch {
    // Storage blocked: fall through to the browser language.
  }
  return navigator.language.toLowerCase().startsWith('am') ? 'am' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // The choice still applies for this session.
    }
  }, [])

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      let text: string = messages[language][key]
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value))
        }
      }
      return text
    },
    [language],
  )

  const value = useMemo<I18nContextValue>(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}