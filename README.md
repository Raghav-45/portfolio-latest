# macOS Portfolio

A developer portfolio that looks and feels like a macOS desktop.
Draggable windows, a live dock, a working terminal, and an MDX blog — built as a template you can fork in ten minutes.

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](#license)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-black?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-black?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-black?logo=tailwindcss)](https://tailwindcss.com)

---

## Demo

**Live demo:** [your-deployment-url.vercel.app](https://your-deployment-url.vercel.app) _(replace this)_

_Drop a screenshot or GIF here (`public/preview.png`) to give visitors a first impression._

---

## Features

- **macOS-style desktop** — draggable, focus-aware windows with a dock and menu bar
- **Interactive terminal** with a virtual filesystem: `ls`, `cat`, `cd`, `whoami`, `neofetch`, tab completion, history
- **MDX-powered blog** — drop `.mdx` files into `/content/blog` and they appear automatically
- **Themeable** — four built-in palettes driven by CSS variables, switchable from a desktop widget
- **Live widgets** — quote rotator, reading list, GitHub contributions heatmap, Spotify now-playing, visitor counter
- **Mobile fallback** — a clean, scrollable layout on phones and small tablets
- **Fully typed** — every piece of user-editable data has an interface in `/config`
- **Zero required services** — site runs without any env vars; integrations (Spotify, Upstash) are opt-in

---

## Tech stack

| Layer          | Choice                                              |
| -------------- | --------------------------------------------------- |
| Framework      | [Next.js 15](https://nextjs.org) (App Router, RSC)  |
| UI             | [React 19](https://react.dev)                       |
| Language       | [TypeScript](https://www.typescriptlang.org) (strict) |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com)          |
| Animation      | [Framer Motion](https://www.framer.com/motion)      |
| MDX            | [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote) + `gray-matter` |
| Icons          | [Lucide](https://lucide.dev)                        |
| Fonts          | [Geist](https://vercel.com/font) (Sans + Mono)      |
| Deploy         | [Vercel](https://vercel.com)                        |

---

## Setup

Requires **Node 20+**. pnpm is recommended but npm / yarn / bun all work.

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 2. Install
pnpm install

# 3. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required for the site to run. Every optional integration (Spotify, Upstash) no-ops cleanly when its env vars are missing.

---

## Customization

Everything you edit lives in two folders: `/config` (text + data) and `/content/blog` (MDX posts).

### 1. Identity — `config/siteConfig.ts`

Start here. Your name, role, tagline, social links, contact info, and SEO metadata.

### 2. Data files

Each file is independently editable and fully typed. Open one in your editor — the interface at the top tells you exactly what fields are required.

| File                  | What it controls                                 |
| --------------------- | ------------------------------------------------ |
| `siteConfig.ts`       | Name · role · socials · contact · SEO · résumé link |
| `projects.ts`         | Projects shown in the Projects window            |
| `experience.ts`       | Work history · résumé bullets · education · teaching |
| `skills.ts`           | Skill chips grouped by category                  |
| `quotes.ts`           | Rotating quotes in the QuoteWidget               |
| `links.ts`            | Reading list in the LinksWidget                  |
| `notes.ts`            | Informal journal entries                         |
| `uses.ts`             | Hardware + tools shown in the Uses window        |
| `themes.ts`           | Desktop theme palettes                           |
| `terminal.ts`         | Output of terminal commands (`cat`, `whoami`, …) |

### 3. Blog posts — `content/blog/*.mdx`

Create a file with frontmatter and Markdown:

```mdx
---
title: "My first post"
date: "2026-04-01"
description: "One-line summary shown on the listing."
tags: ["example", "writing"]
---

Your post body here. Markdown works. So do React components.
```

Posts appear automatically at `/blog` and in the Blogs window, sorted newest-first by `date`.

### 4. Avatar

Replace `public/avatar.svg` with your own image (any format Next.js supports) and update `siteConfig.personal.avatar` if you change the filename.

### 5. Optional integrations

Skip any of these and the matching widget simply doesn't render.

**Spotify now-playing**

1. Create an app at <https://developer.spotify.com/dashboard>.
2. Add a Redirect URI (e.g. `http://localhost:3000/`).
3. Copy `.env.example` → `.env.local` and fill in `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`.
4. Run `node setup-spotify.mjs` — it prints an auth URL.
5. Visit, approve, copy the `code` from the redirect URL.
6. Run `node setup-spotify.mjs THE_CODE` — it prints your refresh token.
7. Add `SPOTIFY_REFRESH_TOKEN` to `.env.local`.

**Visitor counter (Upstash Redis)**

1. Create a free Redis DB at <https://upstash.com>.
2. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into `.env.local`.

**GitHub heatmap**

No setup — reads `siteConfig.social.githubUsername` and fetches the public contributions API.

---

## Deployment (Vercel)

The fastest path:

1. Push your fork to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Leave every build setting at its default — Vercel auto-detects Next.js.
4. **(Optional)** Under **Environment Variables**, paste whichever `SPOTIFY_*` and `UPSTASH_*` values you filled into `.env.local`.
5. Click **Deploy**.

Every push to `main` redeploys. Preview deployments are created automatically for pull requests.

Deploying elsewhere (Netlify, Cloudflare Pages, self-hosted) works too — it's a standard Next.js build (`pnpm build && pnpm start`).

---

## Folder structure

```
portfolio/
├── app/
│   ├── api/                   Route handlers (github, spotify, views)
│   ├── blog/
│   │   ├── page.tsx           /blog listing
│   │   └── [slug]/page.tsx    Per-post page
│   ├── components/
│   │   ├── sections/          Window contents (Hero, Projects, …)
│   │   ├── widgets/           Desktop widgets (Quote, Links, Theme, …)
│   │   ├── modals/            Dialogs (ExperienceModal)
│   │   ├── Desktop.tsx        macOS shell
│   │   ├── MobileLayout.tsx   Mobile fallback
│   │   ├── MacWindow.tsx      Draggable window chrome
│   │   └── MDXComponents.tsx  Styled MDX tag overrides
│   ├── globals.css            Theme tokens + base styles
│   ├── layout.tsx
│   └── page.tsx               Reads posts, renders Desktop
├── components/ui/             Radix dialog primitive
├── config/                    ── Edit here ──
│   ├── siteConfig.ts          Name, socials, contact, SEO
│   ├── projects.ts · experience.ts · skills.ts
│   ├── quotes.ts · links.ts · notes.ts · uses.ts
│   ├── themes.ts              Theme palettes
│   ├── terminal.ts            Terminal payloads
│   └── index.ts               Barrel export
├── content/blog/              ── MDX posts ──
├── lib/
│   ├── posts.ts               MDX filesystem reader
│   └── utils.ts               cn() helper
├── public/                    Static assets (avatar, etc.)
├── .env.example               Documents every env var
├── setup-spotify.mjs          Guided Spotify token exchange
├── next.config.ts
└── package.json
```

---

## Contributing

Issues and PRs welcome. If you build something interesting on top of this template, open an issue — I'd love to link it.

---

## License

MIT. See [LICENSE](./LICENSE). Use it for anything, attribution appreciated but not required.
