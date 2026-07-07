import type { MetadataRoute } from "next";
import { getAllCareers } from "@/lib/careers";
import { getAllDisciplines } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL || "https://求职城市网.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  const disciplinePages: MetadataRoute.Sitemap = getAllDisciplines().map((d) => ({
    url: `${siteUrl}/categories/${d.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const careerPages: MetadataRoute.Sitemap = getAllCareers().map((c) => ({
    url: `${siteUrl}/career/${c.slug}`,
    lastModified: c.metadata?.updatedAt ? new Date(c.metadata.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...disciplinePages, ...careerPages];
}
