/**
 * terminal.ts
 * ─────────────────────────────────────────────────────────────
 * Payloads for the interactive Terminal window. Each entry is the
 * content printed by a command or a virtual file. Lines are shown
 * verbatim — an empty string renders as a blank line.
 * ─────────────────────────────────────────────────────────────
 */

import { siteConfig } from "./siteConfig"

export interface TerminalConfig {
  /** Content of `cat about.txt`. */
  about: string[]
  /** Content of `cat skills.txt`. */
  skills: string[]
  /** Content of `cat experience.txt`. */
  experience: string[]
  /** Content of `cat contact.txt`. */
  contact: string[]
  /** Content of `cat resume.pdf`. */
  resume: string[]
  /** Output of `whoami`. */
  whoami: string[]
  /** Fake JSON returned by `curl github.com/<user>`. */
  githubJson: string
}

const { personal, social, contact } = siteConfig

export const terminal: TerminalConfig = {
  about: [
    `Name:   ${personal.fullName}`,
    `Age:    ${personal.age}`,
    `Base:   ${personal.location}`,
    `Role:   ${personal.role}`,
    "",
    "Building data platforms and AI systems at Human Archive (YC W26).",
    "I ship production-grade pipelines, RAG engines, and full-stack products.",
  ],
  skills: [
    "Languages:     Go · JavaScript · TypeScript · Python · Java · C",
    "Frontend:      React · Next.js · TanStack Query · Zustand · Framer Motion",
    "Backend:       Node.js · Express · Bun · FastAPI · WebSockets · GraphQL",
    "Generative AI: MCP · Agents · RAG · Vector DBs · LangGraph · Langchain",
    "Databases:     PostgreSQL · MongoDB · Redis · Cassandra",
    "Cloud:         AWS · S3 · Lambda · Cognito · CloudFront · Docker",
  ],
  experience: [
    "Human Archive (YC W26)   Feb 2026 – Present   Full Stack Engineer",
    "Conqr AI                 May 2025 – Jan 2026   Full Stack Engineer",
    "Spacedrive               Aug 2023 – May 2025   Open Source Contributor",
  ],
  contact: [
    `email:    ${contact.email}`,
    `github:   github.com/${social.githubUsername}`,
    `twitter:  x.com/${social.twitterHandle}`,
    // "phone:    +91 7042594978",
  ],
  resume: [
    "Opening résumé…",
    "→ loading resume.pdf",
  ],
  whoami: [
    personal.fullName,
    `${personal.role} · ${personal.location}`,
    "",
    "Building data platforms and AI-powered",
    "systems at a YC W26 startup.",
  ],
  githubJson: `{"login":"${social.githubUsername}","name":"${personal.fullName}","bio":"${personal.role} @ Human Archive (YC W26)","public_repos":30}`,
}
