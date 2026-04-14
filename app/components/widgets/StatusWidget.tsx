"use client"

import { motion, useDragControls } from "framer-motion"
// Status + "currently" rows live in /config/status.ts.
import { status } from "@/config/status"

const STATUS = { available: status.available, label: status.label }
const CURRENTLY = status.currently

export default function StatusWidget() {
  const dragControls = useDragControls()

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="absolute select-none"
      style={{ top: 48, right: 24, zIndex: 5, width: 232 }}
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.12)" }} />
      </div>

      <div className="widget-body px-3.5 py-3">
        <div
          className="flex items-center gap-2 pb-2.5 mb-2.5"
          style={{ borderBottom: "1px solid var(--separator)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-none"
            style={{ background: STATUS.available ? "#4ade80" : "var(--text-faint)" }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.1em]"
            style={{ color: STATUS.available ? "var(--text-secondary)" : "var(--text-muted)" }}
          >
            {STATUS.label}
          </span>
        </div>

        <div className="space-y-2">
          {CURRENTLY.map(({ label, value }) => (
            <div key={label} className="flex gap-3 items-start">
              <span
                className="font-mono text-[9px] uppercase tracking-wider flex-none pt-px"
                style={{ color: "var(--text-faint)", width: 52 }}
              >
                {label}
              </span>
              <span className="text-[11px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
