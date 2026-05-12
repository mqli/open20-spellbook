import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.DEPLOY_TARGET === 'github-pages' ? '/open20-spellbook/' : '/',
})
