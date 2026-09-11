import { useState } from 'react'
import { shuffle } from '../../lib/random'
import { GameScreenHeader } from './GameScreenHeader'

const GRID = 12
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function tryPlace(
  grid: string[][],
  word: string,
  dr: number,
  dc: number,
  r: number,
  c: number
): boolean {
  const endR = r + dr * (word.length - 1)
  const endC = c + dc * (word.length - 1)
  if (endR < 0 || endR >= GRID || endC < 0 || endC >= GRID) return false
  for (let i = 0; i < word.length; i++) {
    const ch = word[i]!
    const rr = r + dr * i
    const cc = c + dc * i
    const existing = grid[rr][cc]
    if (existing !== '' && existing !== ch) return false
  }
  for (let i = 0; i < word.length; i++) {
    grid[r + dr * i]![c + dc * i] = word[i]!
  }
  return true
}

function buildGrid(words: string[]): { grid: string[][]; placed: string[] } {
  const grid = Array.from({ length: GRID }, () => Array<string>(GRID).fill(''))
  const placed: string[] = []
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [-1, 1],
  ]
  for (const w of words) {
    let placedWord = false
    for (let attempt = 0; attempt < 120 && !placedWord; attempt++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)]!
      const r = Math.floor(Math.random() * GRID)
      const c = Math.floor(Math.random() * GRID)
      const snapshot = grid.map((row) => [...row])
      if (tryPlace(snapshot, w, dr, dc, r, c)) {
        for (let i = 0; i < GRID; i++) grid[i] = snapshot[i]!
        placed.push(w)
        placedWord = true
      }
    }
  }
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (grid[r][c] === '') grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!
    }
  }
  return { grid, placed }
}

function cellsBetween(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): { r: number; c: number }[] | null {
  const dr = r2 - r1
  const dc = c2 - c1
  if (dr === 0 && dc === 0) return null
  const adr = Math.abs(dr)
  const adc = Math.abs(dc)
  const steps = Math.max(adr, adc)
  let sr = 0
  let sc = 0
  if (dr === 0) sc = dc > 0 ? 1 : -1
  else if (dc === 0) sr = dr > 0 ? 1 : -1
  else if (adr === adc) {
    sr = dr > 0 ? 1 : -1
    sc = dc > 0 ? 1 : -1
  } else return null
  const cells: { r: number; c: number }[] = []
  for (let i = 0; i <= steps; i++) cells.push({ r: r1 + sr * i, c: c1 + sc * i })
  return cells
}

const WORD_BANK = [
  'NATURE', 'OCEAN', 'FOREST', 'GALAXY', 'MELODY', 'CANVAS', 'BRIDGE', 'PYRAMID',
  'HARBOR', 'VOYAGE', 'CITRUS', 'THUNDER', 'HORIZON', 'PLAZA', 'EMERALD', 'CAPSULE',
]

function pickWords(): string[] {
  return shuffle([...WORD_BANK])
    .map((w) => w.replace(/[^a-zA-Z]/g, '').toUpperCase())
    .filter((s) => s.length >= 3 && s.length <= 11)
    .slice(0, 8)
}

export function WordSearchGame() {
  const [puzzle, setPuzzle] = useState(() => buildGrid(pickWords()))
  const { grid, placed } = puzzle

  const [anchor, setAnchor] = useState<{ r: number; c: number } | null>(null)
  const [found, setFound] = useState<Set<string>>(() => new Set())

  const newPuzzle = () => {
    setPuzzle(buildGrid(pickWords()))
    setAnchor(null)
    setFound(new Set())
  }

  const onCell = (r: number, c: number) => {
    if (!anchor) {
      setAnchor({ r, c })
      return
    }
    if (anchor.r === r && anchor.c === c) {
      setAnchor(null)
      return
    }
    const line = cellsBetween(anchor.r, anchor.c, r, c)
    setAnchor(null)
    if (!line) return
    const str = line.map(({ r: rr, c: cc }) => grid[rr]![cc]!).join('')
    const rev = str.split('').reverse().join('')
    const hit = placed.find((w) => (w === str || w === rev) && !found.has(w))
    if (hit) setFound((f) => new Set(f).add(hit))
  }

  const won = placed.length > 0 && found.size === placed.length

  return (
    <>
      <GameScreenHeader
        kicker="Puzzle"
        title="Word search"
        description="Find eight mixed-theme words hidden in straight lines — horizontal, vertical, or diagonal. Tap two cells on the same line; words count forwards or backwards."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-faint">
            Found{' '}
            <span className="font-mono font-medium text-ink tabular-nums">
              {found.size}/{placed.length}
            </span>
          </p>
          <button
            type="button"
            onClick={newPuzzle}
            className="rounded-full border border-surface-border bg-surface-muted/80 px-4 py-2 text-sm font-medium text-ink-soft shadow-innerGlow transition hover:border-accent/30 hover:text-accent"
          >
            New grid
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {placed.map((w) => (
            <span
              key={w}
              className={[
                'rounded-lg border px-2.5 py-1 font-mono text-xs font-medium uppercase',
                found.has(w)
                  ? 'border-accent/35 bg-accent-muted text-ink line-through opacity-70'
                  : 'border-surface-border bg-surface-muted/60 text-ink-soft',
              ].join(' ')}
            >
              {w}
            </span>
          ))}
        </div>

        {won && (
          <p className="rounded-xl border border-accent/25 bg-accent-muted px-4 py-3 text-center text-sm font-medium text-ink">
            Grid cleared — every word found.
          </p>
        )}

        <div
          className="hero-ring inline-block rounded-2xl border border-surface-border bg-surface-elevated/95 p-2 shadow-card"
          role="grid"
          aria-label="Word search letters"
        >
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((ch, c) => {
                const picked = anchor?.r === r && anchor?.c === c
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    role="gridcell"
                    onClick={() => onCell(r, c)}
                    className={[
                      'flex h-7 w-7 items-center justify-center rounded-md border font-mono text-[11px] font-semibold uppercase transition sm:h-8 sm:w-8 sm:text-xs',
                      picked
                        ? 'border-accent bg-accent-muted text-ink'
                        : 'border-transparent bg-surface-muted/50 text-ink-soft hover:border-accent/25 hover:bg-surface-elevated',
                    ].join(' ')}
                  >
                    {ch}
                  </button>
                )
              })
            )}
          </div>
        </div>

        <p className="text-center text-xs text-ink-faint">
          Tip: second tap must continue in a straight line from the first — no knight moves.
        </p>
      </div>
    </>
  )
}
