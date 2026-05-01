import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3">Page not found</h2>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
