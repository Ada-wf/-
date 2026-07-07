import { type NextRequest, NextResponse } from 'next/server'
import { searchCareers } from '@/lib/search'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') ?? '10', 10)

  if (!q) {
    return NextResponse.json({ error: { code: 'MISSING_PARAM', message: '缺少 q 参数' } }, { status: 400 })
  }

  if (q.trim().length < 2) {
    return NextResponse.json({ error: { code: 'QUERY_TOO_SHORT', message: '搜索词至少 2 个字符' } }, { status: 400 })
  }

  const results = searchCareers(q.trim(), { limit })
  const found = results.length > 0

  // Generate suggestions when no exact match
  let suggestions: string[] = []
  if (!found || results.length < 3) {
    const allResults = searchCareers(q.trim(), { limit: 5 })
    suggestions = allResults.map(r => r.career.name)
  }

  return NextResponse.json({
    query: q,
    found: results.length > 0,
    results: results.map(r => ({
      slug: r.career.slug,
      name: r.career.name,
      tagline: r.career.tagline,
      conceptImage: r.career.conceptImage,
      categoryPath: r.career.categoryPath,
      tags: r.career.tags,
      salaryRange: r.career.salaryRange,
      source: r.career.source,
      score: Math.round((1 - r.score) * 100) / 100,
    })),
    totalResults: results.length,
    suggestions: suggestions.filter(s => !results.find(r => r.career.name === s)),
    aiGenerateAvailable: true,
  })
}
