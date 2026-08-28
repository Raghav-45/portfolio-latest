"use client"

import { useState, useEffect } from "react"

export default function MenuBar({ focusedApp }: { focusedApp: string | null }) {
  const [timeStr, setTimeStr] = useState("")
  const [dateStr, setDateStr] = useState("")
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
      setDateStr(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // POST = the single increment per page visit. Other widgets just GET.
    fetch("/api/views", { method: "POST" })
      .then((r) => r.json())
      .then((d) => { if (d.count !== null) setVisits(d.count) })
      .catch(() => {})
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-7 z-[100] flex items-center justify-between px-4 select-none"
      style={{
        background: "var(--menubar-bg)",
        borderBottom: "1px solid var(--glass-border)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
      }}
    >
      {/* Specular highlight along bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.04) 50%, transparent 90%)",
        }}
      />

      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.9)" }}>
          ADITYA
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>|</span>
        <span className="font-mono text-[11px] tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
          {focusedApp ?? "Desktop"}
        </span>
      </div>

      <div className="flex items-center gap-4 font-mono text-[11px]">
        {visits !== null && (
          <span style={{ color: "rgba(255,255,255,0.2)" }}>
            ↑ {visits.toLocaleString()}
          </span>
        )}
        <span style={{ color: "rgba(255,255,255,0.35)" }}>{dateStr}</span>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{timeStr}</span>
      </div>
    </div>
  )
}