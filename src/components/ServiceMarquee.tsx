const SERVICES = [
  'Full-stack web',
  'REST APIs',
  'React / Next.js',
  'MongoDB',
  'Production deploys',
  'Arabic / RTL',
  'Client sites',
  'HR & booking systems',
] as const

export function ServiceMarquee({ className = '' }: { className?: string }) {
  const row = SERVICES.join(' + ') + ' + '
  const doubled = row + row

  return (
    <div
      className={[
        'no-print overflow-hidden border-y border-surface-border bg-surface-muted/40 py-3',
        className,
      ].join(' ')}
      aria-hidden
    >
      <div className="marquee-track flex w-max gap-0 whitespace-nowrap">
        <span className="marquee-content px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {doubled}
        </span>
        <span className="marquee-content px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {doubled}
        </span>
      </div>
    </div>
  )
}
