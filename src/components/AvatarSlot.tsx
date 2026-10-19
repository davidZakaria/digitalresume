import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useSaveData } from '../hooks/useSaveData'
import { AVATAR_ASSETS, probeAvatarSources, type AvatarSources } from '../lib/avatarAssets'

type AvatarSlotProps = {
  className?: string
}

export function AvatarSlot({ className = '' }: AvatarSlotProps) {
  const reduce = useReducedMotion()
  const saveData = useSaveData()
  const coarsePointer = useMediaQuery('(pointer: coarse)')
  const [sources, setSources] = useState<AvatarSources | null>(null)
  const [inView, setInView] = useState(false)
  const [manualPlay, setManualPlay] = useState(false)
  const [failed, setFailed] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let cancelled = false
    void probeAvatarSources().then((next) => {
      if (!cancelled) setSources(next)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: '80px', threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hasVideo = Boolean(sources && (sources.webm || sources.mp4) && !failed)
  const allowAutoplay = Boolean(hasVideo && inView && !coarsePointer && !saveData && !reduce)
  const shouldMountVideo = hasVideo && inView && (allowAutoplay || manualPlay)
  const poster = sources?.poster ? AVATAR_ASSETS.poster : AVATAR_ASSETS.placeholderPortrait

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldMountVideo) return
    if (allowAutoplay || manualPlay) {
      void video.play().catch(() => {
        /* autoplay can still be blocked; poster stays visible */
      })
    }
  }, [allowAutoplay, manualPlay, shouldMountVideo])

  const showPlayHint = hasVideo && !allowAutoplay && !manualPlay

  return (
    <div
      ref={rootRef}
      className={['avatar-slot relative mx-auto', className].join(' ')}
    >
      <div className="relative mx-auto aspect-[4/5] w-36 overflow-hidden border border-canvas/15 bg-canvas/[0.04] md:w-48">
        {shouldMountVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-contain object-bottom"
            muted
            loop
            playsInline
            autoPlay={allowAutoplay}
            preload={allowAutoplay ? 'metadata' : 'none'}
            poster={poster}
            onError={() => setFailed(true)}
            aria-label={`${resume.name} talking avatar`}
          >
            {sources?.webm ? <source src={AVATAR_ASSETS.webm} type="video/webm" /> : null}
            {sources?.mp4 ? <source src={AVATAR_ASSETS.mp4} type="video/mp4" /> : null}
          </video>
        ) : (
          <img
            src={poster}
            alt={resume.name}
            className="h-full w-full object-cover object-top opacity-90"
            width={280}
            height={350}
            decoding="async"
          />
        )}

        {!hasVideo ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream/70 via-transparent to-cream/10" />
        ) : null}

        {showPlayHint ? (
          <button
            type="button"
            className="absolute inset-x-4 bottom-4 border border-canvas/20 bg-cream/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-canvas backdrop-blur-sm transition hover:border-canvas/50"
            onClick={() => setManualPlay(true)}
          >
            Play avatar
          </button>
        ) : null}
      </div>

      <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-canvas/40">
        {resume.name}
      </p>
    </div>
  )
}
