import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { type AvatarIntroClock } from '../lib/avatarAssets'
import { coverMaskFor, resolveHeadlinePose, sampleGripBar } from '../lib/introGrip'

const LINE_ONE = 'FULL-STACK'
const LINE_TWO = 'ENGINEER'
const LINE_ONE_LEN = LINE_ONE.length

/** Extra crooked offsets for a couple of hanging letters. */
const DROPS: Record<number, { y: number; rotate: number }> = {
  3: { y: 18, rotate: -11 }, // L
  9: { y: 14, rotate: 8 }, // K
  12: { y: 16, rotate: -9 }, // G
}

type HeroHeadlineProps = {
  clockRef: MutableRefObject<AvatarIntroClock>
}

export function HeroHeadline({ clockRef }: HeroHeadlineProps) {
  const reduce = useReducedMotion()
  const wordRef = useRef<HTMLSpanElement>(null)
  const maskRef = useRef<HTMLSpanElement>(null)
  const lastReset = useRef(0)
  const fxArmed = useRef(true)
  const lettersFixedRef = useRef(false)
  const stateRef = useRef<'crooked' | 'held' | 'fixed'>('crooked')
  const [fxOn, setFxOn] = useState(false)
  const [lettersFixed, setLettersFixed] = useState(false)
  const [state, setState] = useState<'crooked' | 'held' | 'fixed'>('crooked')

  useEffect(() => {
    let frame = 0
    let fxTimer = 0

    const sync = () => {
      const clock = clockRef.current
      if (clock.resetId !== lastReset.current) {
        lastReset.current = clock.resetId
        fxArmed.current = true
        lettersFixedRef.current = false
        stateRef.current = 'crooked'
        setFxOn(false)
        setLettersFixed(false)
        setState('crooked')
      }

      const skipMotion = Boolean(reduce || !clock.hasIntro || clock.introFailed)
      const word = wordRef.current
      const mask = maskRef.current

      if (skipMotion) {
        if (!lettersFixedRef.current) {
          lettersFixedRef.current = true
          setLettersFixed(true)
        }
        if (stateRef.current !== 'fixed') {
          stateRef.current = 'fixed'
          setState('fixed')
        }
        if (word) {
          word.style.left = '50%'
          word.style.top = '90%'
          word.style.width = '120%'
          word.style.transform = 'translate(-50%, -50%)'
        }
        if (mask) mask.style.opacity = '0'
        frame = requestAnimationFrame(sync)
        return
      }

      const time = clock.phase === 'intro' ? clock.time : clock.phase === 'loop' ? 13 : 0
      const pose = resolveHeadlinePose(time, clock.phase)

      if (word) {
        word.style.left = `${pose.cx * 100}%`
        word.style.top = `${pose.cy * 100}%`
        word.style.width = `${pose.width * 100}%`
        word.style.transform = `translate(-50%, -50%) rotate(${pose.rotate}deg)`
      }

      if (mask) {
        const bar = clock.phase === 'intro' ? sampleGripBar(clock.time) : null
        if (bar && pose.cover > 0) {
          const box = coverMaskFor(bar)
          mask.style.opacity = String(pose.cover)
          mask.style.left = `${box.x * 100}%`
          mask.style.top = `${box.y * 100}%`
          mask.style.width = `${box.w * 100}%`
          mask.style.height = `${box.h * 100}%`
        } else {
          mask.style.opacity = '0'
        }
      }

      if (lettersFixedRef.current !== pose.lettersFixed) {
        lettersFixedRef.current = pose.lettersFixed
        setLettersFixed(pose.lettersFixed)
      }

      const nextState = pose.released ? 'fixed' : pose.grabbing ? 'held' : 'crooked'
      if (stateRef.current !== nextState) {
        stateRef.current = nextState
        setState(nextState)
      }

      if (pose.released && fxArmed.current) {
        fxArmed.current = false
        setFxOn(true)
        window.clearTimeout(fxTimer)
        fxTimer = window.setTimeout(() => setFxOn(false), 720)
      }

      frame = requestAnimationFrame(sync)
    }

    frame = requestAnimationFrame(sync)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(fxTimer)
    }
  }, [clockRef, reduce])

  const skipMotion = Boolean(reduce || !clockRef.current.hasIntro || clockRef.current.introFailed)

  return (
    <div className="hero-headline-layer pointer-events-none absolute inset-0 z-[4] overflow-visible" data-headline-state={state}>
      <span ref={maskRef} className="hero-headline-mask" aria-hidden />
      <h1
        className="hero-headline relative h-full w-full font-display font-black uppercase leading-[0.84] tracking-tight text-canvas"
        data-headline-state={state}
      >
        <span className="sr-only">Full-Stack Engineer</span>
        <span
          ref={wordRef}
          className="hero-headline-word absolute left-1/2 top-[86%] block w-[120%] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          <motion.span
            className="hero-headline-shake relative block"
            animate={fxOn ? { x: [0, -5, 4, -2, 0] } : { x: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <span className="hero-headline-line block origin-[50%_80%]">
              <span className="hero-headline-row hero-headline-row-one block">
                {LINE_ONE.split('').map((ch, i) => (
                  <HeadlineLetter key={`a${i}`} ch={ch} index={i} fixed={skipMotion || lettersFixed} />
                ))}
              </span>
              <span className="hero-headline-row hero-headline-row-two block">
                {LINE_TWO.split('').map((ch, i) => (
                  <HeadlineLetter
                    key={`b${i}`}
                    ch={ch}
                    index={LINE_ONE_LEN + i}
                    fixed={skipMotion || lettersFixed}
                  />
                ))}
              </span>
            </span>
            <span className={['hero-headline-shine', fxOn ? 'is-on' : ''].join(' ')} />
            {fxOn ? <HeadlineDust /> : null}
          </motion.span>
        </span>
      </h1>
    </div>
  )
}

function HeadlineLetter({ ch, index, fixed }: { ch: string; index: number; fixed: boolean }) {
  const drop = DROPS[index]
  return (
    <motion.span
      className="hero-headline-letter inline-block"
      animate={
        fixed
          ? { y: 0, rotate: 0, scale: 1 }
          : { y: drop?.y ?? 0, rotate: drop?.rotate ?? 0, scale: 1 }
      }
      transition={{ type: 'spring', stiffness: 540, damping: 15, mass: 0.42 }}
    >
      {ch === '-' ? <span className="inline-block px-[0.02em]">-</span> : ch}
    </motion.span>
  )
}

function HeadlineDust() {
  const bits = [
    { x: '18%', delay: 0 },
    { x: '36%', delay: 0.04 },
    { x: '52%', delay: 0.02 },
    { x: '68%', delay: 0.07 },
    { x: '82%', delay: 0.05 },
  ]
  return (
    <span className="hero-headline-dust" aria-hidden>
      {bits.map((bit) => (
        <span key={bit.x} style={{ left: bit.x, animationDelay: `${bit.delay}s` }} />
      ))}
    </span>
  )
}
