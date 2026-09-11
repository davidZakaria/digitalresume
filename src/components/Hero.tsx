import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { CircularStamp } from './CircularStamp'
import { ScrollExplore } from './ScrollExplore'

export function Hero() {
  const reduce = useReducedMotion()
  const firstName = resume.name.split(/\s+/)[0] ?? resume.name

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col overflow-hidden print:min-h-0"
      data-nav-theme="cream"
    >
      <div className="section-cream relative flex min-h-[88vh] flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="noise-overlay absolute inset-0" aria-hidden />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
          <motion.div
            className="flex items-start justify-between gap-4"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#" className="font-script text-3xl text-canvas md:text-4xl" aria-label={resume.name}>
              {firstName.toLowerCase()}
            </a>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-canvas/50">Portfolio &amp; CV</p>
          </motion.div>

          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center md:py-12">
            <motion.h1
              className="w-full font-display text-display-xl font-black uppercase leading-[0.84] tracking-tight text-canvas"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Full-Stack
            </motion.h1>
            <motion.p
              className="mt-0 font-display text-display-lg font-bold uppercase leading-[0.9] tracking-tight text-canvas"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Engineer
            </motion.p>

            <motion.p
              className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-canvas/45"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.35, duration: 0.45 }}
            >
              Product <span className="mx-2">•</span> Code <span className="mx-2">•</span> Deploy
            </motion.p>

            <motion.p
              className="mx-auto mt-8 max-w-xl text-pretty text-sm leading-relaxed text-canvas/55 md:text-base"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.42, duration: 0.5 }}
            >
              {resume.summary}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.5, duration: 0.45 }}
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
                className="px-4 py-2.5 text-sm font-medium text-canvas/70 underline-offset-4 transition hover:text-canvas hover:underline"
              >
                GitHub
              </a>
            </motion.div>
          </div>

          <motion.div
            className="flex items-end justify-between gap-6"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.6, duration: 0.45 }}
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">{resume.location}</p>
              <p className="mt-1 text-xs text-canvas/40">Building end-to-end web products</p>
            </div>
            <CircularStamp className="text-canvas" />
          </motion.div>
        </div>

        <motion.div
          className="relative z-10 pb-8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.75, duration: 0.45 }}
        >
          <ScrollExplore href="#about" className="mx-auto motion-safe:animate-float motion-reduce:animate-none" />
        </motion.div>
      </div>

      <div className="section-canvas h-16 md:h-20" aria-hidden />
    </section>
  )
}
