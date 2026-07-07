import Link from 'next/link'
import type { Career } from '@/types/career'

export function SearchResultCard({ career, score }: { career: Career; score?: number }) {
  return (
    <Link
      href={`/career/${career.slug}`}
      className="block rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg bg-[var(--border)] overflow-hidden shrink-0">
          {career.conceptImage.url && (
            <img
              src={career.conceptImage.url}
              alt={career.conceptImage.alt}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold group-hover:text-[var(--color-primary)] transition-colors">{career.name}</h3>
            {career.source === 'ai-generated' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">AI</span>
            )}
            {score !== undefined && score > 0.9 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">高匹配</span>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">{career.tagline}</p>
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span>{career.categoryPath.discipline.name} / {career.categoryPath.school.name}</span>
            {career.salaryRange && <span>{career.salaryRange.junior} ~ {career.salaryRange.senior}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
