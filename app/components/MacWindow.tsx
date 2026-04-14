"use client"

import { useEffect, useId, useRef } from "react"
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
              borderRadius: 8,
              border: isFocused
                ? "1px solid var(--window-border-focused)"
                : "1px solid var(--window-border-unfocused)",
              boxShadow: isFocused
                ? "0 40px 80px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(0,0,0,1)"
                : "0 16px 40px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(0,0,0,1)",
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            }}
          >
            {/* Title Bar */}
            <div
              className="flex-none flex items-center h-9 px-3 relative select-none cursor-grab active:cursor-grabbing"
              style={{
                background: "var(--titlebar-bg)",
                borderBottom: "1px solid var(--window-border-unfocused)",
              }}
              onPointerDown={(e) => dragControls.start(e)}
            >
              {/* Close button — yellow/green are decorative (aria-hidden). */}
              <div className="flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  aria-label={`Close ${title}`}
                  className="w-2.5 h-2.5 rounded-full flex-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--titlebar-bg)]"
                  style={{
                    background: isFocused ? "#ff5f57" : "rgba(255,255,255,0.12)",
                    transition: "background 0.15s",
                  }}
                  onClick={(e) => { e.stopPropagation(); onClose() }}
                  onPointerDown={(e) => e.stopPropagation()}
                />
                <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
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
