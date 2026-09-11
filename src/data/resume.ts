/**
 * Résumé content — align with `DavidSamyResume.pdf` when available.
 * Portfolio projects live here too (`projects`) so CV and site stay in sync.
 */

export type ExperienceItem = {
  role: string
  company: string
  period: string
  location?: string
  highlights: string[]
}

export type EducationItem = {
  school: string
  degree: string
  period: string
  detail?: string
}

export type SkillGroup = {
  label: string
  items: string[]
}

export type PortfolioProject = {
  title: string
  description: string
  stack: string[]
  /** GitHub repository — omit for production-site-only entries */
  repoUrl?: string
  /** Public URL — primary link when no repo, or paired with GitHub when both are set */
  liveUrl?: string
}

const env = import.meta.env

const LIVE_HRERP_FROM_ENV = env.VITE_LIVE_HRERP_URL?.trim()
const LIVE_TALE_FROM_ENV = env.VITE_LIVE_TALE_URL?.trim()

/** Replace with your real public HR ERP URL, or use `VITE_LIVE_HRERP_URL` in `.env.local` */
const LIVE_HRERP_MANUAL = ''
/** Replace with your real public Talé URL, or use `VITE_LIVE_TALE_URL` in `.env.local` */
const LIVE_TALE_MANUAL = 'https://talehotel.com/en'

const hrerpLive = LIVE_HRERP_MANUAL || LIVE_HRERP_FROM_ENV
const taleLive = LIVE_TALE_MANUAL || LIVE_TALE_FROM_ENV

