'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { DisciplineCategory } from '@/types/category'

const MindMap = dynamic(() => import('@/components/category/MindMap').then(m => ({ default: m.MindMap })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[600px] text-[var(--text-secondary)]">加载思维导图...</div>,
})

const CategoryTree = dynamic(() => import('@/components/category/CategoryTree').then(m => ({ default: m.CategoryTree })), {
  ssr: false,
  loading: () => <div className="py-10 text-center text-[var(--text-secondary)]">加载中...</div>,
})

export function MindMapWrapper({ discipline }: { discipline: DisciplineCategory }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (isMobile) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-[var(--text-secondary)] mb-3">点击展开/收起，点击职业名称查看详情</p>
        <CategoryTree discipline={discipline} />
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-[var(--text-secondary)] mb-3">💡 点击节点展开/收起 | 滚轮缩放 | 拖拽平移 | 点击职业名查看详情</p>
      <MindMap discipline={discipline} />
    </div>
  )
}
