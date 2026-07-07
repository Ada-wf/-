'use client'

import { useState, useCallback } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
  query: string
}

type AIStatus = 'idle' | 'searching' | 'generating_text' | 'reviewing' | 'generating_image' | 'done' | 'error'

const statusMessages: Record<AIStatus, string> = {
  idle: '',
  searching: '正在搜索网络信息...',
  generating_text: 'AI 正在整理职业描述...',
  reviewing: '正在审核内容质量...',
  generating_image: '正在生成职业概念图...',
  done: '',
  error: '',
}

export function AIGeneratePanel({ query }: Props) {
  const [status, setStatus] = useState<AIStatus>('idle')
  const [result, setResult] = useState<{ slug: string; name: string; tagline: string; imageUrl?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    setStatus('searching')
    setError(null)

    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || '生成失败')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventType = line.slice(7).trim()
            if (eventType === 'error') setStatus('error')
            else if (Object.keys(statusMessages).includes(eventType)) {
              setStatus(eventType as AIStatus)
            }
          }
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.status === 'done' && data.pageUrl) {
                setResult({ slug: data.slug, name: data.career?.name || query, tagline: data.career?.tagline || '', imageUrl: data.imageUrl })
              }
              if (data.error) {
                setError(data.error.message)
                setStatus('error')
              }
            } catch { /* skip partial JSON */ }
          }
        }
      }

      setStatus('done')
    } catch (err: any) {
      setError(err.message || '生成失败，请稍后再试')
      setStatus('error')
    }
  }, [query])

  if (result && status === 'done') {
    return (
      <div className="rounded-xl bg-[var(--surface)] border border-green-200 dark:border-green-800/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">AI 已为你生成</span>
        </div>
        <Link href={`/career/${result.slug}`} className="block rounded-lg bg-[var(--border)]/30 p-4 hover:bg-[var(--border)]/50 transition-colors">
          <p className="font-medium mb-1">{result.name}</p>
          <p className="text-sm text-[var(--text-secondary)] mb-2">{result.tagline}</p>
          <span className="text-sm text-[var(--color-primary)]">查看详情 →</span>
        </Link>
        <p className="text-xs text-[var(--text-secondary)] mt-3">
          此职业已加入站内数据库，下次搜索可直接找到
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-[var(--surface)] border border-red-200 dark:border-red-800/30 p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-2 font-medium">生成失败</p>
        <p className="text-sm text-[var(--text-secondary)] mb-3">{error}</p>
        <button onClick={() => { setStatus('idle'); setError(null) }} className="text-sm text-[var(--color-primary)] hover:underline">
          重试
        </button>
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6 text-center">
        <Sparkles className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" />
        <p className="font-medium mb-1">暂无此职业</p>
        <p className="text-sm text-[var(--text-secondary)] mb-4">让 AI 帮你搜索网络信息，自动生成职业介绍</p>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-4 h-4" />
          让 AI 帮你查找
        </button>
        <p className="text-xs text-[var(--text-secondary)] mt-3">每天限 3 次 AI 生成</p>
      </div>
    )
  }

  // Generating states
  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
        <span className="font-medium">{statusMessages[status]}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
          style={{
            width: status === 'searching' ? '25%' :
                   status === 'generating_text' ? '50%' :
                   status === 'reviewing' ? '65%' :
                   status === 'generating_image' ? '85%' : '0%'
          }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-[var(--text-secondary)]">
        <span>{status === 'searching' ? '🔍 搜索网络' : status === 'generating_text' ? '🤖 整理内容' : status === 'reviewing' ? '🔎 审核' : status === 'generating_image' ? '🎨 生成图片' : ''}</span>
        <span>{status === 'searching' ? '25%' : status === 'generating_text' ? '50%' : status === 'reviewing' ? '65%' : status === 'generating_image' ? '85%' : ''}</span>
      </div>
    </div>
  )
}
