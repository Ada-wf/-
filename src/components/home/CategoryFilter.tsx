"use client";

import type { DisciplineCategory } from "@/types/category";

interface CategoryFilterProps {
  disciplines: DisciplineCategory[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilter({ disciplines, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-[var(--text)]"
        }`}
      >
        全部
      </button>
      {disciplines.map((d) => (
        <button
          key={d.id}
          onClick={() => onSelect(d.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === d.id
              ? "text-white"
              : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-[var(--text)]"
          }`}
          style={selected === d.id ? { backgroundColor: d.color } : undefined}
        >
          {d.name}
        </button>
      ))}
    </div>
  );
}
