import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionIndex } from './SectionIndex'

const ICONS = ['</>', '◈', '⚙', '⬡'] as const

export function SkillsSection() {
  const reduce = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section
      id="skills"
      className="section-canvas relative scroll-mt-24 overflow-hidden border-b border-surface-border py-24 md:scroll-mt-28 md:py-32 print:bg-white print:text-ink"
      data-nav-theme="dark"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="03" label="Expertise" />

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="flex items-start lg:sticky lg:top-32">
              <h2
                className="vertical-label font-display text-display-md font-black uppercase text-ink lg:text-[clamp(3.5rem,8vw,5.5rem)]"
                aria-hidden
              >
                My expertise
              </h2>
              <h2 className="sr-only">Tools I reach for every week</h2>
            </div>

            <div>
              <p className="mb-8 max-w-md text-sm leading-relaxed text-ink-faint">
                Grouped to mirror how you work — adjust groups in{' '}
                <code className="font-mono text-accent-bright">resume.ts</code> anytime.
              </p>

              <ul className="divide-y divide-[var(--divider)] border-y border-[var(--divider)]">
                {resume.skillGroups.map((group, i) => {
                  const isActive = activeIndex === i
                  return (
                    <li key={group.label}>
                      <button
                        type="button"
                        className={[
                          'group flex w-full items-start gap-5 py-6 text-left transition md:py-7',
                          isActive ? 'text-ink' : 'text-ink-faint hover:text-ink-soft',
                        ].join(' ')}
                        onMouseEnter={() => setActiveIndex(i)}
                        onFocus={() => setActiveIndex(i)}
                        onClick={() => setActiveIndex(i)}
                        aria-expanded={isActive}
                      >
                        <span className="mt-1 font-mono text-lg text-accent" aria-hidden>
                          {ICONS[i] ?? '•'}
                        </span>
                        <span className="flex-1">
                          <span className="flex items-center justify-between gap-4">
                            <span className="font-display text-xl font-semibold uppercase tracking-tight md:text-2xl">
                              {group.label}
                            </span>
                            <span
                              className={[
                                'flex h-2 w-2 shrink-0 rounded-full border transition',
                                isActive
                                  ? 'border-accent bg-accent-bright'
                                  : 'border-ink-faint/40 bg-transparent',
                              ].join(' ')}
                              aria-hidden
                            />
                          </span>
                        </span>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 pb-6 pl-10">
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
        </Reveal>
      </div>
    </section>
  )
}
