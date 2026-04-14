"use client"

/**
 * Blogs (desktop/mobile window)
 * Lists MDX posts. Post metadata is read on the server in
 * app/page.tsx (via lib/posts.ts) and passed down as a prop so
 * this component can stay a client component — consistent with
 * every other section inside the macOS-style window shell.
 *
 * Clicking a post navigates to /blog/[slug] for the full article.
 */

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { PostMeta } from "@/lib/posts"

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export default function Blogs({
  posts,
  compact = false,
}: {
  posts: PostMeta[]
  compact?: boolean
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={compact ? "px-6 py-6" : "py-20 px-6"}
    >
      <div className="flex items-baseline justify-between mb-5">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          Writing
        </p>
        <Link
          href="/blog"
          className="font-mono text-[10px] uppercase tracking-[0.1em] hover:text-white transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          View all →
        </Link>
      </div>

      <div>
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start justify-between gap-4 py-3.5"
              style={{
                borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
                borderBottom: "1px solid var(--separator)",
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors leading-snug mb-1">
                  {post.title}
                </p>
                <p className="text-[11px] leading-relaxed line-clamp-1" style={{ color: "var(--text-muted)" }}>
                  {post.description}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-none mt-0.5">
                <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: "var(--text-faint)" }}>
                  {formatDate(post.date)}
                </span>
                <ArrowUpRight
                  size={12}
                  className="opacity-0 group-hover:opacity-50 transition-opacity"
                  style={{ color: "white" }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
