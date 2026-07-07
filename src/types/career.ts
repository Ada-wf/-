// URL slug
export interface Career {
  slug: string
  name: string
  nameEn?: string
  tagline: string
  categoryPath: {
    discipline: { id: string; name: string }
    school: { id: string; name: string }
    major: { id: string; name: string }
  }
  conceptImage: {
    url: string
    alt: string
    source: 'manual' | 'ai-generated'
    generatedAt?: string
  }
  overview: string
  responsibilities: string[]
  typicalDay?: string
  suggestion: {
    personalityFit: string[]
    skillsRequired: string[]
    summary: string
    notForYou?: string
  }
  salaryRange?: {
    junior: string
    senior: string
    source: string
  }
  educationRequired?: '高中' | '大专' | '本科' | '硕士' | '博士'
  industryOutlook?: 'growth' | 'stable' | 'declining' | 'emerging'
  certifications?: string[]
  relatedCareers?: string[]
  tags: string[]
  source: 'curated' | 'ai-generated'
  generatedAt?: string
  verifiedAt?: string
  metadata: {
    createdAt: string
    updatedAt: string
    viewCount?: number
    feedbackScore?: number
  }
}
