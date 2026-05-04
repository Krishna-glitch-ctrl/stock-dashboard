import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useDebounce from '../hooks/useDebounce'
import { searchStocks, getQuote } from '../services/finnhub'

const TRENDING_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA']

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [trendingStocks, setTrendingStocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTrending() {
      const results = await Promise.all(
        TRENDING_SYMBOLS.map(async (symbol) => ({
          symbol,
          quote: await getQuote(symbol),
        }))
      )
      setTrendingStocks(results)
      setLoading(false)
    }
    loadTrending()
  }, [])

  const debouncedQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      return
    }
    async function runSearch() {
      const results = await searchStocks(debouncedQuery)
      setSearchResults(results.slice(0, 8))
    }
    runSearch()
  }, [debouncedQuery])

  return (
    <div className="bg-gray-950 min-h-screen text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Stock Dashboard</h1>

        <input
          type="text"
          placeholder="Search stocks (e.g. Apple or AAPL)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-2xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
        />

        {searchResults.length > 0 && (
          <div className="flex flex-col gap-2 max-w-2xl">
            {searchResults.map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stock/${stock.symbol}`}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition-colors"
              >
                <span className="font-bold text-white">{stock.symbol}</span>
                <span className="text-gray-400 ml-3 text-sm">{stock.description}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Trending stocks — only shown when search is empty */}
        {searchResults.length === 0 && !searchQuery && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Trending Stocks</h2>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingStocks.map(({ symbol, quote }) => {
                  const isPositive = quote.d >= 0
                  return (
                    <Link
                      key={symbol}
                      to={`/stock/${symbol}`}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-5 py-4 transition-colors"
                    >
                      <div className="text-2xl font-bold mb-2">{symbol}</div>
                      <div className="text-xl">${quote.c?.toFixed(2)}</div>
                      <div className={`text-sm mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{quote.d?.toFixed(2)} ({isPositive ? '+' : ''}{quote.dp?.toFixed(2)}%)
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
