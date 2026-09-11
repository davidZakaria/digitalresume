import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function ExperienceSection() {
  const reduce = useReducedMotion()

  return (
    <section
      id="experience"
      className="section-canvas scroll-mt-24 border-b border-surface-border py-24 md:scroll-mt-28 md:py-32 print:bg-white print:text-ink"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionHeading
            kicker="Experience"
            title="Roles where ownership mattered."
            editorial
            subtitle="Production software across real-estate, HR, hospitality, and independent portfolio work."
          />
        </Reveal>

        <div className="mt-16 divide-y divide-[var(--divider)] border-y border-[var(--divider)]">
          {resume.experience.map((job, index) => (
            <motion.article
              key={`${job.company}-${job.period}`}
              className="group py-10 md:py-12"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{
                duration: 0.5,
                delay: reduce ? 0 : index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-12">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{job.period}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
                    {job.role}
                  </h3>
                  <p className="mt-2 font-medium text-ink-soft">{job.company}</p>
                  {job.location ? <p className="mt-1 text-sm text-ink-faint">{job.location}</p> : null}
                </div>

                <ul className="space-y-3 text-sm leading-relaxed text-ink-soft md:pt-1">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-4">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
