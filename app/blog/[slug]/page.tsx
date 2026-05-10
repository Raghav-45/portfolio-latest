/**
 * /blog/[slug] — post rendering page
 * Renders one MDX file through next-mdx-remote/rsc, using the
 * shared mdxComponents for consistent typography.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { mdxComponents } from "@/app/components/MDXComponents"
import { siteConfig } from "@/config/siteConfig"
import { SITE_URL } from "@/lib/site-url"

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
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${slug}`

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    keywords: post.tags,
    authors: [{ name: siteConfig.personal.fullName, url: SITE_URL }],
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: siteConfig.personal.fullName,
      publishedTime: post.date,
      authors: [siteConfig.personal.fullName],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: `@${siteConfig.social.twitterHandle}`,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const url = `${SITE_URL}/blog/${slug}`
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    inLanguage: "en-US",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  }

  return (
    <main className="desktop-bg min-h-screen py-16 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
          <p className="text-[14px] mb-3" style={{ color: "var(--text-secondary)" }}>
            {post.description}
          </p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "var(--text-muted)" }}
          >
            By{" "}
            <a
              href={SITE_URL}
              rel="author"
              className="hover:text-white transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {siteConfig.personal.fullName}
            </a>
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
