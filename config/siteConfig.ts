/**
 * siteConfig.ts
 * ─────────────────────────────────────────────────────────────
 * Identity, social profiles, contact details, and page metadata.
 *
 * 👉 This is the FIRST file to edit when forking the template.
 * Everything else (projects, experience, skills, blogs) lives in
 * its own file inside /config so the data stays easy to maintain.
 * ─────────────────────────────────────────────────────────────
 */

// ── Types ───────────────────────────────────────────────────────────

export interface Personal {
  firstName: string
  lastName: string
  fullName: string
  /** Two-letter badge shown in the mobile status bar (e.g. "JD"). */
  initials: string
  /** Short role shown under your name in the Hero (e.g. "Frontend Engineer"). */
  role: string
  /** Longer title shown on the résumé header. */
  shortRole: string
  /** One-paragraph bio shown in the Hero. */
  tagline: string
  /** "City, Country" — displayed in Hero footer and résumé header. */
  location: string
  age: number | string
  /** Path (in /public) to your avatar image. */
  avatar: string
  /** Handle shown next to the avatar (no @). */
  username: string
}

export interface Social {
  github: string
  twitter: string
  /** Medium, Hashnode, personal blog, etc. */
  blog: string
  /** Bare GitHub username used in labels + API calls. */
  githubUsername: string
  /** Twitter/X handle, no @. */
  twitterHandle: string
}

export interface ContactRow {
  icon: "mail" | "calendar" | "twitter" | "github"
  href: string
  label: string
  /** Short monospaced value shown on the right of each row. */
  mono: string
}

export interface Contact {
  email: string
  calendar: string
  heading: string
  subheading: string
  rows: ContactRow[]
}

export interface Seo {
  title: string
  description: string
}

export interface Features {
  /** If true, the arrow-arrow-b-a Konami code triggers an easter egg overlay. */
  konami: boolean
}

export interface SiteConfig {
  personal: Personal
  social: Social
  contact: Contact
  seo: Seo
  /** URL to an external résumé (Notion page, Google Doc, hosted PDF). */
  resumeLink: string
  features: Features
}

// ── EDIT BELOW ──────────────────────────────────────────────────────

export const siteConfig: SiteConfig = {
  personal: {
    firstName: "Aditya",
    lastName: "",
    fullName: "Aditya",
    initials: "AD",
    role: "Full Stack Engineer",
    shortRole: "Full-Stack Software Engineer",
    tagline:
      "Building data platforms and AI-powered systems at a YC W26 startup. I ship production-grade pipelines, RAG engines, and full-stack products — from React to PostgreSQL to AWS.",
    location: "New Delhi, India",
    age: 21,
    avatar: "/avatar.svg",
    username: "Raghav-45",
  },

  social: {
    github: "https://github.com/Raghav-45",
    twitter: "https://x.com/adityaxraghav",
    blog: "https://github.com/Raghav-45",
    githubUsername: "Raghav-45",
    twitterHandle: "adityaxraghav",
  },

  contact: {
    email: "realraghavaditya@gmail.com",
    calendar: "https://cal.com/adityaraghav",
    heading: "Let's Connect",
    subheading: "Open to collaborations, interesting projects, or just a conversation about engineering.",
    rows: [
      { icon: "mail",     href: "mailto:realraghavaditya@gmail.com",     label: "Email",           mono: "realraghavaditya@gmail.com" },
      { icon: "calendar", href: "https://cal.com/adityaraghav",           label: "Schedule a call", mono: "cal.com/adityaraghav" },
      { icon: "twitter",  href: "https://x.com/adityaxraghav",            label: "X / Twitter",     mono: "@adityaxraghav" },
      { icon: "github",   href: "https://github.com/Raghav-45",           label: "GitHub",          mono: "Raghav-45" },
    ],
  },

  seo: {
    title: "Aditya — Full Stack Engineer",
    description: "Full Stack Engineer building data platforms and AI systems at a YC W26 startup. Portfolio showcasing production-grade pipelines, RAG engines, and open-source contributions.",
  },

  resumeLink: "https://example.com/resume",

  features: {
    konami: false,
  },
}
