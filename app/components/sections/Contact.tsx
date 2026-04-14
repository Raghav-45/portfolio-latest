"use client"

import { motion } from "framer-motion"
import { Twitter, Mail, Github, Calendar } from "lucide-react"
// Contact rows + headings come from /config/siteConfig.ts → contact.
import { siteConfig, type ContactRow } from "@/config/siteConfig"

const ICONS = {
  mail:     <Mail size={15} />,
  calendar: <Calendar size={15} />,
  twitter:  <Twitter size={15} />,
  github:   <Github size={15} />,
} as const

export default function Contact({ compact = false }: { compact?: boolean }) {
  const { contact } = siteConfig

  return (
    <div className={compact ? "px-6 py-6" : "py-20 px-6"}>
      <p
        className="font-mono text-[10px] uppercase tracking-[0.14em] mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        Contact
      </p>
      <h2 className="text-[22px] font-semibold text-white mb-1">{contact.heading}</h2>
      <p className="text-[13px] mb-7" style={{ color: "var(--text-secondary)" }}>
        {contact.subheading}
      </p>

      <div className="space-y-0">
        {contact.rows.map((c: ContactRow, i: number) => (
          <motion.a
            key={i}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-4"
            style={{
              borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
              borderBottom: "1px solid var(--separator)",
            }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-center gap-3">
              <span style={{ color: "var(--text-muted)" }}>{ICONS[c.icon]}</span>
              <span
                className="text-[13px] font-medium text-white/70 group-hover:text-white transition-colors"
              >
                {c.label}
              </span>
            </div>
            <span
              className="font-mono text-[10px] group-hover:text-white/50 transition-colors"
              style={{ color: "var(--text-faint)" }}
            >
              {c.mono}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
