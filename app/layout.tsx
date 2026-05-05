import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { MotionConfig } from 'framer-motion'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"
// Page metadata lives in /config/siteConfig.ts under `siteConfig.seo`.
import { siteConfig } from '@/config/siteConfig'

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aditya.is-a.dev"

/** JSON-LD schemas — these populate Google Knowledge Panel + sitelinks search.
 *  The `sameAs` array is the high-signal field: Google cross-references it to
 *  verify the same Person across GitHub, X, the YC company page, etc. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.personal.fullName,
  alternateName: siteConfig.personal.username,
  url: SITE_URL,
  image: siteConfig.personal.avatar,
  jobTitle: siteConfig.personal.role,
  description: siteConfig.personal.tagline,
  email: `mailto:${siteConfig.contact.email}`,
  worksFor: {
    "@type": "Organization",
    name: "Human Archive",
    url: "https://humanarchive.ai",
    sameAs: [
      "https://www.ycombinator.com/companies/human-archive",
    ],
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Maharaja Agrasen Institute of Technology",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Full Stack Engineering",
    "TypeScript",
    "Go",
    "React",
    "Next.js",
    "PostgreSQL",
    "AWS",
    "Retrieval Augmented Generation",
    "Vector Embeddings",
    "Multi-tenant Architecture",
  ],
  sameAs: [
    siteConfig.social.github,
    siteConfig.social.twitter,
    siteConfig.contact.calendar,
  ],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.seo.title,
  url: SITE_URL,
  description: siteConfig.seo.description,
  author: { "@type": "Person", name: siteConfig.personal.fullName, url: SITE_URL },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // The Geist variables are declared on <html> and the font-sans default
    // is set via the body rule in globals.css — no need to duplicate a className here.
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {/* `reducedMotion="user"` silences Framer Motion animations for users
            with prefers-reduced-motion enabled, in one place, for the whole tree. */}
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
        <Analytics />
      </body>
    </html>
  )
}
