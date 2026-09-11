import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { resume } from '../data/resume'
import { SECTION_IDS, useScrollspy, type SectionId } from '../hooks/useScrollspy'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const update = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="h-px w-full bg-surface-border" aria-hidden="true">
      <div
        className="h-full bg-accent transition-[width] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const location = useLocation()
  const isGame = location.pathname.startsWith('/game')
  const isGamesHub = location.pathname === '/game' || location.pathname === '/game/'
  const active = useScrollspy(SECTION_IDS)

  const initials = resume.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const linkClass = (id: SectionId) =>
    [
      'px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200',
      active === id ? 'text-ink' : 'text-ink-faint hover:text-accent',
    ].join(' ')

  return (
    <header className="no-print sticky top-0 z-50 border-b border-surface-border bg-canvas/90 backdrop-blur-xl">
      <ScrollProgressBar />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        {isGame ? (
          <Link
            to="/"
            className="font-display text-lg font-bold uppercase tracking-tight text-ink transition hover:text-accent"
            aria-label="Back to résumé home"
          >
            {initials}
          </Link>
        ) : (
          <a
            href="#"
            className="font-display text-lg font-bold uppercase tracking-tight text-ink transition hover:text-accent"
            aria-label="Back to top"
          >
            {initials}
          </a>
        )}

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Primary">
          {isGame ? (
            <>
              <Link
                to="/"
                className="px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint transition hover:text-accent"
              >
                Résumé
              </Link>
              {!isGamesHub && (
                <Link
                  to="/game"
                  className="px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint transition hover:text-accent"
                >
                  Games
                </Link>
              )}
            </>
          ) : (
            <>
              {NAV_LINKS.map((l) => (
                <a key={l.id} href={`#${l.id}`} className={linkClass(l.id)}>
                  {l.label}
                </a>
              ))}
              <Link
                to="/game"
                className="px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint transition hover:text-accent"
              >
                Play
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="border border-surface-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition hover:border-accent/40 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="border-t border-surface-border bg-canvas px-4 py-4 md:hidden"
            aria-label="Mobile primary"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex flex-col gap-1">
              {isGame ? (
                <>
                  <Link
                    to="/"
                    className="rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-faint hover:text-accent"
                    onClick={() => setOpen(false)}
                  >
                    Résumé
                  </Link>
                  {!isGamesHub && (
                    <Link
                      to="/game"
                      className="rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-faint hover:text-accent"
                      onClick={() => setOpen(false)}
                    >
                      Games
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.id}
                      href={`#${l.id}`}
                      className={`rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider ${linkClass(l.id)}`}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </a>
                  ))}
                  <Link
                    to="/game"
                    className="rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-faint hover:text-accent"
                    onClick={() => setOpen(false)}
                  >
                    Play
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
