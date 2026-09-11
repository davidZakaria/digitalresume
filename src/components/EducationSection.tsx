import { resume } from '../data/resume'
import { Reveal, StaggerList } from './Reveal'
import { SectionIndex } from './SectionIndex'

export function EducationSection() {
  return (
    <section
      id="education"
      className="section-canvas scroll-mt-24 border-b border-surface-border py-24 md:scroll-mt-28 md:py-32 print:bg-white print:text-ink"
      data-nav-theme="dark"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="05" label="Education" />
          <h2 className="mt-6 font-display text-3xl font-bold uppercase tracking-tight text-ink md:text-4xl">
            Learning that still shows up in the work.
          </h2>
          <p className="mt-4 text-sm text-ink-faint">
            Kept alongside your PDF in{' '}
            <code className="font-mono text-accent-bright">resume.ts</code>.
          </p>
        </Reveal>

        <StaggerList className="mt-14 divide-y divide-[var(--divider)] border-y border-[var(--divider)]" stagger={0.08}>
          {resume.education.map((edu) => (
            <article key={`${edu.school}-${edu.degree}`} className="py-8 md:py-10">
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink md:text-2xl">
                    {edu.school}
                  </h3>
                  <p className="mt-2 font-medium text-ink-soft">{edu.degree}</p>
                </div>
                {edu.period?.trim() ? (
                  <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                    {edu.period}
                  </p>
                ) : null}
              </div>
              {edu.detail ? (
                <p className="mt-4 text-sm leading-relaxed text-ink-faint">{edu.detail}</p>
              ) : null}
            </article>
          ))}
        </StaggerList>
      </div>
    </section>
  )
}
