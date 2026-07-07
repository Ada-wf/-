import { notFound } from 'next/navigation'
import { getDisciplineById, getAllDisciplines } from '@/lib/categories'
import { MindMapWrapper } from './MindMapWrapper'
import { CategoryBreadcrumb } from '@/components/category/CategoryBreadcrumb'

export async function generateStaticParams() {
  return getAllDisciplines().map((d) => ({ discipline: d.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ discipline: string }> }) {
  const { discipline: id } = await params
  const d = getDisciplineById(id)
  if (!d) return { title: '未找到' }
  return { title: d.name + ' — 求职城市网', description: d.description }
}

export default async function DisciplinePage({ params }: { params: Promise<{ discipline: string }> }) {
  const { discipline: id } = await params
  const discipline = getDisciplineById(id)
  if (!discipline) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CategoryBreadcrumb items={[
        { label: '首页', href: '/' },
        { label: '学科分类', href: '/categories' },
        { label: discipline.name },
      ]} />

      <h1 className="text-3xl md:text-4xl font-bold mb-2">{discipline.name}</h1>
      <p className="text-lg text-[var(--text-secondary)] mb-8">{discipline.description}</p>

      <MindMapWrapper discipline={discipline} />
    </div>
  )
}
