/**
 * /projects — boots the macOS desktop with the Projects window open. Hidden
 * server-rendered content lists every project so Google can crawl them as
 * one canonical /projects index without ever showing a "plain" listing page.
 */
import type { Metadata } from "next"
import Desktop from "@/app/components/Desktop"
import { getAllPosts } from "@/lib/posts"
import { getAllProjects } from "@/lib/project-lookup"
import { siteConfig } from "@/config/siteConfig"

export const metadata: Metadata = {
  title: "Projects",
  description: `Production engineering work by ${siteConfig.personal.fullName} — data platforms, RAG pipelines, and full-stack products.`,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    title: "Projects",
    description: `Production engineering work by ${siteConfig.personal.fullName} — data platforms, RAG pipelines, and full-stack products.`,
    url: "/projects",
  },
}

export default function ProjectsIndexPage() {
  const posts = getAllPosts()
  const projects = getAllProjects()

  return (
    <>
      {/* Hidden SEO index — gives Googlebot every project's title, description,
          and canonical URL without disrupting the desktop UI. */}
      <section className="sr-only" aria-hidden="false">
        <h1>Projects</h1>
        <p>
          Selected production engineering work by {siteConfig.personal.fullName}.
        </p>
        <ul>
          {projects.map((p) => (
            <li key={p.slug}>
              <a href={`/projects/${p.slug}`}>{p.title}</a> — {p.description}
            </li>
          ))}
        </ul>
      </section>

      <Desktop posts={posts} deeplink={{ window: "projects" }} />
    </>
  )
}
