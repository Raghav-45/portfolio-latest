/**
 * /experience — boots the desktop with the Experience window open. Hidden
 * content lists every role, period, and achievement bullet for crawlers.
 */
import type { Metadata } from "next"
import Desktop from "@/app/components/Desktop"
import { getAllPosts } from "@/lib/posts"
import { siteConfig } from "@/config/siteConfig"
import { experience } from "@/config/experience"

export const metadata: Metadata = {
  title: "Experience",
  description: `Professional experience of ${siteConfig.personal.fullName} — ${siteConfig.personal.shortRole} across YC-backed startups, AI products, and open source.`,
  alternates: { canonical: "/experience" },
  openGraph: {
    type: "profile",
    title: `${siteConfig.personal.fullName} — Experience`,
    description: `Professional experience of ${siteConfig.personal.fullName} across YC-backed startups, AI products, and open source.`,
    url: "/experience",
  },
}

export default function ExperiencePage() {
  const posts = getAllPosts()

  const itemListElement = experience.map((role, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Organization",
      name: role.company,
      ...(role.links && role.links.length > 0 ? { url: role.links[0].url } : {}),
      description: `${role.role} — ${role.description}`,
    }
  }))

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article className="sr-only" aria-hidden="false">
        <h1>{siteConfig.personal.fullName} — Experience</h1>
        <p>
          {siteConfig.personal.shortRole} based in {siteConfig.personal.location}.
        </p>

        {experience.map((role) => (
          <section key={`${role.company}-${role.period}`}>
            <h2>
              {role.role} — {role.company} ({role.period})
            </h2>
            <p>{role.description}</p>
            <p>
              <strong>Tech:</strong> {role.tech.join(", ")}.
            </p>
            <h3>Achievements</h3>
            <ul>
              {role.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
            {role.links && role.links.length > 0 && (
              <p>
                <strong>Links:</strong>{" "}
                {role.links.map((l, i) => (
                  <span key={l.url}>
                    {i > 0 ? ", " : ""}
                    <a href={l.url}>{l.label}</a>
                  </span>
                ))}
              </p>
            )}
          </section>
        ))}
      </article>

      <Desktop posts={posts} deeplink={{ window: "experience" }} />
    </>
  )
}
