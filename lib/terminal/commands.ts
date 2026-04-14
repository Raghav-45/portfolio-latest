/**
 * lib/terminal/commands.ts
 * ─────────────────────────────────────────────────────────────
 * Pure functions that implement every terminal command. Each
 * command returns an array of Line objects the component renders.
 *
 * To add a command:
 *   1. Add its name to ALL_COMMANDS.
 *   2. Add a manpage entry to MANPAGES (optional but nice).
 *   3. Add a `case` branch to `run()` below.
 *
 * No React, no DOM — keeps this file trivially unit-testable.
 * ─────────────────────────────────────────────────────────────
 */

import { siteConfig } from "@/config/siteConfig"
import { terminal as terminalData } from "@/config/terminal"
import { getNode, resolvePath } from "./fs"

export interface Line {
  type: "input" | "output" | "error" | "blank" | "system"
  text: string
}

export interface RunContext {
  cwd: string[]
  setCwd: (cwd: string[]) => void
  history: string[]
  onOpen?: (id: string) => void
  onClose?: () => void
}

export const ALL_COMMANDS = [
  "help", "whoami", "ls", "cat", "cd", "pwd", "date", "echo",
  "open", "neofetch", "ping", "clear", "history", "man", "sudo",
  "curl", "env", "which", "exit",
] as const

export const SECTIONS = ["about", "experience", "projects", "blogs", "contact", "resume", "uses", "notes"] as const

export const MANPAGES: Record<string, string[]> = {
  ls:       ["ls [-a] [dir]", "List directory contents."],
  cat:      ["cat <file>", "Print file contents."],
  cd:       ["cd [dir]", "Change directory. cd ~ returns home."],
  echo:     ["echo <text>", "Print text to stdout."],
  ping:     ["ping <host>", "Send ICMP packets to host."],
  open:     ["open <section>", `Open a window. Sections: ${SECTIONS.join(", ")}.`],
  sudo:     ["sudo <cmd>", "Execute command as superuser."],
  neofetch: ["neofetch", "Display system information."],
  history:  ["history", "Show command history."],
  env:      ["env", "Print environment variables."],
  which:    ["which <cmd>", "Locate a command."],
  curl:     ["curl <url>", "Transfer data from a URL."],
  exit:     ["exit", "Close the terminal."],
}

