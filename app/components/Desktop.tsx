"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import MobileLayout from "./MobileLayout"
import MenuBar from "./MenuBar"
import MacWindow from "./MacWindow"
import Dock from "./Dock"
import GitHubHeatmap from "./GitHubHeatmap"
import NowPlaying from "./NowPlaying"
import StatusWidget from "./widgets/StatusWidget"
import QuoteWidget from "./widgets/QuoteWidget"
import LinksWidget from "./widgets/LinksWidget"
import CalendarWidget from "./widgets/CalendarWidget"
import VisitorWidget from "./widgets/VisitorWidget"
import ThemeWidget from "./widgets/ThemeWidget"
import { ContextMenu, MenuItem } from "./ContextMenu"
import { siteConfig } from "@/config/siteConfig"
import { windows, type WindowId } from "@/config/windows"
import type { PostMeta } from "@/lib/posts"

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]

export default function Desktop({ posts }: { posts: PostMeta[] }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [openWindows, setOpenWindows] = useState<WindowId[]>(["about"])
  const [windowOrder, setWindowOrder] = useState<WindowId[]>(["about"])
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showAboutOverlay, setShowAboutOverlay] = useState(false)
  const [konamiActive, setKonamiActive] = useState(false)
  const konamiIdx = useRef(0)

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Konami code — opt-in via siteConfig.features.konami.
  useEffect(() => {
    if (!siteConfig.features.konami) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIdx.current]) {
        konamiIdx.current += 1
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0
          setKonamiActive(true)
          setTimeout(() => setKonamiActive(false), 3200)
        }
      } else {
        konamiIdx.current = e.key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const focusedWindow = windowOrder[windowOrder.length - 1] ?? null

  const closeWindow = useCallback((id: WindowId) => {
    setOpenWindows((p) => p.filter((w) => w !== id))
    setWindowOrder((p) => p.filter((w) => w !== id))
  }, [])

  const focusWindow = useCallback((id: WindowId) => {
    setWindowOrder((p) => [...p.filter((w) => w !== id), id])
  }, [])

  const toggleWindow = useCallback(
    (id: string, url?: string) => {
      if (url) { window.open(url, "_blank", "noopener,noreferrer"); return }
      const wid = id as WindowId
      if (openWindows.includes(wid)) {
        if (focusedWindow !== wid) { focusWindow(wid) } else { closeWindow(wid) }
      } else {
        setOpenWindows((p) => [...p, wid])
        setWindowOrder((p) => [...p.filter((w) => w !== wid), wid])
      }
    },
    [openWindows, focusedWindow, focusWindow, closeWindow]
  )

  const getZIndex = (id: WindowId) => {
    const idx = windowOrder.indexOf(id)
    return idx === -1 ? 10 : 10 + idx
  }

  const contextMenuItems: MenuItem[] = [
    { label: "New Window",        shortcut: "⌘N", onClick: () => toggleWindow("about"),    dividerAfter: false },
    { label: "Open Terminal",     shortcut: "⌘T", onClick: () => toggleWindow("terminal"), dividerAfter: true },
    { label: "About this Portfolio",                onClick: () => setShowAboutOverlay(true), dividerAfter: false },
    { label: "View Source",                         onClick: () => window.open(siteConfig.social.github, "_blank"), dividerAfter: true },
    { label: "Contact",                             onClick: () => toggleWindow("contact") },
  ]

  if (isMobile === null) return null
  if (isMobile) return <MobileLayout posts={posts} />

  const focusedTitle = focusedWindow ? windows.find((w) => w.id === focusedWindow)?.title ?? null : null

  return (
    <div
      className="fixed inset-0 overflow-hidden desktop-bg"
      onContextMenu={(e) => {
        if ((e.target as Element).closest("[data-mac-window]")) return
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
      onClick={() => setContextMenu(null)}
    >
      <div className="album-wallpaper" aria-hidden="true" />

      <MenuBar focusedApp={focusedTitle} />

      {/* Window layer — every window is driven by the /config/windows.ts registry. */}
      {windows.map((win) => {
        const Section = win.component
        // Blogs is the only window that needs extra props (server-fetched post list).
        const extraProps = win.id === "blogs" ? { posts } : {}
        // Terminal needs open/close callbacks so its `open` and `exit` commands work.
        const terminalProps = win.id === "terminal"
          ? { onOpen: toggleWindow, onClose: () => closeWindow("terminal") }
          : {}
        return (
          <MacWindow
            key={win.id}
            windowId={win.id}
            title={win.id === "resume" ? `Résumé — ${siteConfig.personal.fullName}` : win.title}
            isOpen={openWindows.includes(win.id)}
            isFocused={focusedWindow === win.id}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            zIndex={getZIndex(win.id)}
            width={win.width}
            height={win.height}
            offsetX={win.offsetX}
            offsetY={win.offsetY}
          >
            <Section compact {...extraProps} {...terminalProps} />
          </MacWindow>
        )
      })}

      {/* Desktop widgets */}
      <QuoteWidget />
      <StatusWidget />
      <LinksWidget />
      <CalendarWidget />
      <VisitorWidget />
      <ThemeWidget />
      <NowPlaying />
      <GitHubHeatmap />

      <Dock openWindows={openWindows} onToggleWindow={toggleWindow} />

      {/* Right-click context menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            items={contextMenuItems}
          />
        )}
      </AnimatePresence>

      {/* About this Portfolio overlay */}
      <AnimatePresence>
        {showAboutOverlay && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-overlay-title"
            className="fixed inset-0 z-[600] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAboutOverlay(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 8 }}
              transition={{ type: "spring", damping: 28, stiffness: 380 }}
              className="px-8 py-7 text-center"
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                width: 320,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                About this Portfolio
              </p>
              <h2 id="about-overlay-title" className="text-[22px] font-semibold text-white mb-1">macOS Portfolio</h2>
              <p className="font-mono text-[11px] mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Version 1.0.0</p>
              <div
                className="text-left space-y-2 py-4 mb-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                {[
                  ["Runtime",    "Next.js 15 · React 19"],
                  ["Language",   "TypeScript"],
                  ["Styling",    "Tailwind CSS v4"],
                  ["Animation",  "Framer Motion"],
                  ["Font",       "Geist · Geist Mono"],
                  ["Deployed",   "Vercel Edge Network"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>{k}</span>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onClick={() => setShowAboutOverlay(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami code easter egg — gated on siteConfig.features.konami */}
      <AnimatePresence>
        {konamiActive && (
          <motion.div
            className="fixed inset-0 z-[700] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="text-center px-10 py-8"
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
              }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                ✦ Cheat Code Activated ✦
              </p>
              <p className="text-[28px] font-semibold text-white mb-2">+99 Engineering Credits</p>
              <p className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Hello, fellow human of culture.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
