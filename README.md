# Stock Market Dashboard

A React-based stock market dashboard built as a frontend capstone project. Users can search for stocks, view detailed price information with charts, manage a personal watchlist, and read market news.

## Live Demo
https://stock-dashboard-theta-six.vercel.app/

## Features
- Search any US stock by symbol or company name (debounced)
- Trending stocks on the home page with live prices
- Detailed view per stock: current price, daily change, open/high/low/prev close, 30-day price chart
- Personal watchlist with add/remove and personal notes (saved in localStorage)
- Market news feed with pagination
- Error boundary for graceful failure handling
- Dark themed UI

## Tech Stack
- React 19 (Vite)
- React Router v6
- Context API for state management
- Tailwind CSS
- Recharts for the price chart
- Finnhub API for stock data and news

## Getting Started

Install dependencies:

```
npm install
```

Create a `.env` file at the project root with:

```
VITE_FINNHUB_KEY=your_finnhub_api_key
```

Get a free key from [finnhub.io](https://finnhub.io).

Then start the dev server:

```
npm run dev
```

Visit http://localhost:5173.

## Project Structure

- `src/pages/` — page components (Home, StockDetail, Watchlist, News, NotFound)
- `src/components/` — reusable components (ErrorBoundary)
- `src/context/` — Context API providers (WatchlistContext)
- `src/hooks/` — custom hooks (useDebounce)
- `src/services/` — API integration (finnhub.js)

## Notes

- The 30-day chart uses a generated price series. Finnhub's free tier doesn't include historical candle data, so for a real production app this would call a paid endpoint or a different provider.
- Watchlist is stored in localStorage, so it persists across sessions on the same browser but doesn't sync across devices.
- The free tier of Finnhub allows 60 API calls per minute. The app handles 429 rate-limit responses gracefully.

## Built By
Krishna, BCA(Cybersecurity),Roll no.: 2501660036 , KR Mangalam University
