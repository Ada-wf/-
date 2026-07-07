import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { AIGeneratePanel } from '@/components/search/AIGeneratePanel'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { searchCareers } from '@/lib/search'
import { SearchX } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '搜索职业 — 求职城市网',
  description: '搜索你感兴趣的职业',
}

function SearchResults({ query }: { query: string }) {
  const results = searchCareers(query, { limit: 10 })

  if (results.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={SearchX}
          title={`未找到 "${query}"`}
          description="站内暂无此职业，你可以让 AI 帮你生成一个"
          action={null}
        />
        <AIGeneratePanel query={query} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">
        找到 <strong className="text-[var(--text)]">{results.length}</strong> 个与 &ldquo;{query}&rdquo; 相关的职业
      </p>
      {results.map((r) => (
        <SearchResultCard key={r.career.slug} career={r.career} score={1 - r.score} />
      ))}

      {/* AI generation entry for low-match results */}
      {results.length < 5 && (
        <div className="pt-6 mt-6 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-secondary)] mb-4">没找到想要的？试试 AI 智能生成</p>
          <AIGeneratePanel query={query} />
        </div>
      )}
    </div>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text)]">首页</Link>
        <span className="mx-2">/</span>
        <span>搜索</span>
      </nav>

      {/* Search form for SSR fallback */}
      <form action="/search" method="GET" className="mb-8">
        <div className="relative">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="搜索你感兴趣的职业..."
            autoFocus={!q}
            className="w-full pl-4 pr-12 py-3 text-base rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
            搜索
          </button>
        </div>
      </form>

      {q ? (
        <Suspense fallback={<LoadingSpinner text="搜索中..." />}>
          <SearchResults query={q} />
        </Suspense>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-[var(--text-secondary)]">输入职业名称开始搜索</p>
          <p className="text-sm text-[var(--text-secondary)]/70 mt-2">例如：软件工程师、医生、数据科学家</p>
        </div>
      )}
    </div>
  )
}
