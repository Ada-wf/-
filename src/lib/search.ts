import { getAllCareers } from './careers'
import Fuse from 'fuse.js'

export interface SearchResult {
  career: import('@/types/career').Career
  score: number
}

let fuseInstance: Fuse<import('@/types/career').Career> | null = null

function getFuse() {
  if (!fuseInstance) {
    const careers = getAllCareers()
    fuseInstance = new Fuse(careers, {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'tagline', weight: 0.2 },
        { name: 'tags', weight: 0.2 },
        { name: 'overview', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
    })
  }
  return fuseInstance
}

export function searchCareers(
  query: string,
  options?: { limit?: number },
): SearchResult[] {
  if (!query.trim()) return []
  const fuse = getFuse()
  const results = fuse.search(query)
  const limit = options?.limit ?? 10
  return results.slice(0, limit).map((r) => ({
    career: r.item,
    score: r.score ?? 1,
  }))
}

export function resetSearchIndex() {
  fuseInstance = null
}
