import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts"
import { SITE_URL } from "@/lib/site-url"
import { projects } from "@/config/projects"
import { slugifyProject } from "@/lib/project-slug"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const projectEntries = [...projects.personal, ...projects.client].map((p) => ({
    url: `${SITE_URL}/projects/${slugifyProject(p.title)}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    { url: `${SITE_URL}/`,           changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/projects`,   changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`,       changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/experience`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/resume`,     changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,    changeFrequency: "yearly",  priority: 0.5 },
    ...projectEntries,
    ...posts,
  ]
}
