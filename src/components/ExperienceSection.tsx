import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume, type ExperienceItem } from '../data/resume'
import { EditorialWord } from './EditorialWord'
import { Reveal } from './Reveal'
import { SectionIndex } from './SectionIndex'

function yearLabel(period: string): string {
  const years = period.match(/\d{4}/g)
  if (years?.[0]) return years[0]
  if (/present/i.test(period)) return 'Now'
  return period
}

function TimelinePanel({ job, compact = false }: { job: ExperienceItem; compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{job.period}</p>
          <p className="mt-1 truncate font-display text-lg font-bold uppercase tracking-tight text-ink">
            {job.role}
          </p>
          <p className="truncate text-sm text-ink-soft">{job.company}</p>
        </div>
        <p className="shrink-0 font-display text-3xl font-black uppercase leading-none text-ink">
          {yearLabel(job.period)}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">{job.period}</p>
      <p className="mt-3 font-display text-6xl font-black uppercase leading-none tracking-tight text-ink md:text-7xl">
        {yearLabel(job.period)}
      </p>
      <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
        {job.role}
      </h3>
      <p className="mt-2 font-medium text-ink-soft">{job.company}</p>
      {job.location ? <p className="mt-1 text-sm text-ink-faint">{job.location}</p> : null}
    </div>
  )
}

export function ExperienceSection() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const itemRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const nodes = itemRefs.current.filter((node): node is HTMLElement => Boolean(node))
    if (nodes.length === 0) return

    const measure = () => {
      const mid = window.innerHeight * 0.45
      let best = 0
      let bestDist = Number.POSITIVE_INFINITY
      nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = index
        }
      })
      setActive(best)
    }

    const frame = requestAnimationFrame(measure)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const current = resume.experience[active] ?? resume.experience[0]

  return (
    <section
      id="experience"
      className="section-canvas scroll-mt-[var(--nav-h)] border-b border-surface-border py-24 md:py-32 print:bg-white print:text-ink"
      data-nav-theme="dark"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="02" label="Experience" />
          <div className="mt-6 overflow-hidden">
            <EditorialWord size="lg" className="text-ink/15">
              Roles
            </EditorialWord>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-ink-faint">
            Roles where ownership mattered — timeline driven by{' '}
            <code className="font-mono text-accent-bright">resume.ts</code>.
          </p>
        </Reveal>

        <div className="sticky top-[var(--nav-h)] z-20 mt-10 border border-surface-border bg-surface-elevated/95 p-3 backdrop-blur-md sm:p-4 lg:hidden">
          {current ? <TimelinePanel job={current} compact /> : null}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <div className="relative hidden lg:block">
            <div className="sticky top-32 border border-surface-border bg-surface-elevated/80 p-6 backdrop-blur-md">
              {current ? (
                <div
                  className={reduce ? '' : 'transition-opacity duration-300'}
                  aria-live="polite"
                >
                  <TimelinePanel job={current} />
                </div>
              ) : null}
            </div>
          </div>

          <div className="divide-y divide-[var(--divider)] border-y border-[var(--divider)]">
            {resume.experience.map((job, index) => (
              <motion.article
                key={`${job.company}-${job.period}`}
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                className="flex min-h-[42svh] flex-col justify-center py-10 sm:min-h-[50svh] md:min-h-[62svh] md:py-16"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{
                  duration: 0.5,
                  delay: reduce ? 0 : 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                data-active={active === index ? 'true' : 'false'}
              >
                <div className="lg:hidden">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{job.period}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-ink">
                    {job.role}
                  </h3>
                  <p className="mt-2 font-medium text-ink-soft">{job.company}</p>
                </div>
                <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint lg:block">
                  {job.company}
                </p>
                <ul className="mt-6 space-y-3 text-sm leading-relaxed text-ink-soft">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-4">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
