import type { ReactNode } from 'react'

type SectionHeadingProps = {
  kicker: string
  title: string
  subtitle?: ReactNode
}

export function SectionHeading({ kicker, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">{kicker}</p>
      <h2 className="font-display mt-3 bg-gradient-to-br from-ink via-ink-soft to-accent bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-[1.85rem] lg:text-[2rem] print:bg-none print:text-zinc-900">
        {title}
      </h2>
      {subtitle ? (
        <div className="mt-4 text-sm leading-relaxed text-ink-faint print:text-zinc-600">{subtitle}</div>
      ) : null}
    </div>
  )
}
