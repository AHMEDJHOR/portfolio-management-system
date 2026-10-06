import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'

export function NotFound() {
  const { t } = useI18n()

  return (
    <main className="pf-page">
      <div className="pf-container pf-narrow">
        <p className="pf-label">404</p>
        <h1 className="pf-title">{t('notFound.title')}</h1>
        <p className="pf-lead">{t('notFound.text')}</p>
        <p className="pf-more">
          <Link className="pf-link" to="/">
            {t('notFound.home')}
          </Link>
        </p>
      </div>
    </main>
  )
}