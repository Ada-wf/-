'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu } from 'lucide-react'
import { useState, useCallback } from 'react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }, [searchQuery, router])

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-[var(--color-primary)]">求职城市网</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          <Link href="/categories" className="hover:text-[var(--text)] transition-colors">
            分类浏览
          </Link>
          <Link href="/search" className="hover:text-[var(--text)] transition-colors">
            搜索职业
          </Link>
        </nav>

        {/* Search (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索职业..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
        </form>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 space-y-3">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(e); setMenuOpen(false) }} className="relative w-full mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="搜索职业..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </form>
          <Link
            href="/categories"
            className="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]"
            onClick={() => setMenuOpen(false)}
          >
            分类浏览
          </Link>
          <Link
            href="/search"
            className="block py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]"
            onClick={() => setMenuOpen(false)}
          >
            搜索职业
          </Link>
        </div>
      )}
    </header>
  )
}
