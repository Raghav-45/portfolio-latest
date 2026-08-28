"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { Github } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"
import { windows } from "@/config/windows"

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

type DockItem =
  | { kind: "window"; id: string; label: string; icon: React.ReactNode }
  | { kind: "link"; id: string; label: string; icon: React.ReactNode; url: string }

const dockApps: DockItem[] = windows.map((w) => ({
  kind: "window",
  id: w.id,
  label: w.title,
  icon: <w.icon size={22} strokeWidth={1.5} aria-hidden="true" />,
}))

const dockLinks: DockItem[] = [
  { kind: "link", id: "github",  label: "GitHub", icon: <Github size={20} strokeWidth={1.5} aria-hidden="true" />, url: siteConfig.social.github },
  { kind: "link", id: "twitter", label: "X",      icon: <XIcon size={18} />,                                        url: siteConfig.social.twitter },
]

function DockIcon({
  item,
  mouseX,
  isOpen,
  onActivate,
}: {
  item: DockItem
  mouseX: ReturnType<typeof useMotionValue<number>>
  isOpen: boolean
  onActivate: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const sizeTransform = useTransform(distance, [-120, 0, 120], [40, 62, 40])
  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 200, damping: 14 })

  return (
    <div className="relative flex flex-col items-center gap-1">
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-full mb-2 px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase tracking-[0.06em] whitespace-nowrap pointer-events-none"
            style={{
              background: "var(--tooltip-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-primary)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            aria-hidden="true"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        type="button"
        aria-label={item.label}
        aria-pressed={item.kind === "window" ? isOpen : undefined}
        style={{ width: size, height: size }}
        animate={{
          background: isOpen ? "rgba(255,255,255,0.1)" : hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
          color: isOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
          boxShadow: isOpen
            ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.3)"
            : hovered
              ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 6px rgba(0,0,0,0.25)"
              : "none",
        }}
        transition={{ duration: 0.15 }}
        className="rounded-[14px] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        whileTap={{ scale: 0.88 }}
        onClick={onActivate}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {item.icon}
      </motion.button>

      <span
        aria-hidden="true"
        className="w-1 h-1 rounded-full"
        style={{
          background: isOpen ? "var(--accent)" : "transparent",
          transition: "background 0.2s",
        }}
      />
    </div>
  )
}

export default function Dock({
  openWindows,
  onToggleWindow,
}: {
  openWindows: string[]
  onToggleWindow: (id: string, url?: string) => void
}) {
  const mouseX = useMotionValue(Infinity)

  return (
    <nav
      aria-label="Application dock"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]"
    >
      <motion.div
        className="flex items-end gap-2 px-3 pb-2 pt-2.5 rounded-[20px]"
        style={{
          background: "var(--dock-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px) saturate(1.3)",
          WebkitBackdropFilter: "blur(24px) saturate(1.3)",
        }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {/* Specular highlight along top edge */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px pointer-events-none rounded-[20px]"
          style={{
            background: "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.06) 50%, transparent 85%)",
          }}
        />

        {dockApps.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isOpen={openWindows.includes(item.id)}
            onActivate={() => onToggleWindow(item.id)}
          />
        ))}

        <span
          aria-hidden="true"
          className="h-8 self-center mx-1 rounded-full"
          style={{ width: 1, background: "var(--glass-border)" }}
        />

        {dockLinks.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isOpen={false}
            onActivate={() => onToggleWindow(item.id, item.kind === "link" ? item.url : undefined)}
          />
        ))}
      </motion.div>
    </nav>
  )
}