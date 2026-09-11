import { useCallback, useEffect, useState } from 'react'
import { GameScreenHeader } from './GameScreenHeader'

const SIZE = 4

type Grid = (number | null)[][]

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array<number | null>(SIZE).fill(null))
}

function spawnTile(g: Grid): Grid {
  const cells: [number, number][] = []
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (g[r][c] === null) cells.push([r, c])
  if (cells.length === 0) return g
  const [r, c] = cells[Math.floor(Math.random() * cells.length)]!
  const next = g.map((row) => [...row])
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

function slideMergeLine(line: (number | null)[]): { line: (number | null)[]; gained: number } {
  const nums = line.filter((x): x is number => x !== null)
  const out: number[] = []
  let gained = 0
  for (let i = 0; i < nums.length; i++) {
    if (i < nums.length - 1 && nums[i] === nums[i + 1]) {
      const v = nums[i]! * 2
      out.push(v)
      gained += v
      i++
    } else {
      out.push(nums[i]!)
    }
  }
  const padded: (number | null)[] = [...out, ...Array(SIZE - out.length).fill(null)]
  return { line: padded, gained }
}

function rotateCW(g: Grid): Grid {
  const n = g.length
  const r: Grid = emptyGrid()
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) r[j][n - 1 - i] = g[i][j]
  return r
}

type Dir = 'left' | 'right' | 'up' | 'down'

function move(g: Grid, dir: Dir): { grid: Grid; score: number; moved: boolean } {
  let work = g.map((row) => [...row])
  let score = 0
  let moved = false

  const applyLeft = (grid: Grid) => {
    const next = emptyGrid()
    for (let r = 0; r < SIZE; r++) {
      const { line, gained } = slideMergeLine(grid[r])
      next[r] = line
      score += gained
      if (line.some((v, i) => v !== grid[r][i])) moved = true
    }
    return next
  }

  if (dir === 'left') work = applyLeft(work)
  else if (dir === 'right') {
    work = work.map((row) => [...row].reverse())
    work = applyLeft(work)
    work = work.map((row) => [...row].reverse())
  } else if (dir === 'up') {
    work = rotateCW(rotateCW(rotateCW(work)))
    work = applyLeft(work)
    work = rotateCW(work)
  } else {
    work = rotateCW(work)
    work = applyLeft(work)
    work = rotateCW(rotateCW(rotateCW(work)))
  }

  return { grid: work, score, moved }
}

function canMove(g: Grid): boolean {
  for (const d of ['left', 'right', 'up', 'down'] as Dir[]) {
    if (move(g, d).moved) return true
  }
  return false
}

function tileBg(v: number): string {
  if (v <= 0) return 'transparent'
  const steps = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]
  const i = steps.indexOf(v)
  const t = i < 0 ? 10 : Math.min(i, 10)
  const alpha = 0.08 + t * 0.07
  return `rgb(var(--accent) / ${alpha})`
}

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => spawnTile(spawnTile(emptyGrid())))
  const [totalScore, setTotalScore] = useState(0)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)

  const dispatch = useCallback((dir: Dir) => {
    setGrid((prev) => {
      const { grid: next, score, moved } = move(prev, dir)
      if (!moved) return prev
      setTotalScore((s) => s + score)
      const withSpawn = spawnTile(next)
      if (!canMove(withSpawn)) setLost(true)
      if (withSpawn.some((row) => row.some((c) => c === 2048))) setWon(true)
      return withSpawn
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key
      if (k === 'ArrowLeft') {
        e.preventDefault()
        dispatch('left')
      } else if (k === 'ArrowRight') {
        e.preventDefault()
        dispatch('right')
      } else if (k === 'ArrowUp') {
        e.preventDefault()
        dispatch('up')
      } else if (k === 'ArrowDown') {
        e.preventDefault()
        dispatch('down')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  const newGame = () => {
    let g = emptyGrid()
    g = spawnTile(g)
    g = spawnTile(g)
    setGrid(g)
    setTotalScore(0)
    setWon(false)
    setLost(false)
  }

  return (
    <>
      <GameScreenHeader
        kicker="Puzzle"
        title="2048"
        description="Slide and merge matching numbers with the arrow keys (or buttons) until you reach 2048. Classic rules, cleaned-up board."
      />

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-sm text-ink-faint">
            Score{' '}
            <span className="font-semibold text-ink tabular-nums">{totalScore}</span>
          </p>
          <button
            type="button"
            onClick={newGame}
            className="rounded-full border border-surface-border bg-surface-muted/80 px-4 py-2 text-sm font-medium text-ink-soft shadow-innerGlow transition hover:border-accent/30 hover:text-accent"
          >
            New board
          </button>
        </div>

        {(won || lost) && (
          <p
            className={`rounded-xl border px-4 py-3 text-center text-sm font-medium ${
              won && !lost
                ? 'border-accent/30 bg-accent-muted text-ink'
                : 'border-pop-bright/30 bg-pop/10 text-ink'
            }`}
          >
            {won ? 'You reached 2048 — keep going or start fresh.' : 'No moves left. Start a new board.'}
          </p>
        )}

        <div
          className="hero-ring grid aspect-square grid-cols-4 gap-2 rounded-2xl border border-surface-border bg-surface-muted/90 p-3 shadow-card"
          role="application"
          aria-label="2048 board — use arrow keys"
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className="flex items-center justify-center rounded-xl border border-surface-border/80 bg-surface-elevated/90 text-lg font-bold tabular-nums text-ink shadow-innerGlow md:text-2xl"
                style={{ backgroundColor: cell ? tileBg(cell) : undefined }}
              >
                {cell ?? ''}
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {(
            [
              ['↑', 'up'],
              ['←', 'left'],
              ['↓', 'down'],
              ['→', 'right'],
            ] as const
          ).map(([label, dir]) => (
            <button
              key={dir}
              type="button"
              onClick={() => dispatch(dir)}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-surface-border bg-surface-elevated text-lg font-mono text-ink shadow-card transition hover:border-accent/35 md:h-14 md:w-14"
              aria-label={`Move ${dir}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
