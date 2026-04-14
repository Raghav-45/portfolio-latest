"use client"

import { useEffect, useState } from "react"
import { motion, useDragControls } from "framer-motion"

export default function VisitorWidget() {
  const [count, setCount] = useState<number | null>(null)
  const dragControls = useDragControls()

  useEffect(() => {
    fetch("/api/views")
      .then((r) => r.json())
      .then((d) => { if (d.count !== null) setCount(d.count) })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="absolute select-none"
      style={{ bottom: 80, left: 320, zIndex: 5, width: 160 }}
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.12)" }} />
      </div>

      <div className="widget-body px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-1.5" style={{ color: "var(--text-faint)" }}>
          Visitors
        </p>
        <p className="text-[28px] font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
          {count !== null ? count.toLocaleString() : "—"}
        </p>
        <p className="font-mono text-[9px] mt-1.5" style={{ color: "var(--text-muted)" }}>
          total visits
        </p>
      </div>
    </motion.div>
  )
}
