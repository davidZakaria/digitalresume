import { motion, useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionIndex } from './SectionIndex'

const STATS = [
  { label: 'Status', value: resume.location },
  { label: 'Focus', value: 'Web apps · APIs · Arabic/RTL' },
  { label: 'Portfolio', value: `${resume.projects.length} pieces` },
  { label: 'Stack', value: 'Full-stack' },
  { label: 'Mindset', value: 'Ship end-to-end' },
  { label: 'Deployments', value: 'Live client sites' },
] as const

export function AboutSection() {
  const reduce = useReducedMotion()

  return (
    <section
      id="about"
      className="section-canvas relative scroll-mt-24 border-b border-surface-border py-24 md:scroll-mt-28 md:py-32 print:bg-white print:text-ink"
      data-nav-theme="dark"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-tight opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="01" label="About" />

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <motion.div
              className="relative flex items-center justify-center"
              initial={reduce ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-56 w-44 overflow-hidden border border-surface-border md:h-72 md:w-52">
                <img
                  src="/david-portrait.png"
                  alt="David Samy"
                  className="h-full w-full object-cover object-[center_12%]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>

            <div>
              <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-ink md:text-4xl lg:text-[2.6rem] lg:leading-[1.1]">
                I build{' '}
                <span className="text-cream">production web apps</span> where{' '}
                <span className="text-cream">design meets code</span>.
              </h2>

              <blockquote className="mt-8 border-l-2 border-cream/40 py-1 pl-6 text-base leading-relaxed text-ink-soft md:text-lg">
                {resume.summary}
              </blockquote>

              <p className="mt-6 font-display text-lg font-semibold text-ink">Clear products, built with care.</p>

              <div className="mt-10 grid grid-cols-2 gap-px border border-surface-border bg-surface-border md:grid-cols-3">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="bg-canvas p-4 md:p-5"
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{
                      duration: 0.45,
                      delay: reduce ? 0 : i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">{stat.label}</p>
                    <p className="mt-2 text-sm font-medium text-ink md:text-base">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <aside className="mt-10 border border-surface-border p-5 md:p-6" aria-label="At a glance">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/70">At a glance</p>
                <p className="mt-3 font-display text-xl font-bold uppercase text-ink">Work that ships</p>
                <p className="mt-2 text-sm text-ink-faint">
                  Full-stack products — from HR and booking to archives, learning tools, and live client sites.
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                  Focus: Web apps · APIs · Arabic/RTL · Deployments
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Next.js', 'React', 'Node', 'MongoDB', 'TypeScript'].map((t) => (
                    <span
                      key={t}
                      className="border border-surface-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-cream/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
