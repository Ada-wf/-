'use client'

import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchBox({ placeholder = '搜索职业...', className = '' }: { placeholder?: string; className?: string }) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }, [query, router])

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
      />
    </form>
  )
}
