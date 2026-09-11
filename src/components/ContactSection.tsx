import { useState } from 'react'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { CircularStamp } from './CircularStamp'
import { SectionHeading } from './SectionHeading'

export function ContactSection() {
  const { email, github, linkedin } = resume.contact
  const [copied, setCopied] = useState(false)

  const copyGithub = async () => {
    try {
      await navigator.clipboard.writeText(github)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section
      id="contact"
      className="section-canvas scroll-mt-24 relative overflow-hidden py-24 md:scroll-mt-28 md:pb-40 md:pt-28 print:bg-white print:text-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              kicker="Contact"
              title="Let's build."
              editorial
              subtitle="Open to remote full-stack roles. GitHub is always on — add an email in resume.ts when you want a direct line."
            />
            <CircularStamp className="hidden text-ink md:flex" />
          </div>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="inline-flex border border-surface-border px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink transition hover:border-accent hover:text-accent"
            >
              Email · {email}
            </a>
          ) : (
            <span className="inline-flex items-center border border-dashed border-surface-border px-6 py-3 text-sm text-ink-faint">
              Set <code className="mx-1.5 font-mono text-accent">contact.email</code> in resume.ts
            </span>
          )}
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex border border-ink bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wider text-canvas transition hover:bg-ink/90 print:bg-zinc-900 print:text-white"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={() => void copyGithub()}
            className="inline-flex border border-surface-border px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink transition hover:border-accent no-print"
          >
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'GitHub profile URL copied to clipboard' : ''}
          </span>
          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex border border-surface-border px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink transition hover:border-accent-bright"
            >
              LinkedIn
            </a>
          ) : null}
        </div>

        <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {resume.location} · {resume.name}
        </p>
      </div>
    </section>
  )
}
