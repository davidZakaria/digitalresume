type VerticalLabelProps = {
  children: string
  side: 'left' | 'right'
  className?: string
}

export function VerticalLabel({ children, side, className = '' }: VerticalLabelProps) {
  return (
    <span
      className={[
        'vertical-label pointer-events-none select-none font-mono text-[10px] uppercase tracking-[0.35em] text-ink-faint',
        side === 'left' ? 'left-4 md:left-6' : 'right-4 md:right-6',
        className,
      ].join(' ')}
      aria-hidden
    >
      {children}
    </span>
  )
}
