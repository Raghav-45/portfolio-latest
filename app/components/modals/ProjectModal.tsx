"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"
import type { ProjectItem } from "@/config/projects"

interface ProjectModalProps {
  project: ProjectItem | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null

  const cs = project.caseStudy

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden max-h-[85vh] overflow-y-auto mac-scrollbar"
        style={{
          background: "var(--widget-bg)",
          border: "1px solid var(--widget-border)",
          borderRadius: 8,
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid var(--separator)" }}>
          <DialogTitle className="text-[18px] font-semibold text-white mb-1">
            {project.title}
          </DialogTitle>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.1em]"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.tech.slice(0, 4).join(" · ")}
          </p>
        </div>

        <div className="px-6 py-5 space-y-5">
          {cs?.metric && (
            <div
              className="flex items-baseline gap-3 px-4 py-3 rounded"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--separator)" }}
            >
              <span className="text-[22px] font-semibold leading-none text-white">
                {cs.metric.value}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{ color: "var(--text-faint)" }}
              >
                {cs.metric.label}
              </span>
            </div>
          )}

          {cs ? (
            <>
              <Block label="Problem"  body={cs.problem} />
              <Block label="Approach" body={cs.approach} />
              <Block label="Outcome"  body={cs.outcome} />
            </>
          ) : (
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {project.description}
            </p>
          )}

          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2"
              style={{ color: "var(--text-faint)" }}
            >
              Stack
            </p>
            <p className="font-mono text-[12px]" style={{ color: "var(--text-secondary)" }}>
              {project.tech.join(" · ")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 rounded transition-colors"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--widget-border)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              View project
              <ExternalLink size={9} />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p
        className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2"
        style={{ color: "var(--text-faint)" }}
      >
        {label}
      </p>
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {body}
      </p>
    </div>
  )
}
