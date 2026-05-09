/**
 * /resume — boots the macOS desktop with the Résumé window open. Hidden
 * server-rendered résumé content is present for crawlers (and recruiters
 * who pipe the URL through their ATS).
 */
import type { Metadata } from "next"
import Desktop from "@/app/components/Desktop"
import { getAllPosts } from "@/lib/posts"
import { siteConfig } from "@/config/siteConfig"
import { resumeExperience, education } from "@/config/experience"
import { skills } from "@/config/skills"
import { resumeProjects } from "@/config/projects"
import { SITE_URL } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Résumé",
  description: `${siteConfig.personal.shortRole} — ${siteConfig.personal.fullName}'s résumé. ${siteConfig.personal.tagline}`,
  alternates: { canonical: "/resume" },
  openGraph: {
    type: "profile",
    title: `${siteConfig.personal.fullName} — Résumé`,
    description: `${siteConfig.personal.shortRole} — ${siteConfig.personal.fullName}'s résumé.`,
    url: "/resume",
  },
}

export default function ResumePage() {
  const posts = getAllPosts()

  return (
    <>
      <article className="sr-only" aria-hidden="false">
        <h1>{siteConfig.personal.fullName} — {siteConfig.personal.shortRole}</h1>
        <p>{siteConfig.personal.tagline}</p>
        <p>
          Location: {siteConfig.personal.location}. Email:{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.{" "}
          GitHub: <a href={siteConfig.social.github}>{siteConfig.social.github}</a>.
        </p>

        <h2>Experience</h2>
        {resumeExperience.map((role) => (
          <section key={`${role.company}-${role.period}`}>
            <h3>{role.role} — {role.company} ({role.period})</h3>
            <ul>
              {role.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </section>
        ))}

        <h2>Selected Projects</h2>
        <ul>
          {resumeProjects.map((p) => (
            <li key={p.name}><strong>{p.name}</strong> — {p.desc}</li>
          ))}
        </ul>

        <h2>Education</h2>
        <p>{education.degree}, {education.school} ({education.period}).</p>

        <h2>Skills</h2>
        {Object.entries(skills).map(([category, items]) => (
          <p key={category}>
            <strong>{category}:</strong> {items.join(", ")}.
          </p>
        ))}

        <p>
          Full résumé PDF: <a href={siteConfig.resumeLink}>{siteConfig.resumeLink}</a>.{" "}
          Canonical URL: <a href={`${SITE_URL}/resume`}>{SITE_URL}/resume</a>.
        </p>
      </article>

      <Desktop posts={posts} deeplink={{ window: "resume" }} />
    </>
  )
}
