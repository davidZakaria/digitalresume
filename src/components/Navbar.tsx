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

function ScrollProgressBar({ cream }: { cream: boolean }) {
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
    <div
      className={['h-px w-full', cream ? 'bg-canvas/15' : 'bg-surface-border'].join(' ')}
      aria-hidden="true"
    >
      <div
        className="h-full bg-accent transition-[width] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [onCream, setOnCream] = useState(true)
  const reduce = useReducedMotion()
  const location = useLocation()
  const isGame = location.pathname.startsWith('/game')
  const isGamesHub = location.pathname === '/game' || location.pathname === '/game/'
  const active = useScrollspy(SECTION_IDS)

  const firstName = resume.name.split(/\s+/)[0] ?? resume.name

  useEffect(() => {
    if (isGame) {
      setOnCream(false)
      return
    }

    const update = () => {
      const hero = document.getElementById('home')
      const projects = document.getElementById('projects')
      const y = window.scrollY + 72
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0
      const projectsTop = projects ? projects.offsetTop : Number.POSITIVE_INFINITY
      const projectsBottom = projects ? projects.offsetTop + projects.offsetHeight : 0
      setOnCream(y < heroBottom || (y >= projectsTop && y < projectsBottom))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [isGame])

  const linkClass = (id: SectionId) =>
    [
      'relative px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200',
      onCream
        ? active === id
          ? 'text-canvas'
          : 'text-canvas/55 hover:text-canvas'
        : active === id
          ? 'text-ink'
          : 'text-ink-faint hover:text-accent',
    ].join(' ')

  return (
    <header
      className={[
        'no-print fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-colors duration-300',
        onCream ? 'bg-cream/85 text-canvas' : 'bg-canvas/90 text-ink',
      ].join(' ')}
    >
      <ScrollProgressBar cream={onCream} />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        {isGame ? (
          <Link
            to="/"
            className="font-script text-2xl text-ink transition hover:text-accent"
            aria-label="Back to résumé home"
          >
            {firstName.toLowerCase()}
          </Link>
        ) : (
          <a
            href="#"
            className={[
              'font-script text-2xl transition hover:opacity-80',
              onCream ? 'text-canvas' : 'text-ink',
            ].join(' ')}
            aria-label="Back to top"
          >
            {firstName.toLowerCase()}
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
                  {active === l.id ? (
                    <span
                      className={[
                        'absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                        onCream ? 'bg-canvas' : 'bg-accent',
                      ].join(' ')}
                      aria-hidden
                    />
                  ) : null}
                </a>
              ))}
              <Link
                to="/game"
                className={[
                  'px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition',
                  onCream ? 'text-canvas/55 hover:text-canvas' : 'text-ink-faint hover:text-accent',
                ].join(' ')}
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
            className={[
              'border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition md:hidden',
              onCream
                ? 'border-canvas/20 text-canvas hover:border-canvas/50'
                : 'border-surface-border text-ink hover:border-accent/40',
            ].join(' ')}
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
            className={[
              'border-t px-4 py-4 md:hidden',
              onCream ? 'border-canvas/15 bg-cream/95' : 'border-surface-border bg-canvas',
            ].join(' ')}
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
                    className={[
                      'rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider',
                      onCream ? 'text-canvas/55 hover:text-canvas' : 'text-ink-faint hover:text-accent',
                    ].join(' ')}
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
