import { useI18n } from '../../i18n/useI18n'

export function LanguageToggle() {
  const { language, setLanguage, t } = useI18n()
  const next = language === 'en' ? 'am' : 'en'

  return (
    <button
      type="button"
      className="theme-toggle lang-toggle"
      onClick={() => setLanguage(next)}
      aria-label={t('lang.switch')}
    >
      <span lang={next}>{t('lang.short')}</span>
    </button>
  )
}