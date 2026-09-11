import type { ReactNode } from 'react'

type SectionHeadingProps = {
  kicker: string
  title: string
  subtitle?: ReactNode
  /** Use oversized condensed display type (editorial sections) */
  editorial?: boolean
  align?: 'left' | 'split'
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  editorial = false,
  align = 'left',
}: SectionHeadingProps) {
  if (editorial) {
    return (
      <div className={align === 'split' ? 'grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end' : 'max-w-4xl'}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">{kicker}</p>
          <h2 className="mt-3 font-display text-display-md font-black uppercase text-ink">{title}</h2>
        </div>
        {subtitle ? (
          <div className="text-sm leading-relaxed text-ink-faint md:max-w-md md:pb-1">{subtitle}</div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <div className="mt-4 text-sm leading-relaxed text-ink-faint print:text-zinc-600">{subtitle}</div>
      ) : null}
    </div>
  )
}
