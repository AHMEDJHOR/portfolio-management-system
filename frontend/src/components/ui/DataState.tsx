import type { ReactNode } from 'react'
import { getErrorMessage } from '../../lib/errors'
import { useI18n } from '../../i18n/useI18n'

interface DataStateProps {
  isPending: boolean
  error: Error | null
  isEmpty: boolean
  emptyMessage: string
  onRetry?: () => void
  children: ReactNode
}

export function DataState({ isPending, error, isEmpty, emptyMessage, onRetry, children }: DataStateProps) {
  const { t } = useI18n()

  if (isPending) {
    return (
      <div role="status">
        <span className="sr-only">{t('state.loading')}</span>
        <div className="pf-grid" aria-hidden="true">
          {[0, 1, 2].map((key) => (
            <div key={key} className="pf-skeleton" />
          ))}
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="pf-state" role="alert">
        <p>{getErrorMessage(error)}</p>
        {onRetry && (
          <button type="button" className="pf-button pf-button--ghost" onClick={onRetry}>
            {t('state.retry')}
          </button>
        )}
      </div>
    )
  }
  if (isEmpty) return <p className="pf-state">{emptyMessage}</p>
  return <>{children}</>
}