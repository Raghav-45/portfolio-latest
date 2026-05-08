/**
 * /projects/[slug] — project detail page with full case study.
 * Statically generated at build time from config/projects.ts.
 */
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import { getAllProjects, getProjectBySlug } from "@/lib/project-lookup"
import { siteConfig } from "@/config/siteConfig"
import { SITE_URL } from "@/lib/site-url"

export function generateStaticParams() {
  return getAllProjects().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  const url = `${SITE_URL}/projects/${slug}`

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    keywords: project.tech,
    openGraph: {
      type: "article",
      url,
      title: project.title,
      description: project.description,
      siteName: siteConfig.personal.fullName,
      authors: [siteConfig.personal.fullName],
      tags: project.tech,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      creator: `@${siteConfig.social.twitterHandle}`,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const url = `${SITE_URL}/projects/${slug}`
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#creativework`,
    name: project.title,
    description: project.description,
    url,
    sameAs: project.link,
    keywords: project.tech.join(", "),
    author: { "@id": `${SITE_URL}/#person` },
    creator: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
    ...(project.caseStudy?.outcome && {
      abstract: project.caseStudy.outcome,
    }),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: url },
    ],
  }

  return (
    <main className="desktop-bg min-h-screen py-16 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-2xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest mb-10 hover:text-white transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={11} /> All projects
        </Link>

        <header className="mb-10">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.14em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            {project.category} project
            {project.status ? ` · ${project.status}` : ""}
          </p>
          <h1 className="text-[28px] font-semibold text-white leading-tight mb-3">
            {project.title}
          </h1>
          <p className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.map((tag) => (
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

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-white/80 hover:text-white transition-colors"
          >
            Visit project <ArrowUpRight size={11} />
          </a>
        </header>

        {project.caseStudy && (
          <div className="prose-mdx space-y-8">
            {project.caseStudy.metric && (
              <div
                className="rounded-lg p-6"
                style={{ border: "1px solid var(--widget-border)" }}
              >
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.14em] mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {project.caseStudy.metric.label}
                </p>
                <p className="text-[28px] font-semibold text-white">
                  {project.caseStudy.metric.value}
                </p>
              </div>
            )}

            <section>
              <h2 className="text-[16px] font-semibold text-white/90 mb-2">Problem</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {project.caseStudy.problem}
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white/90 mb-2">Approach</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {project.caseStudy.approach}
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-white/90 mb-2">Outcome</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {project.caseStudy.outcome}
              </p>
            </section>
          </div>
        )}
      </article>
    </main>
  )
}
