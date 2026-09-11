import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const BENTO_SPAN = ['md:col-span-2', 'md:col-span-1', 'md:col-span-1', 'md:col-span-2'] as const

export function SkillsSection() {
  const reduce = useReducedMotion()

  return (
    <section
      id="skills"
      className="scroll-mt-24 border-y border-surface-border bg-gradient-to-b from-surface via-surface-muted/40 to-surface py-20 md:scroll-mt-28 md:py-28 print:bg-white print:text-zinc-900"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            kicker="Skills"
            title="Tools I reach for every week."
            subtitle="Grouped to mirror how you work — adjust groups in resume.ts anytime."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {resume.skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              className={BENTO_SPAN[i] ?? ''}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="h-full rounded-2xl border border-surface-border bg-surface-elevated/95 p-6 shadow-innerGlow backdrop-blur-sm transition duration-300 hover:border-accent/25 hover:shadow-glow md:p-7">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-accent/35 to-transparent" aria-hidden />
                  <h3 className="whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent-bright">
                    {group.label}
                  </h3>
                  <span className="h-px flex-1 bg-gradient-to-l from-accent/25 to-transparent" aria-hidden />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-surface-border bg-surface-muted/70 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-accent/30 hover:bg-surface-elevated"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
