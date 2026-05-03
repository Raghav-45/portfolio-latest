"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, RotateCw, Share, Plus, Copy } from "lucide-react"

/** Sentinel for the Safari-style start page (no iframe — local UI). */
const START_URL = "safari:start"

interface Favourite {
  name: string
  url: string
  bg: string
  fg: string
}

// Only sites that allow iframe embedding — others (Google, Facebook, X, etc.)
// send X-Frame-Options/CSP headers that block loading inside this browser.
// Personal projects with deployed URLs are mixed in alongside third-party sites.
const FAVOURITES: Favourite[] = [
  { name: "Thunder Forms", url: "https://thunderforms.in",     bg: "#000", fg: "#ffffff" },
  { name: "Wikipedia",     url: "https://www.wikipedia.org",   bg: "#ffffff", fg: "#000000" },
  { name: "Zomato",        url: "https://www.zomato.com",      bg: "#cb202d", fg: "#000000" },
]

interface ExperienceTile {
  company: string
  role: string
  period: string
  url: string
  bg: string
  fg: string
  /** Optional Y Combinator batch (e.g. "W26") — renders an orange YC pill. */
  ycBatch?: string
}

// Companies I've worked at — rendered as wider cards so they read like
// résumé entries, not app icons.
const EXPERIENCE: ExperienceTile[] = [
  { company: "Human Archive", role: "Full Stack Engineer",   period: "Feb 2026 - May 2026",  url: "https://humanarchive.ai", bg: "#18181b", fg: "#ffffff", ycBatch: "W26" },
  { company: "Conqr AI",      role: "Full Stack Engineer",   period: "May 2025 - Jan 2026", url: "https://conqr.ai",        bg: "#1e3a8a", fg: "#ffffff" },
  { company: "Spacedrive",    role: "Open Source Contributor", period: "Aug 2023 - May 2025", url: "https://spacedrive.com", bg: "#000000", fg: "#ffffff" },
]

