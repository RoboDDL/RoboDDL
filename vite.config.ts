import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const deployBranch = process.env.VERCEL_GIT_COMMIT_REF ?? ''

// Use relative asset paths so the build works for both project pages
// (/RoboDDL/) and custom-domain root hosting.
export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    __DEPLOY_BRANCH__: JSON.stringify(deployBranch),
  },
  build: {
    outDir: 'dist',
  },
})
