import { resume } from '../data/resume'

type CircularStampProps = {
  href?: string
  className?: string
}

export function CircularStamp({ href = '#contact', className = '' }: CircularStampProps) {
  const label = `${resume.name} · Open to work · `.repeat(2)

  return (
    <a
      href={href}
      className={[
        'group relative flex h-[88px] w-[88px] items-center justify-center rounded-full border border-current/20 transition hover:border-accent/50 no-print',
        className,
      ].join(' ')}
      aria-label="Contact David Samy"
    >
      <svg
        className="absolute inset-0 h-full w-full stamp-text motion-reduce:animate-none"
        viewBox="0 0 88 88"
        aria-hidden
      >
        <defs>
          <path id="stamp-circle" d="M 44,44 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" />
        </defs>
        <text className="fill-current text-[7.5px] uppercase tracking-[0.22em] opacity-60">
          <textPath href="#stamp-circle">{label}</textPath>
        </text>
      </svg>
      <span className="relative z-[1] flex h-3 w-3 items-center justify-center rounded-full border border-current/30 bg-current/5 transition group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/20">
        <span className="h-1 w-1 rounded-full bg-accent-bright" />
      </span>
    </a>
  )
}
