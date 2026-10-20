import type { SkillGroup } from '../data/resume'

const SYMBOLS: Record<string, string> = {
  TypeScript: 'Ts',
  JavaScript: 'Js',
  HTML: 'H',
  CSS: 'C',
  React: 'Re',
  'Next.js': 'Nx',
  Vite: 'Vi',
  'Tailwind CSS': 'Tw',
  'Framer Motion': 'Fm',
  'Node.js': 'No',
  Express: 'Ex',
  NestJS: 'Ne',
  'REST APIs': 'Api',
  PostgreSQL: 'Pg',
  Prisma: 'Pr',
  MongoDB: 'Db',
  JWT: 'Jw',
  Docker: 'Dk',
  Git: 'Gt',
  Linux: 'Lx',
  Redis: 'Rd',
  'GitHub Actions': 'Gh',
}

export type SkillElement = {
  atomic: number
  name: string
  symbol: string
  category: string
}

export function skillSymbol(name: string): string {
  if (SYMBOLS[name]) return SYMBOLS[name]
  const letters = name.replace(/[^A-Za-z]/g, '')
  if (letters.length >= 2) return `${letters[0]!.toUpperCase()}${letters[1]!.toLowerCase()}`
  if (letters.length === 1) return letters[0]!.toUpperCase()
  return name.slice(0, 2)
}

export function flattenSkillElements(groups: readonly SkillGroup[]): SkillElement[] {
  const elements: SkillElement[] = []
  let atomic = 1
  for (const group of groups) {
    for (const name of group.items) {
      elements.push({
        atomic,
        name,
        symbol: skillSymbol(name),
        category: group.label,
      })
      atomic += 1
    }
  }
  return elements
}

export function displaySkillCategory(label: string): string {
  return label
}
