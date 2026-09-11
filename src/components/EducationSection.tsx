import { resume } from '../data/resume'
import { Reveal, StaggerList } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function EducationSection() {
  return (
    <section
      id="education"
      className="scroll-mt-24 border-t border-surface-border bg-surface-muted/40 py-20 md:scroll-mt-28 md:py-28 print:bg-white print:text-ink"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            kicker="Education"
            title="Learning that still shows up in the work."
            subtitle={
              <>
                Kept alongside your PDF in{' '}
                <code className="font-mono text-[13px] text-accent-bright">resume.ts</code>.
              </>
            }
          />
        </Reveal>

        <StaggerList className="mt-14 space-y-6" stagger={0.08}>
          {resume.education.map((edu) => (
            <article
              key={`${edu.school}-${edu.degree}`}
              className="rounded-2xl border border-surface-border bg-surface-elevated/95 p-6 shadow-card backdrop-blur-sm transition hover:border-accent/25 hover:shadow-glow md:p-8"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-ink">{edu.school}</h3>
                  <p className="mt-1 font-medium text-accent">{edu.degree}</p>
                </div>
                {edu.period?.trim() ? (
                  <p className="shrink-0 font-mono text-xs uppercase tracking-wider text-ink-faint">
                    {edu.period}
                  </p>
                ) : null}
              </div>
              {edu.detail ? (
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{edu.detail}</p>
              ) : null}
            </article>
          ))}
        </StaggerList>
      </div>
    </section>
  )
}