/** Turn whatever the user typed into a navigable URL. */
function resolveInput(raw: string): string {
  const q = raw.trim()
  if (!q) return START_URL
  if (/^https?:\/\//i.test(q)) return q
  // Looks like a domain (has a dot, no spaces) → prepend https.
  if (/^[^\s]+\.[^\s]+$/.test(q)) return `https://${q}`
  // Otherwise treat as a search query (DuckDuckGo's lite html allows iframes).
  return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`
}

function prettyHost(url: string): string {
  if (url === START_URL) return ""
  try {
    const u = new URL(url)
    return u.host.replace(/^www\./, "") + (u.pathname === "/" ? "" : u.pathname)
  } catch {
    return url
  }
}

export default function Safari({ compact = false }: { compact?: boolean }) {
  // History stack — we control back/forward instead of relying on iframe.history,
  // which is inaccessible across origins anyway.
  const [history, setHistory] = useState<string[]>([START_URL])
  const [cursor, setCursor] = useState(0)
  const [input, setInput] = useState("")
  // When the URL bar is focused, show the full URL for editing; otherwise
  // show just the host (matches real Safari).
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  // Bumped on every reload to force the iframe to re-fetch the same URL.
  const [reloadKey, setReloadKey] = useState(0)

  const current = history[cursor]
  const onStart = current === START_URL
  const canBack = cursor > 0
  const canForward = cursor < history.length - 1

  useEffect(() => {
    if (!editing) setInput(onStart ? "" : prettyHost(current))
    if (onStart) setLoading(false)
  }, [current, editing, onStart])

  function pushUrl(url: string) {
    if (url === current) {
      if (url !== START_URL) {
        setReloadKey((k) => k + 1)
        setLoading(true)
      }
      return
    }
    const trimmed = history.slice(0, cursor + 1)
    setHistory([...trimmed, url])
    setCursor(trimmed.length)
    setLoading(url !== START_URL)
  }

  function navigate(rawUrl: string) {
    pushUrl(resolveInput(rawUrl))
  }

  function goBack() {
    if (!canBack) return
    setCursor((c) => c - 1)
  }
  function goForward() {
    if (!canForward) return
    setCursor((c) => c + 1)
  }
  function reload() {
    if (onStart) return
    setReloadKey((k) => k + 1)
    setLoading(true)
  }
  function goHome() {
    pushUrl(START_URL)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={compact ? "h-full flex flex-col" : "h-[80vh] flex flex-col"}
    >
      {/* Toolbar — back/forward · centered URL pill · share · new tab · tabs. */}
      <div
        className="flex-none flex items-center gap-1.5 px-3 py-2.5"
        style={{ borderBottom: "1px solid var(--separator)" }}
      >
        <div className="flex items-center gap-0.5 flex-none">
          <NavButton onClick={goBack} disabled={!canBack} ariaLabel="Back">
            <ChevronLeft size={18} strokeWidth={2.25} />
          </NavButton>
          <NavButton onClick={goForward} disabled={!canForward} ariaLabel="Forward">
            <ChevronRight size={18} strokeWidth={2.25} />
          </NavButton>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate(input); (e.target as HTMLFormElement).querySelector("input")?.blur() }}
          className="flex-1 flex justify-center min-w-0"
        >
          <div
            className="relative w-full max-w-[520px] h-7 overflow-hidden"
            style={{
              background: "rgba(0,0,0,0.30)",
              boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.05)",
              borderRadius: 999,
            }}
          >
            {/* Always-mounted input. Text is invisible when not editing so the
                animated overlay span owns the visual; cursor still works because
                the input fills the whole pill. */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={(e) => {
                setEditing(true)
                if (!onStart) setInput(current)
                requestAnimationFrame(() => e.currentTarget.select())
              }}
              onBlur={() => {
                setEditing(false)
                setInput(onStart ? "" : prettyHost(current))
              }}
              spellCheck={false}
              placeholder={editing ? "Search or enter website name" : ""}
              className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-[12.5px] tracking-tight px-3.5"
              style={{
                color: editing ? "rgba(255,255,255,0.92)" : "transparent",
                caretColor: "rgba(255,255,255,0.92)",
                textAlign: "left",
                // Matches the overlay span: snappier in, gentler out.
                transition: editing
                  ? "color 0.14s ease-out"
                  : "color 0.20s ease-out",
              }}
            />

            {/* Animated display layer — single span persistently mounted; only
                its `x` and opacity animate, so the slide is one fluid motion
                with no layout reflow or background flash. */}
            <motion.span
              className="absolute top-1/2 text-[12.5px] tracking-tight truncate pointer-events-none whitespace-nowrap"
              initial={false}
              animate={{
                left: editing ? "14px" : "50%",
                x: editing ? 0 : "-50%",
                y: "-50%",
                opacity: editing ? 0 : 1,
              }}
              transition={{
                left:    { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
                x:       { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
                // Gradual fade in both directions, but focus is snappier than blur.
                opacity: editing
                  ? { duration: 0.14, ease: "easeOut" }
                  : { duration: 0.20, ease: "easeOut" },
              }}
              style={{ color: onStart ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.88)" }}
            >
              {onStart ? "Search or enter website name" : prettyHost(current)}
            </motion.span>

            {/* Reload icon — fades when the bar gets focus. */}
            <motion.button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={reload}
              aria-label="Reload"
              initial={false}
              animate={{
                opacity: !editing && !onStart ? 1 : 0,
                pointerEvents: !editing && !onStart ? "auto" : "none",
              }}
              transition={{ duration: 0.18 }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <RotateCw size={11} className={loading ? "animate-spin" : ""} />
            </motion.button>
          </div>
        </form>

        <div className="flex items-center gap-0.5 flex-none">
          <NavButton
            onClick={() => { if (!onStart) window.open(current, "_blank", "noopener,noreferrer") }}
            disabled={onStart}
            ariaLabel="Open in new tab"
          >
            <Share size={13} strokeWidth={2} />
          </NavButton>
          <NavButton onClick={goHome} ariaLabel="New tab">
            <Plus size={15} strokeWidth={2.25} />
          </NavButton>
          <NavButton onClick={goHome} ariaLabel="Show all tabs">
            <Copy size={13} strokeWidth={2} />
          </NavButton>
        </div>
      </div>

      {/* Viewport — start page or iframe, mutually exclusive. */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: onStart ? "var(--window-bg)" : "white" }}
      >
        {onStart ? (
          <StartPage onPick={pushUrl} />
        ) : (
          <>
            <iframe
              key={`${current}::${reloadKey}`}
              src={current}
              title="Safari"
              referrerPolicy="no-referrer"
              sandbox="allow-forms allow-popups allow-scripts allow-same-origin"
              onLoad={() => setLoading(false)}
              className="border-0"
              style={{
                width: "153.85%",
                height: "153.85%",
                transform: "scale(0.65)",
                transformOrigin: "0 0",
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  )
}

function NavButton({
  onClick, disabled, ariaLabel, children,
}: {
  onClick: () => void
  disabled?: boolean
  ariaLabel: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className="w-6 h-6 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white/10"
      style={{ color: "rgba(255,255,255,0.6)" }}
    >
      {children}
    </button>
  )
}

/** Safari-style start page: Favourites + Projects (tiles) + Experience (cards). */
function StartPage({ onPick }: { onPick: (url: string) => void }) {
  return (
    <div className="h-full overflow-y-auto mac-scrollbar px-8 py-8 space-y-8">
      <TileSection title="Favourites" items={FAVOURITES} onPick={onPick} />
      <ExperienceSection items={EXPERIENCE} onPick={onPick} />
    </div>
  )
}

function TileSection({
  title, items, onPick,
}: {
  title: string
  items: Favourite[]
  onPick: (url: string) => void
}) {
  return (
    <section>
      <h3
        className="text-[18px] font-semibold tracking-tight mb-6"
        style={{ color: "rgba(255,255,255,0.92)" }}
      >
        {title}
      </h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-x-3 gap-y-5">
        {items.map((f) => (
          <FavTile key={f.url} fav={f} onPick={onPick} />
        ))}
      </div>
    </section>
  )
}

function FavTile({
  fav, onPick,
}: {
  fav: Favourite
  onPick: (url: string) => void
}) {
  const [errored, setErrored] = useState(false)
  let host = ""
  try { host = new URL(fav.url).host } catch {}

  return (
    <button
      type="button"
      onClick={() => onPick(fav.url)}
      className="group flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
    >
      <div
        className="w-14.5 h-14.5 rounded-2xl flex items-center justify-center transition-transform duration-150 group-hover:scale-[1.06] group-active:scale-95"
        style={{
          background: fav.bg,
          boxShadow: "0 2px 6px rgba(0,0,0,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.06)",
        }}
      >
        {errored ? (
          <span className="text-[24px] font-semibold leading-none" style={{ color: fav.fg }}>
            {fav.name[0]}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://www.google.com/s2/favicons?domain=${host}&sz=128`}
            alt=""
            className="w-8 h-8 overflow-hidden rounded-sm"
            onError={() => setErrored(true)}
          />
        )}
      </div>
      <span
        className="text-[10.5px] leading-tight text-center line-clamp-2"
        style={{ color: "rgba(255,255,255,0.72)" }}
      >
        {fav.name}
      </span>
    </button>
  )
}

