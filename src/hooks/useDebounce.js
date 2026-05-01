import { useState, useEffect } from 'react'

// Delays updating a value until the user stops changing it for `delay` milliseconds.
// Useful for search inputs so we don't fire an API call on every single keystroke.
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    // If value changes before the timer fires, cancel the previous timer
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
