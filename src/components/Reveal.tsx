import { Children, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

type StaggerListProps = {
  children: ReactNode
  className?: string
  stagger?: number
}

export function StaggerList({ children, className, stagger = 0.1 }: StaggerListProps) {
  const reduce = useReducedMotion()
  const items = Children.toArray(children)

  if (reduce) {
    return <div className={className}>{items}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: 0.04 },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-8% 0px' }}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
