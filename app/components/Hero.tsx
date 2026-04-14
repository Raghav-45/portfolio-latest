"use client"

import Image from 'next/image'
import { Twitter, Github, BookOpen } from 'lucide-react'
// Text + social links come from /config/siteConfig.ts.
import { siteConfig } from '@/config/siteConfig'

export default function Hero({ compact = false }: { compact?: boolean }) {
  const { personal, social } = siteConfig

  return (
    <section className="px-6 pt-7 pb-6 flex flex-col h-full" style={{ minHeight: 0 }}>

      {/* Name — edit siteConfig.personal.firstName / lastName */}
      <div className="mb-5">
        <h1
          className="font-semibold tracking-tight text-white leading-[0.92] mb-3"
          style={{ fontSize: compact ? 46 : 56 }}
        >
          {personal.firstName}<br />{personal.lastName}
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
          {personal.role}
        </p>
      </div>

      <div style={{ height: 1, background: "var(--separator)", marginBottom: 20 }} />

      {/* Bio — edit siteConfig.personal.tagline */}
      <p className="text-[13px] leading-[1.75]" style={{ color: "var(--text-secondary)" }}>
        {personal.tagline}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-auto pt-5"
        style={{ borderTop: "1px solid var(--separator)" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-md overflow-hidden flex-none">
            {/* Avatar — edit siteConfig.personal.avatar and drop your image into /public.
                alt="" because the name is already rendered next to it (avoid double announcement).
                priority because the avatar is above the fold on every viewport. */}
            <Image src={personal.avatar} alt="" fill priority className="object-cover" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
              {personal.username}
            </p>
            <p className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>
              {personal.location.split(",")[0]} · {personal.age}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[
            { href: social.twitter, icon: <Twitter size={15} />, label: "X" },
            { href: social.github,  icon: <Github size={15} />,  label: "GitHub" },
            { href: social.blog,    icon: <BookOpen size={15} />, label: "Blog" },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
