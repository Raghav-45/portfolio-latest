"use client"

import { motion } from "framer-motion"
// Tools + hardware list lives in /config/uses.ts.
import { uses as USES } from "@/config/uses"

export default function Uses({ compact = false }: { compact?: boolean }) {
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
        Uses
      </p>

      <div className="space-y-6">
        {USES.map((group, gi) => (
          <div key={gi}>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.1em] mb-3"
              style={{ color: "var(--text-faint)" }}
            >
              {group.category}
            </p>
            <div>
              {group.items.map((item, ii) => (
                <div
                  key={ii}
                  className="flex items-baseline justify-between py-2"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    borderTop: ii === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined,
                  }}
                >
                  <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {item.name}
                  </span>
                  {item.note && (
                    <span className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>
                      {item.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
