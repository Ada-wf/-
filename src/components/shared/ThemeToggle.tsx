'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggle = () => {
    setDark(!dark)
    if (dark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <button onClick={toggle} className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors" aria-label="切换暗色模式">
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
