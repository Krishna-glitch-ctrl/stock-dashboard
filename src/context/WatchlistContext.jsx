import { createContext, useContext, useState, useEffect, useRef } from 'react'

// The context object — holds everything the watchlist feature needs
export const WatchlistContext = createContext(null)

// WatchlistProvider wraps the app so any child component can access watchlist data
export function WatchlistProvider({ children }) {
  // Each item in the array looks like: { symbol: "AAPL", note: "" }
  const [watchlist, setWatchlist] = useState([])

  // This ref flips to true once we've finished reading from localStorage.
  // It prevents us from overwriting saved data before we've loaded it.
  const hasLoaded = useRef(false)

  // On first render: load the saved watchlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('watchlist')
      if (saved) setWatchlist(JSON.parse(saved))
    } catch (err) {
      console.error('Failed to load watchlist from localStorage:', err)
    }
    hasLoaded.current = true
  }, [])

  // Whenever the watchlist changes: save it to localStorage.
  // We skip this on the very first render (before hydration) using the ref above.
  useEffect(() => {
    if (!hasLoaded.current) return
    try {
      localStorage.setItem('watchlist', JSON.stringify(watchlist))
    } catch (err) {
      console.error('Failed to save watchlist to localStorage:', err)
    }
  }, [watchlist])

  // Add a symbol if it isn't already in the list
  function addToWatchlist(symbol) {
    setWatchlist((prev) => {
      if (prev.some((item) => item.symbol === symbol)) return prev
      return [...prev, { symbol, note: '' }]
    })
  }

  // Remove a symbol from the list
  function removeFromWatchlist(symbol) {
    setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol))
  }

  // Update the personal note for a given symbol
  function updateNote(symbol, note) {
    setWatchlist((prev) =>
      prev.map((item) => (item.symbol === symbol ? { ...item, note } : item))
    )
  }

  // Returns true if the symbol is already in the watchlist
  function isInWatchlist(symbol) {
    return watchlist.some((item) => item.symbol === symbol)
  }

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, updateNote, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

// Custom hook — call this inside any component to access the watchlist
export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used inside a WatchlistProvider')
  return ctx
}
