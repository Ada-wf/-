import { defineConfig, s } from 'velite'

export default defineConfig({
  root: 'content',
  collections: {
    careers: {
      name: 'Career',
      pattern: 'careers/**/*.md',
      schema: s.object({
        slug: s.string(),
        name: s.string(),
        nameEn: s.string().optional(),
        tagline: s.string(),
        categoryPath: s.object({
          discipline: s.object({ id: s.string(), name: s.string() }),
          school: s.object({ id: s.string(), name: s.string() }),
          major: s.object({ id: s.string(), name: s.string() }),
        }),
        conceptImage: s.object({
          url: s.string(),
          alt: s.string(),
          source: s.enum(['manual', 'ai-generated']),
          generatedAt: s.string().optional(),
        }),
        overview: s.string(),
        responsibilities: s.array(s.string()),
        typicalDay: s.string().optional(),
        suggestion: s.object({
          personalityFit: s.array(s.string()),
          skillsRequired: s.array(s.string()),
          summary: s.string(),
          notForYou: s.string().optional(),
        }),
        salaryRange: s.object({
          junior: s.string(),
          senior: s.string(),
          source: s.string(),
        }).optional(),
        educationRequired: s.enum(['高中', '大专', '本科', '硕士', '博士']).optional(),
        industryOutlook: s.enum(['growth', 'stable', 'declining', 'emerging']).optional(),
        certifications: s.array(s.string()).optional(),
        relatedCareers: s.array(s.string()).optional(),
        tags: s.array(s.string()),
        source: s.enum(['curated', 'ai-generated']),
        generatedAt: s.string().optional(),
        verifiedAt: s.string().optional(),
        metadata: s.object({
          createdAt: s.string(),
          updatedAt: s.string(),
          viewCount: s.number().optional(),
          feedbackScore: s.number().optional(),
        }),
      }),
    },
  },
})
