"use client"

import { useEffect, useState } from "react"
import { Github } from "lucide-react"
import { motion, useDragControls } from "framer-motion"
// GitHub username label — edit siteConfig.social.githubUsername in /config/siteConfig.ts.
import { siteConfig } from "@/config/siteConfig"

interface Contribution {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

// Green scale stays green — it's contribution data, not UI chrome
const LEVEL_COLORS = [
  "var(--heatmap-empty)",
  "rgba(0,200,100,0.25)",
  "rgba(0,200,100,0.45)",
  "rgba(0,200,100,0.70)",
  "rgba(0,200,100,0.95)",
]

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

export default function GitHubHeatmap() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loaded, setLoaded] = useState(false)
  const dragControls = useDragControls()

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        setContributions(d.contributions ?? [])
        const sum = Object.values(d.total as Record<string, number>).reduce(
          (a: number, b) => a + (b as number), 0
        )
        setTotal(sum as number)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  if (!loaded) return null

  const weeks: (Contribution | null)[][] = []
  if (contributions.length > 0) {
    const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date))
    const firstDate = new Date(sorted[0].date)
    const dayOfWeek = firstDate.getDay()
    const startDate = new Date(firstDate)
    startDate.setDate(startDate.getDate() - dayOfWeek)

    const byDate = new Map(sorted.map((c) => [c.date, c]))
    const current = new Date(startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    while (current <= today) {
      const week: (Contribution | null)[] = []
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().slice(0, 10)
        week.push(current > today ? null : (byDate.get(dateStr) ?? { date: dateStr, count: 0, level: 0 }))
        current.setDate(current.getDate() + 1)
      }
      weeks.push(week)
    }
  }

  const monthPositions: { label: string; col: number }[] = []
  if (weeks.length > 0) {
    let lastMonth = -1
    weeks.forEach((week, col) => {
      const firstValid = week.find((d) => d !== null)
      if (firstValid) {
        const month = new Date(firstValid.date).getMonth()
        if (month !== lastMonth) {
          monthPositions.push({ label: MONTH_LABELS[month], col })
          lastMonth = month
        }
      }
    })
  }

  const CELL = 10
  const GAP = 2
  const colWidth = CELL + GAP

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="absolute select-none"
      style={{ bottom: 80, right: 24, zIndex: 5 }}
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.12)" }} />
      </div>

      <div className="widget-body px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2.5 gap-8">
          <div className="flex items-center gap-1.5">
            <Github size={11} style={{ color: "var(--text-faint)" }} />
            <span className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>
              {siteConfig.social.githubUsername}
            </span>
          </div>
          {total > 0 && (
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {total.toLocaleString()} contributions this year
            </span>
          )}
        </div>

        {weeks.length === 0 ? (
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>No data</div>
        ) : (
          <div>
            <div style={{ position: "relative", height: 14, marginBottom: 2, width: weeks.length * colWidth }}>
              {monthPositions.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  style={{
                    position: "absolute",
                    left: col * colWidth,
                    fontSize: 9,
                    color: "var(--text-muted)",
                    lineHeight: "14px",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={day ? `${day.date}: ${day.count} contributions` : ""}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        background: day ? LEVEL_COLORS[day.level] : "transparent",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