export function run(raw: string, ctx: RunContext): Line[] {
  const trimmed = raw.trim()
  if (!trimmed) return []

  const tokens = trimmed.split(/\s+/)
  const cmd = tokens[0].toLowerCase()
  const args = tokens.slice(1)

  const out = (text: string): Line => ({ type: "output", text })
  const err = (text: string): Line => ({ type: "error", text })
  const blank: Line = { type: "blank", text: "" }

  switch (cmd) {
    case "help":
      return [
        out("Available commands:"),
        blank,
        out("  whoami              About me"),
        out("  ls [-a] [path]      List directory"),
        out("  cat <file>          Print file"),
        out("  cd [dir]            Change directory"),
        out("  pwd                 Working directory"),
        out("  date                Current date/time"),
        out("  echo <text>         Echo text"),
        out("  open <section>      Open a window"),
        out("  neofetch            System info"),
        out("  ping <host>         Ping a host"),
        out("  man <cmd>           Manual page"),
        out("  history             Command history"),
        out("  env                 Environment variables"),
        out("  which <cmd>         Locate a command"),
        out("  curl <url>          Fetch a URL"),
        out("  sudo <cmd>          Superuser"),
        out("  clear               Clear terminal (Ctrl+L)"),
        out("  exit                Close terminal (Ctrl+D)"),
      ]

    case "whoami":
      return terminalData.whoami.map((l) => (l === "" ? blank : out(l)))

    case "pwd":
      return [out("/Users/" + siteConfig.personal.username + "/" + ctx.cwd.join("/"))]

    case "date":
      return [out(new Date().toString())]

    case "echo": {
      const text = args.join(" ")
      if (text === "$HOME" || text === "~") return [out(`/Users/${siteConfig.personal.username}`)]
      if (text === "$USER") return [out(siteConfig.personal.username)]
      if (text === "$SHELL") return [out("/bin/zsh")]
      return [out(text)]
    }

    case "cd": {
      const target = args[0]
      if (!target || target === "~" || target === "$HOME") {
        ctx.setCwd([])
        return []
      }
      const parts = target.split("/").filter(Boolean)
      const newPath = resolvePath(ctx.cwd, parts)
      if (newPath === null) return [err(`cd: ${target}: No such file or directory`)]
      const node = getNode(newPath)
      if (!node) return [err(`cd: ${target}: No such file or directory`)]
      if (node.type !== "dir") return [err(`cd: ${target}: Not a directory`)]
      ctx.setCwd(newPath)
      return []
    }

    case "ls": {
      const showHidden = args.includes("-a") || args.includes("-la") || args.includes("-al")
      const pathArg = args.find((a) => !a.startsWith("-"))

      let targetPath = ctx.cwd
      if (pathArg) {
        const parts = pathArg.split("/").filter(Boolean)
        const resolved = resolvePath(ctx.cwd, parts)
        if (resolved === null) return [err(`ls: ${pathArg}: No such file or directory`)]
        targetPath = resolved
      }

      const node = getNode(targetPath)
      if (!node) return [err(`ls: ${pathArg}: No such file or directory`)]
      if (node.type === "file") return [out(pathArg ?? "")]

      const entries = Object.entries(node.children)
      const visible = showHidden
        ? [[".", "dir"], ["..", "dir"], ...entries.map(([n, v]) => [n, v.type])]
        : entries.filter(([n]) => !n.startsWith(".")).map(([n, v]) => [n, v.type])

      if (visible.length === 0) return []
      return visible.map(([name, type]) =>
        out(type === "dir" ? name + "/" : name)
      )
    }

    case "cat": {
      if (!args[0]) return [err("cat: missing file operand")]
      const parts = args[0].split("/").filter(Boolean)
      const resolved = resolvePath(ctx.cwd, parts)
      if (!resolved) return [err(`cat: ${args[0]}: No such file or directory`)]
      const node = getNode(resolved)
      if (!node) return [err(`cat: ${args[0]}: No such file or directory`)]
      if (node.type === "dir") return [err(`cat: ${args[0]}: Is a directory`)]
      return node.content.map((l) => (l === "" ? blank : out(l)))
    }

    case "open": {
      if (!args[0]) return [err("open: missing argument. Usage: open <section>")]
      const section = args[0].toLowerCase()
      if ((SECTIONS as readonly string[]).includes(section)) {
        ctx.onOpen?.(section)
        return [out(`Opening ${section}…`)]
      }
      return [err(`open: '${args[0]}' not found. Try: ${SECTIONS.join(", ")}`)]
    }

    case "neofetch":
      return [
        out(`             ████████             ${siteConfig.personal.username}@portfolio`),
        out("           ████████████           ─────────────────────────"),
        out("         ██████████████           OS: Portfolio OS v1.0"),
        out("       ████████████████           Host: Vercel Edge Network"),
        out("         ██████████████           Kernel: Next.js 15"),
        out("       ██            ██           Shell: React 19 + TS"),
        out("     ████            ████         CPU: Portfolio Engine"),
        out("     ██████        ██████         Memory: ∞ browser tabs"),
        out("       ████████████████           GPU: Framer Motion"),
        out("         ████████████             Theme: Minimal Dark"),
        out("           ████████               Font: Geist Mono"),
        blank,
        out("  ████  ████  ████  ████  ████  ████  ████  ████"),
      ]

    case "ping": {
      const host = args[0] ?? "localhost"
      return [
        out(`PING ${host}: 56 data bytes`),
        out(`64 bytes from ${host}: icmp_seq=0 ttl=64 time=1.337 ms`),
        out(`64 bytes from ${host}: icmp_seq=1 ttl=64 time=420.69 ms`),
        out(`64 bytes from ${host}: icmp_seq=2 ttl=64 time=80085 ms`),
        blank,
        out(`--- ${host} ping statistics ---`),
        out(`3 packets transmitted, 3 received, 0% packet loss`),
      ]
    }

    case "man": {
      if (!args[0]) return [err("What manual page do you want?")]
      const page = MANPAGES[args[0].toLowerCase()]
      if (!page) return [err(`No manual entry for ${args[0]}`)]
      return [out("NAME"), out(`       ${page[0]}`), blank, out("DESCRIPTION"), out(`       ${page[1]}`)]
    }

    case "history":
      if (ctx.history.length === 0) return [out("No commands in history.")]
      return ctx.history.slice().reverse().map((h, i) => out(`  ${String(i + 1).padStart(3)}  ${h}`))

    case "env":
      return [
        out(`USER=${siteConfig.personal.username}`),
        out(`HOME=/Users/${siteConfig.personal.username}`),
        out("SHELL=/bin/zsh"),
        out("TERM=xterm-256color"),
        out("EDITOR=nvim"),
        out("LANG=en_US.UTF-8"),
        out("NODE_ENV=production"),
        out("NEXT_PUBLIC_SITE=portfolio"),
      ]

    case "which": {
      if (!args[0]) return [err("which: missing argument")]
      const c = args[0].toLowerCase()
      if ((ALL_COMMANDS as readonly string[]).includes(c)) return [out(`/usr/local/bin/${c}`)]
      return [err(`which: ${args[0]}: not found`)]
    }

    case "curl": {
      if (!args[0]) return [err("curl: no URL specified")]
      const url = args[0]
      if (url.includes(siteConfig.social.githubUsername) || url.includes("github.com")) {
        return [out(terminalData.githubJson)]
      }
      return [
        out(`  % Total    % Received  Xferd  Avg Speed`),
        out(`100   240  100   240    0     0    512      0`),
        out(`{"status":"ok","message":"hello from ${url}"}`),
      ]
    }

    case "sudo":
      if (args[0] === "rm" && args[1] === "-rf" && (args[2] === "/" || args[2] === "*")) {
        return [err("nice try."), out("Portfolio integrity: intact.")]
      }
      return [err("sudo: you are not in the sudoers file. This incident will be reported.")]

    case "clear":
      return [{ type: "blank", text: "__clear__" }]

    case "exit":
      ctx.onClose?.()
      return [out("Closing terminal…")]

    default:
      return [err(`zsh: command not found: ${cmd}`)]
  }
}

