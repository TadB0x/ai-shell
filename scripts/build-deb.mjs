#!/usr/bin/env node
import { execSync } from 'child_process'
import { cpSync, mkdirSync, writeFileSync, chmodSync, rmSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const VERSION = '1.0.0'
const ARCH = 'amd64'
const PACKAGE = 'ai-shell'
const pkgDir = join(root, 'installers', `${PACKAGE}_${VERSION}_${ARCH}`)

// Clean previous build
if (existsSync(pkgDir)) rmSync(pkgDir, { recursive: true })

// Directory structure
mkdirSync(join(pkgDir, 'DEBIAN'), { recursive: true })
mkdirSync(join(pkgDir, 'usr', 'local', 'bin'), { recursive: true })
mkdirSync(join(pkgDir, 'usr', 'lib', 'ai-shell'), { recursive: true })
mkdirSync(join(pkgDir, 'usr', 'share', 'doc', PACKAGE), { recursive: true })

// Copy the entire dist/ folder into /usr/lib/ai-shell/
cpSync(join(root, 'dist'), join(pkgDir, 'usr', 'lib', 'ai-shell', 'dist'), { recursive: true })
// Copy node_modules needed at runtime
cpSync(join(root, 'node_modules'), join(pkgDir, 'usr', 'lib', 'ai-shell', 'node_modules'), { recursive: true })
// Copy package.json (needed for ESM resolution)
cpSync(join(root, 'package.json'), join(pkgDir, 'usr', 'lib', 'ai-shell', 'package.json'))

// Launcher wrapper script at /usr/local/bin/ai
writeFileSync(join(pkgDir, 'usr', 'local', 'bin', 'ai'), `#!/bin/sh
exec node /usr/lib/ai-shell/dist/index.js "$@"
`)
chmodSync(join(pkgDir, 'usr', 'local', 'bin', 'ai'), 0o755)

// DEBIAN/control
writeFileSync(join(pkgDir, 'DEBIAN', 'control'), `Package: ${PACKAGE}
Version: ${VERSION}
Architecture: ${ARCH}
Maintainer: ai-shell contributors <noreply@example.com>
Depends: nodejs (>= 18)
Recommends: xclip | xsel | wl-clipboard
Section: utils
Priority: optional
Homepage: https://github.com/TadB0x/ai-shell
Description: Type plain English. Get a shell command.
 ai-shell converts plain English queries into shell commands
 powered by Claude AI (or Gemini / Groq). Shows the command,
 explains it, and confirms before running.
`)

// DEBIAN/postinst
writeFileSync(join(pkgDir, 'DEBIAN', 'postinst'), `#!/bin/sh
set -e
echo ""
echo " ╭─────────────────────────────────────────────╮"
echo " │           ai-shell installed!               │"
echo " ╰─────────────────────────────────────────────╯"
echo ""
echo "  Run: ai config    (set your API key)"
echo "  Then: ai list files larger than 100mb"
echo ""
`)
chmodSync(join(pkgDir, 'DEBIAN', 'postinst'), 0o755)

writeFileSync(
  join(pkgDir, 'usr', 'share', 'doc', PACKAGE, 'copyright'),
  `Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/
Upstream-Name: ai-shell
Source: https://github.com/TadB0x/ai-shell
License: MIT
`
)

const outDeb = join(root, 'installers', `${PACKAGE}_${VERSION}_${ARCH}.deb`)
execSync(`dpkg-deb --build ${pkgDir} ${outDeb}`, { stdio: 'inherit' })
console.log(`\n✓ Built: ${outDeb}`)
