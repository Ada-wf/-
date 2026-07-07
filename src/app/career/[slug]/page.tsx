import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCareerBySlug, getAllCareers } from "@/lib/careers";
import { getRelatedCareers } from "@/lib/careers";

export async function generateStaticParams() {
  return getAllCareers().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = getCareerBySlug(slug);
  if (!career) return { title: "未找到" };
  return { title: career.name + " — 求职城市网", description: career.tagline };
}

const outlookLabels: Record<string, string> = {
  growth: "成长型", stable: "稳定型", declining: "衰退型", emerging: "新兴领域",
};

const outlookColors: Record<string, string> = {
  growth: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  stable: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  declining: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  emerging: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default async function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = getCareerBySlug(slug);
  if (!career) notFound();
  const related = getRelatedCareers(slug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text)]">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-[var(--text)]">{career.categoryPath.discipline.name}</Link>
        <span className="mx-2">/</span>
        <span>{career.name}</span>
      </nav>

      <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-xl overflow-hidden bg-[var(--border)] mb-8">
        {career.conceptImage.url ? (
          <Image src={career.conceptImage.url} alt={career.conceptImage.alt} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 800px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl text-[var(--text-secondary)]">{career.name}</div>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-2">{career.name}</h1>
      {career.nameEn && <p className="text-lg text-[var(--text-secondary)] mb-2">{career.nameEn}</p>}
      <p className="text-lg text-[var(--text-secondary)] mb-6">{career.tagline}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {career.salaryRange && (
          <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--text-secondary)] mb-1">薪资范围</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">{career.salaryRange.junior} ~ {career.salaryRange.senior}</p>
          </div>
        )}
        {career.educationRequired && (
          <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--text-secondary)] mb-1">学历要求</p>
            <p className="text-sm font-semibold">{career.educationRequired}</p>
          </div>
        )}
        {career.industryOutlook && (
          <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--text-secondary)] mb-1">行业前景</p>
            <span className={"inline-block text-xs font-medium px-2 py-0.5 rounded " + (outlookColors[career.industryOutlook] || "")}>
              {outlookLabels[career.industryOutlook] || career.industryOutlook}
            </span>
          </div>
        )}
        {career.certifications && career.certifications.length > 0 && (
          <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--text-secondary)] mb-1">相关证书</p>
            <p className="text-xs leading-relaxed">{career.certifications.slice(0, 2).join("、")}</p>
            {career.certifications.length > 2 && <p className="text-xs text-[var(--text-secondary)] mt-1">+{career.certifications.length - 2} 个</p>}
          </div>
        )}
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">工作概述</h2>
        <div className="text-[var(--text)] leading-relaxed whitespace-pre-line">{career.overview}</div>
      </section>

      {career.responsibilities.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">主要职责</h2>
          <ul className="space-y-2">
            {career.responsibilities.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm"><span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />{r}</li>
            ))}
          </ul>
        </section>
      )}

      {career.typicalDay && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">典型的一天</h2>
          <p className="text-sm text-[var(--text)] leading-relaxed">{career.typicalDay}</p>
        </section>
      )}

      {career.suggestion && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">选择建议</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm mb-3">适合的性格特质</h3>
              <ul className="space-y-2">{career.suggestion.personalityFit.map((p, i) => (<li key={i} className="flex gap-2 text-sm"><span>✓</span>{p}</li>))}</ul>
            </div>
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm mb-3">需要的能力/技能</h3>
              <ul className="space-y-2">{career.suggestion.skillsRequired.map((s, i) => (<li key={i} className="flex gap-2 text-sm"><span>⚡</span>{s}</li>))}</ul>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5">
            <h3 className="font-semibold text-sm mb-2">适合人群</h3>
            <p className="text-sm leading-relaxed">{career.suggestion.summary}</p>
            {career.suggestion.notForYou && (
              <><h3 className="font-semibold text-sm mb-2 mt-4">可能不适合的情况</h3><p className="text-sm leading-relaxed text-[var(--text-secondary)]">{career.suggestion.notForYou}</p></>
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">相似职业</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {related.map((r) => (
              <Link key={r.slug} href={"/career/" + r.slug} className="rounded-lg bg-[var(--surface)] border border-[var(--border)] p-3 text-sm hover:border-[var(--color-primary)]/30 transition-colors">
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{r.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {career.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-10">
          {career.tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]">{tag}</span>
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--text-secondary)] border-t border-[var(--border)] pt-4">
        所属学科: {career.categoryPath.discipline.name} / {career.categoryPath.school.name} / {career.categoryPath.major.name}
      </p>
    </div>
  );
}