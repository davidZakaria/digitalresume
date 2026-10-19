import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, summary, label, [data-cursor="grow"]'

function isInteractive(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE))
}

export function CustomCursor() {
  const reduce = useReducedMotion()
  const [finePointer, setFinePointer] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 500, damping: 32, mass: 0.35 })
  const y = useSpring(rawY, { stiffness: 500, damping: 32, mass: 0.35 })

  useEffect(() => {
    if (reduce) return

    const mq = window.matchMedia('(pointer: fine) and (hover: hover)')
    const updatePointer = () => setFinePointer(mq.matches)
    updatePointer()
    mq.addEventListener('change', updatePointer)

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      setVisible(true)
      setHovering(isInteractive(e.target))
    }
    const onOver = (e: MouseEvent) => {
      setHovering(isInteractive(e.target))
    }
    const onLeave = () => {
      setVisible(false)
      setHovering(false)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      mq.removeEventListener('change', updatePointer)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [reduce, rawX, rawY])

  useEffect(() => {
    const root = document.documentElement
    const enable = Boolean(!reduce && finePointer)
    root.classList.toggle('has-custom-cursor', enable)
    return () => root.classList.remove('has-custom-cursor')
  }, [reduce, finePointer])

  if (reduce || !finePointer || !visible) return null

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference md:block no-print"
      style={{ x, y }}
      aria-hidden
    >
      <motion.span
        className="block rounded-full border-2 border-white bg-white/10"
        animate={{
          width: hovering ? 44 : 18,
          height: hovering ? 44 : 18,
          x: hovering ? -22 : -9,
          y: hovering ? -22 : -9,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.35 }}
      />
    </motion.div>
  )
}
