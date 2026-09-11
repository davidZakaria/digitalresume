type SectionIndexProps = {
  index: string
  label: string
  className?: string
}

export function SectionIndex({ index, label, className = '' }: SectionIndexProps) {
  return (
    <p className={['font-mono text-[10px] uppercase tracking-[0.32em] text-accent', className].join(' ')}>
      {index} — {label}
    </p>
  )
}
