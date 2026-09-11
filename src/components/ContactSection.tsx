import { useState } from 'react'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
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
      className="scroll-mt-24 relative overflow-hidden py-20 md:scroll-mt-28 md:pb-36 md:pt-16 print:bg-white print:text-zinc-900"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent-muted via-surface to-transparent print:hidden"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            kicker="Contact"
            title="Let’s talk about what you’re building next."
            subtitle="GitHub is always on — add an email in resume.ts when you want a direct line."
          />
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="inline-flex rounded-full border border-surface-border bg-surface-elevated px-6 py-3 text-sm font-semibold text-ink shadow-innerGlow transition hover:border-accent/35 hover:shadow-glow print:border-zinc-300 print:bg-zinc-50 print:text-zinc-900"
            >
              Email · {email}
            </a>
          ) : (
            <span className="inline-flex items-center rounded-full border border-dashed border-surface-border bg-surface-muted/80 px-6 py-3 text-sm text-ink-faint print:border-zinc-400 print:text-zinc-600">
              Set <code className="mx-1.5 font-mono text-accent">contact.email</code> in resume.ts
            </span>
          )}
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-surface-elevated shadow-glow transition brightness-100 hover:brightness-95 print:bg-zinc-900 print:text-white print:shadow-none"
          >
            GitHub profile
          </a>
          <button
            type="button"
            onClick={() => void copyGithub()}
            className="inline-flex rounded-full border border-surface-border bg-surface-elevated/90 px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent/35 hover:bg-surface-elevated no-print"
          >
            {copied ? 'Copied link' : 'Copy GitHub URL'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'GitHub profile URL copied to clipboard' : ''}
          </span>
          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-surface-border bg-surface-elevated px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent-bright/40 hover:bg-accent-soft print:border-zinc-300 print:text-zinc-900"
            >
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
