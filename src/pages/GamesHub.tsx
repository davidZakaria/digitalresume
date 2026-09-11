import { Link } from 'react-router-dom'

type GameMeta = {
  to: string
  title: string
  blurb: string
  tag: 'Puzzle' | 'Arcade' | 'Quiz' | 'Reflex'
}

const GAMES: GameMeta[] = [
  {
    to: '/game/stack-match',
    title: 'Memory match',
    blurb: 'Classic memory — eight random pairs of words per round.',
    tag: 'Puzzle',
  },
  {
    to: '/game/quiz',
    title: 'Trivia mix',
    blurb: 'Mixed multiple-choice — science, geography, history, and curiosities.',
    tag: 'Quiz',
  },
  {
    to: '/game/word-search',
    title: 'Word search',
    blurb: 'Twelve-by-twelve grid; find themed words in straight lines any direction.',
    tag: 'Puzzle',
  },
  {
    to: '/game/2048',
    title: '2048',
    blurb: 'The usual sliding merge; keys or on-screen arrows.',
    tag: 'Puzzle',
  },
  {
    to: '/game/ship-grid',
    title: 'Lights out',
    blurb: 'Toggle lights and neighbors on a 5×5; darken the whole board.',
    tag: 'Puzzle',
  },
  {
    to: '/game/snake',
    title: 'Snake',
    blurb: 'Speed ramps with score; high score saved in the browser.',
    tag: 'Arcade',
  },
  {
    to: '/game/offline-runner',
    title: 'Chrome dino',
    blurb:
      'Endless runner like Chrome’s offline dinosaur — jump hazards; speed ramps; best saved locally.',
    tag: 'Arcade',
  },
  {
    to: '/game/breakout',
    title: 'Breakout',
    blurb: 'Paddle and ball; stages change the brick pattern.',
    tag: 'Arcade',
  },
  {
    to: '/game/reaction',
    title: 'Reaction time',
    blurb: 'Wait for the cue, then tap — randomized delays and false-start checks.',
    tag: 'Reflex',
  },
  {
    to: '/game/typing',
    title: 'Typing line',
    blurb: 'Copy quotes and pangrams exactly; live diff highlighting.',
    tag: 'Reflex',
  },
]

export function GamesHub() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-8 md:px-6 md:pt-12">
      <header className="mb-10 text-center md:mb-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-faint">Play</p>
        <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">Mini-games</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-faint md:text-base">
          Puzzles, arcade, and quick reflex checks — all run in the browser, no signup.
        </p>
      </header>

      <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {GAMES.map((g) => (
          <li key={g.to}>
            <Link
              to={g.to}
              className="hero-ring group flex h-full flex-col rounded-2xl border border-surface-border bg-surface-elevated/95 p-6 shadow-card transition hover:border-accent/25 hover:shadow-glow md:p-7"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">{g.tag}</p>
              <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl group-hover:text-accent">
                {g.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-faint">{g.blurb}</p>
              <p className="mt-4 text-sm font-medium text-accent">Play →</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
