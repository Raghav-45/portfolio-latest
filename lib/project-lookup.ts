/**
 * Resolve a project by URL slug. Walks both personal and client lists from
 * config/projects.ts so /projects/[slug] works for any title without needing
 * a separate index map.
 */
import { projects, type ProjectItem } from "@/config/projects"
import { slugifyProject } from "@/lib/project-slug"

export interface ResolvedProject extends ProjectItem {
  slug: string
  category: "personal" | "client"
}

export function getAllProjects(): ResolvedProject[] {
  return [
    ...projects.personal.map((p) => ({ ...p, slug: slugifyProject(p.title), category: "personal" as const })),
    ...projects.client.map((p) => ({ ...p, slug: slugifyProject(p.title), category: "client" as const })),
  ]
}

export function getProjectBySlug(slug: string): ResolvedProject | null {
  return getAllProjects().find((p) => p.slug === slug) ?? null
}
