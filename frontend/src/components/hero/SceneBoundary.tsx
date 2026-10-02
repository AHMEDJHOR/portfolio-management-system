import { Component, type ReactNode } from 'react'

interface SceneBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface SceneBoundaryState {
  hasError: boolean
}

// Keeps a WebGL/context failure from taking the rest of the Hero down.
export class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SceneBoundaryState {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}