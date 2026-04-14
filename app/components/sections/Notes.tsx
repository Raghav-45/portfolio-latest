"use client"

import { motion } from "framer-motion"
// Journal entries live in /config/notes.ts.
import { notes as NOTES } from "@/config/notes"

export default function Notes({ compact = false }: { compact?: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={compact ? "px-6 py-6" : "py-20 px-6"}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.14em] mb-5"
        style={{ color: "var(--text-muted)" }}
      >
        Notes
      </p>
      <p className="text-[12px] mb-6" style={{ color: "var(--text-muted)" }}>
        Raw thoughts. Not edited for an audience.
      </p>

      <div className="space-y-0">
        {NOTES.map((note, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="py-4"
            style={{
              borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
              borderBottom: "1px solid var(--separator)",
            }}
          >
            <p
              className="font-mono text-[9px] uppercase tracking-[0.12em] mb-2"
              style={{ color: "var(--text-faint)" }}
            >
              {note.date}
            </p>
            <div className="text-[13px] leading-[1.7] space-y-3" style={{ color: "rgba(255,255,255,0.6)" }}>
              {note.body.split("\n\n").map((para, pi) => (
                <p key={pi} style={{ whiteSpace: "pre-line" }}>{para}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
