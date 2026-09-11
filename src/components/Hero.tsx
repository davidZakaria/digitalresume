import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { CircularStamp } from './CircularStamp'
import { VerticalLabel } from './VerticalLabel'

const titleParts = resume.title.split(/\s+/)
const titleLine1 = titleParts.slice(0, -1).join(' ') || titleParts[0] || resume.title
const titleLine2 = titleParts.length > 1 ? titleParts[titleParts.length - 1] : ''

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      id="home"
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

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col px-4 pb-24 pt-28 md:px-8 md:pb-28 md:pt-32">
        <motion.p
          className="font-sans text-sm italic text-ink-faint md:text-base"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Résumé <span className="text-pop not-italic">✕</span> developer flex{' '}
          <span className="text-accent-bright not-italic">✓</span>
        </motion.p>

        <div className="mt-auto flex flex-1 flex-col justify-center py-12 md:py-16">
          <motion.h1
            className="font-display text-display-xl font-black uppercase leading-[0.88] tracking-tight text-canvas"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: reduce ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {titleLine1}
          </motion.h1>

          {titleLine2 ? (
            <motion.p
              className="mt-2 font-display text-display-lg font-bold uppercase tracking-tight text-canvas md:mt-3"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduce ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              {titleLine2}
            </motion.p>
          ) : null}

          <motion.p
            className="mt-8 max-w-2xl text-base leading-relaxed text-ink-faint md:mt-10 md:text-lg"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {resume.summary}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4 md:mt-12"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center border border-canvas bg-canvas px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-cream transition hover:bg-canvas/90"
            >
              View work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center border border-canvas/30 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-canvas transition hover:border-canvas hover:bg-canvas/5"
            >
              Contact
            </a>
            <a
              href={resume.contact.github}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-ink-faint underline-offset-4 transition hover:text-canvas hover:underline"
            >
              GitHub →
            </a>
          </motion.div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <motion.p
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.5, duration: 0.5 }}
          >
            {resume.location}
          </motion.p>

          <CircularStamp className="text-canvas" />
        </div>
      </div>

      <motion.a
        href="#about"
        className="no-print absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-faint motion-safe:animate-float motion-reduce:animate-none"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.8, duration: 0.5 }}
        aria-label="Scroll to About"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Scroll to explore</span>
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
