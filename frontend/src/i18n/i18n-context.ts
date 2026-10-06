import { createContext } from 'react'
import type { Language, MessageKey } from './messages'

export interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)