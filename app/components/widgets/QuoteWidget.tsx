"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
// Quotes live in /config/quotes.ts — edit there to customise.
import { quotes as QUOTES } from "@/config/quotes"

export default function QuoteWidget() {
  const [idx, setIdx] = useState(0)
  const dragControls = useDragControls()

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % QUOTES.length), 7000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="absolute select-none"
      style={{ top: 48, left: 24, zIndex: 5, width: 240 }}
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.12)" }} />
      </div>

      <div className="widget-body px-4 py-3.5" style={{ minHeight: 74 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="text-[12px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            &ldquo;{QUOTES[idx]}&rdquo;
          </motion.p>
        </AnimatePresence>

        <div className="flex items-center gap-1 mt-3">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 12 : 4,
                height: 3,
                background: i === idx ? "var(--accent)" : "var(--accent-subtle)",
              }}
            />
          ))}
        </div>

        <p
          className="font-mono text-[9px] uppercase tracking-[0.1em] mt-2"
          style={{ color: "var(--text-faint)" }}
        >
          — aditya · writing
        </p>
      </div>
    </motion.div>
  )
}
