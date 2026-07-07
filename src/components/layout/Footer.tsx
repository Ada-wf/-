import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text)]">求职城市网</span>
            <span className="hidden sm:inline">·</span>
            <span>探索你的职业城市</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/categories" className="hover:text-[var(--text)] transition-colors">
              分类浏览
            </Link>
            <Link href="/search" className="hover:text-[var(--text)] transition-colors">
              搜索
            </Link>
          </nav>
          <div className="text-xs">
            © {new Date().getFullYear()} 求职城市网 · 数据仅供参考
          </div>
        </div>
      </div>
    </footer>
  )
}
