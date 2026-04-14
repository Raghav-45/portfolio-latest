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
    company: "Acme Corp",
    role: "Senior Software Engineer",
    period: "Jan 2024 – Present",
    description: "Short one-line summary of what you do here.",
    tech: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    achievements: [
      "Led the migration of a critical service from X to Y with zero downtime.",
      "Mentored three junior engineers through design reviews and pairing.",
      "Shipped a feature that drove a measurable 12% improvement in activation.",
    ],
  },
  {
    company: "Globex",
    role: "Software Engineer",
    period: "Jun 2022 – Dec 2023",
    description: "What you built here, in a sentence.",
    tech: ["Go", "Kubernetes", "Redis"],
    achievements: [
      "Built and owned the internal deploy pipeline used by 40+ engineers.",
      "Reduced p99 latency of the core API from 800ms to 110ms.",
    ],
    links: [
      { type: "website", url: "https://example.com", label: "example.com" },
    ],
  },
  {
    company: "Initech",
    role: "Software Engineering Intern",
    period: "Summer 2021",
    description: "Your internship — one line.",
    tech: ["Python", "AWS"],
    achievements: [
      "Wrote an internal data pipeline tool still in use today.",
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
    company: "Acme Corp",
    role: "Senior Software Engineer",
    period: "Jan 2024 – Present",
    bullets: [
      "Led the migration of a critical service from X to Y with zero downtime.",
      "Mentored three junior engineers through design reviews and pairing.",
      "Shipped a feature that drove a measurable 12% improvement in activation.",
    ],
  },
  {
    company: "Globex",
    role: "Software Engineer",
    period: "Jun 2022 – Dec 2023",
    bullets: [
      "Built and owned the internal deploy pipeline used by 40+ engineers.",
      "Reduced p99 latency of the core API from 800ms to 110ms.",
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
  school: "State University",
  degree: "B.Sc. — Computer Science",
  period: "2018 – 2022",
}

export const teaching: string[] = [
  "Ran a weekend study group on data structures for ~15 local students.",
  "Guest-lectured an intro-to-web-dev class at my alma mater.",
]
