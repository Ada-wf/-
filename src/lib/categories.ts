import fs from "node:fs";
import path from "node:path";
import { load } from "js-yaml";
import type { DisciplineCategory, CategoryIndex } from "@/types/category";

let cached: DisciplineCategory[] | null = null;

function loadCategories(): DisciplineCategory[] {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "content/categories/tsinghua-categories.yaml");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = load(raw) as CategoryIndex;
  cached = data.disciplines;
  return cached;
}

export function getAllDisciplines(): DisciplineCategory[] {
  return loadCategories();
}

export function getDisciplineById(id: string): DisciplineCategory | null {
  return loadCategories().find((d) => d.id === id) ?? null;
}

export function getSchoolsByDiscipline(disciplineId: string) {
  const d = getDisciplineById(disciplineId);
  return d?.schools ?? [];
}

export function getMajorsBySchool(schoolId: string) {
  for (const d of loadCategories()) {
    const school = d.schools.find((s) => s.id === schoolId);
    if (school) return school.majors;
  }
  return [];
}

export function getCareersByMajor(majorId: string): string[] {
  for (const d of loadCategories()) {
    for (const s of d.schools) {
      const major = s.majors.find((m) => m.id === majorId);
      if (major) return major.careerSlugs;
    }
  }
  return [];
}
