import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const LOADER_KEY = 'resume-loader-seen'

type PageLoaderProps = {
  onComplete: () => void
}

function PencilOrbit() {
  return (
    <svg className="h-28 w-28 md:h-32 md:w-32" viewBox="0 0 120 120" aria-hidden>
      <circle
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-cream/25"
      />
      <g className="loader-pencil-orbit motion-reduce:animate-none" style={{ transformOrigin: '60px 60px' }}>
        <g transform="translate(60, 12)">
          <path d="M-4 0 L4 0 L3 14 L-3 14 Z" fill="#f4efe6" />
          <path d="M-3 14 L3 14 L0 20 Z" fill="#d4a574" />
          <rect x="-4" y="-6" width="8" height="6" rx="1" fill="#d6d0c4" />
        </g>
      </g>
    </svg>
  )
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (reduce) {
      onComplete()
      return
    }

    try {
      if (sessionStorage.getItem(LOADER_KEY) === '1') {
        onComplete()
        return
      }
    } catch {
      /* ignore */
    }

    const duration = 1600
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setExiting(true)
        window.setTimeout(() => {
          try {
            sessionStorage.setItem(LOADER_KEY, '1')
          } catch {
            /* ignore */
          }
          onComplete()
        }, 520)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce, onComplete])

  if (reduce) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
      aria-busy={!exiting}
      role="status"
    >
      <p className="font-display text-6xl font-black tabular-nums text-cream md:text-7xl">{progress}%</p>
      <div className="mt-8 text-cream">
        <PencilOrbit />
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.35em] text-cream/40">Loading résumé</p>
    </motion.div>
  )
}
