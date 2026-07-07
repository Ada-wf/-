export interface DisciplineCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  schools: School[]
}

export interface School {
  id: string
  name: string
  disciplineId: string
  majors: Major[]
}

export interface Major {
  id: string
  name: string
  schoolId: string
  description: string
  careerSlugs: string[]
}

export interface CategoryIndex {
  disciplines: DisciplineCategory[]
}
