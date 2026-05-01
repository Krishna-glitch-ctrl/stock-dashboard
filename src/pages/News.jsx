import { useState, useEffect } from 'react'
import { getMarketNews } from '../services/finnhub'

const ITEMS_PER_PAGE = 10

// Converts a Unix timestamp (seconds) into a human-readable relative time string
function timeAgo(unixSeconds) {
  const diff = Math.floor(Date.now() / 1000) - unixSeconds
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function News() {
  const [news, setNews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all news articles once when the page first loads
  useEffect(() => {
    async function loadNews() {
      try {
        const data = await getMarketNews()
        if (!Array.isArray(data) || data.length === 0) {
          setError('No news articles found.')
        } else {
          setNews(data)
        }
      } catch (err) {
        setError('Failed to load news. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [])

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const pageItems = news.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  function goToPage(page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Market News</h1>

        {/* Loading state */}
        {loading && <p className="text-gray-400">Loading news...</p>}

        {/* Error state */}
        {error && <p className="text-red-400">{error}</p>}

        {/* News cards */}
        {!loading && !error && (
          <>
            <div className="flex flex-col gap-4 mb-8">
              {pageItems.map((item, i) => (
                <div
                  key={item.id ?? i}
                  className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-4 flex gap-4 transition-colors"
                >
                  {/* Thumbnail */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-24 h-24 object-cover rounded-lg shrink-0"
                    />
                  )}

                  {/* Text content */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-medium text-gray-300">{item.source}</span>
                      <span>·</span>
                      <span>{timeAgo(item.datetime)}</span>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-blue-400 transition-colors leading-snug"
                    >
                      {item.headline}
                    </a>

                    {item.summary && (
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {item.summary.length > 150
                          ? item.summary.slice(0, 150) + '…'
                          : item.summary}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-gray-400 text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
