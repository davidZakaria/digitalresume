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
  const [posterFailed, setPosterFailed] = useState(false)
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
  const useStudioPoster = !posterFailed && (sources === null || sources.poster)
  const poster = useStudioPoster ? AVATAR_ASSETS.poster : AVATAR_ASSETS.placeholderPortrait
  const blended = useStudioPoster || hasVideo

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
    <div ref={rootRef} className={['avatar-slot relative mx-auto', className].join(' ')}>
      <div
        className={[
          'avatar-stage relative mx-auto aspect-video w-[min(22rem,90vw)] md:w-[28rem] lg:w-[32rem]',
          blended ? 'avatar-stage-blend' : 'overflow-hidden border border-canvas/15 bg-canvas/[0.04]',
        ].join(' ')}
      >
        <div className="avatar-spotlight pointer-events-none absolute inset-0" aria-hidden />

        {shouldMountVideo ? (
          <video
            ref={videoRef}
            className={['h-full w-full object-cover object-center', blended ? 'avatar-media-blend' : ''].join(' ')}
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
            className={[
              'h-full w-full',
              blended ? 'avatar-media-blend object-cover object-center' : 'object-cover object-top opacity-90',
            ].join(' ')}
            width={1280}
            height={720}
            decoding="async"
            onError={() => setPosterFailed(true)}
          />
        )}

        {showPlayHint ? (
          <button
            type="button"
            className="absolute bottom-3 left-1/2 z-[1] -translate-x-1/2 rounded-full border border-canvas/20 bg-cream/80 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-canvas backdrop-blur-sm transition hover:border-canvas/50 dark:border-cream/20 dark:bg-canvas/70 dark:text-cream"
            onClick={() => setManualPlay(true)}
          >
            Play avatar
          </button>
        ) : null}
      </div>
    </div>
  )
}
