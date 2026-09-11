import { motion, useReducedMotion } from 'framer-motion'

type EditorialWordProps = {
  children: string
  className?: string
  size?: 'xl' | 'lg' | 'md'
}

const SIZE_CLASS = {
  xl: 'text-display-xl',
  lg: 'text-display-lg',
  md: 'text-display-md',
} as const

export function EditorialWord({ children, className = '', size = 'xl' }: EditorialWordProps) {
  const reduce = useReducedMotion()

  return (
    <motion.h2
      className={[
        'font-display font-black uppercase leading-[0.88] tracking-tight',
        SIZE_CLASS[size],
        className,
      ].join(' ')}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.h2>
  )
}
