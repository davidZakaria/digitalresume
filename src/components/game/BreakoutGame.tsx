import { useCallback, useEffect, useRef, useState } from 'react'
import { GameScreenHeader } from './GameScreenHeader'

const COLS = 10
const ROWS = 5
const PADDLE_W = 0.2
const BALL_R = 0.015

function readCssColor(varName: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  if (!v) return fallback
  if (v.includes('rgba') || v.includes('rgb(') || v.startsWith('#')) return v
  return `rgb(${v})`
}

type Brick = { c: number; r: number; alive: boolean }

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [message, setMessage] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const paddleXRef = useRef(0.5)
  const ballRef = useRef({ x: 0.5, y: 0.78, vx: 0.014, vy: -0.02 })
  const bricksRef = useRef<Brick[]>([])
  const prevAliveRef = useRef(0)
  const levelRef = useRef(1)

  const buildBricks = useCallback((lv: number) => {
    const list: Brick[] = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const gap = (r + c * 2 + lv) % 6
        if (gap !== 0 && gap !== 2) list.push({ c, r, alive: true })
      }
    }
    bricksRef.current = list
    prevAliveRef.current = list.filter((b) => b.alive).length
  }, [])

  const resetBallAbovePaddle = useCallback(() => {
    const b = ballRef.current
    b.x = paddleXRef.current
    b.y = 0.82
    b.vx = 0.012 * (Math.random() > 0.5 ? 1 : -1)
    b.vy = -0.022
  }, [])

  const applyLevel = useCallback(
    (lv: number) => {
      levelRef.current = lv
      buildBricks(lv)
      paddleXRef.current = 0.5
      resetBallAbovePaddle()
    },
    [buildBricks, resetBallAbovePaddle]
  )

  useEffect(() => {
    applyLevel(1)
  }, [applyLevel])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const bg = readCssColor('--surface-muted', '#f0efeb')
    const brickA = readCssColor('--accent', '#a16207')
    const brickB = readCssColor('--accent-bright', '#0f766e')
    const paddle = readCssColor('--ink-soft', '#57534e')
    const ball = readCssColor('--pop', '#b45309')

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    const brickW = w / COLS
    const brickH = (h * 0.34) / ROWS

    for (const b of bricksRef.current) {
      if (!b.alive) continue
      ctx.fillStyle = (b.r + b.c) % 2 === 0 ? brickA : brickB
      ctx.globalAlpha = 0.88
      ctx.beginPath()
      ctx.roundRect(b.c * brickW + 2, b.r * brickH + 2, brickW - 4, brickH - 4, 4)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    const py = h * 0.9
    const pw = w * PADDLE_W
    const px = paddleXRef.current * w - pw / 2
    ctx.fillStyle = paddle
    ctx.beginPath()
    ctx.roundRect(px, py, pw, h * 0.024, 10)
    ctx.fill()

    const ballPos = ballRef.current
    ctx.fillStyle = ball
    ctx.beginPath()
    ctx.arc(ballPos.x * w, ballPos.y * h, BALL_R * Math.min(w, h), 0, Math.PI * 2)
    ctx.fill()
  }, [])

  const step = useCallback(
    (w: number, h: number) => {
      const b = ballRef.current
      b.x += b.vx
      b.y += b.vy

      if (b.x <= BALL_R) {
        b.vx = Math.abs(b.vx)
        b.x = BALL_R
      }
      if (b.x >= 1 - BALL_R) {
        b.vx = -Math.abs(b.vx)
        b.x = 1 - BALL_R
      }
      if (b.y <= BALL_R) {
        b.vy = Math.abs(b.vy)
        b.y = BALL_R
      }

      const cx = b.x * w
      const cy = b.y * h
      const pad = BALL_R * Math.min(w, h)
      const brickW = w / COLS
      const brickH = (h * 0.34) / ROWS

      for (let i = 0; i < bricksRef.current.length; i++) {
        const br = bricksRef.current[i]
        if (!br?.alive) continue
        const bx = br.c * brickW
        const by = br.r * brickH
        if (cx + pad > bx && cx - pad < bx + brickW && cy + pad > by && cy - pad < by + brickH) {
          const next = [...bricksRef.current]
          next[i] = { ...br, alive: false }
          bricksRef.current = next
          b.vy *= -1
          const lv = levelRef.current
          setScore((s) => s + 8 * lv)
          break
        }
      }

      const py = h * 0.9
      const pw = w * PADDLE_W
      const px = paddleXRef.current * w - pw / 2
      if (
        b.vy > 0 &&
        cy >= py - h * 0.05 &&
        cy <= py + h * 0.05 &&
        cx >= px - pad &&
        cx <= px + pw + pad
      ) {
        b.vy = -Math.abs(b.vy)
        const hitPos = (cx - (px + pw / 2)) / (pw / 2)
        b.vx += hitPos * 0.01
        b.vx = Math.max(-0.028, Math.min(0.028, b.vx))
        b.y = py / h - 0.06
      }

      if (b.y > 1.05) {
        setLives((lv) => {
          const n = lv - 1
          if (n <= 0) {
            setRunning(false)
            setMessage('No lives left — game over.')
            b.x = 0.5
            b.y = 0.4
          } else {
            resetBallAbovePaddle()
          }
          return n
        })
      }

      const alive = bricksRef.current.filter((x) => x.alive).length
      if (alive === 0 && prevAliveRef.current > 0 && bricksRef.current.length > 0) {
        const nl = levelRef.current + 1
        setLevel(nl)
        applyLevel(nl)
        setMessage(`Stage ${nl} — new pattern.`)
        window.setTimeout(() => setMessage(null), 1400)
      }
      prevAliveRef.current = alive
    },
    [applyLevel, resetBallAbovePaddle]
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      paddleXRef.current = Math.max(PADDLE_W / 2, Math.min(1 - PADDLE_W / 2, x))
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    let id = 0
    const loop = () => {
      const canvas = canvasRef.current
      if (canvas && running && lives > 0) {
        step(canvas.clientWidth, canvas.clientHeight)
      }
      draw()
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [draw, running, step, lives])

  const fullRestart = () => {
    setScore(0)
    setLives(3)
    setLevel(1)
    applyLevel(1)
    setRunning(true)
    setMessage(null)
  }

  return (
    <>
      <GameScreenHeader
        kicker="Arcade"
        title="Breakout"
        description="Move your pointer to steer the paddle, break the brick wall, and advance stages. Three lives."
      />

      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-faint">
          <span>
            Score{' '}
            <span className="font-mono font-semibold text-ink tabular-nums">{score}</span>
          </span>
          <span>
            Lives <span className="font-mono tabular-nums">{lives}</span>
          </span>
          <span>
            Stage <span className="font-mono tabular-nums">{level}</span>
          </span>
        </div>

        {message && (
          <p className="rounded-xl border border-accent/25 bg-accent-muted px-4 py-2 text-center text-sm text-ink">
            {message}
          </p>
        )}

        <canvas
          ref={canvasRef}
          className="hero-ring h-[min(56vw,380px)] w-full cursor-none rounded-2xl border border-surface-border shadow-card"
          onPointerDown={() => {
            if (lives > 0) setRunning(true)
          }}
          aria-label="Breakout — move pointer horizontally"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="rounded-full border border-surface-border bg-surface-muted/80 px-5 py-2 text-sm font-medium text-ink-soft transition hover:border-accent/30"
          >
            {running ? 'Pause' : 'Run'}
          </button>
          <button
            type="button"
            onClick={fullRestart}
            className="rounded-full border border-accent/30 bg-accent-muted px-5 py-2 text-sm font-semibold text-ink transition hover:border-accent/45"
          >
            Full reset
          </button>
        </div>
      </div>
    </>
  )
}
