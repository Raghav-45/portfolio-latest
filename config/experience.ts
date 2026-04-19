/**
 * experience.ts
 * ─────────────────────────────────────────────────────────────
 *  - `experience`        → full cards shown in the Experience window
 *                          (click one to open a modal with achievements + links).
 *  - `resumeExperience`  → condensed bullets shown on the Résumé window.
 *  - `education`         → single degree entry for the Résumé.
 *  - `teaching`          → free-form bullets for the Teaching section.
 *
 * The two experience lists are separate on purpose: the main site shows
 * every role, while the résumé groups multiple roles into summaries.
 * ─────────────────────────────────────────────────────────────
 */

export interface ExperienceItem {
  company: string
  role: string
  /** e.g. "Jun 2024 – Present" or "2023". */
  period: string
  /** One-line summary shown on the card. */
  description: string
  tech: string[]
  /** Bullet points shown in the modal. */
  achievements: string[]
  /** Optional related links shown at the bottom of the modal. */
  links?: { type: string; url: string; label: string }[]
}

export const experience: ExperienceItem[] = [
  {
    company: "Human Archive (YC W26)",
    role: "Full Stack Engineer",
    period: "Feb 2026 – Present",
    description: "Building the company's data platform for delivering TB-scale robotics datasets to enterprise customers.",
    tech: ["React", "TanStack Router", "Express", "PostgreSQL", "AWS", "Cognito", "S3", "Lambda", "CloudFront"],
    achievements: [
      "Led a team of engineers to build the data platform end-to-end: React with TanStack Router, Express API, PostgreSQL, and deep AWS integration (Cognito, S3, Lambda, CloudFront signed URLs).",
      "Designed the dataset pipeline with recursive S3 folder resolution, batched ingestion with conflict-safe upserts.",
      "Built a multi-tenant auth layer with Cognito JWT verification, Postgres-enriched role/org profiles, and role-gated UI branching entire component subtrees per user type.",
    ],
  },
  {
    company: "Conqr AI",
    role: "Full Stack Engineer",
    period: "May 2025 – Jan 2026",
    description: "Built a legal chatbot using RAG and engineered an end-to-end document processing pipeline.",
    tech: ["Go", "RAG", "PDF.js", "OCR", "Vector Embeddings"],
    achievements: [
      "Built a Legal Chatbot using RAG, leveraging PDF.js and page-wise chunking to maintain context across sections.",
      "Engineered an end-to-end document pipeline: scan detection, OCR on demand, chunking, and metadata-backed storage.",
      "Optimised data ingestion timeline from 5+ minutes to under a minute for ~25 documents using Go's concurrency model for parallel processing.",
    ],
    links: [
      { type: "website", url: "https://conqr.ai", label: "conqr.ai" },
    ],
  },
  {
    company: "Spacedrive",
    role: "Open Source Contributor",
    period: "Aug 2023 – May 2025",
    description: "Implemented 9 key features across the Spacedrive open-source file manager.",
    tech: ["Rust", "React", "TypeScript"],
    achievements: [
      "Implemented Copy File Path functionality and full file path display in the Inspector.",
      "Built Quick Preview for text files with extended support for additional file types.",
      "Added image zooming to the Quick Preview system.",
    ],
    links: [
      { type: "website", url: "https://spacedrive.com", label: "spacedrive.com" },
    ],
  },
]

// ── Résumé-only condensed version ────────────────────────────────────

export interface ResumeExperienceItem {
  company: string
  role: string
  period: string
  /** Optional list of sub-companies (e.g. for a contractor umbrella). */
  subRoles?: string[]
  bullets: string[]
}

export const resumeExperience: ResumeExperienceItem[] = [
  {
    company: "Human Archive (YC W26)",
    role: "Full Stack Engineer",
    period: "Feb 2026 – Present",
    bullets: [
      "Led a team of engineers to build the company's data platform end-to-end: React with TanStack Router, Express API, PostgreSQL, and deep AWS integration (Cognito, S3, Lambda, CloudFront signed URLs), serving as the primary tool for delivering TB-scale robotics datasets to enterprise customers.",
      "Designed the dataset pipeline (recursive S3 folder resolution, batched ingestion with conflict-safe upserts) and a multi-tenant auth layer with Cognito JWT verification, Postgres-enriched role/org profiles, and role-gated UI branching entire component subtrees per user type.",
    ],
  },
  {
    company: "Conqr AI",
    role: "Full Stack Engineer",
    period: "May 2025 – Jan 2026",
    bullets: [
      "Built a Legal Chatbot using RAG, leveraging PDF.js and page-wise chunking to maintain context across sections.",
      "Engineered an end-to-end document pipeline: scan detection, OCR on demand, chunking, and metadata-backed storage; optimised data ingestion from 5+ minutes to under a minute for ~25 documents using Go's concurrency model.",
    ],
  },
  {
    company: "Spacedrive",
    role: "Open Source Contributor",
    period: "Aug 2023 – May 2025",
    bullets: [
      "Implemented 9 key features, including Copy File Path, displaying full file paths in the Inspector, Quick Preview for text files, and extended Quick Preview support with additional file types and image zooming.",
    ],
  },
]

// ── Education + Teaching ─────────────────────────────────────────────

export interface EducationItem {
  school: string
  degree: string
  period: string
}

export const education: EducationItem = {
  school: "Maharaja Agrasen Institute of Technology",
  degree: "B.Tech — Information Technology and Engineering",
  period: "2024 – 2028",
}

export const teaching: string[] = [
  "3rd Runner Up @ Bajaj HackRX 6.0 — Awarded Larry Page Award for Best Innovation.",
  "Top 25 @ Facebook: Pragati AI for Impact Hackathon.",
]
