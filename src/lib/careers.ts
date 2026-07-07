import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Career } from '@/types/career'

let cached: Career[] | null = null

export function getAllCareers(): Career[] {
  if (cached) return cached

  const dir = path.join(process.cwd(), 'content/careers')
  if (!fs.existsSync(dir)) {
    cached = []
    return cached
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const careers: Career[] = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
    const { data } = matter(raw)
    careers.push(data as unknown as Career)
  }

  cached = careers
  return cached
}

export function getCareerBySlug(slug: string): Career | null {
  return getAllCareers().find((c) => c.slug === slug) ?? null
}

export function getCareersByDiscipline(disciplineId: string): Career[] {
  return getAllCareers().filter((c) => c.categoryPath.discipline.id === disciplineId)
}

export function getRandomCareers(
  count: number,
  excludeSlugs: string[] = [],
): Career[] {
  const pool = getAllCareers().filter((c) => !excludeSlugs.includes(c.slug))
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, pool.length))
}

export function getRelatedCareers(slug: string): Career[] {
  const career = getCareerBySlug(slug)
  if (!career?.relatedCareers) return []
  return career.relatedCareers
    .map((s) => getCareerBySlug(s))
    .filter((c): c is Career => c !== null)
}
