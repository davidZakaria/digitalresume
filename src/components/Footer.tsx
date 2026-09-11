import { resume } from '../data/resume'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 mt-auto border-t border-surface-border/50 print:border-stone-200">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center md:px-6">
        <p className="text-sm text-ink-faint print:text-zinc-600">
          © {year}{' '}
          <a
            href={resume.contact.github}
            className="font-display font-bold text-ink underline-offset-4 transition hover:text-accent print:text-violet-800 print:underline"
          >
            {resume.name}
          </a>
        </p>
      </div>
    </footer>
  )
}
