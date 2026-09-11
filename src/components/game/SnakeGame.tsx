import { useCallback, useEffect, useRef, useState } from 'react'
import { GameScreenHeader } from './GameScreenHeader'

const COLS = 18
const ROWS = 18
const BASE_MS = 140
const MIN_MS = 55
const SNAKE_HI_KEY = 'games-snake-high'
const SNAKE_HI_LEGACY = 'resume-snake-best'

function readCssColor(varName: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  if (!v) return fallback
  if (v.includes('rgba') || v.includes('rgb(') || v.startsWith('#')) return v
  return `rgb(${v})`
}

type Pt = { x: number; y: number }

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => {
    try {
      const v = localStorage.getItem(SNAKE_HI_KEY) ?? localStorage.getItem(SNAKE_HI_LEGACY)
      return v ? parseInt(v, 10) || 0 : 0
    } catch {
      return 0
    }
  })
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)

  const snakeRef = useRef<Pt[]>([{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }])
  const dirRef = useRef<Pt>({ x: 1, y: 0 })
  const pendingDirRef = useRef<Pt>({ x: 1, y: 0 })
  const foodRef = useRef<Pt>({ x: 12, y: 9 })
  const accRef = useRef(0)
  const lastRef = useRef(0)
  const frameRef = useRef<number>(0)

  const speedMs = Math.max(MIN_MS, BASE_MS - Math.min(70, score * 4))

  const reset = useCallback(() => {
    snakeRef.current = [
      { x: 8, y: 9 },
      { x: 7, y: 9 },
      { x: 6, y: 9 },
    ]
    dirRef.current = { x: 1, y: 0 }
    pendingDirRef.current = { x: 1, y: 0 }
    foodRef.current = { x: 12, y: 9 }
    setScore(0)
    setGameOver(false)
    setPaused(false)
  }, [])

  const placeFood = useCallback((avoid: Pt[]) => {
    const taken = new Set(avoid.map((p) => `${p.x},${p.y}`))
    let p: Pt = { x: 0, y: 0 }
    for (let n = 0; n < 8000; n++) {
      p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
      if (!taken.has(`${p.x},${p.y}`)) break
    }
    foodRef.current = p
  }, [])

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

    const cellW = cssW / COLS
    const cellH = cssH / ROWS

    const bg = readCssColor('--surface-muted', '#f0efeb')
    const grid = readCssColor('--surface-border', 'rgba(120,120,120,0.2)')
    const head = readCssColor('--accent', '#a16207')
    const body = readCssColor('--accent-bright', '#0f766e')
    const food = readCssColor('--pop', '#b45309')

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, cssW, cssH)

    ctx.strokeStyle = grid
    ctx.globalAlpha = 0.4
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath()
      ctx.moveTo(x * cellW, 0)
      ctx.lineTo(x * cellW, cssH)
      ctx.stroke()
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * cellH)
      ctx.lineTo(cssW, y * cellH)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    const foodPos = foodRef.current
    ctx.fillStyle = food
    ctx.beginPath()
    ctx.roundRect(foodPos.x * cellW + 2, foodPos.y * cellH + 2, cellW - 4, cellH - 4, 4)
    ctx.fill()

    const snake = snakeRef.current
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? head : body
      const pad = i === 0 ? 1 : 2
      ctx.beginPath()
      ctx.roundRect(seg.x * cellW + pad, seg.y * cellH + pad, cellW - pad * 2, cellH - pad * 2, 3)
      ctx.fill()
    })
  }, [])

  const tick = useCallback(() => {
    if (!running || paused || gameOver) return
    const d = pendingDirRef.current
    const cur = dirRef.current
    if (d.x + cur.x !== 0 || d.y + cur.y !== 0) {
      dirRef.current = d
    }
    const dir = dirRef.current
    const snake = snakeRef.current
    const head = snake[0]!
    const next = { x: head.x + dir.x, y: head.y + dir.y }

    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      setGameOver(true)
      setRunning(false)
      return
    }
    if (snake.some((s, i) => i > 0 && s.x === next.x && s.y === next.y)) {
      setGameOver(true)
      setRunning(false)
      return
    }

    snake.unshift(next)
    const fx = foodRef.current
    if (next.x === fx.x && next.y === fx.y) {
      setScore((s) => {
        const n = s + 1
        setBest((b) => {
          const nb = Math.max(b, n)
          try {
            localStorage.setItem(SNAKE_HI_KEY, String(nb))
          } catch {
            /* ignore */
          }
          return nb
        })
        return n
      })
      placeFood(snake)
    } else {
      snake.pop()
    }
  }, [gameOver, paused, placeFood, running])

  useEffect(() => {
    const onResize = () => draw()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [draw])

  useEffect(() => {
    draw()
  }, [draw, score, gameOver, running, paused])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key
      if (k === ' ' || k === 'Escape') {
        e.preventDefault()
        if (gameOver) return
        setPaused((p) => !p)
        return
      }
      if (!running) return
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      }
      const n = map[k] ?? map[k.toLowerCase()]
      if (n) {
        e.preventDefault()
        pendingDirRef.current = n
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running, gameOver])

  useEffect(() => {
    if (!running || gameOver) return
    let cancelled = false
    const loop = (t: number) => {
      if (cancelled) return
      if (!lastRef.current) lastRef.current = t
      if (!paused) {
        accRef.current += t - lastRef.current
        while (accRef.current >= speedMs) {
          accRef.current -= speedMs
          tick()
        }
      }
      lastRef.current = t
      draw()
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => {
      cancelled = true
      cancelAnimationFrame(frameRef.current)
      lastRef.current = 0
      accRef.current = 0
    }
  }, [running, paused, gameOver, speedMs, tick, draw])

  const start = () => {
    if (gameOver) reset()
    setRunning(true)
  }

  return (
    <>
      <GameScreenHeader
        kicker="Arcade"
        title="Snake"
        description="Eat the warm squares, avoid walls and yourself. Space pauses. Speed climbs with your score — high score is saved locally."
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
          <span className="font-mono text-xs text-ink-faint">~{speedMs}ms / tick</span>
        </div>

        {gameOver && (
          <p className="rounded-xl border border-pop-bright/30 bg-pop/10 px-4 py-3 text-center text-sm font-medium text-ink">
            Collision. Reset and try a tighter line.
          </p>
        )}
        {paused && running && !gameOver && (
          <p className="rounded-xl border border-accent/25 bg-accent-muted px-4 py-3 text-center text-sm text-ink">
            Paused — press Space to continue.
          </p>
        )}

        <canvas
          ref={canvasRef}
          className="hero-ring h-[min(72vw,420px)] w-full rounded-2xl border border-surface-border bg-surface-muted shadow-card"
          aria-label="Snake playfield"
        />

        <div className="flex flex-wrap gap-3">
          {!running ? (
            <button
              type="button"
              onClick={start}
              className="rounded-full border border-accent/35 bg-accent-muted px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/50"
            >
              {gameOver ? 'Play again' : 'Start'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="rounded-full border border-surface-border bg-surface-muted/80 px-6 py-2.5 text-sm font-medium text-ink-soft transition hover:border-accent/30"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setRunning(false)
              reset()
            }}
            className="rounded-full border border-surface-border bg-surface-muted/80 px-6 py-2.5 text-sm font-medium text-ink-soft transition hover:border-accent/30"
          >
            Reset board
          </button>
        </div>

        <p className="text-center text-xs text-ink-faint">
          Arrows or WASD · Space to pause · Canvas scales with your viewport
        </p>
      </div>
    </>
  )
}
