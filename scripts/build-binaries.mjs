#!/usr/bin/env node
import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'installers', 'bin')

mkdirSync(outDir, { recursive: true })

const pkg = join(root, 'node_modules', '.bin', 'pkg')
const bundle = join(root, 'dist', 'bundle.cjs')

const targets = [
  { target: 'node22-linux-x64',   out: join(outDir, 'ai-linux-x64')   },
  { target: 'node22-win-x64',     out: join(outDir, 'ai-win-x64.exe') },
  { target: 'node22-macos-x64',   out: join(outDir, 'ai-macos-x64')   },
  { target: 'node22-macos-arm64', out: join(outDir, 'ai-macos-arm64') },
]

console.log('Building standalone binaries...\n')

for (const { target, out } of targets) {
  process.stdout.write(`  → ${target.padEnd(28)} `)
  try {
    execSync(`${pkg} ${bundle} --target ${target} --output ${out} --compress GZip`, {
      stdio: 'pipe',
      cwd: root,
    })
    console.log('✓')
  } catch (err) {
    console.log('✗ (skipped — may need to download Node for this target)')
  }
}

console.log('\nBinaries written to installers/bin/')
