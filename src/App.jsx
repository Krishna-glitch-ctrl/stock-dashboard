import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { WatchlistProvider, useWatchlist } from './context/WatchlistContext'
import Home from './pages/Home'
import StockDetail from './pages/StockDetail'
import Watchlist from './pages/Watchlist'
import News from './pages/News'

// Separate component so it can call useWatchlist() (which needs the provider above it)
function Navbar() {
  const { watchlist } = useWatchlist()
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex gap-6 items-center">
      <Link to="/" className="hover:text-gray-300">Home</Link>
      <Link to="/watchlist" className="hover:text-gray-300 flex items-center gap-1.5">
        Watchlist
        {/* Badge showing how many stocks are saved */}
        {watchlist.length > 0 && (
          <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {watchlist.length}
          </span>
        )}
      </Link>
      <Link to="/news" className="hover:text-gray-300">News</Link>
    </nav>
  )
}

function App() {
  return (
    // WatchlistProvider wraps everything so Navbar and all pages can access watchlist state
    <WatchlistProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </BrowserRouter>
    </WatchlistProvider>
  )
}

export default App
