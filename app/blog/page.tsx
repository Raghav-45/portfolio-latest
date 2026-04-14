/**
 * /blog — listing page
 * Lists every MDX post in /content/blog, newest first.
 * Reuses the portfolio's typography so the page feels continuous
 * with the rest of the site.
 */

import Link from "next/link"
import { ArrowUpRight, ArrowLeft } from "lucide-react"
import { getAllPosts } from "@/lib/posts"

export const metadata = {
  title: "Writing",
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <main className="desktop-bg min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest mb-10 hover:text-white transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={11} /> Home
        </Link>

        <p
          className="font-mono text-[10px] uppercase tracking-[0.14em] mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Writing
        </p>
        <h1 className="text-[28px] font-semibold text-white mb-10">All posts</h1>

        {posts.length === 0 ? (
          <div
            className="py-16 px-6 text-center rounded-lg"
            style={{ border: "1px dashed var(--separator)", color: "var(--text-muted)" }}
          >
            <p className="text-[13px] mb-2" style={{ color: "var(--text-secondary)" }}>No posts yet.</p>
            <p className="font-mono text-[11px]">
              Drop an <code className="text-white/70">.mdx</code> file into{" "}
              <code className="text-white/70">/content/blog</code> and it&apos;ll appear here.
            </p>
          </div>
        ) : (
        <div>
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start justify-between gap-4 py-4"
              style={{
                borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
                borderBottom: "1px solid var(--separator)",
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-white/85 group-hover:text-white transition-colors leading-snug mb-1">
                  {post.title}
                </p>
                <p className="text-[12px] leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
                      style={{
                        color: "var(--text-muted)",
                        border: "1px solid var(--widget-border)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
          ))}
        </div>
        )}
      </div>
    </main>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}
