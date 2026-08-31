"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Hero from "./Hero"
import Experience from "./sections/Experience"
import Projects from "./sections/Projects"
import Blogs from "./sections/Blogs"
import Contact from "./sections/Contact"
import Resume from "./sections/Resume"
// Initials + footer name come from /config/siteConfig.ts.
import { siteConfig } from "@/config/siteConfig"
import type { PostMeta } from "@/lib/posts"

const NAV = [
  { id: "about",      label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects",   label: "Projects" },
  { id: "writing",    label: "Writing" },
  { id: "contact",    label: "Contact" },
  { id: "resume",     label: "Résumé" },
]

const BORDER = "1px solid rgba(255,255,255,0.07)"
// Keep section anchors clear of the sticky status bar (44px) and nav (36px).
const STICKY_HEADER_HEIGHT = 80

export default function MobileLayout({
  posts,
  initialProjectSlug,
  initialSection,
}: {
  posts: PostMeta[]
  initialProjectSlug?: string
  initialSection?: string
}) {
  // Auto-scroll to the targeted section if the user landed via a deeplink (like /resume or /projects/<slug>).
  useEffect(() => {
    if (initialProjectSlug) {
      const el = document.getElementById("projects")
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" })
    } else if (initialSection) {
      // Map window IDs to section IDs where they differ
      const sectionId = initialSection === "blogs" ? "writing" : initialSection
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" })
    }
  }, [initialProjectSlug, initialSection])

  const [time, setTime] = useState("")
  const [activeId, setActiveId] = useState("about")
  const [isBrandCompact, setIsBrandCompact] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
    }
    update()
    // Minute-level precision is plenty for a status bar — saves 29 re-renders/sec.
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])

  // Track the section whose top edge has reached the content area below the
  // sticky headers. A visibility-ratio observer does not work for long
  // sections like Résumé because 40% of the section can never fit onscreen.
  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const marker = STICKY_HEADER_HEIGHT + 1
        let nextId = NAV[0].id

        for (const { id } of NAV) {
          const el = document.getElementById(id)
          if (el && el.getBoundingClientRect().top <= marker) nextId = id
        }

        setActiveId((currentId) => currentId === nextId ? currentId : nextId)
        const compact = window.scrollY > 12
        setIsBrandCompact((current) => current === compact ? current : compact)
      })
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)
    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const scrollTo = (id: string) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="desktop-bg" style={{ minHeight: "100dvh", color: "#f0f0f0" }}>

      {/* Status bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5"
        style={{ height: 44, background: "rgba(11,11,11,0.96)", borderBottom: BORDER, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <motion.div
          className="relative h-5 overflow-hidden font-mono text-[11px] font-semibold uppercase tracking-widest"
          animate={{ width: isBrandCompact ? 23 : 58 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="sr-only">{siteConfig.personal.firstName}</span>
          {Array.from(siteConfig.personal.firstName).map((letter, index) => {
            const isInitial = index < siteConfig.personal.initials.length
            const fullLeft = index * 9
            const compactLeft = index === 0 ? 0 : 10

            return (
              <motion.span
                key={`${letter}-${index}`}
                className="absolute top-0 whitespace-nowrap"
                aria-hidden="true"
                initial={false}
                animate={{
                  left: isBrandCompact ? compactLeft : fullLeft,
                  opacity: isBrandCompact ? (isInitial ? 1 : 0) : 1,
                  scale: isBrandCompact ? (isInitial ? 1 : 0.55) : 1,
                  filter: isBrandCompact
                    ? (isInitial ? "blur(0px)" : "blur(2px)")
                    : "blur(0px)",
                }}
                transition={{
                  left: { duration: 0.34, delay: isBrandCompact ? index * 0.025 : (5 - index) * 0.02, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.2, delay: isBrandCompact ? 0.14 + index * 0.025 : 0.04 },
                  scale: { duration: 0.28, delay: isBrandCompact ? index * 0.025 : 0.02 },
                  filter: { duration: 0.2, delay: isBrandCompact ? 0.14 + index * 0.025 : 0.04 },
                }}
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {letter}
              </motion.span>
            )
          })}
        </motion.div>
        <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          {time}
        </span>
      </header>

      {/* Section nav */}
      <nav
        className="sticky z-40 flex items-center gap-5 px-5 overflow-x-auto"
        style={{ top: 44, height: 36, background: "rgba(11,11,11,0.96)", borderBottom: BORDER, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", scrollbarWidth: "none", overscrollBehaviorX: "contain" }}
      >
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors pb-px"
            style={{
              color: activeId === id ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.28)",
              borderBottom: activeId === id ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Sections */}
      <section id="about" style={{ borderBottom: BORDER, scrollMarginTop: STICKY_HEADER_HEIGHT }}>
        <Hero />
      </section>

      <section id="experience" style={{ borderBottom: BORDER, scrollMarginTop: STICKY_HEADER_HEIGHT }}>
        <Experience compact />
      </section>

      <section id="projects" style={{ borderBottom: BORDER, scrollMarginTop: STICKY_HEADER_HEIGHT }}>
        <Projects compact initialSlug={initialProjectSlug} />
      </section>

      <section id="writing" style={{ borderBottom: BORDER, scrollMarginTop: STICKY_HEADER_HEIGHT }}>
        <Blogs compact posts={posts} />
      </section>

      <section id="contact" style={{ borderBottom: BORDER, scrollMarginTop: STICKY_HEADER_HEIGHT }}>
        <Contact compact />
      </section>

      <section id="resume" style={{ borderBottom: BORDER, scrollMarginTop: STICKY_HEADER_HEIGHT }}>
        <Resume compact />
      </section>

      {/* Footer — edit siteConfig.personal.fullName */}
      <footer className="px-6 py-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>
          {siteConfig.personal.fullName} · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
