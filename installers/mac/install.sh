#!/usr/bin/env bash
set -e

INSTALL_DIR="/usr/local/lib/ai-shell"
BIN="/usr/local/bin/ai"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo " ╭─────────────────────────────────────────────╮"
echo " │       ai-shell installer for macOS          │"
echo " ╰─────────────────────────────────────────────╯"
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo " [ERROR] Node.js not found. Install it from https://nodejs.org (v18+)"
  exit 1
fi

NODE_VER=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if [ "$NODE_VER" -lt 18 ]; then
  echo " [ERROR] Node.js v18+ required (found v$NODE_VER). Update at https://nodejs.org"
  exit 1
fi

echo "  Node.js  : $(node --version)"
echo "  Install  : $INSTALL_DIR"
echo ""

if [ -w "/usr/local/lib" ]; then
  SUDO=""
else
  SUDO="sudo"
  echo "  (requires sudo)"
fi

# Copy app files
$SUDO mkdir -p "$INSTALL_DIR"
$SUDO cp -r "$SCRIPT_DIR/app/." "$INSTALL_DIR/"

# Write launcher
$SUDO tee "$BIN" > /dev/null << 'LAUNCHER'
#!/bin/sh
exec node /usr/local/lib/ai-shell/dist/index.js "$@"
LAUNCHER
$SUDO chmod 755 "$BIN"

echo " ✓ Installed!"
echo ""
echo "  Run: ai config"
echo "  Then: ai list files larger than 100mb"
echo ""
