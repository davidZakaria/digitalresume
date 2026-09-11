import { resume } from '../data/resume'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-surface-border bg-canvas print:border-stone-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 md:flex-row md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint print:text-zinc-600">
          © {year} {resume.name}
        </p>
        <a
          href={resume.contact.github}
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint transition hover:text-accent print:text-zinc-800"
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
