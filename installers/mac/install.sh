#!/usr/bin/env bash
set -e

INSTALL_DIR="/usr/local/bin"
BINARY_NAME="ai"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Detect architecture
ARCH="$(uname -m)"
if [ "$ARCH" = "arm64" ]; then
  BIN_SOURCE="$SCRIPT_DIR/ai-macos-arm64"
else
  BIN_SOURCE="$SCRIPT_DIR/ai-macos-x64"
fi

echo ""
echo " ╭─────────────────────────────────────────────╮"
echo " │       ai-shell installer for macOS          │"
echo " ╰─────────────────────────────────────────────╯"
echo ""
echo "  Architecture : $ARCH"
echo "  Binary       : $(basename $BIN_SOURCE)"
echo "  Install to   : $INSTALL_DIR/$BINARY_NAME"
echo ""

if [ ! -f "$BIN_SOURCE" ]; then
  echo " [ERROR] Binary not found: $BIN_SOURCE"
  echo "  Make sure the installer folder is intact."
  exit 1
fi

# Check if /usr/local/bin is writable, otherwise use sudo
if [ -w "$INSTALL_DIR" ]; then
  cp "$BIN_SOURCE" "$INSTALL_DIR/$BINARY_NAME"
  chmod 755 "$INSTALL_DIR/$BINARY_NAME"
else
  echo "  (requires sudo to write to $INSTALL_DIR)"
  sudo cp "$BIN_SOURCE" "$INSTALL_DIR/$BINARY_NAME"
  sudo chmod 755 "$INSTALL_DIR/$BINARY_NAME"
fi

# Remove quarantine attribute (macOS Gatekeeper)
if command -v xattr &>/dev/null; then
  xattr -d com.apple.quarantine "$INSTALL_DIR/$BINARY_NAME" 2>/dev/null || true
fi

echo " ✓ Installed successfully!"
echo ""
echo "  Run: ai config    (set your Anthropic API key)"
echo "  Then: ai \"list files larger than 100mb\""
echo ""
