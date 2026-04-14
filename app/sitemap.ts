/**
 * Sitemap for search engines. Lists the home page, the blog index, and
 * every MDX post. Set NEXT_PUBLIC_SITE_URL in .env.local / production env
 * so URLs are absolute (falls back to localhost for dev).
 */
import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }))

  return [
    { url: `${BASE_URL}/`,     changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly",  priority: 0.8 },
    ...posts,
  ]
}
