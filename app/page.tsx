import Link from 'next/link'
import Desktop from './components/Desktop'
import { getAllPosts } from '@/lib/posts'
import { getAllProjects } from '@/lib/project-lookup'
import { siteConfig } from '@/config/siteConfig'
import { experience } from '@/config/experience'

// Server component — reads MDX metadata from /content/blog and hands
// it down. Desktop (client) and everything beneath it gets plain data.
//
// The hidden <section> below provides crawlable SSR content for search
// engines. Desktop is "use client" and produces zero server HTML, which
// previously caused Google to see an empty <body> with no internal links
// — the root cause of "Discovered – currently not indexed" in GSC.
export default function Home() {
  const posts = getAllPosts()
  const projects = getAllProjects()

  return (
    <>
      {/* ── Server-rendered SEO content ──────────────────────────────
          Visually hidden via .sr-only but present in the HTML so that
          crawlers see headings, descriptive text, and — crucially —
          internal <a> links to every key route on the site.
          This is the primary mechanism for Google to discover sub-pages
          from the homepage (the sitemap alone was insufficient). */}
      <section className="sr-only" aria-hidden="false">
        <h1>{siteConfig.seo.title}</h1>
        <p>{siteConfig.seo.description}</p>
        <p>{siteConfig.personal.tagline}</p>

        <nav aria-label="Site navigation">
          <h2>Pages</h2>
          <ul>
            <li><Link href="/projects">Projects</Link> — Production engineering work</li>
            <li><Link href="/blog">Blog</Link> — Notes on engineering and AI systems</li>
            <li><Link href="/experience">Experience</Link> — Professional background</li>
            <li><Link href="/resume">Résumé</Link></li>
            <li><Link href="/contact">Contact</Link> — {siteConfig.contact.heading}</li>
          </ul>
        </nav>

        <h2>Projects</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} title={`${p.title} Case Study`}>{p.title}</Link> — {p.description}
              {p.caseStudy?.problem && <span> {p.caseStudy.problem}</span>}
              {p.tech.length > 0 && <span> Tech Stack: {p.tech.join(', ')}.</span>}
            </li>
          ))}
        </ul>

        <h2>Writing</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link> — {post.description}
            </li>
          ))}
        </ul>

        <h2>Experience</h2>
        <ul>
          {experience.map((exp) => (
            <li key={exp.company}>
              <strong>{exp.role}</strong> at {exp.company} ({exp.period}) — {exp.description}
            </li>
          ))}
        </ul>
      </section>

      <Desktop posts={posts} />
    </>
  )
}
