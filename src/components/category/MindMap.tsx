'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { DisciplineCategory } from '@/types/category'

interface Props {
  discipline: DisciplineCategory
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTreeData(discipline: DisciplineCategory): any {
  return {
    id: discipline.id,
    style: { labelText: discipline.name, fill: discipline.color },
    children: discipline.schools.map((school) => ({
      id: school.id,
      style: { labelText: school.name },
      children: school.majors.map((major) => ({
        id: major.id,
        style: { labelText: major.name },
        children: major.careerSlugs.map((slug) => ({
          id: slug,
          style: {
            labelText: slug.replace(/-/g, ' '),
          },
          data: { isLeaf: true, disciplineColor: discipline.color },
        })),
      })),
    })),
  }
}

const LOADING_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 600,
  color: 'var(--text-secondary)',
}

export function MindMap({ discipline }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<any>(null)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    const initG6 = async () => {
      const G6 = await import('@antv/g6')
      if (!containerRef.current || cancelled) return

      // Destroy previous instance
      try { graphRef.current?.destroy() } catch { /* ignore */ }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const treeData: any = buildTreeData(discipline)
      const width = containerRef.current.clientWidth || 800

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const graph: any = new G6.Graph({
        container: containerRef.current,
        width,
        height: 600,
        autoFit: 'view',
        data: treeData,
        layout: {
          type: 'compact-box',
          direction: 'LR',
          getWidth: () => 150,
          getHeight: () => 36,
          getVGap: () => 8,
          getHGap: () => 80,
        },
        node: {
          type: 'rect',
          style: (d: any) => ({
            size: d.data?.isLeaf ? [130, 32] : [140, 36],
            fill: d.data?.isLeaf ? '#fff' : (d.style?.fill || '#fff'),
            stroke: d.data?.isLeaf ? d.data.disciplineColor : (d.style?.fill || '#ccc'),
            lineWidth: 1.5,
            radius: 6,
            labelText: d.style?.labelText || d.id,
            labelFontSize: 11,
            labelFill: '#333',
            cursor: 'pointer',
          }),
        },
        edge: {
          type: 'cubic-horizontal',
          style: { stroke: '#ccc', lineWidth: 1 },
        },
        behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
      })

      graph.render()
      graphRef.current = graph

      graph.on('node:click', (e: any) => {
        const nodeId = e.target?.id || e.targetId
        if (nodeId && typeof nodeId === 'string') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const model: any = graph.getNodeData?.(nodeId)
          if (model?.data?.isLeaf) {
            router.push(`/career/${nodeId}`)
          }
        }
      })
    }

    initG6()

    return () => {
      cancelled = true
      try { graphRef.current?.destroy() } catch { /* ignore */ }
    }
  }, [discipline, router])

  return (
    <div ref={containerRef} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden" style={{ minHeight: 600 }}>
      <div style={LOADING_STYLE}>加载思维导图...</div>
    </div>
  )
}
