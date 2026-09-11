import { useCallback, useEffect, useRef, useState } from 'react'
import { GameScreenHeader } from './GameScreenHeader'

const DINO_HI_KEY = 'games-chrome-dino-high'

function readCssColor(varName: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  if (!v) return fallback
  if (v.includes('rgba') || v.includes('rgb(') || v.startsWith('#')) return v
  return `rgb(${v})`
}

type Obstacle = { x: number; w: number; h: number; passed: boolean }

export function ChromeDinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reqRef = useRef<number>(0)
  const runningRef = useRef(false)
  const gameOverRef = useRef(false)
  const lastTRef = useRef(0)
  const speedRef = useRef(320)
  const scoreAccRef = useRef(0)
  const nextSpawnRef = useRef(0)
  const scoreUiRef = useRef(0)

  const dinoVyRef = useRef(0)
  /** Canvas Y of feet on ground; -1 until first frame sizes the playfield */
  const feetYRef = useRef(-1)
  const airborneRef = useRef(false)

  const obstaclesRef = useRef<Obstacle[]>([])

  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => {
    try {
      const v = localStorage.getItem(DINO_HI_KEY)
      return v ? parseInt(v, 10) || 0 : 0
    } catch {
      return 0
    }
  })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cssW = canvas.clientWidth
    const cssH = canvas.clientHeight
    canvas.width = cssW * dpr
    canvas.height = cssH * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const groundY = cssH * 0.74
    const dinoX = cssW * 0.09
    const dinoW = Math.max(32, cssW * 0.06)
    const dinoIdleH = dinoW * 0.95

    const bg = readCssColor('--surface-muted', '#f5f5f5')
    const groundStripe = readCssColor('--surface-border', 'rgba(0,0,0,0.12)')
    const ink = readCssColor('--ink', '#1c1917')
    const accent = readCssColor('--accent', '#a16207')

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, cssW, cssH)

    ctx.strokeStyle = groundStripe
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, groundY + 1)
    ctx.lineTo(cssW, groundY + 1)
    ctx.stroke()

    const obstacles = obstaclesRef.current
    for (const o of obstacles) {
      ctx.fillStyle = ink
      ctx.fillRect(o.x, groundY - o.h, o.w, o.h)
      ctx.strokeStyle = accent
      ctx.strokeRect(o.x + 0.5, groundY - o.h + 0.5, o.w - 1, o.h - 1)
    }

    const fy = feetYRef.current > 0 ? feetYRef.current : groundY
    const dTop = fy - dinoIdleH

    ctx.fillStyle = ink
    ctx.fillRect(dinoX, dTop, dinoW * 0.55, dinoIdleH)

    ctx.fillRect(dinoX + dinoW * 0.52, dTop + dinoIdleH * 0.35, dinoW * 0.42, dinoIdleH * 0.22)

    ctx.fillRect(dinoX + dinoW * 0.72, dTop + dinoIdleH * 0.18, dinoW * 0.18, dinoIdleH * 0.18)

    ctx.fillStyle = accent
    ctx.fillRect(dinoX + dinoW * 0.15, dTop + dinoIdleH * 0.65, dinoW * 0.7, dinoIdleH * 0.12)

    if (!runningRef.current && !gameOverRef.current) {
      ctx.fillStyle = readCssColor('--ink-faint', '#78716c')
      ctx.font = `600 ${Math.max(14, cssW * 0.035)}px "DM Sans", system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('Space or tap to start', cssW / 2, cssH * 0.42)
    }
  }, [])

  const reset = useCallback(() => {
    obstaclesRef.current = []
    dinoVyRef.current = 0
    feetYRef.current = -1
    airborneRef.current = false
    speedRef.current = 320
    scoreAccRef.current = 0
    scoreUiRef.current = 0
    nextSpawnRef.current = 0
    setScore(0)
    setGameOver(false)
    gameOverRef.current = false
  }, [])

  const jump = useCallback(() => {
    if (gameOverRef.current) return
    if (!runningRef.current) {
      runningRef.current = true
      setRunning(true)
      lastTRef.current = 0
      return
    }
    if (!airborneRef.current) {
      dinoVyRef.current = -680
      airborneRef.current = true
    }
  }, [])

  const tick = useCallback((t: number) => {
    const canvas = canvasRef.current
    if (!canvas || !runningRef.current || gameOverRef.current) return

    if (!lastTRef.current) lastTRef.current = t
    const dt = Math.min(0.05, (t - lastTRef.current) / 1000)
    lastTRef.current = t

    const cssW = canvas.clientWidth
    const cssH = canvas.clientHeight
    const groundY = cssH * 0.74
    const dinoX = cssW * 0.09
    const dinoW = Math.max(32, cssW * 0.06)
    const dinoIdleH = dinoW * 0.95

    const g = 2400
    if (airborneRef.current || (feetYRef.current > 0 && feetYRef.current < groundY)) {
      dinoVyRef.current += g * dt
      feetYRef.current += dinoVyRef.current * dt
      if (feetYRef.current >= groundY) {
        feetYRef.current = groundY
        dinoVyRef.current = 0
        airborneRef.current = false
      }
    } else {
      feetYRef.current = groundY
    }

    const sp = speedRef.current
    speedRef.current = Math.min(560, sp + 2 * dt)

    const obs = obstaclesRef.current
    for (const o of obs) {
      o.x -= sp * dt
    }
    while (obs.length && obs[0]!.x + obs[0]!.w < -20) {
      obs.shift()
    }

    nextSpawnRef.current -= sp * dt
    if (nextSpawnRef.current <= 0) {
      const w = 18 + Math.random() * 14
      const h = 28 + Math.random() * 36
      obs.push({ x: cssW + 24, w, h, passed: false })
      nextSpawnRef.current = 220 + Math.random() * 140 + (580 - sp) * 0.15
    }

    const dTop = feetYRef.current - dinoIdleH
    const dRect = { l: dinoX, t: dTop, r: dinoX + dinoW * 0.94, b: feetYRef.current }

    for (const o of obs) {
      if (
        dRect.r > o.x + 4 &&
        dRect.l < o.x + o.w - 4 &&
        dRect.b > groundY - o.h + 4 &&
        dRect.t < groundY - 4
      ) {
        gameOverRef.current = true
        setGameOver(true)
        runningRef.current = false
        setRunning(false)
        setBest((b) => {
          const final = Math.floor(scoreAccRef.current)
          const nb = Math.max(b, final)
          try {
            localStorage.setItem(DINO_HI_KEY, String(nb))
          } catch {
            /* ignore */
          }
          return nb
        })
        setScore(Math.floor(scoreAccRef.current))
        return
      }

      if (!o.passed && dinoX > o.x + o.w) {
        o.passed = true
        scoreAccRef.current += 8
      }
    }

    scoreAccRef.current += sp * dt * 0.14

    scoreUiRef.current += dt
    if (scoreUiRef.current >= 0.08) {
      scoreUiRef.current = 0
      setScore(Math.floor(scoreAccRef.current))
    }
  }, [])

  useEffect(() => {
    const onResize = () => draw()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [draw])

  useEffect(() => {
    draw()
  }, [draw, score, running, gameOver])

  useEffect(() => {
    let cancelled = false
    const loop = (t: number) => {
      if (cancelled) return
      tick(t)
      draw()
      reqRef.current = requestAnimationFrame(loop)
    }
    reqRef.current = requestAnimationFrame(loop)
    return () => {
      cancelled = true
      cancelAnimationFrame(reqRef.current)
    }
  }, [tick, draw])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key
      if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') {
        e.preventDefault()
        if (gameOverRef.current) {
          reset()
          runningRef.current = true
          setRunning(true)
          lastTRef.current = 0
          return
        }
        jump()
      }
    }
    window.addEventListener('keydown', onKey, { passive: false })
    return () => window.removeEventListener('keydown', onKey)
  }, [jump, reset])

  return (
    <>
      <GameScreenHeader
        kicker="Arcade"
        title="Chrome dino"
        description="Inspired by Chrome’s dinosaur game — jump obstacles, score climbs with distance. Space or tap; speed ramps gently. Best saved locally."
      />

      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-ink-faint">
            Score <span className="font-mono font-semibold text-ink tabular-nums">{score}</span>
          </span>
          <span className="text-ink-faint">
            Best{' '}
            <span className="font-mono font-semibold text-ink tabular-nums">{best}</span>
          </span>
        </div>

        {gameOver && (
          <p className="rounded-xl border border-pop-bright/30 bg-pop/10 px-4 py-3 text-center text-sm font-medium text-ink">
            Crashed — try again once the lanes clear.
          </p>
        )}

        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Chrome-style dinosaur runner canvas"
          onPointerDown={(e) => {
            e.preventDefault()
            if (gameOverRef.current) {
              reset()
              runningRef.current = true
              setRunning(true)
              lastTRef.current = 0
              return
            }
            jump()
          }}
          className="hero-ring cursor-pointer touch-manipulation select-none h-[min(52vw,360px)] w-full rounded-2xl border border-surface-border bg-surface-muted shadow-card"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              reset()
              lastTRef.current = 0
              runningRef.current = false
              setRunning(false)
            }}
            className="rounded-full border border-surface-border bg-surface-muted/80 px-6 py-2.5 text-sm font-medium text-ink-soft transition hover:border-accent/30"
          >
            Reset
          </button>
          {gameOver ? (
            <button
              type="button"
              onClick={() => {
                reset()
                runningRef.current = true
                setRunning(true)
                lastTRef.current = 0
              }}
              className="rounded-full border border-accent/35 bg-accent-muted px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/50"
            >
              Play again
            </button>
          ) : null}
        </div>

        <p className="text-center text-xs text-ink-faint">
          Space / ↑ / tap to jump · not affiliated with Google
        </p>
      </div>
    </>
  )
}
