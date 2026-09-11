import Lenis from 'lenis'
import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type SmoothScrollProps = {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    })

    let raf = 0
    const tick = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduce])

  return <>{children}</>
}
