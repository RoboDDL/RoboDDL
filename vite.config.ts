import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative asset paths so the build works for both project pages
// (/RoboDDL/) and custom-domain root hosting.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
})
