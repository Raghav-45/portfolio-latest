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
      title: "Fantastic Robo",
      description: "High-throughput, multi-format ingestion pipeline with adaptive extraction, OCR, semantic chunking, and a production-grade LLM load balancer for resilient RAG service levels.",
      tech: ["Docker", "Sentry", "Vector Embeddings", "Mistral OCR", "CI/CD", "DigitalOcean"],
      link: "https://github.com/Raghav-45/fantastic-robo",
    },
    {
      title: "Thunder Forms",
      description: "State-driven form builder with drag-and-drop composition, AI-assisted creation, and a deep analytics pipeline — shipped as a production SaaS with 10K+ visits.",
      tech: ["Next.js", "TypeScript", "SSE", "PostgreSQL", "NextAuth.js", "Shadcn UI"],
      link: "https://github.com/Raghav-45/thunder-forms",
    },
  ],

  client: [
    {
      title: "Human Archive Data Platform",
      description: "Enterprise data platform for delivering TB-scale robotics datasets with multi-tenant auth and deep AWS integration.",
      tech: ["React", "TanStack Router", "Express", "PostgreSQL", "AWS"],
      link: "https://humanarchive.com",
    },
    {
      title: "Conqr AI Legal Chatbot",
      description: "RAG-powered legal chatbot with end-to-end document pipeline — scan detection, OCR, chunking, and Go-powered parallel processing.",
      tech: ["Go", "RAG", "PDF.js", "OCR", "Vector Embeddings"],
      link: "https://conqr.ai",
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
    name: "Fantastic Robo",
    desc: "High-throughput, multi-format ingestion pipeline supporting PDFs, DOCX, PPTX, XLSX, images, and emails with adaptive extraction, OCR, semantic chunking, and embedding batching. Scalable vector search layer with HNSW-based similarity matching, dynamic Top-K and Hybrid retrieval. Production-grade LLM load balancer with smart request routing and telemetry feedback.",
  },
  {
    name: "Thunder Forms",
    desc: "State-driven form builder with drag-and-drop composition, schema-driven rendering, and an AI-assisted creation pipeline. Deep analytics pipeline aggregating event-level data into session-aware metrics (impressions, bounce rate, live users); shipped as a production SaaS with 10K+ visits.",
  },
]
