import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  INTRO_FIX_START,
  INTRO_FIX_STAGGER,
  type AvatarIntroClock,
} from '../lib/avatarAssets'

const LINE_ONE = 'FULL-STACK'
const LINE_TWO = 'ENGINEER'
const LETTERS = [...LINE_ONE, ...LINE_TWO]
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

function countFixed(time: number): number {
  if (time < INTRO_FIX_START) return 0
  return Math.min(LETTERS.length, Math.floor((time - INTRO_FIX_START) / INTRO_FIX_STAGGER) + 1)
}

export function HeroHeadline({ clockRef }: HeroHeadlineProps) {
  const reduce = useReducedMotion()
  const [fixedCount, setFixedCount] = useState(0)
  const [fxOn, setFxOn] = useState(false)
  const lastReset = useRef(0)
  const fxArmed = useRef(true)

  useEffect(() => {
    let frame = 0

    const sync = () => {
      const clock = clockRef.current
      if (clock.resetId !== lastReset.current) {
        lastReset.current = clock.resetId
        fxArmed.current = true
        setFxOn(false)
        setFixedCount(0)
      }

      const skipMotion = Boolean(reduce || !clock.hasIntro || clock.introFailed)
      if (skipMotion) {
        setFixedCount(LETTERS.length)
        setFxOn(false)
        frame = requestAnimationFrame(sync)
        return
      }

      const applied =
        clock.phase === 'poster' ? 0 : clock.phase === 'loop' ? LETTERS.length : countFixed(clock.time)

      setFixedCount((prev) => (prev === applied ? prev : applied))

      if (applied > 0 && fxArmed.current) {
        fxArmed.current = false
        setFxOn(true)
        window.setTimeout(() => setFxOn(false), 720)
      }

      frame = requestAnimationFrame(sync)
    }

    frame = requestAnimationFrame(sync)
    return () => cancelAnimationFrame(frame)
  }, [clockRef, reduce])

  const skipMotion = Boolean(reduce || !clockRef.current.hasIntro || clockRef.current.introFailed)
  const lineStraight = skipMotion || fixedCount > 0
  const state = skipMotion || fixedCount >= LETTERS.length ? 'fixed' : fixedCount > 0 ? 'fixing' : 'crooked'

  return (
    <h1
      className="hero-headline relative w-full font-display font-black uppercase leading-[0.84] tracking-tight text-canvas"
      data-headline-state={state}
    >
      <span className="sr-only">Full-Stack Engineer</span>
      <motion.span
        className="hero-headline-shake relative block"
        animate={fxOn ? { x: [0, -5, 4, -2, 0] } : { x: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        aria-hidden
      >
        <motion.span
          className="hero-headline-line block origin-[50%_80%]"
          animate={lineStraight ? { rotate: 0, x: 0 } : { rotate: -6.5, x: -18 }}
          transition={{ type: 'spring', stiffness: 280, damping: 16, mass: 0.7 }}
        >
          <span className="block text-display-xl">
            {LINE_ONE.split('').map((ch, i) => (
              <HeadlineLetter key={`a${i}`} ch={ch} index={i} fixed={skipMotion || i < fixedCount} />
            ))}
          </span>
          <span className="mt-0 block text-display-lg font-bold">
            {LINE_TWO.split('').map((ch, i) => (
              <HeadlineLetter
                key={`b${i}`}
                ch={ch}
                index={LINE_ONE_LEN + i}
                fixed={skipMotion || LINE_ONE_LEN + i < fixedCount}
              />
            ))}
          </span>
        </motion.span>
        <span className={['hero-headline-shine', fxOn ? 'is-on' : ''].join(' ')} />
        {fxOn ? <HeadlineDust /> : null}
      </motion.span>
    </h1>
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
