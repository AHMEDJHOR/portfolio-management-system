import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ConfirmContext, type ConfirmFn, type ConfirmOptions } from './confirm-context'
import './Confirm.css'

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<((result: boolean) => void) | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const confirm = useCallback<ConfirmFn>(
    (next) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve
        setOptions(next)
      }),
    [],
  )

  // Native modal dialog: focus trap, Esc to close and an inert page behind it, for free.
  useEffect(() => {
    const dialog = dialogRef.current
    if (options && dialog && !dialog.open) dialog.showModal()
  }, [options])

  const finish = (result: boolean) => {
    resolver.current?.(result)
    resolver.current = null
    dialogRef.current?.close()
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <dialog
          ref={dialogRef}
          className="confirm"
          aria-labelledby="confirm-title"
          aria-describedby={options.message ? 'confirm-message' : undefined}
          onClose={() => finish(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) finish(false)
          }}
        >
          <div className="confirm__panel">
            <span className={options.tone === 'danger' ? 'confirm__icon is-danger' : 'confirm__icon'} aria-hidden="true">
              !
            </span>
            <h2 id="confirm-title" className="confirm__title">
              {options.title}
            </h2>
            {options.message && (
              <p id="confirm-message" className="confirm__message">
                {options.message}
              </p>
            )}
            <div className="confirm__actions">
              <button type="button" className="pf-button pf-button--ghost" autoFocus onClick={() => finish(false)}>
                Cancel
              </button>
              <button
                type="button"
                className={options.tone === 'danger' ? 'pf-button pf-button--danger' : 'pf-button pf-button--primary'}
                onClick={() => finish(true)}
              >
                {options.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </ConfirmContext.Provider>
  )
}