# ai-shell 🤖

> Type plain English. Get a shell command.

[![npm version](https://img.shields.io/npm/v/ai-shell?color=cyan&style=flat-square)](https://npmjs.com/package/ai-shell)
[![npm downloads](https://img.shields.io/npm/dm/ai-shell?color=cyan&style=flat-square)](https://npmjs.com/package/ai-shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](https://nodejs.org)
[![GitHub Stars](https://img.shields.io/github/stars/TadB0x/ai-shell?style=flat-square&color=yellow)](https://github.com/TadB0x/ai-shell/stargazers)

Don't know the exact command? Just describe what you want. **ai-shell** turns your words into a shell command, explains what it does, and asks before running it.

Supports **Anthropic Claude**, **Google Gemini**, and **Groq** — switch providers per query.

---

<!-- demo.gif — record with: asciinema rec demo.cast && svg-term --in demo.cast --out demo.svg -->
![ai-shell demo](https://raw.githubusercontent.com/TadB0x/ai-shell/main/demo.gif)

---

## Download

| Platform | Download |
|---|---|
| **Linux** (Debian/Ubuntu) | [ai-shell_1.0.0_amd64.deb](https://github.com/TadB0x/ai-shell/releases/latest/download/ai-shell_1.0.0_amd64.deb) |
| **macOS** (Intel + Apple Silicon) | [ai-shell_1.0.0_macos.zip](https://github.com/TadB0x/ai-shell/releases/latest/download/ai-shell_1.0.0_macos.zip) |
| **Windows** x64 | [ai-shell_1.0.0_windows_x64.zip](https://github.com/TadB0x/ai-shell/releases/latest/download/ai-shell_1.0.0_windows_x64.zip) |
| **npm** (all platforms) | `npm install -g ai-shell` |

---

## Install

### Linux (Debian / Ubuntu)
```bash
wget https://github.com/TadB0x/ai-shell/releases/latest/download/ai-shell_1.0.0_amd64.deb
sudo dpkg -i ai-shell_1.0.0_amd64.deb
```

### macOS
```bash
# Download and unzip, then:
chmod +x install.sh && ./install.sh
```
Apple Silicon (M1/M2/M3) and Intel both supported.

### Windows
Download the zip, extract, right-click `install.bat` → **Run as Administrator**.

### npm (all platforms, requires Node 18+)
```bash
npm install -g ai-shell
```

---

## Setup

Get an API key from any supported provider:
- [Anthropic Console](https://console.anthropic.com) — Claude Haiku
- [Google AI Studio](https://aistudio.google.com) — Gemini 2.0 Flash
- [Groq Console](https://console.groq.com) — Llama 3.3 70B (free, very fast)

Then run:
```bash
ai config
```

You'll be prompted to enter any/all of your keys and pick a default provider. Keys are saved to `~/.ai-shell/config.json`.

---

## Usage

### Basic query

No quotes needed for simple queries:
```bash
ai list all files larger than 100mb
ai kill the process on port 3000
ai show disk usage sorted by size
```

Use quotes when your query contains shell special characters (`>`, `|`, `&`, `*`):
```bash
ai "find files modified in the last 24 hours | sort by size"
```

### What it looks like

```
$ ai show all running processes sorted by memory

  ╭────────────────────────────────────────────╮
  │  ps aux --sort=-%mem                        │
  ╰────────────────────────────────────────────╯

  Lists all running processes sorted by memory usage in
  descending order, showing user, PID, CPU%, MEM%, and command.

  ◆ Groq · llama-3.3-70b-versatile

  ? Run this command? (y/N)
```

---

## All options

```
Options:
  -y, --yes              Run immediately, skip confirmation (once)
  --all-yes              Permanently skip all confirmations forever
  --no-all-yes           Turn off permanent auto-confirm
  -c, --copy             Copy command to clipboard instead of running
  -p, --provider <name>  Use a specific provider: anthropic | gemini | groq
  -e, --explain <cmd>    Explain what an existing command does
```

### Skip confirmation once

```bash
ai delete all log files older than 7 days -y
ai restart nginx --yes
```

### Permanently skip all confirmations

Run this once to never be asked again:
```bash
ai --all-yes
```

Every command after this runs immediately without any prompt, including dangerous ones:
```bash
ai empty the trash    # runs instantly
ai rm -rf /tmp/build  # runs instantly, no warning
```

Turn it back on anytime:
```bash
ai --no-all-yes
```

### Switch provider per query

```bash
ai list docker containers --provider groq
ai show memory usage --provider gemini
ai explain this error --provider anthropic
```

### Explain an existing command

```bash
ai --explain "find . -name '*.js' -not -path '*/node_modules/*'"
```

```
  ╭────────────────────────────────────────────────────────────────╮
  │  find . -name '*.js' -not -path '*/node_modules/*'             │
  ╰────────────────────────────────────────────────────────────────╯

  Searches the current directory recursively for .js files,
  skipping anything inside node_modules folders.
```

### View history

```bash
ai history        # last 20 commands
ai history -n 50  # last 50
ai history --clear
```

---

## Dangerous command detection

By default, ai-shell detects commands that could cause irreversible damage (`rm -rf`, disk writes, fork bombs, etc.) and requires you to type `yes` in full before running.

```
  ╭──────────────────────────╮
  │  rm -rf /tmp/old-project  │
  ╰──────────────────────────╯

  ⚠  WARNING: This command may be dangerous:
     • Recursive force delete (rm -rf)

  ⚠  This is a dangerous command.
  Type "yes" to confirm, anything else to cancel:
```

Use `-y` or `--all-yes` to bypass this when you know what you're doing.

---

## Providers & Models

| Provider | Model | Speed | Free tier |
|---|---|---|---|
| Groq | llama-3.3-70b-versatile | ⚡ Ultra-fast | Yes — generous |
| Anthropic | claude-haiku-4-5 | Fast | No |
| Google Gemini | gemini-2.0-flash | Fast | Yes — limited |

---

## Config files

| File | Purpose |
|---|---|
| `~/.ai-shell/config.json` | API keys, default provider, settings |
| `~/.ai-shell/history.json` | Command history (last 500 entries) |

---

## Building from source

```bash
git clone https://github.com/TadB0x/ai-shell
cd ai-shell
npm install
npm run build           # TypeScript → dist/
npm run bundle          # esbuild CJS bundle
npm run build:binaries  # standalone executables → installers/bin/
```

## Contributing

1. Fork the repo
2. `npm install && npm run build`
3. Make your changes in `src/`
4. Open a PR

---

## License

MIT © [TadB0x](https://github.com/TadB0x)
