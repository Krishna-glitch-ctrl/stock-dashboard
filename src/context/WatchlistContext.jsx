import { createContext, useContext, useState, useEffect } from 'react'

// The context object — holds everything the watchlist feature needs
export const WatchlistContext = createContext(null)

// WatchlistProvider wraps the app so any child component can access watchlist data
export function WatchlistProvider({ children }) {
  // Each item in the array looks like: { symbol: "AAPL", note: "" }
  const [watchlist, setWatchlist] = useState([])

  // has to be state (not a ref) so updating it triggers a re-render, which makes
  // the save effect re-run and actually write to localStorage
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('watchlist')
      if (saved) setWatchlist(JSON.parse(saved))
    } catch (err) {
      console.error('Failed to load watchlist from localStorage:', err)
    }
    setHasLoaded(true)
  }, [])

  // skip on first render — otherwise we'd wipe localStorage before we've read it
  useEffect(() => {
    if (!hasLoaded) return
    try {
      localStorage.setItem('watchlist', JSON.stringify(watchlist))
    } catch (err) {
      console.error('Failed to save watchlist to localStorage:', err)
    }
  }, [watchlist, hasLoaded])

  function addToWatchlist(symbol) {
    setWatchlist((prev) => {
      if (prev.some((item) => item.symbol === symbol)) return prev
      return [...prev, { symbol, note: '' }]
    })
  }

  function removeFromWatchlist(symbol) {
    setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol))
  }

  function updateNote(symbol, note) {
    setWatchlist((prev) =>
      prev.map((item) => (item.symbol === symbol ? { ...item, note } : item))
    )
  }

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
