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
    firstName: "Jane",
    lastName: "Developer",
    fullName: "Jane Developer",
    initials: "JD",
    role: "Software Engineer",
    shortRole: "Full-Stack Software Engineer",
    tagline:
      "A short, opinionated sentence about what you build and why it matters. Keep it two sentences at most — this is the first thing visitors read.",
    location: "Earth",
    age: 20,
    avatar: "/avatar.svg",
    username: "janedeveloper",
  },

  social: {
    github: "https://github.com/janedeveloper",
    twitter: "https://x.com/janedeveloper",
    blog: "https://example.com/blog",
    githubUsername: "janedeveloper",
    twitterHandle: "janedeveloper",
  },

  contact: {
    email: "hello@example.com",
    calendar: "https://cal.com/janedeveloper",
    heading: "Let's Connect",
    subheading: "Open to collaborations, freelance work, or just a conversation.",
    rows: [
      { icon: "mail",     href: "mailto:hello@example.com",             label: "Email",           mono: "hello@example.com" },
      { icon: "calendar", href: "https://cal.com/janedeveloper",         label: "Schedule a call", mono: "cal.com/janedeveloper" },
      { icon: "twitter",  href: "https://x.com/janedeveloper",           label: "X / Twitter",     mono: "@janedeveloper" },
      { icon: "github",   href: "https://github.com/janedeveloper",      label: "GitHub",          mono: "janedeveloper" },
    ],
  },

  seo: {
    title: "Jane Developer — Portfolio",
    description: "Personal portfolio and writing by Jane Developer.",
  },

  resumeLink: "https://example.com/resume",

  features: {
    konami: false,
  },
}
