'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronDown, GraduationCap, Building2, Briefcase } from 'lucide-react'
import type { DisciplineCategory } from '@/types/category'

interface Props {
  discipline: DisciplineCategory
}

export function CategoryTree({ discipline }: Props) {
  const router = useRouter()
  const [expandedSchools, setExpandedSchools] = useState<Set<string>>(new Set())
  const [expandedMajors, setExpandedMajors] = useState<Set<string>>(new Set())

  const toggleSchool = (id: string) => {
    setExpandedSchools(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleMajor = (id: string) => {
    setExpandedMajors(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-1">
      {/* Root */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-bold text-base"
        style={{ backgroundColor: discipline.color + '15', color: discipline.color }}>
        <span>{discipline.name}</span>
        <span className="text-xs opacity-70">({discipline.schools.length} 个学院)</span>
      </div>

      {discipline.schools.map((school) => (
        <div key={school.id} className="ml-3">
          {/* School */}
          <button
            onClick={() => toggleSchool(school.id)}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-left font-medium text-sm hover:bg-[var(--border)]/30 transition-colors"
          >
            {expandedSchools.has(school.id)
              ? <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
              : <ChevronRight className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
            }
            <Building2 className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
            <span>{school.name}</span>
            <span className="text-xs text-[var(--text-secondary)] ml-auto">{school.majors.length} 个专业</span>
          </button>

          {expandedSchools.has(school.id) && school.majors.map((major) => (
            <div key={major.id} className="ml-4">
              {/* Major */}
              <button
                onClick={() => toggleMajor(major.id)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm hover:bg-[var(--border)]/30 transition-colors"
              >
                {expandedMajors.has(major.id)
                  ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-[var(--text-secondary)]" />
                  : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--text-secondary)]" />
                }
                <GraduationCap className="w-3.5 h-3.5 shrink-0 text-[var(--text-secondary)]" />
                <span>{major.name}</span>
                <span className="text-xs text-[var(--text-secondary)] ml-auto">{major.careerSlugs.length} 职业</span>
              </button>

              {expandedMajors.has(major.id) && major.careerSlugs.map((slug) => (
                <button
                  key={slug}
                  onClick={() => router.push(`/career/${slug}`)}
                  className="flex items-center gap-2 w-full px-3 py-2 ml-4 rounded-lg text-left text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
                >
                  <Briefcase className="w-3 h-3 shrink-0" />
                  <span className="capitalize">{slug.replace(/-/g, ' ')}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
