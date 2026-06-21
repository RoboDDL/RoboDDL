import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative asset paths so the build works across Cloudflare Pages
// domains and the fallback GitHub Pages deployment.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
})
