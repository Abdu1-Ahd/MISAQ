import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'

interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true } }
  componentDidCatch(_error: Error, _info: ErrorInfo): void {}

  render(): ReactNode {
    if (this.state.hasError) return <main className="state-screen"><section><h1>Something went wrong</h1><button type="button" onClick={() => window.location.reload()}>Reload</button></section></main>
    return this.props.children
  }
}