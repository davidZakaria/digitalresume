import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { resume, type PortfolioProject } from '../data/resume'
import { useMediaQuery } from '../hooks/useMediaQuery'
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
  horizontal,
}: {
  project: PortfolioProject
  index: number
  horizontal: boolean
}) {
  const reduce = useReducedMotion()
  const live = project.liveUrl?.trim()
  const repo = project.repoUrl?.trim()
  const hasLive = Boolean(live)
  const hasRepo = Boolean(repo)

  return (
    <motion.article
      className={[
        'overflow-hidden border border-canvas/15 bg-cream/40',
        horizontal ? 'h-full w-[min(28rem,78vw)] shrink-0' : '',
      ].join(' ')}
      initial={reduce || horizontal ? false : { opacity: 0, y: 28 }}
      whileInView={horizontal ? undefined : { opacity: 1, y: 0 }}
      viewport={horizontal ? undefined : { once: true, margin: '-8%' }}
      transition={{
        duration: 0.55,
        delay: reduce || horizontal ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex items-center gap-2 border-b border-canvas/10 bg-canvas/5 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-canvas/20" />
          <span className="h-2 w-2 rounded-full bg-canvas/20" />
          <span className="h-2 w-2 rounded-full bg-canvas/20" />
        </span>
        <span className="ms-2 truncate font-mono text-[10px] uppercase tracking-wider text-canvas/40">
          {project.title}
        </span>
        <span className="ms-auto font-mono text-[9px] uppercase tracking-wider text-canvas/35">
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
  const reduce = useReducedMotion()
  const stackedViewport = useMediaQuery('(max-width: 767px)')
  const pin = !reduce && !stackedViewport

  const visible = useMemo(
    () => projects.filter((p) => projectMatches(p, filter)),
    [projects, filter],
  )

  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const rtl =
    typeof document !== 'undefined' && document.documentElement.getAttribute('dir') === 'rtl'
  const x = useTransform(scrollYProgress, [0.06, 0.94], rtl ? [0, travel] : [0, -travel])

  useLayoutEffect(() => {
    if (!pin) return

    const measure = () => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return
      const next = Math.max(0, track.scrollWidth - viewport.clientWidth)
      setTravel((prev) => (prev === next ? prev : next))
    }

    const frame = requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    if (trackRef.current) observer.observe(trackRef.current)
    if (viewportRef.current) observer.observe(viewportRef.current)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pin, visible])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-cream scroll-mt-24 print:bg-white print:text-ink"
      data-nav-theme="cream"
      style={pin ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      <div
        className={[
          pin
            ? 'projects-pin sticky top-0 flex h-svh flex-col justify-center overflow-x-clip py-16'
            : 'py-20 md:py-28',
          'md:scroll-mt-28',
        ].join(' ')}
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
          {pin ? (
            <>
              <SectionIndex index="05" label="Projects" className="text-canvas/50" />
              <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight text-canvas md:text-4xl">
                Selected projects
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-canvas/55">
                Work that&apos;s live, forkable, or both — sourced from{' '}
                <code className="font-mono text-canvas/70">resume.projects</code>.
                {' '}Scroll to move through the row.
              </p>
            </>
          ) : (
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
          )}

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
                <span className="ms-1.5 opacity-70">
                  {f.id === 'all'
                    ? projects.length
                    : projects.filter((p) => projectMatches(p, f.id)).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-canvas/50 md:px-8">
            No projects match this filter.
          </p>
        ) : pin ? (
          <div ref={viewportRef} className="projects-viewport mt-10 overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="projects-track flex items-stretch gap-6 px-4 md:px-8"
              onFocusCapture={(event) => {
                const article = (event.target as HTMLElement).closest('article')
                const track = trackRef.current
                const section = sectionRef.current
                if (!article || !track || !section || travel === 0) return
                const cards = Array.from(track.querySelectorAll('article'))
                const index = cards.indexOf(article)
                if (index < 0) return
                const progress = index / Math.max(cards.length - 1, 1)
                const max = section.offsetHeight - window.innerHeight
                window.scrollTo({ top: section.offsetTop + max * (0.06 + progress * 0.88) })
              }}
            >
              {visible.map((project, index) => (
                <ProjectCard
                  key={project.repoUrl ?? project.liveUrl ?? project.title}
                  project={project}
                  index={index}
                  horizontal
                />
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="mx-auto mt-12 flex w-full max-w-6xl flex-col gap-6 px-4 md:gap-8 md:px-8">
            {visible.map((project, index) => (
              <ProjectCard
                key={project.repoUrl ?? project.liveUrl ?? project.title}
                project={project}
                index={index}
                horizontal={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
