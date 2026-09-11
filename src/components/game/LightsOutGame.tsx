import { useCallback, useState } from 'react'
import { GameScreenHeader } from './GameScreenHeader'

const N = 5

function empty(): boolean[][] {
  return Array.from({ length: N }, () => Array<boolean>(N).fill(false))
}

/** Apply toggle at (r,c) including orthogonal neighbors. */
function toggle(grid: boolean[][], r: number, c: number): boolean[][] {
  const next = grid.map((row) => [...row])
  const cells: [number, number][] = [
    [r, c],
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ]
  for (const [rr, cc] of cells) {
    if (rr >= 0 && rr < N && cc >= 0 && cc < N) next[rr]![cc] = !next[rr]![cc]!
  }
  return next
}

/** Solvable puzzle: start solved, apply t random toggles. */
function randomPuzzle(taps = 14): boolean[][] {
  let g = empty()
  for (let k = 0; k < taps; k++) {
    const r = Math.floor(Math.random() * N)
    const c = Math.floor(Math.random() * N)
    g = toggle(g, r, c)
  }
  return g
}

function allOff(grid: boolean[][]): boolean {
  return grid.every((row) => row.every((on) => !on))
}

export function LightsOutGame() {
  const [grid, setGrid] = useState<boolean[][]>(() => randomPuzzle(16))
  const [moves, setMoves] = useState(0)

  const won = allOff(grid)

  const cellClick = useCallback(
    (r: number, c: number) => {
      if (won) return
      setGrid((g) => toggle(g, r, c))
      setMoves((m) => m + 1)
    },
    [won]
  )

  const newPuzzle = () => {
    setGrid(randomPuzzle(12 + Math.floor(Math.random() * 10)))
    setMoves(0)
  }

  return (
    <>
      <GameScreenHeader
        kicker="Puzzle"
        title="Lights out"
        description="Classic Lights Out: each tap toggles that square and the four neighbors. Turn every cell off. Layouts are always solvable."
      />

      <div className="mx-auto max-w-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-faint">
            Moves{' '}
            <span className="font-mono font-medium text-ink tabular-nums">{moves}</span>
          </p>
          <button
            type="button"
            onClick={newPuzzle}
            className="rounded-full border border-surface-border bg-surface-muted/80 px-4 py-2 text-sm font-medium text-ink-soft shadow-innerGlow transition hover:border-accent/30 hover:text-accent"
          >
            New board
          </button>
        </div>

        {won && (
          <p className="rounded-xl border border-accent/30 bg-accent-muted px-4 py-3 text-center text-sm font-medium text-ink">
            Cleared — try fewer moves next time.
          </p>
        )}

        <div
          className="hero-ring mx-auto w-fit rounded-2xl border border-surface-border bg-surface-muted/80 p-3 shadow-card sm:p-4"
          role="grid"
          aria-label="Lights out puzzle grid"
        >
          <div className="grid gap-2 sm:gap-2.5" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
            {grid.map((row, r) =>
              row.map((on, c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  role="gridcell"
                  aria-pressed={on}
                  onClick={() => cellClick(r, c)}
                  className={[
                    'h-12 w-12 rounded-xl border-2 transition sm:h-14 sm:w-14',
                    on
                      ? 'border-accent/50 bg-gradient-to-br from-accent-muted to-accent-soft shadow-innerGlow'
                      : 'border-surface-border bg-surface-elevated/90 hover:border-accent/25',
                  ].join(' ')}
                />
              ))
            )}
          </div>
        </div>

        <p className="text-center text-xs text-ink-faint">
          Tip: parity tricks exist on 5×5, but mashing intuition works too — layouts are built from random taps on a solved board.
        </p>
      </div>
    </>
  )
}
