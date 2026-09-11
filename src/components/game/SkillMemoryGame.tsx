import { useCallback, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { shuffle } from '../../lib/random'

const PAIR_COUNT = 8

/** General themes — nature, places, arts, everyday words (single line for card fit). */
const CARD_POOL = [
  'Aurora',
  'Glacier',
  'Harbor',
  'Mosaic',
  'Saffron',
  'Comet',
  'Velvet',
  'Coral',
  'Fjord',
  'Bamboo',
  'Marble',
  'Citrus',
  'Lotus',
  'Meadow',
  'Orchid',
  'Quartz',
  'Raven',
  'Summit',
  'Voyage',
  'Willow',
]

type CardModel = {
  id: number
  label: string
  pairKey: string
}

function buildDeck(): CardModel[] {
  const pool = shuffle([...CARD_POOL])
  const picked = pool.slice(0, PAIR_COUNT)
  const cards: CardModel[] = []
  let id = 0
  for (const label of picked) {
    cards.push({ id: id++, label, pairKey: label })
    cards.push({ id: id++, label, pairKey: label })
  }
  return shuffle(cards)
}

export function SkillMemoryGame() {
  const reduce = useReducedMotion()
  const [deck, setDeck] = useState(buildDeck)
  const [matched, setMatched] = useState<Set<number>>(() => new Set())
  const [picked, setPicked] = useState<number[]>([])
  const [lock, setLock] = useState(false)

  const handleFlip = useCallback(
    (position: number) => {
      if (lock || matched.has(position) || picked.includes(position)) return

      if (picked.length === 0) {
        setPicked([position])
        return
      }

      if (picked.length === 1) {
        const first = picked[0]
        if (first === position) return
        setPicked([first, position])
        const a = deck[first]
        const b = deck[position]
        if (a.pairKey === b.pairKey) {
          setMatched((prev) => new Set(prev).add(first).add(position))
          setPicked([])
        } else {
          setLock(true)
          window.setTimeout(() => {
            setPicked([])
            setLock(false)
          }, 780)
        }
      }
    },
    [deck, lock, matched, picked]
  )

  const newGame = () => {
    setDeck(buildDeck())
    setMatched(new Set())
    setPicked([])
    setLock(false)
  }

  const won = matched.size === deck.length
  const matchedPairs = matched.size / 2

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-faint">
          Pairs found:{' '}
          <span className="font-mono font-medium text-ink-soft tabular-nums">
            {matchedPairs}/{PAIR_COUNT}
          </span>
        </p>
        <button
          type="button"
          onClick={newGame}
          className="rounded-full border border-surface-border bg-surface-muted/80 px-4 py-2 text-sm font-medium text-ink-soft shadow-innerGlow transition hover:border-accent/30 hover:text-accent"
        >
          New game
        </button>
      </div>

      {won && (
        <motion.p
          className="mb-4 rounded-xl border border-accent/20 bg-accent-muted px-4 py-3 text-center text-sm font-medium text-ink"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          Board cleared — sharp memory.
        </motion.p>
      )}

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3"
        role="grid"
        aria-label="Memory matching cards"
      >
        {deck.map((card, index) => {
          const faceUp = matched.has(index) || picked.includes(index)
          const done = matched.has(index)
          return (
            <motion.button
              key={card.id}
              type="button"
              role="gridcell"
              aria-label={
                faceUp ? `${card.label}${done ? ', matched' : ''}` : 'Hidden card, select to reveal'
              }
              disabled={done || lock}
              onClick={() => handleFlip(index)}
              className={[
                'relative aspect-square select-none rounded-xl border text-left shadow-card transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50',
                done
                  ? 'border-accent/25 bg-gradient-to-br from-accent-muted via-accent-soft to-surface-elevated ring-1 ring-accent/15'
                  : 'border-surface-border bg-surface-elevated hover:border-accent/25',
                lock && picked.includes(index) ? 'ring-1 ring-accent/20' : '',
              ].join(' ')}
              whileTap={reduce || done || lock ? undefined : { scale: 0.97 }}
            >
              <span
                className={[
                  'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
                  faceUp ? 'pointer-events-none opacity-0' : 'opacity-100',
                ].join(' ')}
                aria-hidden={faceUp}
              >
                <span className="font-mono text-lg font-medium text-accent">?</span>
              </span>
              <span
                className={[
                  'absolute inset-0 flex items-center justify-center p-2 text-center text-xs font-medium leading-snug text-ink transition-opacity duration-200 sm:text-sm',
                  faceUp ? 'opacity-100' : 'pointer-events-none opacity-0',
                ].join(' ')}
                aria-hidden={!faceUp}
              >
                {card.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
