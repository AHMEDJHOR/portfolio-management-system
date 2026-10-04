import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { getErrorMessage } from '../../lib/errors'

function getRedirect(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string') {
    return state.from
  }
  return '/admin'
}

export function AdminLogin() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isLoading && isAuthenticated) return <Navigate to={getRedirect(location.state)} replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login({ email: email.trim(), password })
    } catch (err) {
      setError(getErrorMessage(err))
      setIsSubmitting(false)
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-login__card" onSubmit={(event) => void handleSubmit(event)}>
        <p className="pf-label">Admin</p>
        <h1 className="admin-title">Sign in</h1>

        <div className="pf-field">
          <label htmlFor="login-email" className="pf-field__label">
            Email
          </label>
          <input id="login-email" type="email" autoComplete="username" required className="pf-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="pf-field">
          <label htmlFor="login-password" className="pf-field__label">
            Password
          </label>
          <input id="login-password" type="password" autoComplete="current-password" required className="pf-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && (
          <p className="pf-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="pf-button pf-button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}