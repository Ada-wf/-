import Image from "next/image";
import Link from "next/link";
import type { Career } from "@/types/career";

interface CareerCardProps {
  career: Career;
}

export function CareerCard({ career }: CareerCardProps) {
  return (
    <Link href={`/career/${career.slug}`} className="career-card block">
      <div className="relative career-card__image bg-[var(--border)]">
        {career.conceptImage.url ? (
          <Image
            src={career.conceptImage.url}
            alt={career.conceptImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--text-secondary)] text-sm">
            {career.name}
          </div>
        )}
      </div>
      <div className="career-card__body">
        <h3 className="career-card__title">{career.name}</h3>
        <p className="career-card__tagline">{career.tagline}</p>
        {career.salaryRange && (
          <p className="career-card__salary">
            {career.salaryRange.junior} ~ {career.salaryRange.senior}
          </p>
        )}
        <div className="career-card__tags">
          {career.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="career-card__tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
