import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { getQuote } from '../services/finnhub'

export default function Watchlist() {
  const { watchlist, removeFromWatchlist, updateNote } = useWatchlist()

  // quotes is an object: { "AAPL": { c: 123, d: 1.2, dp: 0.98, ... }, ... }
  const [quotes, setQuotes] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (watchlist.length === 0) {
      setQuotes({})
      return
    }
    async function fetchQuotes() {
      setLoading(true)
      const results = await Promise.all(
        watchlist.map(({ symbol }) => getQuote(symbol))
      )
      // Turn the array of results into a { symbol: quote } map
      const map = {}
      watchlist.forEach(({ symbol }, i) => { map[symbol] = results[i] })
      setQuotes(map)
      setLoading(false)
    }
    fetchQuotes()
  }, [watchlist])

  const fmt = (n) => (n != null ? n.toFixed(2) : '—')

  return (
    <div className="bg-gray-950 min-h-screen text-white p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>

        {watchlist.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg mb-4">Your watchlist is empty.</p>
            <p className="mb-6">Add stocks from the Home page.</p>
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors">
              ← Go to Home
            </Link>
          </div>
        )}

        {watchlist.length > 0 && loading && (
          <p className="text-gray-400">Loading quotes...</p>
        )}

        {!loading && watchlist.map(({ symbol, note }) => {
          const q = quotes[symbol] || {}
          const isPositive = q.d >= 0
          const changeColor = isPositive ? 'text-green-400' : 'text-red-400'
          const changeSign = isPositive ? '+' : ''

          return (
            <div
              key={symbol}
              className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 mb-4"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <Link
                    to={`/stock/${symbol}`}
                    className="text-2xl font-bold hover:text-blue-400 transition-colors"
                  >
                    {symbol}
                  </Link>
                  {q.c ? (
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl text-white">${fmt(q.c)}</span>
                      <span className={`text-sm ${changeColor}`}>
                        {changeSign}{fmt(q.d)} ({changeSign}{fmt(q.dp)}%)
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mt-1">No quote data</p>
                  )}
                </div>

                <button
                  onClick={() => removeFromWatchlist(symbol)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>

              <textarea
                value={note}
                onChange={(e) => updateNote(symbol, e.target.value)}
                placeholder="Add a personal note..."
                rows={2}
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm px-3 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
