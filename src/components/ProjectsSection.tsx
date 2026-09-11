import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { resume, type PortfolioProject } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionIndex } from './SectionIndex'

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

function ProjectCard({
  project,
  index,
}: {
  project: PortfolioProject
  index: number
}) {
  const reduce = useReducedMotion()
  const live = project.liveUrl?.trim()
  const repo = project.repoUrl?.trim()
  const hasLive = Boolean(live)
  const hasRepo = Boolean(repo)

  return (
    <motion.article
      className="overflow-hidden border border-canvas/15 bg-cream/40"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{
        duration: 0.55,
        delay: reduce ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex items-center gap-2 border-b border-canvas/10 bg-canvas/5 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-canvas/20" />
          <span className="h-2 w-2 rounded-full bg-canvas/20" />
          <span className="h-2 w-2 rounded-full bg-canvas/20" />
        </span>
        <span className="ml-2 truncate font-mono text-[10px] uppercase tracking-wider text-canvas/40">
          {project.title}
        </span>
        <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-canvas/35">
          {hasLive && hasRepo ? 'Live + GH' : hasLive ? 'Live' : 'Repo'}
        </span>
      </div>

      <div className="p-5 md:p-6">
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-canvas md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-canvas/60 md:text-base">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="border border-canvas/12 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-canvas/50"
            >
              {tag}
            </span>
          ))}
        </div>

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
                  className="text-xs font-medium uppercase tracking-wider text-canvas/50 underline-offset-4 transition hover:text-canvas hover:underline"
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
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-canvas transition hover:opacity-80 print:underline"
            >
              View on GitHub
              <span aria-hidden>→</span>
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

export function ProjectsSection() {
  const { projects } = resume
  const [filter, setFilter] = useState<FilterId>('all')

  const visible = useMemo(
    () => projects.filter((p) => projectMatches(p, filter)),
    [projects, filter],
  )

  return (
    <section
      id="projects"
      className="section-cream scroll-mt-24 py-20 md:scroll-mt-28 md:py-28 print:bg-white print:text-ink"
      data-nav-theme="cream"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="05" label="Projects" className="text-canvas/50" />
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight text-canvas md:text-4xl">
            Selected projects
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-canvas/55">
            Work that&apos;s live, forkable, or both — sourced from{' '}
            <code className="font-mono text-canvas/70">resume.projects</code>.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects by type">
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
                  : 'border-canvas/20 text-canvas/45 hover:border-canvas/50 hover:text-canvas',
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

        <div className="mt-12 flex flex-col gap-6 md:gap-8">
          {visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-canvas/50">No projects match this filter.</p>
          ) : (
            visible.map((project, index) => (
              <ProjectCard
                key={project.repoUrl ?? project.liveUrl ?? project.title}
                project={project}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
