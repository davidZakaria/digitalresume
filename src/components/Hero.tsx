import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { CircularStamp } from './CircularStamp'
import { ScrollExplore } from './ScrollExplore'

const titleParts = resume.title.split(/\s+/)
const titleLine1 = titleParts.slice(0, -1).join(' ') || titleParts[0] || resume.title
const titleLine2 = titleParts.length > 1 ? titleParts[titleParts.length - 1] : ''

export function Hero() {
  const reduce = useReducedMotion()
  const firstName = resume.name.split(/\s+/)[0] ?? resume.name

  return (
    <section
      id="home"
      className="section-cream relative flex min-h-screen flex-col overflow-hidden print:min-h-0"
      data-nav-theme="cream"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div className="noise-overlay absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-24 md:px-8 md:pb-14 md:pt-28">
        <motion.div
          className="flex items-start justify-between gap-4"
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="#" className="font-script text-3xl text-canvas md:text-4xl" aria-label={resume.name}>
            {firstName.toLowerCase()}
          </a>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-accent sm:block">
            Portfolio &amp; CV
          </p>
        </motion.div>

        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center md:py-14">
          <motion.p
            className="mb-6 inline-flex border border-canvas/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent sm:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Portfolio &amp; CV
          </motion.p>

          <motion.h1
            className="w-full font-display text-display-xl font-black uppercase leading-[0.85] tracking-tight text-canvas"
            initial={reduce ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: reduce ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {titleLine1}
          </motion.h1>

          {titleLine2 ? (
            <motion.p
              className="mt-1 font-display text-display-lg font-bold uppercase tracking-tight text-canvas md:mt-2"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {titleLine2}
            </motion.p>
          ) : null}

          <motion.p
            className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-ink-faint"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.38, duration: 0.5 }}
          >
            Product <span className="mx-2 text-canvas/30">•</span> Code{' '}
            <span className="mx-2 text-canvas/30">•</span> Deploy
          </motion.p>

          <motion.p
            className="mx-auto mt-10 max-w-2xl text-pretty text-sm leading-relaxed text-ink-faint md:text-base"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.45, duration: 0.55 }}
          >
            {resume.summary}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.52, duration: 0.5 }}
          >
            <a
              href="#projects"
              className="border border-canvas bg-canvas px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-canvas/90"
            >
              View flagship work
            </a>
            <a
              href="#contact"
              className="border border-canvas/25 px-6 py-2.5 text-sm font-semibold text-canvas transition hover:border-canvas"
            >
              Let&apos;s talk
            </a>
            <a
              href={resume.contact.github}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 text-sm font-medium text-accent transition hover:text-accent-bright hover:underline"
            >
              GitHub
            </a>
          </motion.div>
        </div>

        <motion.div
          className="flex items-end justify-between gap-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.65, duration: 0.5 }}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">{resume.location}</p>
            <p className="mt-1 text-xs text-ink-faint/80">Building end-to-end web products</p>
          </div>
          <CircularStamp className="text-canvas" />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 pb-10"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.9, duration: 0.5 }}
      >
        <ScrollExplore href="#about" className="mx-auto motion-safe:animate-float motion-reduce:animate-none" />
      </motion.div>
    </section>
  )
}
