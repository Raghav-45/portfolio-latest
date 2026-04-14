"use client"

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react"
import { siteConfig } from "@/config/siteConfig"
import { cwdToString } from "@/lib/terminal/fs"
import {
  run, getCompletions, BOOT, type Line, type RunContext,
} from "@/lib/terminal/commands"

interface TerminalProps {
  compact?: boolean
  onOpen?: (id: string) => void
  onClose?: () => void
}

/**
 * Terminal window. All command behaviour lives in lib/terminal/commands.ts;
 * the virtual filesystem in lib/terminal/fs.ts. This component owns only
 * input handling, history, tab-cycle state, and rendering.
 */
export default function Terminal({ compact = false, onOpen, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>(BOOT)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [cwd, setCwd] = useState<string[]>([])
  const [tabCycle, setTabCycle] = useState<{ completions: string[]; idx: number } | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const getPrompt = useCallback(() => {
    return `${siteConfig.personal.username}@portfolio ${cwdToString(cwd)} % `
  }, [cwd])

  const submit = useCallback(() => {
    const cmd = input.trim()
    const inputLine: Line = { type: "input", text: getPrompt() + input }

    const ctx: RunContext = { cwd, setCwd, history, onOpen, onClose }
    const result = run(cmd, ctx)

    if (result[0]?.text === "__clear__") {
      setLines(BOOT)
    } else {
      setLines((prev) => [...prev, inputLine, ...result])
    }

    if (cmd) setHistory((prev) => [cmd, ...prev])
    setInput("")
    setHistIdx(-1)
    setTabCycle(null)
  }, [input, cwd, history, onOpen, onClose, getPrompt])

  const handleTab = useCallback(() => {
    const completions = getCompletions(input, cwd)
    if (completions.length === 0) return

    if (completions.length === 1) {
      const tokens = input.split(/\s+/)
      tokens[tokens.length - 1] = completions[0]
      setInput(tokens.join(" "))
      setTabCycle(null)
      return
    }

    if (tabCycle && tabCycle.completions.join() === completions.join()) {
      const nextIdx = (tabCycle.idx + 1) % completions.length
      const tokens = input.split(/\s+/)
      tokens[tokens.length - 1] = completions[nextIdx]
      setInput(tokens.join(" "))
      setTabCycle({ completions, idx: nextIdx })
    } else {
      const inputLine: Line = { type: "input", text: getPrompt() + input }
      const completionLines = completions.map((c) => ({ type: "output" as const, text: c }))
      setLines((prev) => [...prev, inputLine, ...completionLines])
      setTabCycle({ completions, idx: -1 })
    }
  }, [input, cwd, tabCycle, getPrompt])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      handleTab()
      return
    }

    if (e.key !== "Tab") setTabCycle(null)

    if (e.key === "Enter") { submit(); return }

    // Ctrl+C — cancel input
    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault()
      const cancelLine: Line = { type: "input", text: getPrompt() + input + "^C" }
      setLines((prev) => [...prev, cancelLine])
      setInput("")
      setHistIdx(-1)
      return
    }

    // Ctrl+D — EOF. Closes the terminal (matches real shells).
    if (e.key === "d" && e.ctrlKey) {
      e.preventDefault()
      onClose?.()
      return
    }

    // Ctrl+L — clear screen
    if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines(BOOT); return }
    // Ctrl+A — beginning of line
    if (e.key === "a" && e.ctrlKey) { e.preventDefault(); inputRef.current?.setSelectionRange(0, 0); return }
    // Ctrl+E — end of line
    if (e.key === "e" && e.ctrlKey) { e.preventDefault(); const len = input.length; inputRef.current?.setSelectionRange(len, len); return }
    // Ctrl+U — clear line
    if (e.key === "u" && e.ctrlKey) { e.preventDefault(); setInput(""); return }
    // Ctrl+W — delete previous word
    if (e.key === "w" && e.ctrlKey) { e.preventDefault(); setInput((p) => p.replace(/\S+\s*$/, "")); return }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? "")
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? "" : history[next])
    }
  }

  return (
    <div
      className={`font-mono text-[12px] leading-relaxed h-full flex flex-col cursor-text select-text ${compact ? "p-4" : "p-5"}`}
      style={{ background: "var(--terminal-bg)", color: "rgba(255,255,255,0.7)" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output region — role="log" so screen readers announce command output. */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="flex-1 overflow-y-auto mac-scrollbar space-y-0.5 pb-2"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap break-all"
            style={{
              color:
                line.type === "input"  ? "rgba(255,255,255,0.85)" :
                line.type === "error"  ? "rgba(255,100,100,0.8)"  :
                line.type === "system" ? "rgba(255,255,255,0.35)" :
                                         "rgba(255,255,255,0.5)",
            }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="flex items-center gap-0 flex-none pt-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span style={{ color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }} aria-hidden="true">
          {getPrompt()}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setTabCycle(null) }}
          onKeyDown={onKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Terminal input"
          className="flex-1 bg-transparent outline-none caret-white min-w-0"
          style={{ color: "rgba(255,255,255,0.85)" }}
        />
      </div>
    </div>
  )
}
