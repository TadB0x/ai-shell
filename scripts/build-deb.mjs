#!/usr/bin/env node
import { execSync } from 'child_process'
import { cpSync, mkdirSync, writeFileSync, chmodSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const VERSION = '1.0.0'
const ARCH = 'amd64'
const PACKAGE = 'ai-shell'
const pkgDir = join(root, 'installers', `${PACKAGE}_${VERSION}_${ARCH}`)

// Directory structure
mkdirSync(join(pkgDir, 'DEBIAN'), { recursive: true })
mkdirSync(join(pkgDir, 'usr', 'local', 'bin'), { recursive: true })
mkdirSync(join(pkgDir, 'usr', 'share', 'doc', PACKAGE), { recursive: true })

// Copy binary
cpSync(
  join(root, 'installers', 'bin', 'ai-linux-x64'),
  join(pkgDir, 'usr', 'local', 'bin', 'ai')
)
chmodSync(join(pkgDir, 'usr', 'local', 'bin', 'ai'), 0o755)

// DEBIAN/control
writeFileSync(join(pkgDir, 'DEBIAN', 'control'), `Package: ${PACKAGE}
Version: ${VERSION}
Architecture: ${ARCH}
Maintainer: ai-shell contributors <noreply@example.com>
Depends:
Recommends: xclip | xsel | wl-clipboard
Section: utils
Priority: optional
Homepage: https://github.com/TadB0x/ai-shell
Description: Type plain English. Get a shell command.
 ai-shell converts plain English queries into shell commands
 powered by Claude AI. It shows the command, explains what it does,
 and asks for confirmation before running it. Includes dangerous
 command detection with extra confirmation steps.
`)

// DEBIAN/postinst — show welcome message
writeFileSync(join(pkgDir, 'DEBIAN', 'postinst'), `#!/bin/sh
set -e
echo ""
echo " ╭─────────────────────────────────────────────╮"
echo " │           ai-shell installed!               │"
echo " ╰─────────────────────────────────────────────╯"
echo ""
echo "  Run: ai config    (set your Anthropic API key)"
echo "  Then: ai \\"list files larger than 100mb\\""
echo ""
`)
chmodSync(join(pkgDir, 'DEBIAN', 'postinst'), 0o755)

// copyright
writeFileSync(
  join(pkgDir, 'usr', 'share', 'doc', PACKAGE, 'copyright'),
  `Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/
Upstream-Name: ai-shell
Source: https://github.com/TadB0x/ai-shell
License: MIT
`
)

// Build the .deb
const outDeb = join(root, 'installers', `${PACKAGE}_${VERSION}_${ARCH}.deb`)
execSync(`dpkg-deb --build ${pkgDir} ${outDeb}`, { stdio: 'inherit' })

console.log(`\n✓ Built: ${outDeb}`)
