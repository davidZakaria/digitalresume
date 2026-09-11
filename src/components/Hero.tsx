import type { CSSProperties, MouseEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { CircularStamp } from './CircularStamp'
import { VerticalLabel } from './VerticalLabel'

const FEATURED_STACK = ['Next.js', 'React', 'Node', 'MongoDB', 'TypeScript'] as const

function HeroSnapshot() {
  const reduce = useReducedMotion()
  const n = resume.projects.length

  return (
    <motion.aside
      className="relative border border-canvas/15 bg-cream/60 p-6 backdrop-blur-sm md:p-7"
      initial={reduce ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, delay: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      aria-label="At a glance"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">At a glance</p>
      <p className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-canvas md:text-2xl">
        Work that ships
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-faint">
        Full-stack products — from HR and booking to archives, learning tools, and live client sites.
      </p>
      <dl className="mt-6 space-y-3 border-t border-canvas/15 pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-faint">Portfolio pieces</dt>
          <dd className="font-display text-lg font-bold tabular-nums text-canvas">{n}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-faint">Focus</dt>
          <dd className="text-right font-medium text-ink-soft">
            Web apps · APIs · Arabic/RTL · Deployments
          </dd>
        </div>
        <div className="mt-1 flex flex-wrap gap-2 pt-1">
          {FEATURED_STACK.map((t) => (
            <span
              key={t}
              className="border border-canvas/15 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-accent-bright"
            >
              {t}
            </span>
          ))}
        </div>
      </dl>
    </motion.aside>
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
      className="section-cream relative min-h-[92vh] overflow-hidden border-b border-black/10 print:min-h-0 print:border-stone-200 print:bg-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div className="noise-overlay absolute inset-0" aria-hidden />

      <VerticalLabel side="left" className="absolute top-1/2 z-10 hidden -translate-y-1/2 md:block">
        Code
      </VerticalLabel>
      <VerticalLabel side="right" className="absolute top-1/2 z-10 hidden -translate-y-1/2 md:block">
        Ship
      </VerticalLabel>

      <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-6xl gap-12 px-4 pb-24 pt-28 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:px-8 md:pb-28 md:pt-32 lg:items-center">
        <div className="flex flex-col justify-center">
          <motion.p
            className="mb-4 inline-flex w-fit items-center border border-canvas/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Portfolio &amp; CV
          </motion.p>

          <motion.h1
            className="font-display text-display-lg font-black uppercase leading-[0.9] tracking-tight text-canvas"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {firstName}
            {restName ? (
              <>
                <br />
                <span className="text-gradient motion-safe:animate-gradient-flow motion-reduce:bg-none motion-reduce:text-accent">
                  {restName}
                </span>
              </>
            ) : null}
          </motion.h1>

          <motion.p
            className="mt-5 text-lg font-semibold text-ink-soft md:text-xl"
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
              className="inline-flex items-center justify-center border border-canvas bg-canvas px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-canvas/90"
            >
              View flagship work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center border border-canvas/30 px-6 py-2.5 text-sm font-semibold text-canvas transition hover:border-canvas hover:bg-canvas/5"
            >
              Let&apos;s talk
            </a>
            <a
              href={resume.contact.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-accent underline-offset-4 transition hover:text-accent-bright hover:underline"
            >
              GitHub
            </a>
          </motion.div>

          <motion.p
            className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-faint"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.4, duration: 0.5 }}
          >
            <span>{resume.location}</span>
            <span className="hidden h-1 w-1 rounded-full bg-accent/50 sm:inline" aria-hidden />
            <span>Building end-to-end web products</span>
          </motion.p>
        </div>

        <div className="relative flex flex-col justify-center gap-6 lg:translate-y-2">
          <HeroSnapshot />
          <div className="hidden justify-end md:flex">
            <CircularStamp className="text-canvas" />
          </div>
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-canvas" aria-hidden>
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.a>
    </section>
  )
}
