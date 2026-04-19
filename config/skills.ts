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
  "Languages":         ["Go", "JavaScript", "TypeScript", "Python", "Java", "C"],
  "Frontend":          ["React.js", "Next.js", "TanStack Query", "Zustand", "Redux", "Framer Motion"],
  "Backend":           ["Node.js", "Express", "Bun", "FastAPI", "WebSockets", "GraphQL", "Langchain"],
  "Generative AI":     ["MCP", "Agents", "RAG", "Vector DBs", "LangGraph"],
  "Databases":         ["PostgreSQL", "MongoDB", "Redis", "Cassandra", "Prisma", "Drizzle", "TypeORM"],
  "DevOps / Cloud":    ["Docker", "AWS", "Cognito", "S3", "Lambda", "CloudFront", "CI/CD", "DigitalOcean"],
  "Other":             ["DSA", "Puppeteer", "Chrome Extensions", "Web Scraping", "Discord Bots", "Telegram Bots"],
}
