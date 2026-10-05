import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section className="pf-page" role="alert">
        <div className="pf-container pf-narrow">
          <p className="pf-label">Error</p>
          <h1 className="pf-title">Something went wrong</h1>
          <p className="pf-lead">This page failed to load. Reloading usually fixes it.</p>
          <p className="pf-more">
            <button type="button" className="pf-button pf-button--primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </p>
        </div>
      </section>
    )
  }
}