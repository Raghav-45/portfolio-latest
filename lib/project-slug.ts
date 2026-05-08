/**
 * Convert a project title into a URL slug used for /projects/[slug] routes.
 * Stable across re-orderings of config/projects.ts so canonical URLs don't break.
 */
export function slugifyProject(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
