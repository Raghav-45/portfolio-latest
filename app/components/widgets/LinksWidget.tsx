"use client"

import { useState } from "react"
import { motion, useDragControls, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
// Reading list lives in /config/links.ts.
import { links as LINKS } from "@/config/links"

export default function LinksWidget() {
  const dragControls = useDragControls()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="absolute select-none"
      style={{ top: 228, left: 24, zIndex: 5, width: 240 }}
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.12)" }} />
      </div>

      <div className="widget-body">
        <div className="px-3 pt-2.5 pb-1" style={{ borderBottom: "1px solid var(--separator)" }}>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "var(--text-faint)" }}>
            Links · worth reading
          </p>
        </div>

        {LINKS.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 group"
            style={{ borderBottom: i < LINKS.length - 1 ? "1px solid var(--item-separator)" : undefined }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="min-w-0">
              <p
                className="text-[11px] leading-tight truncate transition-colors"
                style={{ color: hovered === i ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {link.title}
              </p>
              <p className="font-mono text-[9px] mt-0.5" style={{ color: "var(--text-faint)" }}>
                {link.author} · {link.tag}
              </p>
            </div>
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.1 }}
                  className="flex-none ml-2"
                >
                  <ArrowUpRight size={11} style={{ color: "var(--text-secondary)" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </a>
        ))}
      </div>
    </motion.div>
  )
}
