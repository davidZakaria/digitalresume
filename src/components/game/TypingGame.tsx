import { useCallback, useMemo, useState } from 'react'
import { shuffle } from '../../lib/random'
import { GameScreenHeader } from './GameScreenHeader'

const LINES = shuffle([
  'The quick brown fox jumps over the lazy dog.',
  'We are all in the gutter, but some of us are looking at the stars.',
  'Not all those who wander are lost.',
  'In three words I can sum up everything I have learned about life: it goes on.',
  'The only impossible journey is the one you never begin.',
  'Winter mornings reward anyone who leaves the house early.',
  'Small steps every day add up to long roads.',
  'Curiosity is the engine of achievement.',
])

export function TypingGame() {
  const [lineIndex, setLineIndex] = useState(0)
  const expected = LINES[lineIndex] ?? LINES[0]!
  const [input, setInput] = useState('')
  const [done, setDone] = useState(false)

  const correctPrefixLen = useMemo(() => {
    let n = 0
    for (let i = 0; i < input.length && i < expected.length; i++) {
      if (input[i] !== expected[i]) break
      n++
    }
    return n
  }, [expected, input])

  const hasError = input.length > correctPrefixLen

  const reset = useCallback(() => {
    setInput('')
    setDone(false)
  }, [])

  const nextLine = () => {
    setLineIndex((i) => (i + 1) % LINES.length)
    setInput('')
    setDone(false)
  }

  const onChange = (v: string) => {
    if (done) return
    const next = v.slice(0, expected.length)
    setInput(next)
    if (next === expected) setDone(true)
  }

  return (
    <>
      <GameScreenHeader
        kicker="Mini-game"
        title="Typing line"
        description="Copy the line exactly — punctuation and spaces count. Lines rotate through well-known quotes and pangrams."
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <p
          className="hero-ring rounded-2xl border border-surface-border bg-surface-elevated/95 p-5 text-sm leading-relaxed text-ink-faint shadow-card md:p-6 md:text-base"
          aria-label="Text to type"
        >
          {expected.split('').map((ch, i) => {
            let cls = 'text-ink-faint'
            if (i < correctPrefixLen) cls = 'text-ink'
            else if (i < input.length) cls = 'text-pop-bright'
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            )
          })}
        </p>

        <label className="block text-sm font-medium text-ink-soft" htmlFor="typing-input">
          Your input
        </label>
        <textarea
          id="typing-input"
          rows={4}
          value={input}
          disabled={done}
          onChange={(e) => onChange(e.target.value)}
          className={[
            'w-full resize-y rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 font-mono text-sm text-ink shadow-innerGlow ring-0 transition placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25',
            hasError ? 'border-pop-bright/40' : 'border-surface-border',
          ].join(' ')}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-surface-border bg-surface-muted/80 px-4 py-2 text-sm font-medium text-ink-soft shadow-innerGlow transition hover:border-accent/30 hover:text-accent"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={nextLine}
            className="rounded-full border border-surface-border bg-surface-muted/80 px-4 py-2 text-sm font-medium text-ink-soft shadow-innerGlow transition hover:border-accent/30 hover:text-accent"
          >
            Another line
          </button>
          {done && (
            <p className="text-sm font-medium text-ink">Exact match — nice fingers.</p>
          )}
        </div>
      </div>
    </>
  )
}
