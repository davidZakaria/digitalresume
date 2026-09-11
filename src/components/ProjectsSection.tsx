import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume, type PortfolioProject } from '../data/resume'
import { EditorialWord } from './EditorialWord'
import { Reveal } from './Reveal'
import { SectionIndex } from './SectionIndex'
import { ServiceMarquee } from './ServiceMarquee'

const TECH_PILLS = ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind', 'Express'] as const

const FILTERS = [
  { id: 'all' as const, label: 'All' },
  { id: 'deployed' as const, label: 'Deployed' },
  { id: 'opensource' as const, label: 'GitHub' },
]

type FilterId = (typeof FILTERS)[number]['id']

function projectMatches(p: PortfolioProject, filter: FilterId): boolean {
  if (filter === 'all') return true
  const live = Boolean(p.liveUrl?.trim())
  const repo = Boolean(p.repoUrl?.trim())
  if (filter === 'deployed') return live
  return repo
}

export function ProjectsSection() {
  const reduce = useReducedMotion()
  const { projects } = resume
  const [filter, setFilter] = useState<FilterId>('all')
  const [activeTech, setActiveTech] = useState<string | null>(null)

  const visible = useMemo(
    () => projects.filter((p) => projectMatches(p, filter)),
    [projects, filter],
  )

  return (
    <section
      id="projects"
      className="section-cream relative scroll-mt-24 py-24 md:scroll-mt-28 md:py-32 print:bg-white print:text-ink"
      data-nav-theme="cream"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="04" label="Work" className="text-accent" />

          <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
            {TECH_PILLS.map((tech) => (
              <button
                key={tech}
                type="button"
                className={[
                  'relative border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition',
                  activeTech === tech
                    ? 'border-canvas bg-canvas text-cream'
                    : 'border-canvas/15 text-ink-faint hover:border-canvas/40 hover:text-canvas',
                ].join(' ')}
                onMouseEnter={() => setActiveTech(tech)}
                onFocus={() => setActiveTech(tech)}
                onMouseLeave={() => setActiveTech(null)}
                onBlur={() => setActiveTech(null)}
              >
                {tech}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
            Scroll to explore my
          </p>

          <div className="mt-6 overflow-hidden">
            <EditorialWord size="xl" className="text-center text-canvas">
              Work
            </EditorialWord>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-faint">
            Work that&apos;s live, forkable, or both — sourced from{' '}
            <code className="font-mono text-accent">resume.projects</code>.
          </p>
        </Reveal>
      </div>

      <ServiceMarquee className="mt-12" />

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter projects by type">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={[
                'border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition',
                filter === f.id
                  ? 'border-canvas bg-canvas text-cream'
                  : 'border-canvas/20 text-ink-faint hover:border-canvas/50 hover:text-canvas',
              ].join(' ')}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">
                {f.id === 'all'
                  ? projects.length
                  : projects.filter((p) => projectMatches(p, f.id)).length}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-14 divide-y divide-[var(--divider)] border-y border-[var(--divider)]">
          {visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-faint">No projects match this filter.</p>
          ) : (
            visible.map((project, index) => {
              const live = project.liveUrl?.trim()
              const repo = project.repoUrl?.trim()
              const hasLive = Boolean(live)
              const hasRepo = Boolean(repo)
              const cardKey = repo ?? live ?? project.title

              return (
                <motion.article
                  key={cardKey}
                  className="group py-10 md:py-12"
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{
                    duration: 0.5,
                    delay: reduce ? 0 : index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="grid gap-6 md:grid-cols-[1.2fr_1.8fr] md:gap-12">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-canvas md:text-3xl">
                          {project.title}
                        </h3>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                          {hasLive && hasRepo ? 'Live + GH' : hasLive ? 'Live' : 'Repo'}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.stack.map((tag) => (
                          <span
                            key={tag}
                            className="border border-canvas/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm leading-relaxed text-ink-faint md:text-base">{project.description}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        {hasLive ? (
                          <>
                            <a
                              href={live}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 border border-canvas bg-canvas px-5 py-2 text-xs font-semibold uppercase tracking-wider text-cream transition hover:bg-canvas/90 print:hidden"
                            >
                              Visit live site
                              <span aria-hidden>→</span>
                            </a>
                            {hasRepo ? (
                              <a
                                href={repo}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium uppercase tracking-wider text-ink-faint underline-offset-4 transition hover:text-canvas hover:underline"
                              >
                                Source on GitHub
                              </a>
                            ) : null}
                          </>
                        ) : hasRepo ? (
                          <a
                            href={repo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-canvas transition hover:text-accent print:underline"
                          >
                            View on GitHub
                            <span aria-hidden>→</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
