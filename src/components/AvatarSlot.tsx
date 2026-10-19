import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useSaveData } from '../hooks/useSaveData'
import {
  AVATAR_ASSETS,
  AVATAR_CROSSFADE_MS,
  AVATAR_INTRO_CAPTION,
  probeAvatarSources,
  type AvatarSources,
} from '../lib/avatarAssets'

type AvatarSlotProps = {
  className?: string
}

type Phase = 'poster' | 'intro' | 'loop'

function playQuietly(el: HTMLVideoElement | null) {
  if (!el) return
  void el.play().catch(() => {
    /* autoplay can still be blocked */
  })
}

export function AvatarSlot({ className = '' }: AvatarSlotProps) {
  const reduce = useReducedMotion()
  const saveData = useSaveData()
  const coarsePointer = useMediaQuery('(pointer: coarse)')
  const [sources, setSources] = useState<AvatarSources | null>(null)
  const [inView, setInView] = useState(false)
  const [phase, setPhase] = useState<Phase>('poster')
  const [soundOn, setSoundOn] = useState(false)
  const [introVisible, setIntroVisible] = useState(true)
  const [mountLoop, setMountLoop] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const [introFailed, setIntroFailed] = useState(false)
  const [loopFailed, setLoopFailed] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLVideoElement>(null)
  const loopRef = useRef<HTMLVideoElement>(null)
  const fadeTimer = useRef<number>(0)

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

  const hasIntro = Boolean(sources && (sources.introWebm || sources.introMp4) && !introFailed)
  const hasLoop = Boolean(sources && (sources.loopWebm || sources.loopMp4) && !loopFailed)
  const useStudioPoster = !posterFailed && (sources === null || sources.poster)
  const poster = useStudioPoster ? AVATAR_ASSETS.poster : AVATAR_ASSETS.placeholderPortrait
  const blended = useStudioPoster || hasIntro || hasLoop
  const canAutoplay = Boolean(inView && !coarsePointer && !saveData && !reduce)
  const wantsManualStart = Boolean(coarsePointer || saveData || reduce)

  const finishFadeToLoop = useCallback(() => {
    window.clearTimeout(fadeTimer.current)
    setIntroVisible(false)
    fadeTimer.current = window.setTimeout(() => {
      setPhase('loop')
      const intro = introRef.current
      if (intro) {
        intro.pause()
        intro.muted = true
      }
    }, AVATAR_CROSSFADE_MS)
  }, [])

  const goToLoop = useCallback(() => {
    if (!hasLoop) {
      setPhase('poster')
      return
    }
    const loop = loopRef.current
    if (loop) playQuietly(loop)
    setMountLoop(true)
    finishFadeToLoop()
  }, [finishFadeToLoop, hasLoop])

  useEffect(() => {
    return () => window.clearTimeout(fadeTimer.current)
  }, [])

  useEffect(() => {
    if (phase !== 'poster') return
    if (!canAutoplay || !inView) return

    const start = () => {
      if (hasIntro) {
        setPhase('intro')
        setIntroVisible(true)
        return
      }
      if (hasLoop) {
        setMountLoop(true)
        setPhase('loop')
        setIntroVisible(false)
      }
    }

    if (typeof window.requestIdleCallback === 'function') {
      const idle = window.requestIdleCallback(start, { timeout: 900 })
      return () => window.cancelIdleCallback(idle)
    }
    const timer = window.setTimeout(start, 180)
    return () => window.clearTimeout(timer)
  }, [canAutoplay, hasIntro, hasLoop, inView, phase])

  useEffect(() => {
    if (phase !== 'intro') return
    const intro = introRef.current
    if (!intro) return
    intro.muted = !soundOn
    playQuietly(intro)
  }, [phase, soundOn])

  useEffect(() => {
    if (!mountLoop) return
    playQuietly(loopRef.current)
  }, [mountLoop])

  const startFromPoster = () => {
    if (hasIntro) {
      setSoundOn(true)
      setIntroVisible(true)
      setPhase('intro')
      return
    }
    if (hasLoop) {
      setMountLoop(true)
      setIntroVisible(false)
      setPhase('loop')
    }
  }

  const unmuteIntro = () => {
    const intro = introRef.current
    setSoundOn(true)
    setIntroVisible(true)
    setPhase('intro')
    if (intro) {
      intro.muted = false
      intro.currentTime = 0
      playQuietly(intro)
    }
  }

  const replayIntro = () => {
    window.clearTimeout(fadeTimer.current)
    const loop = loopRef.current
    if (loop) loop.pause()
    setSoundOn(true)
    setIntroVisible(true)
    setPhase('intro')
    const intro = introRef.current
    if (intro) {
      intro.muted = false
      intro.currentTime = 0
      playQuietly(intro)
    }
  }

  const preloadLoopSoon = () => {
    if (mountLoop || !hasLoop) return
    setMountLoop(true)
  }

  const showPlayOnPoster = phase === 'poster' && (hasIntro || hasLoop) && wantsManualStart
  const showUnmutePill = phase === 'intro' && !soundOn && !wantsManualStart
  const showReplay = (phase === 'loop' || (phase === 'intro' && soundOn)) && hasIntro
  const showCaption = phase === 'intro'
  const mountIntro = phase === 'intro' || (phase === 'loop' && hasIntro)
  const videoCoversPoster = phase === 'intro' || phase === 'loop'

  return (
    <div ref={rootRef} className={['avatar-slot relative mx-auto', className].join(' ')}>
      <div
        className={[
          'avatar-stage relative mx-auto aspect-video w-[min(22rem,90vw)] md:w-[28rem] lg:w-[32rem]',
          blended ? 'avatar-stage-blend' : 'overflow-hidden border border-canvas/15 bg-canvas/[0.04]',
        ].join(' ')}
      >
        <div className="avatar-spotlight pointer-events-none absolute inset-0" aria-hidden />

        <img
          src={poster}
          alt={videoCoversPoster ? '' : resume.name}
          className={[
            'h-full w-full',
            blended ? 'avatar-media-blend object-cover object-center' : 'object-cover object-top opacity-90',
          ].join(' ')}
          width={1280}
          height={720}
          decoding="async"
          onError={() => setPosterFailed(true)}
        />

        {mountIntro && hasIntro ? (
          <video
            ref={introRef}
            className={[
              'avatar-layer absolute inset-0 h-full w-full object-cover object-center',
              blended ? 'avatar-media-blend' : '',
              introVisible ? 'avatar-layer-on' : 'avatar-layer-off',
            ].join(' ')}
            muted={!soundOn}
            playsInline
            preload="none"
            poster={poster}
            onError={() => setIntroFailed(true)}
            onEnded={goToLoop}
            onTimeUpdate={(event) => {
              const el = event.currentTarget
              if (el.duration && el.currentTime >= el.duration - 0.9) preloadLoopSoon()
            }}
            aria-label={`${resume.name} introduction`}
          >
            {sources?.introWebm ? <source src={AVATAR_ASSETS.introWebm} type="video/webm" /> : null}
            {sources?.introMp4 ? <source src={AVATAR_ASSETS.introMp4} type="video/mp4" /> : null}
            <track
              kind="captions"
              srcLang="en"
              label="English"
              src={AVATAR_ASSETS.introCaptions}
              default
            />
          </video>
        ) : null}

        {mountLoop && hasLoop ? (
          <video
            ref={loopRef}
            className={[
              'avatar-layer absolute inset-0 h-full w-full object-cover object-center',
              blended ? 'avatar-media-blend' : '',
              phase === 'loop' || !introVisible ? 'avatar-layer-on' : 'avatar-layer-off',
            ].join(' ')}
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setLoopFailed(true)}
            aria-hidden={phase !== 'loop'}
            aria-label={`${resume.name} talking avatar`}
          >
            {sources?.loopWebm ? <source src={AVATAR_ASSETS.loopWebm} type="video/webm" /> : null}
            {sources?.loopMp4 ? <source src={AVATAR_ASSETS.loopMp4} type="video/mp4" /> : null}
          </video>
        ) : null}

        {showPlayOnPoster ? (
          <button type="button" className="avatar-sound-pill" onClick={startFromPoster}>
            Play intro
          </button>
        ) : null}

        {showUnmutePill ? (
          <button type="button" className="avatar-sound-pill" onClick={unmuteIntro}>
            <span className="avatar-sound-dot" aria-hidden />
            Tap for sound
          </button>
        ) : null}

        {showReplay ? (
          <button type="button" className="avatar-replay" onClick={replayIntro}>
            Replay intro
          </button>
        ) : null}
      </div>

      {showCaption ? (
        <p className="avatar-caption" aria-live="polite">
          {AVATAR_INTRO_CAPTION}
        </p>
      ) : (
        <p className="sr-only" aria-live="polite">
          {phase === 'loop' ? `${resume.name} talking avatar` : ''}
        </p>
      )}
    </div>
  )
}
