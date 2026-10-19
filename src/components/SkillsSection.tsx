import { useMemo, useState } from 'react'
import { resume } from '../data/resume'
import { displaySkillCategory, flattenSkillElements } from '../lib/skillElements'
import { Reveal } from './Reveal'
import { SectionIndex } from './SectionIndex'

const ALL = 'all'

export function SkillsSection() {
  const elements = useMemo(() => flattenSkillElements(resume.skillGroups), [])
  const filters = useMemo(
    () => [
      { id: ALL, label: 'All' },
      ...resume.skillGroups.map((group) => ({
        id: group.label,
        label: displaySkillCategory(group.label),
      })),
    ],
    [],
  )

  const [filter, setFilter] = useState(ALL)
  const [activeName, setActiveName] = useState(elements[0]?.name ?? '')

  const active = elements.find((el) => el.name === activeName) ?? elements[0]

  return (
    <section
      id="skills"
      className="section-canvas relative scroll-mt-24 overflow-hidden border-b border-surface-border py-24 md:scroll-mt-28 md:py-32 print:bg-white print:text-ink"
      data-nav-theme="dark"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionIndex index="03" label="Expertise" />

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-black uppercase tracking-tight text-ink md:text-5xl">
                Periodic stack
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-faint">
                Element tiles from <code className="font-mono text-accent-bright">resume.ts</code>. Filter a
                family to dim the rest — hover or tap a tile for the readout.
              </p>
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter skills by category"
            >
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                  className={[
                    'tap-target inline-flex items-center border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition',
                    filter === item.id
                      ? 'border-cream bg-cream text-canvas'
                      : 'border-surface-border text-ink-faint hover:border-cream/40 hover:text-ink',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <ul className="skill-table grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8">
              {elements.map((el) => {
                const dimmed = filter !== ALL && el.category !== filter
                const selected = active?.name === el.name
                return (
                  <li key={el.name}>
                    <button
                      type="button"
                      className={[
                        'skill-tile tap-target flex aspect-square w-full flex-col items-center justify-center border px-1.5 py-2 text-center transition',
                        selected
                          ? 'border-cream bg-cream/10 text-ink'
                          : 'border-surface-border text-ink-soft hover:border-cream/50 hover:text-ink',
                        dimmed ? 'opacity-25' : 'opacity-100',
                      ].join(' ')}
                      onMouseEnter={() => setActiveName(el.name)}
                      onFocus={() => setActiveName(el.name)}
                      onClick={() => setActiveName(el.name)}
                      aria-pressed={selected}
                    >
                      <span className="self-start font-mono text-[8px] uppercase tracking-widest text-ink-faint">
                        {String(el.atomic).padStart(2, '0')}
                      </span>
                      <span className="font-display text-2xl font-black uppercase leading-none tracking-tight md:text-3xl">
                        {el.symbol}
                      </span>
                      <span className="mt-1 line-clamp-2 font-mono text-[8px] uppercase tracking-[0.12em] text-ink-faint">
                        {el.name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <aside
              className="border border-surface-border bg-surface-muted/20 p-5 md:p-6 lg:sticky lg:top-32"
              aria-live="polite"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">Element</p>
              {active ? (
                <>
                  <p className="mt-4 font-display text-5xl font-black uppercase leading-none text-ink">
                    {active.symbol}
                  </p>
                  <p className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-ink">
                    {active.name}
                  </p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                    {displaySkillCategory(active.category)}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-faint">
                    No. {String(active.atomic).padStart(2, '0')} in the working set — grouped the way the
                    résumé is edited.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm text-ink-faint">Select a tile to inspect it.</p>
              )}
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
