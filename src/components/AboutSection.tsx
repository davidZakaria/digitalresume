import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  return (
    <section
      id="about"
      className="section-canvas relative scroll-mt-24 border-b border-surface-border py-24 md:scroll-mt-28 md:py-32 print:bg-white print:text-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-tight opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionHeading
            kicker="About"
            title="Built to ship."
            editorial
            align="split"
            subtitle="Full-stack engineer focused on production web applications — from APIs and data models to polished interfaces and live deployments."
          />
          <div className="mt-14 max-w-3xl">
            <p className="font-sans text-lg leading-relaxed text-ink-soft md:text-xl md:leading-relaxed">
              {resume.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['HR & ERP', 'Real estate', 'Hospitality', 'Archives', 'Education'].map((tag) => (
                <span
                  key={tag}
                  className="border border-surface-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
