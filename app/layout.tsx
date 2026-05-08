import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { MotionConfig } from 'framer-motion'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"
import { siteConfig } from '@/config/siteConfig'
import { SITE_URL } from '@/lib/site-url'
import { projects } from '@/config/projects'
import { slugifyProject } from '@/lib/project-slug'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.seo.title,
    template: `%s — ${siteConfig.personal.fullName}`,
  },
  description: siteConfig.seo.description,
  applicationName: siteConfig.personal.fullName,
  authors: [{ name: siteConfig.personal.fullName, url: SITE_URL }],
  creator: siteConfig.personal.fullName,
  publisher: siteConfig.personal.fullName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: siteConfig.personal.fullName,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.seo.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    creator: `@${siteConfig.social.twitterHandle}`,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

/** JSON-LD schemas — these populate Google Knowledge Panel + sitelinks search.
 *  The `sameAs` array is the high-signal field: Google cross-references it to
 *  verify the same Person across GitHub, X, the YC company page, etc. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
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
  "@id": `${SITE_URL}/#website`,
  name: siteConfig.seo.title,
  url: SITE_URL,
  description: siteConfig.seo.description,
  inLanguage: "en-US",
  publisher: { "@id": `${SITE_URL}/#person` },
  author: { "@id": `${SITE_URL}/#person` },
}

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profilepage`,
  url: SITE_URL,
  name: siteConfig.seo.title,
  about: { "@id": `${SITE_URL}/#person` },
  mainEntity: { "@id": `${SITE_URL}/#person` },
  inLanguage: "en-US",
}

const allProjects = [...projects.personal, ...projects.client]
const creativeWorkGraph = allProjects.map((project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": `${SITE_URL}/projects/${slugifyProject(project.title)}#creativework`,
  name: project.title,
  description: project.description,
  url: `${SITE_URL}/projects/${slugifyProject(project.title)}`,
  sameAs: project.link,
  author: { "@id": `${SITE_URL}/#person` },
  creator: { "@id": `${SITE_URL}/#person` },
  keywords: project.tech.join(", "),
}))

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const schemas = [personSchema, websiteSchema, profilePageSchema, ...creativeWorkGraph]
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
        <Analytics />
      </body>
    </html>
  )
}
