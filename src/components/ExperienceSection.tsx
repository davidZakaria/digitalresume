import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function ExperienceSection() {
  const reduce = useReducedMotion()

  return (
    <section
      id="experience"
      className="scroll-mt-24 py-20 md:scroll-mt-28 md:py-28 print:bg-white print:text-ink"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            kicker="Experience"
            title="Roles where ownership mattered."
            subtitle={
              <>
                Timeline is driven by{' '}
                <code className="rounded-md border border-surface-border bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] text-accent-bright">
                  resume.ts
                </code>{' '}
                — edit roles there and this page stays in sync.
              </>
            }
          />
        </Reveal>

        <div className="relative mt-16 ml-3 border-l border-accent/20 md:ml-4">
          <ul className="space-y-14 pb-2">
            {resume.experience.map((job, index) => (
              <motion.li
                key={`${job.company}-${job.period}`}
                className="relative pl-8 md:pl-12"
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{
                  duration: 0.5,
                  delay: reduce ? 0 : index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span
                  className="absolute left-0 top-7 h-[13px] w-[13px] -translate-x-1/2 rounded-full border-2 border-accent bg-surface-elevated shadow-[0_0_0_4px_var(--accent-muted)]"
                  aria-hidden
                />
                <article className="group rounded-2xl border border-surface-border bg-surface-elevated/95 p-6 shadow-card backdrop-blur-sm transition duration-300 hover:border-accent/25 hover:shadow-glow md:p-8">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-ink">{job.role}</h3>
                      <p className="mt-1 font-medium text-accent">{job.company}</p>
                    </div>
                    <p className="shrink-0 font-mono text-xs uppercase tracking-wider text-ink-faint">
                      {job.period}
                    </p>
                  </div>
                  {job.location ? (
                    <p className="mt-2 text-sm text-ink-faint">{job.location}</p>
                  ) : null}
                  <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink-soft">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
