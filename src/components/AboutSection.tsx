import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-b border-surface-border bg-surface-muted/50 py-20 md:scroll-mt-28 md:py-28 print:bg-white print:text-ink"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <Reveal>
          <SectionHeading kicker="About" title="Clear products, built with care." />
          <blockquote className="relative mt-10 border-l-[3px] border-accent bg-gradient-to-r from-accent-muted via-surface-elevated to-transparent py-6 pl-8 pr-6 font-display text-lg font-medium leading-relaxed text-ink md:text-xl md:leading-relaxed">
            <span
              className="absolute left-3 top-4 font-display text-4xl leading-none text-accent/30"
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
