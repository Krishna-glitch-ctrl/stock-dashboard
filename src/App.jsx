import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import StockDetail from './pages/StockDetail'
import Watchlist from './pages/Watchlist'
import News from './pages/News'

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-900 text-white px-6 py-4 flex gap-6">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/watchlist" className="hover:text-gray-300">Watchlist</Link>
        <Link to="/news" className="hover:text-gray-300">News</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
