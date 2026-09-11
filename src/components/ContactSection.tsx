import { useState } from 'react'
import { resume } from '../data/resume'
import { Reveal } from './Reveal'
import { SectionIndex } from './SectionIndex'

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ContactCardProps = {
  icon: string
  label: string
  value: string
  href?: string
  onClick?: () => void
}

function ContactCard({ icon, label, value, href, onClick }: ContactCardProps) {
  const inner = (
    <>
      <span className="flex h-10 w-10 items-center justify-center border border-surface-border font-mono text-sm text-accent">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">{label}</span>
        <span className="mt-1 block truncate text-sm font-medium text-ink">{value}</span>
      </span>
      <ArrowUpRight className="shrink-0 text-ink-faint transition group-hover:text-accent" />
    </>
  )

  const className =
    'group flex w-full items-center gap-4 border border-surface-border bg-surface-muted/30 p-4 text-left transition hover:border-accent/40 md:p-5'

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {inner}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  )
}

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
      data-nav-theme="dark"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="06" label="Contact" />

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-[2.75rem]">
                Let&apos;s talk about what you&apos;re{' '}
                <span className="text-accent">building next</span>.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-faint md:text-base">
                Have a project in mind or want to discuss a full-stack role? GitHub is always on — add
                an email in resume.ts when you want a direct line.
              </p>

              <div className="mt-10 space-y-3">
                {email ? (
                  <ContactCard icon="@" label="Email me" value={email} href={`mailto:${email}`} />
                ) : (
                  <div className="flex items-center gap-4 border border-dashed border-surface-border p-4 text-sm text-ink-faint md:p-5">
                    Set <code className="mx-1 font-mono text-accent">contact.email</code> in resume.ts
                  </div>
                )}
                <ContactCard icon="GH" label="GitHub profile" value="davidZakaria" href={github} />
                {linkedin ? (
                  <ContactCard icon="in" label="LinkedIn" value="Profile" href={linkedin} />
                ) : null}
                <ContactCard icon="◎" label="Based in" value={resume.location} />
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <div className="border border-surface-border bg-surface-muted/20 p-6 md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Quick connect</p>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  {resume.summary}
                </p>
                <div className="mt-8 space-y-3">
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 bg-cream px-6 py-3.5 text-sm font-semibold text-canvas transition hover:bg-cream/90"
                  >
                    GitHub profile
                    <ArrowUpRight />
                  </a>
                  <button
                    type="button"
                    onClick={() => void copyGithub()}
                    className="flex w-full items-center justify-center gap-2 border border-surface-border px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-accent no-print"
                  >
                    {copied ? 'Copied link' : 'Copy GitHub URL'}
                  </button>
                </div>
                <span className="sr-only" aria-live="polite">
                  {copied ? 'GitHub profile URL copied to clipboard' : ''}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
