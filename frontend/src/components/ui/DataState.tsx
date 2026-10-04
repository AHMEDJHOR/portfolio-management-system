import type { ReactNode } from 'react'
import { getErrorMessage } from '../../lib/errors'

interface DataStateProps {
  isPending: boolean
  error: Error | null
  isEmpty: boolean
  emptyMessage: string
  onRetry?: () => void
  children: ReactNode
}

export function DataState({ isPending, error, isEmpty, emptyMessage, onRetry, children }: DataStateProps) {
  if (isPending) {
    return (
      <p className="pf-state" role="status">
        Loading…
      </p>
    )
  }
  if (error) {
    return (
      <div className="pf-state" role="alert">
        <p>{getErrorMessage(error)}</p>
        {onRetry && (
          <button type="button" className="pf-button pf-button--ghost" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    )
  }
  if (isEmpty) return <p className="pf-state">{emptyMessage}</p>
  return <>{children}</>
}