/** Experience: wider résumé-style cards with company, role, period. */
function ExperienceSection({
  items, onPick,
}: {
  items: ExperienceTile[]
  onPick: (url: string) => void
}) {
  return (
    <section>
      <h3
        className="text-[18px] font-semibold tracking-tight mb-6"
        style={{ color: "rgba(255,255,255,0.92)" }}
      >
        Experience
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((e) => (
          <ExperienceCard key={e.url} item={e} onPick={onPick} />
        ))}
      </div>
    </section>
  )
}

function ExperienceCard({
  item, onPick,
}: {
  item: ExperienceTile
  onPick: (url: string) => void
}) {
  const [errored, setErrored] = useState(false)
  let host = ""
  try { host = new URL(item.url).host } catch {}

  return (
    <button
      type="button"
      onClick={() => onPick(item.url)}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left outline-none transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-white/40"
      style={{ border: "1px solid var(--separator)" }}
    >
      <div
        className="flex-none w-9 h-9 rounded-lg flex items-center justify-center"
        style={{
          background: item.bg,
          boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.08)",
        }}
      >
        {errored ? (
          <span className="text-[13px] font-semibold leading-none" style={{ color: item.fg }}>
            {item.company[0]}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://www.google.com/s2/favicons?domain=${host}&sz=128`}
            alt=""
            className="w-5 h-5"
            onError={() => setErrored(true)}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[12px] font-semibold tracking-tight truncate flex items-center gap-1.5"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          <span className="truncate">{item.company}</span>
          {item.ycBatch && <YCBadge batch={item.ycBatch} />}
        </p>
        <p
          className="text-[10.5px] truncate"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {item.role}
        </p>
      </div>
      <span
        className="font-mono text-[8.5px] uppercase tracking-[0.1em] flex-none whitespace-nowrap hidden sm:inline"
        style={{ color: "var(--text-faint)" }}
      >
        {item.period}
      </span>
    </button>
  )
}

/** Y Combinator pill — recognizable orange tile + batch (e.g. "W26"). */
function YCBadge({ batch }: { batch: string }) {
  return (
    <span
      className="inline-flex items-center gap-[3px] flex-none leading-none rounded-[3px] overflow-hidden"
      title={`Backed by Y Combinator · ${batch}`}
      aria-label={`Y Combinator ${batch}`}
    >
      <span
        className="font-bold"
        style={{
          background: "#FB651E",
          color: "#ffffff",
          fontSize: 9,
          padding: "2px 4px",
          letterSpacing: "0.2px",
        }}
      >
        Y
      </span>
      <span
        className="font-semibold"
        style={{ color: "#FB651E", fontSize: 9, letterSpacing: "0.4px" }}
      >
        {batch}
      </span>
    </span>
  )
}
