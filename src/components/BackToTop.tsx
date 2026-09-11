import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function BackToTop() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  if (!visible) return null

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-[45] flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-surface-elevated/95 text-ink shadow-glow backdrop-blur-md transition hover:border-accent/40 hover:bg-accent-muted hover:text-accent no-print"
      onClick={scrollUp}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  )
}
