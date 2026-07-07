import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function CategoryBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="text-sm text-[var(--text-secondary)] mb-6">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--text)] transition-colors">{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
