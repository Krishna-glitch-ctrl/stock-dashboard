// Your Finnhub API key, loaded from the .env file
export const API_KEY = import.meta.env.VITE_FINNHUB_KEY

const BASE = 'https://finnhub.io/api/v1'

// Searches for stocks matching the query string (e.g. "Apple" or "AAPL").
// Returns an array of matching results, or an empty array if something goes wrong.
export async function searchStocks(query) {
  try {
    const res = await fetch(`${BASE}/search?q=${query}&token=${API_KEY}`)
    const data = await res.json()
    return data.result ?? []
  } catch (err) {
    console.error('searchStocks error:', err)
    return []
  }
}

// Fetches the latest price quote for a stock symbol (e.g. "AAPL").
// Returns an object with fields like c (current price), d (change), dp (% change).
export async function getQuote(symbol) {
  try {
    const res = await fetch(`${BASE}/quote?symbol=${symbol}&token=${API_KEY}`)
    return await res.json()
  } catch (err) {
    console.error('getQuote error:', err)
    return {}
  }
}

// Fetches the latest general market news articles as an array.
export async function getMarketNews() {
  try {
    const res = await fetch(`${BASE}/news?category=general&token=${API_KEY}`)
    return await res.json()
  } catch (err) {
    console.error('getMarketNews error:', err)
    return []
  }
}

// Fetches company profile info for a stock symbol (e.g. name, logo, industry).
export async function getCompanyProfile(symbol) {
  try {
    const res = await fetch(`${BASE}/stock/profile2?symbol=${symbol}&token=${API_KEY}`)
    return await res.json()
  } catch (err) {
    console.error('getCompanyProfile error:', err)
    return {}
  }
}
