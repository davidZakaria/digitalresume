import { useState } from 'react'
import { EditorialWord } from './EditorialWord'
import { Reveal } from './Reveal'
import { SectionIndex } from './SectionIndex'
import { ServiceMarquee } from './ServiceMarquee'

const TECH_PILLS = ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind', 'Express'] as const

export function WorkSection() {
  const [activeTech, setActiveTech] = useState<string | null>(null)

  return (
    <section
      className="section-canvas relative overflow-hidden border-b border-surface-border py-20 md:py-28"
      data-nav-theme="dark"
      aria-labelledby="work-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="04" label="Work" />

          <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
            {TECH_PILLS.map((tech) => (
              <button
                key={tech}
                type="button"
                className={[
                  'border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition',
                  activeTech === tech
                    ? 'border-cream bg-cream text-canvas'
                    : 'border-surface-border text-ink-faint hover:border-cream/40 hover:text-ink',
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

          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
            Scroll to explore my
          </p>

          <div className="mt-4 overflow-hidden" id="work-heading">
            <EditorialWord size="xl" className="text-center text-cream/90">
              Work
            </EditorialWord>
          </div>
        </Reveal>
      </div>

      <ServiceMarquee className="mt-10" />
    </section>
  )
}
