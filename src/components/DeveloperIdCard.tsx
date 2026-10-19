import { useCallback, useRef, useState, type PointerEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { useMediaQuery } from '../hooks/useMediaQuery'

type Tilt = {
  rx: number
  ry: number
  gx: number
  gy: number
}

const REST: Tilt = { rx: 0, ry: 0, gx: 50, gy: 40 }

function githubHandle(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, '')
    const handle = path.split('/').filter(Boolean).pop()
    return handle ? `@${handle}` : url
  } catch {
    return url
  }
}

export function DeveloperIdCard() {
  const reduce = useReducedMotion()
  const coarse = useMediaQuery('(pointer: coarse)')
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<Tilt>(REST)

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reduce || coarse) return
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      setTilt({
        rx: (0.5 - py) * 12,
        ry: (px - 0.5) * 16,
        gx: px * 100,
        gy: py * 100,
      })
    },
    [coarse, reduce],
  )

  const reset = useCallback(() => {
    if (reduce || coarse) return
    setTilt(REST)
  }, [coarse, reduce])

  const liveTilt = !reduce && !coarse
  const autoTilt = !reduce && coarse

  return (
    <div
      ref={cardRef}
      className={[
        'id-card relative isolate overflow-hidden border border-white/12 bg-[#0a0a0a] p-5 text-[#f4efe6] md:p-6',
        autoTilt ? 'id-card-autotilt' : '',
      ].join(' ')}
      style={
        liveTilt
          ? {
              transform: `perspective(920px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            }
          : undefined
      }
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <div
        className="id-card-glare pointer-events-none absolute inset-0 z-[2]"
        style={
          reduce
            ? undefined
            : {
                background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgb(255 255 255 / 0.28), transparent 42%)`,
              }
        }
        aria-hidden
      />

      <div className="relative z-[1]">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f4efe6]/55">Developer ID</p>
          <span className="id-card-chip h-7 w-10 shrink-0" aria-hidden />
        </div>

        <p className="mt-6 font-display text-3xl font-black uppercase leading-none tracking-tight text-[#f4efe6] md:text-4xl">
          {resume.name}
        </p>
        <p className="mt-2 font-serif text-lg italic text-[#f4efe6]/75">{resume.title}</p>

        <dl className="mt-8 space-y-3 border-t border-white/15 pt-5">
          <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3">
            <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#f4efe6]/45">Status</dt>
            <dd className="text-sm text-[#f4efe6]">{resume.location}</dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3">
            <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#f4efe6]/45">Focus</dt>
            <dd className="text-sm text-[#f4efe6]">Web apps · APIs · Arabic/RTL</dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3">
            <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#f4efe6]/45">GitHub</dt>
            <dd>
              <a
                href={resume.contact.github}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#f4efe6] underline-offset-4 transition hover:underline"
              >
                {githubHandle(resume.contact.github)}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
