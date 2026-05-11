/**
 * Sitemap for search engines. Lists the home page, the blog index, every
 * MDX post, and every project detail route. URL host comes from the shared
 * SITE_URL constant so it never drifts from layout.tsx / robots.ts.
 *
 * Every entry includes a `lastModified` date so Google treats the pages
 * as having known freshness — entries without it get deprioritised.
 */
import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts"
import { SITE_URL } from "@/lib/site-url"
import { projects } from "@/config/projects"
import { slugifyProject } from "@/lib/project-slug"

export default function sitemap(): MetadataRoute.Sitemap {
  // Use the build date as a reasonable "last modified" for config-driven pages.
  const now = new Date()

  const posts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const projectEntries = [...projects.personal, ...projects.client].map((p) => ({
    url: `${SITE_URL}/projects/${slugifyProject(p.title)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    { url: `${SITE_URL}/`,           lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/projects`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/experience`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/resume`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,    lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    ...projectEntries,
    ...posts,
  ]
}
