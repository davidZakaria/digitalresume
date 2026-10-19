import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react'
import { useReducedMotion } from 'framer-motion'
import { resume } from '../data/resume'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useSaveData } from '../hooks/useSaveData'
import {
  AVATAR_ASSETS,
  AVATAR_CROSSFADE_MS,
  AVATAR_INTRO_CAPTION,
  markWebkitInline,
  orderedVideoSources,
  probeAvatarSources,
  type AvatarIntroClock,
  type AvatarSources,
} from '../lib/avatarAssets'

type AvatarSlotProps = {
  className?: string
  clockRef?: MutableRefObject<AvatarIntroClock>
  onCaption?: (caption: string) => void
}

type Phase = 'poster' | 'intro' | 'loop'

function playQuietly(el: HTMLVideoElement | null) {
  if (!el) return
  void el.play().catch(() => {
    /* autoplay can still be blocked */
  })
}

function bindInlineVideo(el: HTMLVideoElement | null, store: MutableRefObject<HTMLVideoElement | null>) {
  store.current = el
  markWebkitInline(el)
}

export function AvatarSlot({ className = '', clockRef, onCaption }: AvatarSlotProps) {
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
  const resetId = useRef(0)
  const phaseRef = useRef<Phase>('poster')

  const publishClock = useCallback(
    (partial: Partial<AvatarIntroClock>) => {
      if (!clockRef) return
      clockRef.current = { ...clockRef.current, ...partial }
    },
    [clockRef],
  )

  useEffect(() => {
    let cancelled = false
    void probeAvatarSources().then((next) => {
      if (cancelled) return
      setSources(next)
      const found = Boolean(next.introWebm || next.introMp4)
      publishClock({ hasIntro: found, introFailed: false })
    })
    return () => {
      cancelled = true
    }
  }, [publishClock])

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

  useEffect(() => {
    phaseRef.current = phase
    publishClock({
      phase,
      hasIntro,
      introFailed,
      resetId: resetId.current,
    })
  }, [hasIntro, introFailed, phase, publishClock])

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
      publishClock({ phase: 'loop', time: 7.5 })
    }, AVATAR_CROSSFADE_MS)
  }, [publishClock])

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

    let cancelled = false
    const pushTime = () => {
      if (cancelled || phaseRef.current !== 'intro') return
      publishClock({ phase: 'intro', time: intro.currentTime, resetId: resetId.current })
    }

    const video = intro as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number
      cancelVideoFrameCallback?: (id: number) => void
    }

    if (typeof video.requestVideoFrameCallback === 'function') {
      let id = 0
      const onFrame = () => {
        pushTime()
        if (!cancelled && phaseRef.current === 'intro') {
          id = video.requestVideoFrameCallback!(onFrame)
        }
      }
      id = video.requestVideoFrameCallback(onFrame)
      return () => {
        cancelled = true
        video.cancelVideoFrameCallback?.(id)
      }
    }

    let raf = 0
    const onTime = () => {
      pushTime()
      raf = requestAnimationFrame(onTime)
    }
    intro.addEventListener('timeupdate', pushTime)
    raf = requestAnimationFrame(onTime)
    return () => {
      cancelled = true
      intro.removeEventListener('timeupdate', pushTime)
      cancelAnimationFrame(raf)
    }
  }, [phase, publishClock, soundOn])

  useEffect(() => {
    if (!mountLoop) return
    playQuietly(loopRef.current)
  }, [mountLoop])

  const playIntroNow = (withSound: boolean, restart: boolean) => {
    const intro = introRef.current
    if (!intro) return
    intro.muted = !withSound
    if (restart) {
      try {
        intro.currentTime = 0
      } catch {
        /* some engines throw if metadata is not ready */
      }
    }
    playQuietly(intro)
  }

  const startFromPoster = () => {
    if (hasIntro) {
      resetId.current += 1
      setSoundOn(true)
      setIntroVisible(true)
      setPhase('intro')
      publishClock({ phase: 'intro', time: 0, resetId: resetId.current, hasIntro: true })
      playIntroNow(true, true)
      return
    }
    if (hasLoop) {
      setMountLoop(true)
      setIntroVisible(false)
      setPhase('loop')
    }
  }

  const unmuteIntro = () => {
    resetId.current += 1
    setSoundOn(true)
    setIntroVisible(true)
    setPhase('intro')
    publishClock({ phase: 'intro', time: 0, resetId: resetId.current, hasIntro: true })
    playIntroNow(true, true)
  }

  const replayIntro = () => {
    window.clearTimeout(fadeTimer.current)
    const loop = loopRef.current
    if (loop) loop.pause()
    resetId.current += 1
    setSoundOn(true)
    setIntroVisible(true)
    setPhase('intro')
    publishClock({ phase: 'intro', time: 0, resetId: resetId.current, hasIntro: true })
    playIntroNow(true, true)
  }

  const preloadLoopSoon = () => {
    if (mountLoop || !hasLoop) return
    setMountLoop(true)
  }

  const showPlayOnPoster = phase === 'poster' && (hasIntro || hasLoop) && wantsManualStart
  const showUnmutePill = phase === 'intro' && !soundOn && !wantsManualStart
  const showReplay = (phase === 'loop' || (phase === 'intro' && soundOn)) && hasIntro
  const showCaption = phase === 'intro'

  useEffect(() => {
    onCaption?.(showCaption ? AVATAR_INTRO_CAPTION : '')
  }, [onCaption, showCaption])
  const mountIntro = Boolean(hasIntro && (phase !== 'poster' || inView || wantsManualStart))
  const videoCoversPoster = phase === 'intro' || phase === 'loop'
  const introSources = sources
    ? orderedVideoSources(
        { ok: sources.introWebm, src: AVATAR_ASSETS.introWebm },
        { ok: sources.introMp4, src: AVATAR_ASSETS.introMp4 },
      )
    : []
  const loopSources = sources
    ? orderedVideoSources(
        { ok: sources.loopWebm, src: AVATAR_ASSETS.loopWebm },
        { ok: sources.loopMp4, src: AVATAR_ASSETS.loopMp4 },
      )
    : []

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
            ref={(el) => bindInlineVideo(el, introRef)}
            className={[
              'avatar-layer absolute inset-0 h-full w-full object-cover object-center',
              blended ? 'avatar-media-blend' : '',
              phase === 'intro' && introVisible ? 'avatar-layer-on' : 'avatar-layer-off',
            ].join(' ')}
            muted={!soundOn}
            playsInline
            preload={wantsManualStart || inView ? 'metadata' : 'none'}
            poster={poster}
            onError={() => {
              setIntroFailed(true)
              publishClock({ introFailed: true, hasIntro: false })
            }}
            onEnded={goToLoop}
            onTimeUpdate={(event) => {
              const el = event.currentTarget
              if (el.duration && el.currentTime >= el.duration - 0.9) preloadLoopSoon()
            }}
            aria-label={`${resume.name} introduction`}
          >
            {introSources.map((item) => (
              <source key={item.type} src={item.src} type={item.type} />
            ))}
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
            ref={(el) => bindInlineVideo(el, loopRef)}
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
            {loopSources.map((item) => (
              <source key={item.type} src={item.src} type={item.type} />
            ))}
          </video>
        ) : null}

        {showPlayOnPoster ? (
          <button type="button" className="avatar-sound-pill tap-target" onClick={startFromPoster}>
            Play intro
          </button>
        ) : null}

        {showUnmutePill ? (
          <button type="button" className="avatar-sound-pill tap-target" onClick={unmuteIntro}>
            <span className="avatar-sound-dot" aria-hidden />
            Tap for sound
          </button>
        ) : null}

        {showReplay ? (
          <button type="button" className="avatar-replay tap-target" onClick={replayIntro}>
            Replay intro
          </button>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {showCaption ? AVATAR_INTRO_CAPTION : phase === 'loop' ? `${resume.name} talking avatar` : ''}
      </p>
    </div>
  )
}
