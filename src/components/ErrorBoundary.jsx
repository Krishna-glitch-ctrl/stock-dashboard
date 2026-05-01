// What is an Error Boundary?
// An Error Boundary is a React component that catches JavaScript errors thrown
// anywhere inside its child component tree. Without it, a single crash in any
// component would leave the whole screen blank and give the user no way to recover.
// Instead, an Error Boundary catches the error and shows a friendly fallback UI.
//
// Why must it be a class component?
// React's error-catching hooks (getDerivedStateFromError and componentDidCatch)
// only exist on class components. There is no functional-component equivalent yet,
// so this is one of the few remaining cases where a class is required in React.
//
// What does it protect against?
// Any runtime error that occurs during rendering, inside a lifecycle method, or
// inside a constructor of a child component. It does NOT catch errors in event
// handlers, async code, or server-side rendering — those need their own try/catch.

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
