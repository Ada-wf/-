"use client";

import { useState, useCallback, useMemo } from "react";
import { CareerCardGrid } from "@/components/home/CareerCardGrid";
import { CategoryFilter } from "@/components/home/CategoryFilter";
import type { Career } from "@/types/career";
import type { DisciplineCategory } from "@/types/category";

interface HomeClientProps {
  disciplines: DisciplineCategory[];
  careers: Career[];
}

export function HomeClient({ disciplines, careers }: HomeClientProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);

  const filteredCareers = useMemo(() => {
    if (selectedDiscipline) {
      return careers.filter((c) => c.categoryPath.discipline.id === selectedDiscipline);
    }
    return careers;
  }, [careers, selectedDiscipline]);

  const [shuffledCareers, setShuffledCareers] = useState<Career[]>(() => {
    const shuffled = [...filteredCareers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  });

  const handleRefresh = useCallback(() => {
    const shuffled = [...filteredCareers].sort(() => Math.random() - 0.5);
    setShuffledCareers(shuffled.slice(0, 12));
  }, [filteredCareers]);

  const handleDisciplineChange = useCallback((id: string | null) => {
    setSelectedDiscipline(id);
    // Auto-refresh on discipline change
    const filtered = id
      ? careers.filter((c) => c.categoryPath.discipline.id === id)
      : careers;
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setShuffledCareers(shuffled.slice(0, 12));
  }, [careers]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            探索你的<span className="text-[var(--color-primary)]">职业城市</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            基于清华大学学科体系，发现 400+ 职业的精彩世界
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <CategoryFilter
            disciplines={disciplines}
            selected={selectedDiscipline}
            onSelect={handleDisciplineChange}
          />
        </div>
        <CareerCardGrid
          careers={shuffledCareers}
          onRefresh={handleRefresh}
          loading={false}
        />
      </section>
    </div>
  );
}
