import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

// Served from https://<user>.github.io/rugged-india/ in production
const base = process.env.NODE_ENV === 'production' ? '/rugged-india/' : '/'

// Source and catalogue reference images as '/images/...' — prefix them with the base path
const baseImages = (): Plugin => ({
  name: 'base-images',
  transform(code, id) {
    if (base === '/' || !id.includes('/src/')) return
    return code.replaceAll(`'/images/`, `'${base}images/`).replaceAll(`"/images/`, `"${base}images/`)
  },
})

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), baseImages()],
})
