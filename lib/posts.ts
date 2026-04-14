/**
 * lib/posts.ts
 * ─────────────────────────────────────────────────────────────
 * Filesystem-backed blog index. Reads .mdx files from /content/blog,
 * parses frontmatter with gray-matter, and exposes two helpers:
 *
 *   getAllPosts()        → metadata for every post, newest first
 *   getPostBySlug(slug)  → metadata + raw MDX source for one post
 *
 * Everything runs at build/request time on the server — do NOT
 * import this module from a "use client" component.
 * ─────────────────────────────────────────────────────────────
 */

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { cache } from "react"

const POSTS_DIR = path.join(process.cwd(), "content", "blog")

export interface PostFrontmatter {
  title: string
  date: string         // ISO-8601 date string, e.g. "2026-03-08"
  description: string
  tags: string[]
}

export interface PostMeta extends PostFrontmatter {
  slug: string
}

export interface Post extends PostMeta {
  /** Raw MDX source — pass to <MDXRemote source={…} /> for rendering. */
  content: string
}

/** Strip the .mdx extension and return just the filename. */
function slugFromFile(filename: string): string {
  return filename.replace(/\.mdx$/, "")
}

/** Cheap runtime check so bad frontmatter fails loudly at build. */
function assertFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  const { title, date, description, tags } = data
  if (typeof title !== "string")       throw new Error(`[${slug}] missing "title"`)
  if (typeof date !== "string")        throw new Error(`[${slug}] missing "date"`)
  if (typeof description !== "string") throw new Error(`[${slug}] missing "description"`)
  if (!Array.isArray(tags))            throw new Error(`[${slug}] "tags" must be an array`)
  return { title, date, description, tags: tags.map(String) }
}

/** List every post's metadata, newest first. Wrapped in `react/cache` so
 *  repeated calls during the same render pass only hit the filesystem once. */
export const getAllPosts = cache((): PostMeta[] => {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"))

  const posts = files.map((file) => {
    const slug = slugFromFile(file)
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8")
    const { data } = matter(raw)
    return { slug, ...assertFrontmatter(data, slug) }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
})

/** Load a single post (metadata + raw MDX body) by slug. Returns null if missing. */
export const getPostBySlug = cache((slug: string): Post | null => {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  return { slug, content, ...assertFrontmatter(data, slug) }
})
