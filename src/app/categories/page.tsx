import Link from 'next/link'
import { getAllDisciplines } from '@/lib/categories'
import type { DisciplineCategory } from '@/types/category'

const iconMap: Record<string, string> = {
  'flask-conical': '🧪', 'wrench': '⚙️', 'stethoscope': '🏥', 'briefcase': '💼',
  'book-open': '📖', 'users': '👥', 'scale': '⚖️', 'palette': '🎨',
  'trending-up': '📈', 'graduation-cap': '🎓', 'sprout': '🌱', 'git-branch': '🔀',
}

function getSchoolNames(d: DisciplineCategory): string {
  return d.schools.map(s => s.name).slice(0, 5).join(' · ') + (d.schools.length > 5 ? ' ...' : '')
}

function countCareers(d: DisciplineCategory): number {
  return d.schools.reduce((sum, s) =>
    sum + s.majors.reduce((mSum, m) => mSum + m.careerSlugs.length, 0), 0
  )
}

export default function CategoriesPage() {
  const disciplines = getAllDisciplines()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text)]">首页</Link>
        <span className="mx-2">/</span>
        <span>学科分类</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-2">学科分类</h1>
      <p className="text-lg text-[var(--text-secondary)] mb-10">
        基于清华大学学科体系，按 12 大学科门类浏览 400+ 个职业
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {disciplines.map((d) => {
          const count = countCareers(d)
          return (
            <Link
              key={d.id}
              href={`/categories/${d.id}`}
              className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5 hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{iconMap[d.icon] ?? '📚'}</span>
                <div>
                  <h2 className="text-lg font-bold group-hover:text-[var(--color-primary)] transition-colors">
                    {d.name}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">{count} 个职业</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-2">{d.description}</p>
              <p className="text-xs text-[var(--text-secondary)]/70">{getSchoolNames(d)}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
