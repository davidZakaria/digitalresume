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
    <div className="h-[3px] w-full bg-surface-muted" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-accent to-accent-bright transition-[width] duration-200 ease-out motion-reduce:transition-none"
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
  const isGamesHub =
    location.pathname === '/game' || location.pathname === '/game/'
  const active = useScrollspy(SECTION_IDS)

  const initials = resume.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const linkClass = (id: SectionId) =>
    [
      'rounded-full px-3 py-1.5 text-sm transition-colors duration-200',
      active === id
        ? 'bg-accent-muted text-ink shadow-innerGlow ring-1 ring-accent/25'
        : 'text-ink-faint hover:text-accent',
    ].join(' ')

  return (
    <header className="no-print sticky top-0 z-50 border-b border-surface-border bg-surface-elevated/90 shadow-nav backdrop-blur-xl backdrop-saturate-150">
      <ScrollProgressBar />
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {isGame ? (
          <Link
            to="/"
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-muted to-accent-soft font-mono text-sm font-bold text-ink ring-1 ring-surface-border transition hover:ring-accent/35 hover:shadow-glow"
            aria-label="Back to résumé home"
          >
            <span className="relative z-10">{initials}</span>
            <span
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100 motion-reduce:opacity-0"
              style={{ background: 'var(--initials-hover-glow)' }}
            />
          </Link>
        ) : (
          <a
            href="#"
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-muted to-accent-soft font-mono text-sm font-bold text-ink ring-1 ring-surface-border transition hover:ring-accent/35 hover:shadow-glow"
            aria-label="Back to top"
          >
            <span className="relative z-10">{initials}</span>
            <span
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100 motion-reduce:opacity-0"
              style={{ background: 'var(--initials-hover-glow)' }}
            />
          </a>
        )}

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {isGame ? (
            <>
              <Link
                to="/"
                className="rounded-full px-3 py-1.5 text-sm text-ink-faint transition-colors duration-200 hover:text-accent"
              >
                Résumé
              </Link>
              {!isGamesHub && (
                <Link
                  to="/game"
                  className="rounded-full px-3 py-1.5 text-sm text-ink-faint transition-colors duration-200 hover:text-accent"
                >
                  All games
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
                className="rounded-full px-3 py-1.5 text-sm text-ink-faint transition-colors duration-200 hover:text-accent"
              >
                Play
              </Link>
            </>
          )}
        </nav>

        <ThemeToggle />

        <button
          type="button"
          className="rounded-xl border border-surface-border bg-surface-muted/80 px-3 py-2 text-sm text-ink backdrop-blur transition hover:border-accent/30 hover:bg-surface-elevated md:hidden"
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
            className="border-t border-surface-border bg-surface-elevated/98 px-4 py-4 backdrop-blur-xl md:hidden"
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
                    className="rounded-lg px-3 py-2.5 text-sm text-ink-faint hover:text-accent"
                    onClick={() => setOpen(false)}
                  >
                    Résumé
                  </Link>
                  {!isGamesHub && (
                    <Link
                      to="/game"
                      className="rounded-lg px-3 py-2.5 text-sm text-ink-faint hover:text-accent"
                      onClick={() => setOpen(false)}
                    >
                      All games
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.id}
                      href={`#${l.id}`}
                      className={`rounded-lg px-3 py-2.5 text-sm ${linkClass(l.id)}`}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </a>
                  ))}
                  <Link
                    to="/game"
                    className="rounded-lg px-3 py-2.5 text-sm text-ink-faint hover:text-accent"
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
