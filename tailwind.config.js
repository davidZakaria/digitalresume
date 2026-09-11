/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        cream: {
          DEFAULT: 'rgb(var(--cream) / <alpha-value>)',
          muted: 'rgb(var(--cream-muted) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
          border: 'var(--surface-border)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          bright: 'rgb(var(--accent-bright) / <alpha-value>)',
          muted: 'var(--accent-muted)',
          soft: 'var(--accent-soft)',
        },
        pop: {
          DEFAULT: 'rgb(var(--pop) / <alpha-value>)',
          bright: 'rgb(var(--pop-bright) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        'glow-lg': 'var(--shadow-glow-lg)',
        innerGlow: 'var(--shadow-inner-glow)',
        card: 'var(--shadow-card)',
        nav: 'var(--shadow-nav)',
      },
      backgroundImage: {
        'noise-faint':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        'gradient-flow': 'gradient-flow 6s ease infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
      fontSize: {
        'display-xl': ['clamp(4.5rem,14vw,11rem)', { lineHeight: '0.88', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(3rem,8vw,6rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2.25rem,5vw,4rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [],
}
