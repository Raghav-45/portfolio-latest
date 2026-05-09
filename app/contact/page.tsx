/**
 * /contact — boots the desktop with the Contact window open. Hidden content
 * exposes email, calendar link, and socials for crawlers and contact-extraction
 * tools (some recruiters paste the URL into their ATS to harvest the address).
 */
import type { Metadata } from "next"
import Desktop from "@/app/components/Desktop"
import { getAllPosts } from "@/lib/posts"
import { siteConfig } from "@/config/siteConfig"

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.personal.fullName} — ${siteConfig.contact.subheading}`,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: `Contact ${siteConfig.personal.fullName}`,
    description: siteConfig.contact.subheading,
    url: "/contact",
  },
}

export default function ContactPage() {
  const posts = getAllPosts()

  return (
    <>
      <article className="sr-only" aria-hidden="false">
        <h1>Contact {siteConfig.personal.fullName}</h1>
        <p>{siteConfig.contact.subheading}</p>
        <ul>
          {siteConfig.contact.rows.map((row) => (
            <li key={row.label}>
              <strong>{row.label}:</strong>{" "}
              <a href={row.href}>{row.mono}</a>
            </li>
          ))}
        </ul>
        <p>
          {siteConfig.personal.fullName} is based in {siteConfig.personal.location}.
        </p>
      </article>

      <Desktop posts={posts} deeplink={{ window: "contact" }} />
    </>
  )
}
