/**
 * projects.ts
 * ─────────────────────────────────────────────────────────────
 * All projects shown in the Projects window.
 * Split into two lists: `personal` (side projects) and `client`
 * (paid / contracted work). Both use the same ProjectItem shape.
 *
 *  - `tech`   → array of tags rendered beneath the description.
 *  - `stars`  → optional — shown next to the title if present.
 *  - `status` → optional — rendered as a pill (e.g. "Paused").
 * ─────────────────────────────────────────────────────────────
 */

export interface ProjectItem {
  title: string
  description: string
  tech: string[]
  status?: string
  stars?: number
  link: string
}

export interface ProjectsConfig {
  personal: ProjectItem[]
  client: ProjectItem[]
}

export const projects: ProjectsConfig = {
  personal: [
    {
      title: "Example Project",
      description: "One-sentence description of what you built and why it matters.",
      tech: ["TypeScript", "Next.js", "PostgreSQL"],
      stars: 42,
      link: "https://github.com/janedeveloper/example-project",
    },
    {
      title: "Another Project",
      description: "A second example. Keep each description tight — two lines max reads best.",
      tech: ["Go", "Redis"],
      link: "https://github.com/janedeveloper/another-project",
    },
    {
      title: "Paused Experiment",
      description: "A project you started but haven't touched in a while — mark it with a status.",
      tech: ["Rust"],
      status: "Paused",
      link: "https://github.com/janedeveloper/experiment",
    },
  ],

  client: [
    {
      title: "Client Work Sample",
      description: "Replace with a short, neutral description of client work you want to show off.",
      tech: ["React", "TailwindCSS"],
      link: "https://example.com",
    },
  ],
}

/** Résumé-only condensed project highlights (short names + long descriptions). */
export interface ResumeProjectItem {
  name: string
  desc: string
}

export const resumeProjects: ResumeProjectItem[] = [
  {
    name: "Example Project",
    desc: "Slightly longer description suitable for a résumé — focus on outcomes, scale, and the specific technologies involved.",
  },
  {
    name: "Another Project",
    desc: "Second résumé-worthy project. Two lines is plenty.",
  },
]
