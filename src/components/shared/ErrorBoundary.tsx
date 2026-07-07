'use client'

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error } }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[var(--text-secondary)] font-medium mb-1">页面加载出错</p>
          <p className="text-sm text-[var(--text-secondary)]/70 mb-4">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })} className="px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-white">
            重试
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
