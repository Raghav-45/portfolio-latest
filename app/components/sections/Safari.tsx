"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock } from "lucide-react"

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
  { name: "Thunder Forms", url: "https://thunderforms.in",     bg: "#7c3aed", fg: "#ffffff" },
  { name: "Wikipedia",     url: "https://www.wikipedia.org",   bg: "#ffffff", fg: "#000000" },
  { name: "Zomato",        url: "https://www.zomato.com",      bg: "#cb202d", fg: "#ffffff" },
]

interface ExperienceTile {
  company: string
  role: string
  period: string
  url: string
  bg: string
  fg: string
}

// Companies I've worked at — rendered as wider cards so they read like
// résumé entries, not app icons.
const EXPERIENCE: ExperienceTile[] = [
  { company: "Human Archive", role: "Full Stack Engineer",   period: "Feb 2026 - Present",  url: "https://humanarchive.ai", bg: "#18181b", fg: "#ffffff" },
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
  const [loading, setLoading] = useState(false)
  // Bumped on every reload to force the iframe to re-fetch the same URL.
  const [reloadKey, setReloadKey] = useState(0)

  const current = history[cursor]
  const onStart = current === START_URL
  const canBack = cursor > 0
  const canForward = cursor < history.length - 1

  useEffect(() => {
    setInput(current === START_URL ? "" : current)
    if (current === START_URL) setLoading(false)
  }, [current])

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
      {/* Toolbar */}
      <div
        className="flex-none flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: "1px solid var(--separator)" }}
      >
        <NavButton onClick={goBack} disabled={!canBack} ariaLabel="Back">
          <ArrowLeft size={13} />
        </NavButton>
        <NavButton onClick={goForward} disabled={!canForward} ariaLabel="Forward">
          <ArrowRight size={13} />
        </NavButton>
        <NavButton onClick={reload} ariaLabel="Reload">
          <RotateCw size={12} className={loading ? "animate-spin" : ""} />
        </NavButton>
        <NavButton onClick={goHome} ariaLabel="Home">
          <Home size={12} />
        </NavButton>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate(input) }}
          className="flex-1"
        >
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--separator)",
            }}
          >
            <Lock
              size={10}
              style={{ color: "var(--text-faint)", opacity: onStart ? 0 : 1 }}
            />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              spellCheck={false}
              placeholder="Search or enter website"
              className="flex-1 bg-transparent border-none outline-none font-mono text-[11px]"
              style={{ color: "rgba(255,255,255,0.75)" }}
            />
            <span
              className="font-mono text-[9px] uppercase tracking-[0.1em] hidden sm:inline"
              style={{ color: "var(--text-faint)" }}
            >
              {onStart ? "" : loading ? "Loading…" : prettyHost(current)}
            </span>
          </div>
        </form>
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
            {/* Fallback note — covers the most common iframe failure modes. */}
            <p
              className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.12em] pointer-events-none"
              style={{ color: "rgba(0,0,0,0.35)" }}
            >
              Some sites (Google, GitHub, YouTube) block iframe embedding.
            </p>
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
        className="w-[58px] h-[58px] rounded-2xl flex items-center justify-center transition-transform duration-150 group-hover:scale-[1.06] group-active:scale-95"
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
            className="w-8 h-8"
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
          className="text-[12px] font-semibold tracking-tight truncate"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          {item.company}
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
