"use client"

import { useState, useEffect } from "react"
import { motion, useDragControls } from "framer-motion"
// Available themes live in /config/themes.ts. Palette CSS variables for
// each theme live in app/globals.css under the matching [data-theme="..."].
import { themes, type ThemeKey } from "@/config/themes"

const LS_KEY = "portfolio-theme"
const DEFAULT_THEME: ThemeKey = "midnight"

function applyTheme(theme: ThemeKey) {
  if (theme === DEFAULT_THEME) {
    delete document.documentElement.dataset.theme
  } else {
    document.documentElement.dataset.theme = theme
  }
  try { localStorage.setItem(LS_KEY, theme) } catch {}
}

export default function ThemeWidget() {
  const [active, setActive] = useState<ThemeKey>(DEFAULT_THEME)
  const [hovered, setHovered] = useState<ThemeKey | null>(null)
  const dragControls = useDragControls()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY) as ThemeKey | null
      if (saved && themes.some((t) => t.key === saved)) {
        setActive(saved)
        applyTheme(saved)
      }
    } catch {}
  }, [])

  const select = (theme: ThemeKey) => {
    setActive(theme)
    applyTheme(theme)
  }

  const activeTheme = themes.find((t) => t.key === active)!

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      style={{ position: "fixed", bottom: 90, left: 560, zIndex: 5, width: 240 }}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          height: 22,
          background: "rgba(255,255,255,0.04)",
          borderRadius: "8px 8px 0 0",
          border: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "none",
        }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div style={{ width: 28, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.12)" }} />
      </div>

      {/* Widget body */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "0 0 8px 8px",
          padding: "10px 12px 12px",
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Theme
          </span>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.1em]"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            {activeTheme.description}
          </span>
        </div>

        {/* Swatch grid */}
        <div className="flex gap-2">
          {themes.map((theme) => {
            const isActive = active === theme.key
            const isHovered = hovered === theme.key

            return (
              <motion.button
                key={theme.key}
                onClick={() => select(theme.key)}
                onHoverStart={() => setHovered(theme.key)}
                onHoverEnd={() => setHovered(null)}
                animate={{
                  scale: isHovered ? 1.07 : 1,
                  opacity: isActive ? 1 : isHovered ? 0.8 : 0.45,
                }}
                transition={{ type: "spring", damping: 26, stiffness: 380 }}
                style={{
                  flex: 1,
                  aspectRatio: "1 / 1",
                  borderRadius: 5,
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: isActive
                    ? `1.5px solid ${theme.accentColor}`
                    : "1.5px solid rgba(255,255,255,0.08)",
                  transition: "border-color 0.25s",
                  padding: 0,
                  background: "transparent",
                }}
              >
                {theme.gradient ? (
                  <div style={{ position: "absolute", inset: 0, background: theme.gradient }} />
                ) : (
                  /* Midnight — abstract dark sleeve */
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, #1c1c1c 0%, #0a0a0a 50%, #161616 100%)",
                    }}
                  >
                    {[28, 42, 55].map((pct) => (
                      <div
                        key={pct}
                        style={{
                          position: "absolute",
                          inset: `${pct}%`,
                          borderRadius: "50%",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="theme-dot"
                    style={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: theme.accentColor,
                      boxShadow: `0 0 6px ${theme.accentColor}`,
                    }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Labels */}
        <div className="flex gap-2 mt-1.5">
          {themes.map((theme) => (
            <div key={theme.key} style={{ flex: 1 }} className="text-center">
              <span
                className="font-mono text-[8px] uppercase tracking-[0.06em]"
                style={{
                  color: active === theme.key
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.15)",
                  transition: "color 0.25s",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {theme.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
