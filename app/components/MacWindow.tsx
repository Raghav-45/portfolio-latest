"use client"

import { useEffect, useId, useRef, useState } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"

interface MacWindowProps {
  /** Stable id used for the aria-labelledby association and storage key. */
  windowId?: string
  title: string
  isOpen: boolean
  isFocused: boolean
  onClose: () => void
  onFocus: () => void
  zIndex: number
  children: React.ReactNode
  width?: number
  height?: number
  offsetX?: number
  offsetY?: number
}

/** localStorage key for persisting per-window drag offsets across reloads. */
const LS_PREFIX = "portfolio-window-pos"

export default function MacWindow({
  windowId,
  title,
  isOpen,
  isFocused,
  onClose,
  onFocus,
  zIndex,
  children,
  width = 640,
  height = 520,
  offsetX = 0,
  offsetY = 0,
}: MacWindowProps) {
  const dragControls = useDragControls()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [hoveredBtn, setHoveredBtn] = useState<"close" | "minimize" | "maximize" | null>(null)
  const [activeBtn, setActiveBtn] = useState<"close" | "minimize" | "maximize" | null>(null)
  const reactId = useId()
  const titleId = `window-title-${windowId ?? reactId}`

  // ── Position persistence ────────────────────────────────────────────
  // A small dx/dy cached in localStorage so dragging survives reloads.
  const posKey = windowId ? `${LS_PREFIX}:${windowId}` : null
  const savedOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  useEffect(() => {
    if (!posKey) return
    try {
      const raw = localStorage.getItem(posKey)
      if (raw) savedOffset.current = JSON.parse(raw)
    } catch {}
  }, [posKey])

  // ── Keyboard: Escape closes the focused window ──────────────────────
  useEffect(() => {
    if (!isOpen || !isFocused) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, isFocused, onClose])

  // ── Auto-focus the dialog when it opens ─────────────────────────────
  useEffect(() => {
    if (isOpen && isFocused) dialogRef.current?.focus({ preventScroll: true })
  }, [isOpen, isFocused])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          tabIndex={-1}
          style={{
            position: "fixed",
            left: `calc(50% - min(${width}px, calc(100vw - 32px)) / 2 + ${offsetX}px)`,
            top: `clamp(28px, calc(50% - ${height / 2}px + ${offsetY}px - 16px), calc(100vh - min(${height}px, calc(100vh - 72px)) - 40px))`,
            width: `min(${width}px, calc(100vw - 32px))`,
            zIndex,
            outline: "none",
          }}
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          initial={{ scale: 0.94, opacity: 0, y: 8, x: savedOffset.current.x, ...(savedOffset.current.y ? { y: savedOffset.current.y } : {}) }}
          animate={{ scale: 1, opacity: 1, x: savedOffset.current.x, y: savedOffset.current.y }}
          exit={{ scale: 0.94, opacity: 0, y: (savedOffset.current.y || 0) + 8, transition: { duration: 0.12 } }}
          transition={{ type: "spring", damping: 32, stiffness: 420 }}
          onPointerDown={onFocus}
          onDragEnd={(_, info) => {
            if (!posKey) return
            savedOffset.current = { x: info.offset.x + savedOffset.current.x, y: info.offset.y + savedOffset.current.y }
            try { localStorage.setItem(posKey, JSON.stringify(savedOffset.current)) } catch {}
          }}
        >
          <div
            data-mac-window
            className="flex flex-col overflow-hidden"
            style={{
              height: `min(${height}px, calc(100vh - 72px))`,
              borderRadius: 16,
              border: isFocused
                ? "1px solid var(--glass-border-strong)"
                : "1px solid var(--glass-border)",
              boxShadow: isFocused
                ? "0 32px 80px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "0 16px 48px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.03)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              transition: "box-shadow 0.25s ease, border-color 0.25s ease",
            }}
          >
            {/* Specular highlight — top edge gradient */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.08) 50%, transparent 90%)",
                borderRadius: "16px 16px 0 0",
              }}
            />

            {/* Title Bar */}
            <div
              className="flex-none flex items-center h-10 px-3.5 relative select-none cursor-grab active:cursor-grabbing"
              style={{
                background: "var(--titlebar-bg)",
                borderBottom: "1px solid var(--glass-border)",
              }}
              onPointerDown={(e) => dragControls.start(e)}
            >
              {/* Traffic light buttons — real macOS SVG paths */}
              <div className="flex items-center gap-[7px] z-10">
                {/* Close */}
                <button
                  type="button"
                  aria-label={`Close ${title}`}
                  className="w-3 h-3 rounded-full flex items-center justify-center flex-none p-0 border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--titlebar-bg)]"
                  style={{
                    background: !isFocused ? "#4E4F52"
                      : activeBtn === "close" ? "#F09389"
                      : "#EC6A5E",
                    transition: "background 0.1s",
                  }}
                  onClick={(e) => { e.stopPropagation(); onClose() }}
                  onPointerDown={(e) => { e.stopPropagation(); setActiveBtn("close") }}
                  onPointerUp={() => setActiveBtn(null)}
                  onPointerLeave={() => { setActiveBtn(null); setHoveredBtn(null) }}
                  onPointerEnter={() => setHoveredBtn("close")}
                >
                  {isFocused && (
                    <svg width="86" height="86" viewBox="0 0 85.4 85.4" fill="none" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M22.5 57.8L57.8 22.5C59.2 21.1 61.4 21.1 62.8 22.5L62.9 22.6C64.3 24 64.3 26.2 62.9 27.6L27.6 62.9C26.2 64.3 24 64.3 22.6 62.9L22.5 62.8C21.2 61.4 21.2 59.2 22.5 57.8Z" fill={hoveredBtn === "close" || activeBtn === "close" ? "#8B1A0F" : "rgba(0,0,0,0.35)"} />
                      <path fillRule="evenodd" clipRule="evenodd" d="M27.6 22.5L62.9 57.8C64.3 59.2 64.3 61.4 62.9 62.8L62.8 62.9C61.4 64.3 59.2 64.3 57.8 62.9L22.5 27.6C21.1 26.2 21.1 24 22.5 22.6L22.6 22.5C24 21.2 26.2 21.2 27.6 22.5Z" fill={hoveredBtn === "close" || activeBtn === "close" ? "#8B1A0F" : "rgba(0,0,0,0.35)"} />
                    </svg>
                  )}
                </button>

                {/* Minimize */}
                <span
                  aria-hidden="true"
                  className="w-3 h-3 rounded-full flex items-center justify-center"
                  style={{
                    background: !isFocused ? "#4E4F52"
                      : activeBtn === "minimize" ? "#FBEB74"
                      : "#F4BF4F",
                    transition: "background 0.1s",
                  }}
                  onPointerEnter={() => setHoveredBtn("minimize")}
                  onPointerLeave={() => setHoveredBtn(null)}
                >
                  {isFocused && (
                    <svg width="86" height="86" viewBox="0 0 85.4 85.4" fill="none" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M17.8 39.1H67.7C69.6 39.1 71.2 40.7 71.2 42.6V42.7C71.2 44.6 69.6 46.2 67.7 46.2H17.8C15.9 46.2 14.3 44.6 14.3 42.7V42.6C14.3 40.7 15.8 39.1 17.8 39.1Z" fill={hoveredBtn === "minimize" ? "#A87229" : "rgba(0,0,0,0.35)"} />
                    </svg>
                  )}
                </span>

                {/* Maximize */}
                <span
                  aria-hidden="true"
                  className="w-3 h-3 rounded-full flex items-center justify-center"
                  style={{
                    background: !isFocused ? "#4E4F52"
                      : activeBtn === "maximize" ? "#86F37E"
                      : "#62C554",
                    transition: "background 0.1s",
                  }}
                  onPointerEnter={() => setHoveredBtn("maximize")}
                  onPointerLeave={() => setHoveredBtn(null)}
                >
                  {isFocused && (
                    <svg width="86" height="86" viewBox="0 0 85.4 85.4" fill="none" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M31.2 20.8H57.9C61.5 20.8 64.4 23.7 64.4 27.3V54L31.2 20.8ZM54.4 64.5H27.6C24 64.5 21.1 61.6 21.1 58V31.2L54.4 64.5Z" fill={hoveredBtn === "maximize" ? "#286017" : "rgba(0,0,0,0.35)"} />
                    </svg>
                  )}
                </span>
              </div>

              {/* Title — rendered as h2 for correct heading semantics. */}
              <h2
                id={titleId}
                className="absolute left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.1em] pointer-events-none m-0 font-normal"
                style={{
                  color: isFocused ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)",
                  transition: "color 0.2s",
                }}
              >
                {title}
              </h2>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden mac-scrollbar"
              style={{ background: "var(--window-bg)" }}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}