/** Tab completion candidates given the current input + cwd. */
export function getCompletions(input: string, cwd: string[]): string[] {
  const tokens = input.split(/\s+/)

  if (tokens.length <= 1) {
    const prefix = tokens[0] ?? ""
    return ALL_COMMANDS.filter((c) => c.startsWith(prefix))
  }

  const cmd = tokens[0].toLowerCase()
  const lastArg = tokens[tokens.length - 1]

  if (cmd === "open") {
    return SECTIONS.filter((s) => s.startsWith(lastArg))
  }

  if (["ls", "cat", "cd"].includes(cmd)) {
    const slashIdx = lastArg.lastIndexOf("/")
    const dirPart = slashIdx >= 0 ? lastArg.slice(0, slashIdx + 1) : ""
    const namePart = slashIdx >= 0 ? lastArg.slice(slashIdx + 1) : lastArg

    const dirPath = dirPart ? resolvePath(cwd, dirPart.split("/").filter(Boolean)) : cwd
    if (!dirPath) return []
    const node = getNode(dirPath)
    if (!node || node.type !== "dir") return []

    return Object.entries(node.children)
      .filter(([name]) => name.startsWith(namePart) && !name.startsWith("."))
      .map(([name, child]) => dirPart + name + (child.type === "dir" ? "/" : ""))
  }

  if (["which", "man", "sudo"].includes(cmd)) {
    return ALL_COMMANDS.filter((c) => c.startsWith(lastArg))
  }

  return []
}

export const BOOT: Line[] = [
  { type: "system", text: "Portfolio OS  v1.0.0" },
  { type: "output", text: 'Type "help" for available commands.' },
  { type: "blank", text: "" },
]
