import type { CSSProperties, MouseEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'

function HeroSnapshot() {
  const reduceMotion = useReducedMotion()
  const n = resume.projects.length

  return (
    <motion.div
      className="hero-ring relative overflow-hidden rounded-2xl border border-surface-border bg-surface-elevated/95 p-6 shadow-card backdrop-blur-sm md:p-7"
      initial={reduceMotion ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent-soft to-accent-muted"
        aria-hidden
      />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">At a glance</p>
        <p className="mt-4 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
          Work that ships
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-faint">
          Full-stack products — from HR and booking to archives, learning tools, and live client sites.
        </p>
        <dl className="mt-6 space-y-3 border-t border-surface-border pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-faint">Portfolio pieces</dt>
            <dd className="font-display font-semibold tabular-nums text-ink">{n}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-faint">Focus</dt>
            <dd className="text-right font-medium text-ink-soft">
              Web apps · APIs · Arabic/RTL · Deployments
            </dd>
          </div>
          <div className="mt-1 flex flex-wrap gap-2 pt-1">
            {['Next.js', 'React', 'Node', 'MongoDB', 'TypeScript'].map((t) => (
              <span
                key={t}
                className="rounded-lg border border-surface-border bg-surface-muted/80 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-accent-bright"
              >
                {t}
              </span>
            ))}
          </div>
        </dl>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const nameParts = resume.name.trim().split(/\s+/)
  const firstName = nameParts[0] ?? resume.name
  const restName = nameParts.slice(1).join(' ')

  const onHeroMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / Math.max(r.width, 1)) * 100
    const y = ((e.clientY - r.top) / Math.max(r.height, 1)) * 100
    el.style.setProperty('--hx', `${x}%`)
    el.style.setProperty('--hy', `${y}%`)
  }

  return (
    <section
      id="home"
      onMouseMove={onHeroMove}
      style={
        {
          '--hx': '45%',
          '--hy': '30%',
        } as CSSProperties
      }
      className="relative overflow-hidden border-b border-surface-border bg-gradient-to-b from-surface to-surface-muted/80 print:border-stone-200 print:bg-white"
    >
      {!reduce ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(min(55vw, 520px) circle at var(--hx, 45%) var(--hy, 30%), rgba(161, 98, 7, 0.08), transparent 55%)',
          }}
          aria-hidden
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden />
      <div className="noise-overlay absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-surface"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-1/3 top-[-10%] h-[min(520px,90vw)] w-[min(520px,90vw)] rounded-full bg-accent/10 blur-3xl animate-gradient-shift motion-reduce:animate-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-[-15%] h-[480px] w-[480px] rounded-full bg-accent-bright/8 blur-3xl animate-gradient-shift motion-reduce:animate-none"
        style={{ animationDelay: '2s' }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-5xl gap-12 px-4 pb-28 pt-14 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:px-6 md:pb-36 md:pt-20 lg:items-center">
        <div>
          <motion.p
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-muted px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Portfolio & CV
          </motion.p>

          <motion.h1
            className="font-display text-balance text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-[3.35rem] lg:leading-[1.08]"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-ink">{firstName}</span>
            {restName ? (
              <>
                {' '}
                <span className="text-gradient motion-safe:animate-gradient-flow motion-reduce:bg-none motion-reduce:text-accent">
                  {restName}
                </span>
              </>
            ) : null}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-lg font-medium text-ink-soft md:text-xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {resume.title}
          </motion.p>

          <motion.p
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-faint md:text-[1.05rem]"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {resume.summary}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-surface-elevated shadow-glow transition hover:bg-ink-soft motion-reduce:transform-none"
            >
              View flagship work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-surface-border bg-surface-elevated/90 px-6 py-2.5 text-sm font-semibold text-ink shadow-innerGlow backdrop-blur transition hover:border-accent/35 hover:bg-surface-elevated"
            >
              Let&apos;s talk
            </a>
            <a
              href={resume.contact.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-accent underline-offset-4 transition hover:text-accent-bright hover:underline"
            >
              GitHub
            </a>
          </motion.div>

          <p className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-faint">
            <span>{resume.location}</span>
            <span className="hidden h-1 w-1 rounded-full bg-accent/50 sm:inline" aria-hidden />
            <span>Building end-to-end web products</span>
          </p>
        </div>

        <div className="relative lg:translate-y-2">
          <div
            className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-accent/12 via-transparent to-accent-bright/10 blur-2xl motion-safe:animate-pulse-soft motion-reduce:animate-none"
            aria-hidden
          />
          <HeroSnapshot />
        </div>
      </div>

      <motion.a
        href="#about"
        className="no-print absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-faint motion-safe:animate-float motion-reduce:animate-none"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1, duration: 0.5 }}
        aria-label="Scroll to About"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Scroll</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent" aria-hidden>
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.a>
    </section>
  )
}
