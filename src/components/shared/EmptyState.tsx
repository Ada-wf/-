import { SearchX } from 'lucide-react'

export function EmptyState({
  icon: Icon = SearchX,
  title = '暂无内容',
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon className="w-12 h-12 text-[var(--text-secondary)]/40 mb-4" />
      <p className="text-[var(--text-secondary)] font-medium mb-1">{title}</p>
      {description && (
        <p className="text-sm text-[var(--text-secondary)]/70 max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
