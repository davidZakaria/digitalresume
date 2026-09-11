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
          <SectionHeading kicker="About" title="Clear products, built with care." editorial />
          <blockquote className="relative mt-12 max-w-3xl border-l-2 border-accent py-2 pl-8 pr-2 text-lg leading-relaxed text-ink-soft md:text-xl md:leading-relaxed">
            <span
              className="absolute left-3 top-3 font-display text-4xl leading-none text-accent/30"
              aria-hidden
            >
              “
            </span>
            <span className="relative">{resume.summary}</span>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
