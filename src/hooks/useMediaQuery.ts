import { useEffect, useState } from 'react'

function readMatch(query: string): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}

/** Live `window.matchMedia` subscription. Safe for Vite SPA (no SSR). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => readMatch(query))

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}
