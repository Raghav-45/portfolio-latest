"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock } from "lucide-react"

const HOME_URL = "https://en.wikipedia.org/wiki/Web_browser"

/** Turn whatever the user typed into a navigable URL. */
function resolveInput(raw: string): string {
  const q = raw.trim()
  if (!q) return HOME_URL
  if (/^https?:\/\//i.test(q)) return q
  // Looks like a domain (has a dot, no spaces) → prepend https.
  if (/^[^\s]+\.[^\s]+$/.test(q)) return `https://${q}`
  // Otherwise treat as a search query (DuckDuckGo's lite html allows iframes).
  return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`
}

function prettyHost(url: string): string {
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
  const [history, setHistory] = useState<string[]>([HOME_URL])
  const [cursor, setCursor] = useState(0)
  const [input, setInput] = useState(HOME_URL)
  const [loading, setLoading] = useState(true)
  // Bumped on every reload to force the iframe to re-fetch the same URL.
  const [reloadKey, setReloadKey] = useState(0)

  const current = history[cursor]
  const canBack = cursor > 0
  const canForward = cursor < history.length - 1

  useEffect(() => { setInput(current) }, [current])

  function navigate(rawUrl: string) {
    const next = resolveInput(rawUrl)
    if (next === current) {
      setReloadKey((k) => k + 1)
      setLoading(true)
      return
    }
    const trimmed = history.slice(0, cursor + 1)
    setHistory([...trimmed, next])
    setCursor(trimmed.length)
    setLoading(true)
  }

  function goBack() {
    if (!canBack) return
    setCursor((c) => c - 1)
    setLoading(true)
  }
  function goForward() {
    if (!canForward) return
    setCursor((c) => c + 1)
    setLoading(true)
  }
  function reload() {
    setReloadKey((k) => k + 1)
    setLoading(true)
  }
  function goHome() {
    navigate(HOME_URL)
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
            <Lock size={10} style={{ color: "var(--text-faint)" }} />
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
              {loading ? "Loading…" : prettyHost(current)}
            </span>
          </div>
        </form>
      </div>

      {/* Iframe viewport — zoomed out so more of the page fits. The iframe is
          oversized to (1/scale) and then scaled back down via transform. */}
      <div className="flex-1 relative bg-white overflow-hidden">
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
