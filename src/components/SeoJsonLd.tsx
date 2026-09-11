import { useEffect } from 'react'
import { resume } from '../data/resume'

const SCRIPT_ID = 'resume-jsonld-graph'

export function SeoJsonLd() {
  useEffect(() => {
    const origin =
      (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
      window.location.origin

    const sameAs = [resume.contact.github, resume.contact.linkedin].filter(Boolean)

    const graph = [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        name: `${resume.name} — Résumé`,
        url: `${origin}/`,
        description: resume.summary.slice(0, 280),
      },
      {
        '@type': 'Person',
        '@id': `${origin}/#person`,
        name: resume.name,
        jobTitle: resume.title,
        url: `${origin}/`,
        ...(sameAs.length ? { sameAs } : {}),
      },
    ]

    const existing = document.getElementById(SCRIPT_ID)
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    })
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}
