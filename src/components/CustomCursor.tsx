import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function CustomCursor() {
  const reduce = useReducedMotion()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [finePointer, setFinePointer] = useState(false)

  useEffect(() => {
    if (reduce) return

    const mq = window.matchMedia('(pointer: fine)')
    const updatePointer = () => setFinePointer(mq.matches)
    updatePointer()
    mq.addEventListener('change', updatePointer)

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      mq.removeEventListener('change', updatePointer)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [reduce])

  if (reduce || !finePointer || !visible) return null

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference md:block no-print"
      animate={{ x: pos.x - 6, y: pos.y - 6 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.4 }}
      aria-hidden
    >
      <span className="block h-3 w-3 rounded-full bg-cream" />
    </motion.div>
  )
}
