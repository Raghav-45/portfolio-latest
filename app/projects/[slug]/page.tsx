/**
 * /projects/[slug] — boots the macOS desktop with the Projects window open
 * and the matching project's modal pre-selected. SEO crawlers see a fully
 * server-rendered case study (visually hidden via .sr-only) plus JSON-LD,
 * so Google indexes the content while real users get the full UI.
 */
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Desktop from "@/app/components/Desktop"
import { getAllPosts } from "@/lib/posts"
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

  const posts = getAllPosts()
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
    ...(project.caseStudy?.outcome && { abstract: project.caseStudy.outcome }),
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Server-rendered SEO content. Visually hidden via .sr-only — present
          in the HTML for Googlebot and assistive tech, invisible to users
          who get the full macOS desktop UI below. */}
      <article className="sr-only" aria-hidden="false">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <p>
          By {siteConfig.personal.fullName}, {siteConfig.personal.role}
          {siteConfig.personal.location ? `, ${siteConfig.personal.location}` : ""}.
        </p>
        <p>Tech stack: {project.tech.join(", ")}.</p>
        {project.caseStudy && (
          <>
            {project.caseStudy.metric && (
              <p>
                <strong>{project.caseStudy.metric.label}:</strong>{" "}
                {project.caseStudy.metric.value}
              </p>
            )}
            <h2>Problem</h2>
            <p>{project.caseStudy.problem}</p>
            <h2>Approach</h2>
            <p>{project.caseStudy.approach}</p>
            <h2>Outcome</h2>
            <p>{project.caseStudy.outcome}</p>
          </>
        )}
        <p>
          Live link: <a href={project.link}>{project.link}</a>
        </p>
      </article>

      <Desktop posts={posts} deeplink={{ window: "projects", slug }} />
    </>
  )
}
