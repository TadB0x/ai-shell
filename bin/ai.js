#!/usr/bin/env node
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entry = join(__dirname, '..', 'dist', 'index.js')

await import(entry)
