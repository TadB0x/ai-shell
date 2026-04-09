#!/usr/bin/env bash
set -e

INSTALL_PATH="/usr/local/bin/ai"

echo ""
echo "  Uninstalling ai-shell..."

if [ ! -f "$INSTALL_PATH" ]; then
  echo "  ai-shell does not appear to be installed at $INSTALL_PATH"
  exit 0
fi

if [ -w "$INSTALL_PATH" ]; then
  rm "$INSTALL_PATH"
else
  sudo rm "$INSTALL_PATH"
fi

# Remove config (ask first)
CONFIG_DIR="$HOME/.ai-shell"
if [ -d "$CONFIG_DIR" ]; then
  read -p "  Remove ~/.ai-shell (config + history)? [y/N] " confirm
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    rm -rf "$CONFIG_DIR"
    echo "  Removed ~/.ai-shell"
  fi
fi

echo "  ✓ ai-shell uninstalled."
echo ""
