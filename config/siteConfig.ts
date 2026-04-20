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

// ── Single source of truth — edit these, everything else derives. ───

const DOB            = new Date("14 Feb 2005")
const EMAIL          = "realraghavaditya@gmail.com"
const GITHUB         = "raghav-45"
const TWITTER        = "adityaxraghav"
const CAL            = "adityaraghav"

function getAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

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
    age: getAge(DOB),
    // avatar: "/avatar.svg",
    avatar: `https://github.com/${GITHUB}.png?size=512`,
    username: GITHUB,
  },

  social: {
    github: `https://github.com/${GITHUB}`,
    twitter: `https://x.com/${TWITTER}`,
    blog: `https://github.com/${GITHUB}`,
    githubUsername: GITHUB,
    twitterHandle: TWITTER,
  },

  contact: {
    email: EMAIL,
    calendar: `https://cal.com/${CAL}`,
    heading: "Let's Connect",
    subheading: "Open to collaborations, interesting projects, or just a conversation about engineering.",
    rows: [
      { icon: "mail",     href: `mailto:${EMAIL}`,                label: "Email",           mono: EMAIL },
      { icon: "calendar", href: `https://cal.com/${CAL}`,          label: "Schedule a call", mono: `cal.com/${CAL}` },
      { icon: "twitter",  href: `https://x.com/${TWITTER}`,        label: "X / Twitter",     mono: `@${TWITTER}` },
      { icon: "github",   href: `https://github.com/${GITHUB}`,    label: "GitHub",          mono: GITHUB },
    ],
  },

  seo: {
    title: "Aditya — Full Stack Engineer",
    description: "Full Stack Engineer building data platforms and AI systems at a YC W26 startup. Portfolio showcasing production-grade pipelines, RAG engines, and open-source contributions.",
  },

  resumeLink: "https://drive.google.com/file/d/17s590R5N7Lh6oCtramv1_RdIkUGxQ87S/view",

  features: {
    konami: false,
  },
}
