import { Outlet, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { PublicHeader } from '../components/navigation/PublicHeader'
import { PublicFooter } from '../components/navigation/PublicFooter'
import { ScrollProgress } from '../components/ui/ScrollProgress'
import { useI18n } from '../i18n/useI18n'

export function PublicLayout() {
  const { pathname } = useLocation()
  const { t } = useI18n()

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('skip')}
      </a>

      <ScrollProgress />

      <PublicHeader />

      <main id="main-content" tabIndex={-1}>
        <ErrorBoundary key={pathname}>
        <Suspense
      fallback={
        <div className="pf-page" role="status">
          <span className="sr-only">Loading…</span>
        </div>
      }
    >
      <Outlet />
    </Suspense>
        </ErrorBoundary>
      </main>

      <PublicFooter />
    </>
  )
}