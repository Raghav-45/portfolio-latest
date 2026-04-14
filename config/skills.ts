/**
 * skills.ts
 * ─────────────────────────────────────────────────────────────
 * Skills grouped by category. Keys become category labels on the
 * left; values become the chip list on the right.
 *
 * Add, remove, or rename categories freely — the Résumé section
 * iterates over Object.entries(skills), so the UI adapts.
 * ─────────────────────────────────────────────────────────────
 */

export type Skills = Record<string, string[]>

export const skills: Skills = {
  "Languages":         ["TypeScript", "JavaScript", "Go", "Python", "SQL"],
  "Frontend":          ["React", "Next.js", "TailwindCSS", "Framer Motion"],
  "Backend":           ["Node.js", "FastAPI", "PostgreSQL", "Redis"],
  "DevOps / Tooling":  ["Docker", "GitHub Actions", "AWS", "Vercel"],
}
