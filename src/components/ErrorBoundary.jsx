// catches any crash inside its children and shows a fallback screen instead of
// a blank page. has to be a class component because getDerivedStateFromError and
// componentDidCatch don't exist as hooks yet — this is one of those rare cases
// where you still need a class in React. doesn't catch errors in event handlers
// or async code though, those need their own try/catch.

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // Called when a child throws during rendering — updates state to show fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  // Called after the error is captured — good place for logging
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-8 text-center max-w-md">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Reload
          </button>
          {this.state.error && (
            <p className="text-gray-600 text-xs mt-8 max-w-lg text-center break-words">
              {this.state.error.message}
            </p>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
