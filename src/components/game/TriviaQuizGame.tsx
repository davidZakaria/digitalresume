import { useCallback, useState } from 'react'
import { createQuizRound } from '../../data/quizQuestions'
import { GameScreenHeader } from './GameScreenHeader'

export function TriviaQuizGame() {
  const [round, setRound] = useState(createQuizRound(10))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [phase, setPhase] = useState<'play' | 'reveal' | 'done'>('play')

  const q = round[index]
  const last = index >= round.length - 1

  const onPick = useCallback(
    (optionIndex: number) => {
      if (phase !== 'play' || !q) return
      setPicked(optionIndex)
      setPhase('reveal')
      if (optionIndex === q.correctIndex) setScore((s) => s + 1)
    },
    [phase, q]
  )

  const next = useCallback(() => {
    if (!q) return
    if (last) {
      setPhase('done')
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setPhase('play')
  }, [last, q])

  const restart = () => {
    setRound(createQuizRound(10))
    setIndex(0)
    setScore(0)
    setPicked(null)
    setPhase('play')
  }

  if (!q && phase !== 'done') return null

  return (
    <>
      <GameScreenHeader
        kicker="Quiz"
        title="Trivia mix"
        description="Ten mixed questions — geography, science, history, and odd facts. New shuffle each round."
      />

      <div className="mx-auto max-w-xl space-y-8">
        {phase === 'done' ? (
          <div className="hero-ring rounded-2xl border border-surface-border bg-surface-elevated/95 p-8 text-center shadow-card">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Final score</p>
            <p className="mt-4 font-display text-4xl font-bold tabular-nums text-ink">
              {score}/{round.length}
            </p>
            <p className="mt-3 text-sm text-ink-faint">
              {score === round.length
                ? 'Perfect round — curious mind confirmed.'
                : score >= round.length * 0.7
                  ? 'Strong showing.'
                  : 'Spin up another round and see what sticks.'}
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-8 rounded-full border border-surface-border bg-surface-muted/80 px-6 py-2.5 text-sm font-medium text-ink-soft shadow-innerGlow transition hover:border-accent/30 hover:text-accent"
            >
              New round
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-ink-faint">
              <span>
                Question {index + 1} / {round.length}
              </span>
              <span className="font-mono tabular-nums">
                Score {score}/{round.length}
              </span>
            </div>

            <div className="hero-ring rounded-2xl border border-surface-border bg-surface-elevated/95 p-6 shadow-card md:p-8">
              <p className="text-lg font-medium leading-snug text-ink md:text-xl">{q.question}</p>
              <ul className="mt-6 space-y-3">
                {q.options.map((opt, i) => {
                  let cls =
                    'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition md:text-base '
                  if (phase === 'reveal') {
                    if (i === q.correctIndex) cls += 'border-accent/40 bg-accent-muted text-ink '
                    else if (i === picked) cls += 'border-pop-bright/35 bg-pop/10 text-ink '
                    else cls += 'border-surface-border text-ink-faint opacity-80 '
                  } else {
                    cls +=
                      'border-surface-border bg-surface-muted/50 text-ink-soft hover:border-accent/30 hover:bg-surface-elevated '
                  }
                  return (
                    <li key={`${q.id}-${i}`}>
                      <button
                        type="button"
                        disabled={phase !== 'play'}
                        onClick={() => onPick(i)}
                        className={cls}
                      >
                        {opt}
                      </button>
                    </li>
                  )
                })}
              </ul>

              {phase === 'reveal' && (
                <button
                  type="button"
                  onClick={next}
                  className="mt-6 w-full rounded-full border border-accent/30 bg-accent-muted py-3 text-sm font-semibold text-ink transition hover:border-accent/45"
                >
                  {last ? 'See results' : 'Next question'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
