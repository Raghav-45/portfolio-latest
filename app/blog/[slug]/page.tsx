/**
 * /blog/[slug] — post rendering page
 * Renders one MDX file through next-mdx-remote/rsc, using the
 * shared mdxComponents for consistent typography.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { mdxComponents } from "@/app/components/MDXComponents"

// rehype-pretty-code runs at build time via Shiki — zero runtime cost, every
// code fence in every .mdx file gets proper token colouring.
const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark-dimmed",
  keepBackground: true,
}

// Statically generate every post at build time.
export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }))
}

// Per-page <head> metadata, sourced from frontmatter.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="desktop-bg min-h-screen py-16 px-6">
      <article className="max-w-2xl mx-auto">

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest mb-10 hover:text-white transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={11} /> All posts
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <time
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "var(--text-muted)" }}
              dateTime={post.date}
            >
              {formatDate(post.date)}
            </time>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
                style={{ color: "var(--text-muted)", border: "1px solid var(--widget-border)" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-[28px] font-semibold text-white leading-tight mb-2">{post.title}</h1>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            {post.description}
          </p>
        </header>

        <div className="prose-mdx">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{ mdxOptions: { rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]] } }}
          />
        </div>
      </article>
    </main>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
