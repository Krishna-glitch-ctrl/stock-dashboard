import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { getQuote, getCompanyProfile } from '../services/finnhub'
import { useWatchlist } from '../context/WatchlistContext'

export default function StockDetail() {
  const { symbol } = useParams()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()

  const [quote, setQuote] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const [q, p] = await Promise.all([
          getQuote(symbol),
          getCompanyProfile(symbol),
        ])
        if (!q.c) {
          setError('No data found for this symbol')
        } else {
          setQuote(q)
          setProfile(p)
        }
      } catch (err) {
        setError('Failed to load stock data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [symbol])

  // Finnhub's free tier doesn't include historical candle data, so we generate a
  // representative series client-side for visualization. In production, this would
  // call a paid historical endpoint.
  const chartData = useMemo(() => {
    if (!quote?.c) return []

    const startPrice = quote.pc || quote.c
    const endPrice = quote.c
    const points = 30

    const data = []
    let price = startPrice

    for (let i = 0; i < points - 1; i++) {
      // Nudge the price up or down by a random amount within ±2% each day,
      // but bias the walk so it lands near endPrice by the final day.
      const progress = i / (points - 1)
      const target = startPrice + (endPrice - startPrice) * progress
      const noise = price * 0.02 * (Math.random() * 2 - 1)
      price = target + noise
      data.push({ day: `Day ${i + 1}`, price: parseFloat(price.toFixed(2)) })
    }

    data.push({ day: 'Today', price: parseFloat(endPrice.toFixed(2)) })
    return data
  }, [quote])

  const isPositive = quote?.d >= 0
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400'
  const lineColor = isPositive ? '#10b981' : '#ef4444'
  const changeSign = isPositive ? '+' : ''

  const fmt = (n) => (n != null ? n.toFixed(2) : '—')
  const fmtMarketCap = (n) => {
    if (!n) return '—'
    return `$${(n / 1000).toFixed(2)}B`
  }

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-950 min-h-screen text-white p-8">
        <Link to="/" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <p className="text-red-400 text-lg mt-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Back link */}
        <Link to="/" className="text-gray-400 hover:text-white text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        {/* Company header */}
        <div className="flex items-center gap-4 mb-2">
          {profile?.logo && (
            <img
              src={profile.logo}
              alt={`${profile.name} logo`}
              className="w-12 h-12 rounded-lg object-contain bg-white p-1"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{profile?.name || symbol}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{symbol}</p>
          </div>
        </div>

        {/* Price section */}
        <div className="flex flex-wrap items-end gap-4 mt-6 mb-8">
          <span className="text-5xl font-bold">${fmt(quote.c)}</span>
          <span className={`text-xl mb-1 ${changeColor}`}>
            {changeSign}{fmt(quote.d)} ({changeSign}{fmt(quote.dp)}%)
          </span>
          {/* Watchlist toggle button */}
          {isInWatchlist(symbol) ? (
            <button
              onClick={() => removeFromWatchlist(symbol)}
              className="mb-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              ✓ Remove from Watchlist
            </button>
          ) : (
            <button
              onClick={() => addToWatchlist(symbol)}
              className="mb-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Add to Watchlist
            </button>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Open',       value: `$${fmt(quote.o)}`  },
            { label: 'High',       value: `$${fmt(quote.h)}`  },
            { label: 'Low',        value: `$${fmt(quote.l)}`  },
            { label: 'Prev Close', value: `$${fmt(quote.pc)}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-800 rounded-xl px-4 py-3">
              <p className="text-gray-400 text-xs mb-1">{label}</p>
              <p className="text-white text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <h2 className="text-lg font-semibold mb-4 text-gray-300">
          30-Day Price Trend (simulated)
        </h2>
        <div className="bg-gray-800 rounded-xl p-4 mb-10">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                interval={4}
              />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#d1d5db' }}
                itemStyle={{ color: lineColor }}
                formatter={(v) => [`$${v.toFixed(2)}`, 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Company info */}
        {profile?.name && (
          <div className="bg-gray-800 rounded-xl px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Industry',   value: profile.finnhubIndustry || '—' },
              { label: 'Country',    value: profile.country          || '—' },
              { label: 'Exchange',   value: profile.exchange         || '—' },
              { label: 'Market Cap', value: fmtMarketCap(profile.marketCapitalization) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
