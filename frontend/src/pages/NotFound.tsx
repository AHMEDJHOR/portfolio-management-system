import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="pf-page">
      <div className="pf-container pf-narrow">
        <p className="pf-label">404</p>
        <h1 className="pf-title">Page not found</h1>
        <p className="pf-lead">The page you are looking for does not exist or has moved.</p>
        <p className="pf-more">
          <Link className="pf-link" to="/">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}