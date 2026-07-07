'use client'

import { CareerCard } from './CareerCard'
import type { Career } from '@/types/career'

interface CareerCardGridProps {
  careers: Career[]
  onRefresh?: () => void
  loading?: boolean
}

export function CareerCardGrid({ careers, onRefresh, loading }: CareerCardGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--text-secondary)]">
        加载中...
      </div>
    )
  }

  if (careers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-secondary)]">暂未找到匹配的职业</p>
      </div>
    )
  }

  return (
    <div>
      {onRefresh && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
          >
            换一批
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {careers.map((career) => (
          <CareerCard key={career.slug} career={career} />
        ))}
      </div>
    </div>
  )
}
