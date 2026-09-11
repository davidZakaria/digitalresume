type ScrollExploreProps = {
  href: string
  label?: string
  className?: string
}

export function ScrollExplore({ href, label = 'Scroll to explore', className = '' }: ScrollExploreProps) {
  return (
    <a
      href={href}
      className={[
        'no-print group flex flex-col items-center gap-3 text-ink-faint transition hover:text-ink',
        className,
      ].join(' ')}
      aria-label={label}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.35em]">{label}</span>
      <span className="flex flex-col items-center gap-2" aria-hidden>
        <span className="h-10 w-px bg-current/30 transition group-hover:bg-current/60" />
        <span className="h-2 w-2 rounded-full border border-current/40 bg-current/10 transition group-hover:border-accent group-hover:bg-accent/30" />
      </span>
    </a>
  )
}