export const resume = {
  name: 'David Samy',
  /** Professional headline under your name */
  title: 'Full-Stack Software Engineer',
  /** Short elevator pitch */
  summary:
    'I design and ship production web applications across real-estate enterprise systems, HR operations, hospitality booking, cultural archives, and education — from PostgreSQL and Prisma backends to polished React and Next.js interfaces.',
  location: 'Open to remote roles',
  contact: {
    /** Set your public email for mailto links */
    email: '',
    github: 'https://github.com/davidZakaria',
    linkedin: 'https://www.linkedin.com/in/david-zakaria/',
  },
  experience: [
    {
      role: 'Full-Stack Developer',
      company: 'Independent / Portfolio',
      period: 'Present',
      highlights: [
        'HR ERP — employee workflows (leave, excuses, admin dashboards), JWT auth, MongoDB, React front end.',
        'Talé — hotel booking product with Express/MongoDB API, Next.js App Router UI, OAuth and Paymob-ready payments.',
        'Arabic Cinema Digital Archive — batch ingestion, Google Vision Arabic OCR, GPT-assisted correction, BullMQ, RTL Next.js archive UX.',
        'English Learning Platform — LMS-style React/Vite client and Express/MongoDB backend: quizzes, dashboards, bilingual UX.',
        'Car rental & buying (MERN) — MongoDB models, Express routes/middleware, structured API surface for rental and purchase flows.',
        'Sorcerer Killer Bot — Discord voice music bot: YouTube search/queue, playback pipeline with ffmpeg/opus and queue controls.',
        'Additional production sites — j-communities.com and jrs-med.com (live launches and ongoing web presence).',
      ],
    },
    {
      role: 'Software Engineer',
      company: 'New Jersey Developments (NJD Egypt)',
      period: 'Present',
      location: 'Egypt',
      highlights: [
        'Own the public web presence for a real-estate development group — njdegypt.com — including project storytelling, brand pages, and performance-conscious delivery.',
        'Build and maintain production internal systems — post-sales CRM, broker relationship management, legal operations ERP, and engineering workflows — on Next.js, Prisma, and PostgreSQL.',
        'Translate business and marketing needs into a maintainable site structure, content hierarchy, and deployment workflow stakeholders can update over time.',
        'Ship iterative improvements across SEO, accessibility, and reliability so property launches and corporate updates reach clients without friction.',
      ],
    },
  ] satisfies ExperienceItem[],
  education: [
    {
      school: 'BUE — The British University in Egypt',
      degree: 'B.Sc. Computer Science',
      period: '',
      detail: '',
    },
  ] satisfies EducationItem[],
  skillGroups: [
    {
      label: 'Languages',
      items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
    },
    {
      label: 'Frontend',
      items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      label: 'Backend & data',
      items: ['Node.js', 'Express', 'NestJS', 'REST APIs', 'PostgreSQL', 'Prisma', 'MongoDB', 'JWT'],
    },
    {
      label: 'Platform & tooling',
      items: ['Docker', 'Git', 'Linux', 'Redis', 'GitHub Actions'],
    },
  ] satisfies SkillGroup[],
  /** Featured portfolio — same list drives the Projects section on the site */
  projects: [
    {
      title: 'NJD Post-Sales CRM',
      description:
        'Enterprise real-estate post-sales and customer-service CRM with bilingual Arabic RTL / English LTR UI, RBAC, mandatory 2FA, audit logging, bulk Excel import, and automated backups.',
      repoUrl: 'https://github.com/davidZakaria/Cs-njd',
      liveUrl: 'https://njd-crm.com/',
      stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'NextAuth', 'next-intl'],
    },
    {
      title: 'Sales Arena (BRM)',
      description:
        'Broker Relationship Management for agency relationships, compliance data, and Open Race assignments under an Operations-led pipeline from draft through verified status.',
      repoUrl: 'https://github.com/davidZakaria/sales-arena',
      liveUrl: 'https://sales-arena.duckdns.org',
      stack: ['Next.js', 'TypeScript', 'Prisma', 'NextAuth', 'shadcn/ui'],
    },
    {
      title: 'Legal ERP',
      description:
        'Legal and corporate operations ERP for the real-estate group: lawsuit and prosecution tracking, court sessions, legal notices, contracts, GAFI compliance, subsidiary governance, and automated backups.',
      repoUrl: 'https://github.com/davidZakaria/Legal-erp',
      liveUrl: 'https://legal-njd.com/',
      stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'NextAuth', 'next-intl'],
    },
    {
      title: 'Eng ERP (Eng-NJD)',
      description:
        'Engineering real-estate ERP monorepo for Egypt development workflows — consultant model submissions, BOQ, site execution logs, variance reporting, version control, and encrypted backups.',
      repoUrl: 'https://github.com/davidZakaria/eng-erp',
      liveUrl: 'https://eng-njd.duckdns.org',
      stack: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'MinIO'],
    },
    {
      title: 'Backstage',
      description:
        'Bilingual EN/AR furniture e-commerce with an editorial storefront, customer account area, and JWT-protected admin for catalog, orders, content, and site settings.',
      repoUrl: 'https://github.com/davidZakaria/backstage',
      stack: ['Next.js', 'Prisma', 'PostgreSQL', 'next-intl', 'Supabase'],
    },
    {
      title: 'HR ERP',
      description:
        'HR employee management system for leave requests and excuses, admin dashboard, role-based access, and JWT-secured APIs backed by MongoDB.',
      repoUrl: 'https://github.com/davidZakaria/hrerp',
      liveUrl: hrerpLive || undefined,
      stack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'React'],
    },
    {
      title: 'Talé — Hotel booking',
      description:
        'Full-stack hospitality platform with an Express + MongoDB API and a Next.js App Router frontend, OAuth integrations, and Paymob-ready payments.',
      repoUrl: 'https://github.com/davidZakaria/Tal-',
      liveUrl: taleLive || undefined,
      stack: ['Next.js', 'Express', 'MongoDB', 'OAuth', 'TypeScript'],
    },
    {
      title: 'Arabic Cinema Digital Archive',
      description:
        'Large-scale archive pipeline with Arabic OCR via Google Cloud Vision, GPT-assisted correction, BullMQ jobs, MongoDB, and an RTL-first Next.js experience.',
      repoUrl: 'https://github.com/davidZakaria/cath-archives',
      stack: ['Next.js', 'MongoDB', 'Vision API', 'OpenAI', 'Redis'],
    },
    {
      title: 'English Learning Platform',
      description:
        'LMS-style experience for secondary English learners: React + Vite client, Express + MongoDB backend, quizzes, dashboards, and bilingual UX.',
      repoUrl: 'https://github.com/davidZakaria/English-Platform-',
      stack: ['React', 'Vite', 'Express', 'MongoDB', 'Tailwind'],
    },
    {
      title: 'Car rental & buying (MERN)',
      description:
        'MERN-oriented stack with structured Express routing, MongoDB models, and middleware — oriented around vehicle rental and purchasing workflows.',
      repoUrl: 'https://github.com/davidZakaria/Car-rental--buying--Mern',
      stack: ['MongoDB', 'Express', 'React', 'Node.js', 'REST'],
    },
    {
      title: 'Sorcerer Killer Bot',
      description:
        'Discord music bot for voice channels: search YouTube from text queries, queue tracks, and stream audio using yt tooling with ffmpeg/opus playback.',
      repoUrl: 'https://github.com/davidZakaria/SorcererKillerBot-main-master',
      stack: ['Node.js', 'Discord.js', 'ffmpeg', 'YouTube API'],
    },
    {
      title: 'NJD Egypt',
      description:
        'Production company website for NJD Egypt — public-facing brand and business presence.',
      liveUrl: 'https://njdegypt.com',
      stack: ['Production', 'Web', 'Deployed'],
    },
    {
      title: 'J Communities',
      description:
        'Live web presence for J Communities — community-focused organization site.',
      liveUrl: 'https://j-communities.com',
      stack: ['Production', 'Web', 'Deployed'],
    },
    {
      title: 'JRS Med',
      description:
        'Healthcare-sector production site for JRS Med — professional clinical services positioning.',
      liveUrl: 'https://jrs-med.com',
      stack: ['Production', 'Healthcare', 'Web'],
    },
  ] satisfies PortfolioProject[],
}
