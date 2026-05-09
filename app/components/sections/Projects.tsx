"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Star } from "lucide-react"
import { motion } from "framer-motion"
import ProjectModal from "../modals/ProjectModal"
// Project lists live in /config/projects.ts.
import { projects, type ProjectItem } from "@/config/projects"
import { slugifyProject } from "@/lib/project-slug"

function ProjectList({
  projects, onSelect,
}: {
  projects: ProjectItem[]
  onSelect: (p: ProjectItem) => void
}) {
  return (
    <div>
      {projects.map((p, i) => (
        <motion.button
          key={i}
          type="button"
          onClick={() => onSelect(p)}
          className="group w-full flex items-start justify-between gap-4 py-4 text-left"
          style={{
            borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
            borderBottom: "1px solid var(--separator)",
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[13px] font-semibold text-white group-hover:text-white/75 transition-colors">
                {p.title}
              </span>
              {p.stars !== undefined && (
                <span
                  className="flex items-center gap-0.5 font-mono text-[10px]"
                  style={{ color: "var(--text-faint)" }}
                >
                  <Star size={9} className="fill-current" />
                  {p.stars}
                </span>
              )}
              {p.status && (
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
                  style={{
                    color: "var(--text-muted)",
                    border: "1px solid var(--widget-border)",
                  }}
                >
                  {p.status}
                </span>
              )}
              {p.caseStudy?.metric && (
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--widget-border)",
                  }}
                >
                  {p.caseStudy.metric.value}
                </span>
              )}
            </div>
            <p className="text-[12px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
              {p.description}
            </p>
            <p className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>
              {p.tech.join(" · ")}
            </p>
          </div>
          <ArrowUpRight
            size={14}
            className="flex-none mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity"
            style={{ color: "white" }}
          />
        </motion.button>
      ))}
    </div>
  )
}

export default function Projects({
  compact = false,
  initialSlug,
}: {
  compact?: boolean
  initialSlug?: string
}) {
  const { personal: personalProjects, client: clientProjects } = projects

  // If a deeplink slug was passed (e.g. /projects/thunder-forms), find which
  // tab the project lives in and pre-select it so the modal opens at boot.
  const initialTab: "personal" | "client" =
    initialSlug && clientProjects.some((p) => slugifyProject(p.title) === initialSlug)
      ? "client"
      : "personal"
  const initialSelected: ProjectItem | null = initialSlug
    ? [...personalProjects, ...clientProjects].find(
        (p) => slugifyProject(p.title) === initialSlug,
      ) ?? null
    : null

  const [tab, setTab] = useState<"personal" | "client">(initialTab)
  const [selected, setSelected] = useState<ProjectItem | null>(initialSelected)

  // If the slug changes after mount (client-side nav between project URLs)
  // re-sync the modal so the user sees the new project without a full reload.
  useEffect(() => {
    if (!initialSlug) return
    const next = [...personalProjects, ...clientProjects].find(
      (p) => slugifyProject(p.title) === initialSlug,
    )
    if (next) {
      setSelected(next)
      setTab(clientProjects.includes(next) ? "client" : "personal")
    }
  }, [initialSlug, personalProjects, clientProjects])

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={compact ? "px-6 py-6" : "py-20 px-6"}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.14em] mb-5"
          style={{ color: "var(--text-muted)" }}
        >
          Projects
        </p>

        {/* Tabs */}
        <div
          className="flex gap-5 mb-5"
          style={{ borderBottom: "1px solid var(--separator)" }}
        >
          {(["personal", "client"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-mono text-[10px] uppercase tracking-[0.1em] pb-2 transition-colors"
              style={{
                color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
                borderBottom: tab === t ? "1px solid var(--accent)" : "1px solid transparent",
                marginBottom: -1,
              }}
            >
              {t === "personal" ? "Personal" : "Client Work"}
            </button>
          ))}
        </div>

        {tab === "personal" ? (
          <ProjectList projects={personalProjects} onSelect={setSelected} />
        ) : (
          <ProjectList projects={clientProjects} onSelect={setSelected} />
        )}
      </motion.section>

      <ProjectModal
        project={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
