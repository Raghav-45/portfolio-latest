"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, useDragControls } from "framer-motion"

interface NowPlayingData {
  isPlaying: boolean
  configured: boolean
  title?: string
  artist?: string
  album?: string
  albumImageUrl?: string | null
  songUrl?: string | null
}

function EqBars() {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 12 }} aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: "100%",
            borderRadius: 1,
            background: "var(--accent)",
            transformOrigin: "bottom",
            animation: `eq-bar ${0.55 + i * 0.15}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null)
  const dragControls = useDragControls()

  useEffect(() => {
    const fetch_ = () =>
      fetch("/api/spotify").then((r) => r.json()).then(setData).catch(() => {})
    fetch_()
    const id = setInterval(fetch_, 30_000)
    return () => clearInterval(id)
  }, [])

  const isPlaying = data?.isPlaying && data?.title

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="absolute select-none"
      style={{ bottom: 90, left: 20, zIndex: 5, width: 272 }}
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.12)" }} />
      </div>

      <div className="widget-body flex items-center gap-3 px-3 py-2.5">
        {isPlaying && data?.albumImageUrl ? (
          <div className="relative w-8 h-8 flex-none overflow-hidden" style={{ borderRadius: 4 }}>
            <Image src={data.albumImageUrl} alt={data.album ?? ""} fill className="object-cover" />
          </div>
        ) : (
          <div
            className="w-8 h-8 flex-none flex items-center justify-center"
            style={{ borderRadius: 4, background: "var(--accent-subtle)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--text-faint)" }}>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isPlaying ? (
            <>
              <a
                href={data?.songUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[12px] font-medium line-clamp-1 transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {data?.title}
              </a>
              <p className="font-mono text-[10px] line-clamp-1" style={{ color: "var(--text-muted)" }}>
                {data?.artist}
              </p>
            </>
          ) : (
            <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
              not playing
            </p>
          )}
        </div>

        <div className="flex-none">
          {isPlaying ? (
            <EqBars />
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1DB954", opacity: 0.6 }}>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  )
}
