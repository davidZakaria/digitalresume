import { Link } from 'react-router-dom'

type Props = {
  kicker?: string
  title: string
  description: string
}

export function GameScreenHeader({ kicker = 'Mini-game', title, description }: Props) {
  return (
    <header className="mb-10 text-center md:mb-12">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-faint">{kicker}</p>
      <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm text-ink-faint md:text-base">{description}</p>
      <p className="mt-5">
        <Link
          to="/game"
          className="text-sm font-medium text-accent underline-offset-4 hover:text-pop hover:underline"
        >
          ← All games
        </Link>
      </p>
    </header>
  )
}
