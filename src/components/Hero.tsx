import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { IDLE_INTRO_CLOCK, type AvatarIntroClock } from '../lib/avatarAssets'
import { AvatarSlot } from './AvatarSlot'
import { CircularStamp } from './CircularStamp'
import { HeroHeadline } from './HeroHeadline'
import { ScrollExplore } from './ScrollExplore'

export function Hero() {
  const reduce = useReducedMotion()
  const firstName = resume.name.split(/\s+/)[0] ?? resume.name
  const clockRef = useRef<AvatarIntroClock>({ ...IDLE_INTRO_CLOCK, hasIntro: true })

  return (
    <section
      id="home"
      className="relative flex min-h-dvh flex-col overflow-hidden print:min-h-0"
      data-nav-theme="cream"
    >
      <div className="section-cream relative flex min-h-[88svh] flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="noise-overlay absolute inset-0" aria-hidden />

        <p
          className="hero-nameplate pointer-events-none absolute inset-x-0 top-[18%] z-0 select-none text-center font-display font-black uppercase leading-[0.78] tracking-tight text-canvas/[0.07] md:top-[12%]"
          aria-hidden
        >
          David
          <span className="block">Samy</span>
        </p>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
          <motion.div
            className="flex items-start justify-between gap-4"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#" className="tap-target inline-flex items-center font-script text-3xl text-canvas md:text-4xl" aria-label={resume.name}>
              {firstName.toLowerCase()}
            </a>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-canvas/50">Portfolio &amp; CV</p>
          </motion.div>

          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center md:py-8">
            <motion.div
              className="relative z-[1] mb-0 md:-mb-2"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <AvatarSlot clockRef={clockRef} />
            </motion.div>

            <motion.div
              className="hero-headline-wrap relative z-[2] mt-1 w-full overflow-x-clip md:-mt-3"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: reduce ? 0 : 0.08 }}
            >
              <HeroHeadline clockRef={clockRef} />
            </motion.div>

            <motion.p
              className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-canvas/45"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.35, duration: 0.45 }}
            >
              Product <span className="mx-2">•</span> Code <span className="mx-2">•</span> Deploy
            </motion.p>

            <motion.p
              className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-canvas/55 md:text-base"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.42, duration: 0.5 }}
            >
              {resume.summary}
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.5, duration: 0.45 }}
            >
              <a
                href="#projects"
                className="tap-target inline-flex items-center border border-canvas bg-canvas px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-canvas/90"
              >
                View flagship work
              </a>
              <a
                href="#contact"
                className="tap-target inline-flex items-center border border-canvas/25 px-6 py-2.5 text-sm font-semibold text-canvas transition hover:border-canvas"
              >
                Let&apos;s talk
              </a>
              <a
                href={resume.contact.github}
                target="_blank"
                rel="noreferrer"
                className="tap-target inline-flex items-center px-4 py-2.5 text-sm font-medium text-canvas/70 underline-offset-4 transition hover:text-canvas hover:underline"
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
