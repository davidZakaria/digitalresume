import { useEffect, useState } from 'react'

/** Section `id` values (no #) in vertical page order */
export const SECTION_IDS = ['about', 'experience', 'skills', 'projects', 'education', 'contact'] as const

export type SectionId = (typeof SECTION_IDS)[number]

export function useScrollspy(ids: readonly SectionId[]) {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const measure = () => {
      const line = window.scrollY + window.innerHeight * 0.32
      let current: SectionId | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= line) current = id
      }
      setActive(current)
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ids])

  return active
}
