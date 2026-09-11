import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const LOADER_KEY = 'resume-loader-seen'
const LOAD_MS = 1100
const HELLO_MS = 250
const FADE_MS = 250

type PageLoaderProps = {
  onComplete: () => void
}

function ProgressRing({ progress }: { progress: number }) {
  const r = 46
  const c = 2 * Math.PI * r
  const offset = c - (progress / 100) * c

  return (
    <svg className="h-32 w-32 md:h-36 md:w-36" viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="1" className="text-cream/20" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-cream"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 0.08s linear' }}
      />
    </svg>
  )
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'count' | 'hello' | 'exit'>('count')

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

    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = now - start
      if (elapsed < LOAD_MS) {
        const t = elapsed / LOAD_MS
        const eased = 1 - Math.pow(1 - t, 2.2)
        setProgress(Math.min(100, Math.round(eased * 100)))
        frame = requestAnimationFrame(tick)
      } else {
        setProgress(100)
      }
    }

    frame = requestAnimationFrame(tick)

    const helloTimer = window.setTimeout(() => setPhase('hello'), LOAD_MS)
    const exitTimer = window.setTimeout(() => setPhase('exit'), LOAD_MS + HELLO_MS)
    const doneTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(LOADER_KEY, '1')
      } catch {
        /* ignore */
      }
      onComplete()
    }, LOAD_MS + HELLO_MS + FADE_MS)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(helloTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
    }
  }, [reduce, onComplete])

  if (reduce) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
      aria-busy={phase !== 'exit'}
      role="status"
    >
      <AnimatePresence mode="wait">
        {phase === 'hello' || phase === 'exit' ? (
          <motion.p
            key="hello"
            className="font-script text-6xl text-cream md:text-7xl"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            hello
          </motion.p>
        ) : (
          <motion.div key="count" className="flex flex-col items-center">
            <p className="font-display text-6xl font-black tabular-nums text-cream md:text-7xl">{progress}%</p>
            <div className="mt-6 text-cream">
              <ProgressRing progress={progress} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
