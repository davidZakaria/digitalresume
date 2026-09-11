import { resume } from '../data/resume'

type CircularStampProps = {
  href?: string
  className?: string
}

export function CircularStamp({ href = '#contact', className = '' }: CircularStampProps) {
  const label = "Let's work together · Let's work together · "

  return (
    <a
      href={href}
      className={[
        'group relative flex h-[92px] w-[92px] items-center justify-center rounded-full border border-current/20 transition hover:border-accent/50 no-print',
        className,
      ].join(' ')}
      aria-label={`Contact ${resume.name}`}
    >
      <svg
        className="absolute inset-0 h-full w-full stamp-text motion-reduce:animate-none"
        viewBox="0 0 92 92"
        aria-hidden
      >
        <defs>
          <path id="stamp-circle" d="M 46,46 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
        </defs>
        <text className="fill-current text-[7px] uppercase tracking-[0.2em] opacity-55">
          <textPath href="#stamp-circle">{label}</textPath>
        </text>
      </svg>
      <span className="relative z-[1] text-lg leading-none transition group-hover:scale-110" aria-hidden>
        ↗
      </span>
    </a>
  )
}
