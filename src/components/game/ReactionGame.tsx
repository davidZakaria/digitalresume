import { useCallback, useEffect, useRef, useState } from 'react'
import { GameScreenHeader } from './GameScreenHeader'

type Phase = 'intro' | 'wait' | 'ready' | 'result' | 'falseStart'

export function ReactionGame() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [ms, setMs] = useState<number | null>(null)
  const startRef = useRef<number>(0)
  const waitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearWaitTimer = () => {
    if (waitTimeoutRef.current) {
      clearTimeout(waitTimeoutRef.current)
      waitTimeoutRef.current = null
    }
  }

  useEffect(() => () => clearWaitTimer(), [])

  const startRound = useCallback(() => {
    clearWaitTimer()
    setMs(null)
    setPhase('wait')
    const delay = 1500 + Math.random() * 3500
    waitTimeoutRef.current = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('ready')
    }, delay)
  }, [])

  const handleMainAction = () => {
    if (phase === 'intro' || phase === 'result' || phase === 'falseStart') {
      startRound()
      return
    }
    if (phase === 'wait') {
      clearWaitTimer()
      setPhase('falseStart')
      return
    }
    if (phase === 'ready') {
      const elapsed = Math.round(performance.now() - startRef.current)
      setMs(elapsed)
      setPhase('result')
    }
  }

  const label = (() => {
    switch (phase) {
      case 'intro':
        return 'Tap to start'
      case 'wait':
        return 'Wait…'
      case 'ready':
        return 'Go!'
      case 'falseStart':
        return 'Too soon — tap to try again'
      case 'result':
        return ms !== null ? `${ms} ms — tap to play again` : 'Tap to play again'
      default:
        return ''
    }
  })()

  const panelClass =
    phase === 'ready'
      ? 'border-accent/30 bg-gradient-to-br from-accent-muted to-accent-soft text-ink'
      : 'border-surface-border bg-surface-elevated text-ink-soft'

  return (
    <>
      <GameScreenHeader
        kicker="Mini-game"
        title="Reaction"
        description="When the panel turns warm amber and says Go, tap as fast as you can. Don’t jump the wait."
      />

      <div className="mx-auto max-w-xl space-y-6">
        <button
          type="button"
          onClick={handleMainAction}
          className={[
            'hero-ring flex min-h-[200px] w-full flex-col items-center justify-center rounded-2xl border-2 px-6 py-10 text-center shadow-card transition md:min-h-[240px]',
            panelClass,
          ].join(' ')}
          aria-live="polite"
        >
          <span className="font-display text-2xl font-semibold md:text-3xl">{label}</span>
          {phase === 'result' && ms !== null && (
            <span className="mt-3 text-sm text-ink-faint">Sub‑200 ms is excellent. Screens add latency.</span>
          )}
        </button>
      </div>
    </>
  )
}
