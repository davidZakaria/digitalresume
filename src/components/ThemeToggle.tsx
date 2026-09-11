import { useTheme } from '../hooks/useTheme'

function SunGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M17.66 6.34l1.41-1.41M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a7.77 7.77 0 0 0 9.87 9.87A7.5 7.5 0 1 1 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className="relative flex h-9 w-16 shrink-0 items-center rounded-full border border-surface-border bg-surface-muted/90 px-1 shadow-innerGlow transition hover:border-accent/30"
    >
      <span
        className={[
          'pointer-events-none absolute inset-0 rounded-full transition-colors',
          dark ? 'bg-accent-muted/50' : 'bg-surface-elevated/60',
        ].join(' ')}
        aria-hidden
      />
      <span
        className={[
          'relative z-[1] flex h-7 w-7 items-center justify-center rounded-full border border-surface-border bg-surface-elevated text-ink-soft shadow-card transition-[transform] duration-200 ease-out motion-reduce:transition-none',
          dark ? 'translate-x-7' : 'translate-x-0',
        ].join(' ')}
      >
        {dark ? <MoonGlyph className="text-ink-soft" /> : <SunGlyph className="text-ink-soft" />}
      </span>
    </button>
  )
}
