# ai-shell 🤖

> Type plain English. Get a shell command.

[![npm version](https://img.shields.io/npm/v/ai-shell?color=cyan&style=flat-square)](https://npmjs.com/package/ai-shell)
[![npm downloads](https://img.shields.io/npm/dm/ai-shell?color=cyan&style=flat-square)](https://npmjs.com/package/ai-shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](https://nodejs.org)
[![GitHub Stars](https://img.shields.io/github/stars/TadB0x/ai-shell?style=flat-square&color=yellow)](https://github.com/TadB0x/ai-shell/stargazers)

Don't know the exact command? Just describe what you want. **ai-shell** turns your words into a shell command, explains what it does, and asks before running it.

Powered by [Claude AI](https://anthropic.com) (Haiku — fast and cheap).

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
# Download and unzip from the table above, then:
chmod +x install.sh && ./install.sh
```

> Apple Silicon (M1/M2/M3) and Intel both supported.

### Windows
Download the zip from above, extract it, right-click `install.bat` → **Run as Administrator**.

### npm (all platforms, requires Node 18+)
```bash
npm install -g ai-shell
```

---

## Setup

Get a free API key at [console.anthropic.com](https://console.anthropic.com), then:

```bash
ai config
```

You'll be prompted to enter your key. It's saved to `~/.ai-shell/config.json`.

---

## Usage

### Basic query

```
$ ai "show me all files larger than 100mb"

  ╭──────────────────────────────────────────────────╮
  │  find / -size +100M -type f 2>/dev/null           │
  ╰──────────────────────────────────────────────────╯

  Finds all files larger than 100MB on your system,
  suppressing permission errors.

  ? Run this command? (y/N)
```

### More examples

```bash
ai "kill the process running on port 3000"
ai "compress all jpg files in this folder"
ai "show disk usage sorted by size"
ai "find all files modified in the last 24 hours"
ai "list all docker containers including stopped ones"
ai "create a new user named john"
ai "what processes are using the most memory"
ai "watch log file in real time"
```

### Copy to clipboard instead of running

```bash
ai "list all npm global packages" --copy
```

### Explain an existing command

```bash
ai --explain "find . -name '*.js' -not -path '*/node_modules/*'"
```

```
  ╭────────────────────────────────────────────────────────────────╮
  │  find . -name '*.js' -not -path '*/node_modules/*'             │
  ╰────────────────────────────────────────────────────────────────╯

  This command searches the current directory and all subdirectories
  for files ending in .js, but skips anything inside node_modules
  folders to avoid scanning dependencies.
```

### View history

```bash
ai history        # last 20 commands
ai history -n 50  # last 50
ai history --clear
```

---

## Dangerous command detection

ai-shell automatically detects commands that could cause irreversible damage (`rm -rf`, disk writes, fork bombs, etc.) and shows a red warning — requiring you to type `yes` in full before running.

```
  ╭──────────────────────────╮
  │  rm -rf /tmp/old-project  │
  ╰──────────────────────────╯

  Removes the /tmp/old-project directory and all its contents
  permanently.

  ⚠  WARNING: This command may be dangerous:
     • Recursive force delete (rm -rf)

  ⚠  This is a dangerous command.
  Type "yes" to confirm, anything else to cancel:
```

---

## How it works

1. You describe what you want in plain English
2. ai-shell sends your query to Claude Haiku (Anthropic's fastest model)
3. Claude returns a structured response: the exact command + a plain English explanation
4. ai-shell shows you both, checks for dangerous patterns, and asks before running
5. The command runs with real-time output streamed to your terminal
6. Everything is saved to `~/.ai-shell/history.json`

No data is stored on any server other than Anthropic's API for inference.

---

## Config

| File | Purpose |
|---|---|
| `~/.ai-shell/config.json` | API key and settings |
| `~/.ai-shell/history.json` | Command history (last 500 entries) |

Run `ai config` at any time to update your API key.

---

## Building from source

```bash
git clone https://github.com/TadB0x/ai-shell
cd ai-shell
npm install
npm run build        # TypeScript → dist/
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
