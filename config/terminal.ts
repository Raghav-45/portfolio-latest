/**
 * terminal.ts
 * ─────────────────────────────────────────────────────────────
 * Payloads for the interactive Terminal window. Each entry is the
 * content printed by a command or a virtual file. Lines are shown
 * verbatim — an empty string renders as a blank line.
 * ─────────────────────────────────────────────────────────────
 */

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

export const terminal: TerminalConfig = {
  about: [
    "Name:   Jane Developer",
    "Age:    20",
    "Base:   Earth",
    "Role:   Software Engineer",
    "",
    "Short bio line one.",
    "Short bio line two.",
  ],
  skills: [
    "Languages:  TypeScript · Go · Python",
    "Frontend:   React · Next.js · TailwindCSS",
    "Backend:    Node.js · PostgreSQL · Redis",
    "DevOps:     Docker · AWS · Vercel",
  ],
  experience: [
    "Acme Corp    Jan 2024 – Present   Senior Software Engineer",
    "Globex       2022 – 2023          Software Engineer",
    "Initech      Summer 2021          Intern",
  ],
  contact: [
    "email:    hello@example.com",
    "github:   github.com/janedeveloper",
    "twitter:  x.com/janedeveloper",
    "cal:      cal.com/janedeveloper",
  ],
  resume: [
    "Opening résumé…",
    "→ example.com/resume",
  ],
  whoami: [
    "Jane Developer",
    "Software Engineer · Earth",
    "",
    "A short, opinionated sentence about",
    "what you build and why it matters.",
  ],
  githubJson: `{"login":"janedeveloper","name":"Jane Developer","bio":"Software Engineer","public_repos":42}`,
}
