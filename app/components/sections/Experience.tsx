"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ExperienceModal from "../modals/ExperienceModal"
// Work-history entries come from /config/experience.ts.
import { experience as experienceData, type ExperienceItem } from "@/config/experience"

// UI-shape kept for the modal component; icons are injected at render time.
export interface Experience extends ExperienceItem {
  icon: React.ReactNode
  links?: { type: string; url: string; icon: React.ReactNode; label: string }[]
}

const experiences: Experience[] = experienceData.map((e) => ({
  ...e,
  icon: null,
  links: e.links?.map((l) => ({ ...l, icon: null })),
}))

export default function Experience({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<Experience | null>(null)

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
          Experience
        </p>

        <div>
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer py-4"
              style={{
                borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
                borderBottom: "1px solid var(--separator)",
              }}
              onClick={() => setSelected(exp)}
            >
              <div className="flex items-baseline justify-between gap-4 mb-1.5">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-[14px] font-semibold text-white group-hover:text-white/80 transition-colors truncate">
                    {exp.company}
                  </span>
                  <span
                    className="font-mono text-[10px] truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {exp.role}
                  </span>
                </div>
                <span
                  className="font-mono text-[10px] flex-none"
                  style={{ color: "var(--text-faint)" }}
                >
                  {exp.period}
                </span>
              </div>

              <p className="text-[12px] mb-2" style={{ color: "var(--text-secondary)" }}>
                {exp.description}
              </p>

              <p className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>
                {exp.tech.join(" · ")}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <ExperienceModal
        experience={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
