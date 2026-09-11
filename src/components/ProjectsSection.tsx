import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume, type PortfolioProject } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

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

  const visible = useMemo(
    () => projects.filter((p) => projectMatches(p, filter)),
    [projects, filter],
  )

  return (
    <section
      id="projects"
      className="scroll-mt-24 py-20 md:scroll-mt-28 md:py-28 print:bg-white print:text-zinc-900"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            kicker="Projects"
            title="Work that’s live, forkable, or both."
            subtitle={
              <>
                Sourced from{' '}
                <code className="font-mono text-[13px] text-accent">resume.projects</code> — repos,
                client domains, and optional demo links together in one grid.
              </>
            }
          />
        </Reveal>

        <div
          className="mt-10 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter projects by type"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={[
                'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition',
                filter === f.id
                  ? 'bg-ink text-surface-elevated shadow-glow ring-1 ring-ink/10'
                  : 'border border-surface-border bg-surface-elevated/90 text-ink-faint hover:border-accent/30 hover:text-ink print:border-zinc-300 print:bg-zinc-100 print:text-zinc-700',
              ].join(' ')}
            >
              {f.label}
              <span className="ml-1.5 font-mono text-[10px] font-normal opacity-80">
                {f.id === 'all'
                  ? projects.length
                  : projects.filter((p) => projectMatches(p, f.id)).length}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-7">
          {visible.length === 0 ? (
            <p className="col-span-full text-center text-sm text-ink-faint">
              No projects match this filter — try another tab.
            </p>
          ) : (
            visible.map((project, index) => {
              const live = project.liveUrl?.trim()
              const repo = project.repoUrl?.trim()
              const hasLive = Boolean(live)
              const hasRepo = Boolean(repo)
              const cardKey = repo ?? live ?? project.title

              return (
                <div key={cardKey} className="group/p relative rounded-[22px] p-[1px]">
                  <div
                    className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-accent/25 via-accent-bright/15 to-pop/20 opacity-80 blur-[0.5px] transition duration-500 group-hover/p:opacity-100 motion-reduce:opacity-80 print:hidden"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 rounded-[22px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 bg-[length:200%_100%] motion-safe:transition-opacity motion-safe:duration-700 group-hover/p:opacity-100 motion-safe:group-hover/p:animate-border-shimmer print:hidden"
                    aria-hidden
                  />

                  <motion.article
                    initial={reduce ? false : { opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{
                      duration: 0.5,
                      delay: reduce ? 0 : index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={
                      reduce
                        ? undefined
                        : {
                            y: -4,
                            transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                          }
                    }
                    className="relative flex h-full flex-col rounded-[21px] border border-surface-border bg-surface-elevated/98 p-6 shadow-card backdrop-blur-sm md:p-7 print:border-zinc-200 print:bg-white print:shadow-none"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold tracking-tight text-ink print:text-zinc-900">
                        {project.title}
                      </h3>
                      <span className="rounded-md border border-surface-border bg-surface-muted/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-accent-bright print:border-zinc-200 print:bg-zinc-50 print:text-zinc-600">
                        {hasLive && hasRepo ? 'Live + GH' : hasLive ? 'Live' : 'Repo'}
                      </span>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-ink-faint print:text-zinc-600">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-surface-border bg-surface-muted/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-soft print:border-zinc-200 print:bg-zinc-50 print:text-zinc-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      {hasLive ? (
                        <>
                          <a
                            href={live}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-bold text-surface-elevated shadow-innerGlow transition hover:brightness-95 print:hidden"
                          >
                            Visit live site
                            <span aria-hidden>→</span>
                          </a>
                          {hasRepo ? (
                            <a
                              href={repo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 transition hover:text-accent-bright hover:underline print:text-zinc-800 print:underline"
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
                          className="inline-flex items-center gap-2 text-sm font-bold text-accent-bright transition hover:text-accent print:text-zinc-800 print:underline"
                        >
                          View on GitHub
                          <span aria-hidden>→</span>
                        </a>
                      ) : (
                        <span className="text-xs text-accent print:text-amber-900">
                          Add <code className="font-mono text-accent-bright">liveUrl</code> or{' '}
                          <code className="font-mono text-accent-bright">repoUrl</code> in resume.ts
                        </span>
                      )}
                    </div>

                    {!hasLive &&
                    hasRepo &&
                    (project.title === 'HR ERP' || project.title.startsWith('Talé')) ? (
                      <p className="mt-4 text-xs leading-relaxed text-ink-faint print:hidden">
                        Add <code className="font-mono text-accent">liveUrl</code> in{' '}
                        <code className="font-mono text-ink-faint">resume.ts</code> or{' '}
                        <code className="font-mono text-ink-faint">VITE_LIVE_*_URL</code> in{' '}
                        <code className="font-mono text-ink-faint">.env.local</code>.
                      </p>
                    ) : null}
                  </motion.article>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
