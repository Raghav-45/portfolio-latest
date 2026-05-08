/**
 * /projects — index page listing every project as a real, indexable URL.
 * Reuses the styling vocabulary from /blog so the site stays consistent.
 */
import Link from "next/link"
import { ArrowUpRight, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
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
  const projects = getAllProjects()

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
          Projects
        </p>
        <h1 className="text-[28px] font-semibold text-white mb-10">All work</h1>

        <div>
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex items-start justify-between gap-4 py-4"
              style={{
                borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
                borderBottom: "1px solid var(--separator)",
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-white/85 group-hover:text-white transition-colors leading-snug mb-1">
                  {project.title}
                </p>
                <p className="text-[12px] leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
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
              </div>
              <div className="flex items-center gap-2 flex-none mt-0.5">
                <span
                  className="font-mono text-[10px] whitespace-nowrap"
                  style={{ color: "var(--text-faint)" }}
                >
                  {project.category}
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
      </div>
    </main>
  )
}
