import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function SkillsSection() {
  const reduce = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeGroup = resume.skillGroups[activeIndex]

  return (
    <section
      id="skills"
      className="section-canvas relative scroll-mt-24 overflow-hidden border-b border-surface-border py-24 md:scroll-mt-28 md:py-32 print:bg-white print:text-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionHeading
            kicker="Skills"
            title="Tools I reach for every week."
            editorial
            align="split"
            subtitle="Grouped to mirror how you work — adjust groups in resume.ts anytime."
          />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="hidden lg:block" aria-hidden>
            <div className="relative h-full min-h-[280px]">
              {activeGroup?.items.slice(0, 6).map((skill, i) => (
                <motion.span
                  key={skill}
                  className="absolute font-mono text-xs uppercase tracking-wider text-ink-faint/40"
                  initial={false}
                  animate={{
                    opacity: 0.25 + (i % 3) * 0.15,
                    x: (i % 2) * 40,
                    y: i * 36,
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    left: `${10 + (i % 3) * 28}%`,
                    top: `${8 + (i % 4) * 18}%`,
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <ul className="divide-y divide-[var(--divider)] border-y border-[var(--divider)]">
              {resume.skillGroups.map((group, i) => {
                const isActive = activeIndex === i
                return (
                  <li key={group.label}>
                    <button
                      type="button"
                      className={[
                        'group flex w-full items-center justify-between gap-4 py-5 text-left transition md:py-6',
                        isActive ? 'text-ink' : 'text-ink-faint hover:text-ink-soft',
                      ].join(' ')}
                      onMouseEnter={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      aria-expanded={isActive}
                    >
                      <span className="font-display text-xl font-semibold uppercase tracking-tight md:text-2xl">
                        {group.label}
                      </span>
                      <span
                        className={[
                          'flex h-2 w-2 shrink-0 rounded-full border transition',
                          isActive
                            ? 'border-accent bg-accent-bright'
                            : 'border-ink-faint/40 bg-transparent group-hover:border-ink-faint',
                        ].join(' ')}
                        aria-hidden
                      />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{
                        height: isActive ? 'auto' : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 pb-6">
                        {group.items.map((skill) => (
                          <span
                            key={skill}
                            className="border border-surface-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
