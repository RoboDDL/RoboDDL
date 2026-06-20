import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

function getDeployBranch() {
  const branch =
    process.env.CF_PAGES_BRANCH ??
    process.env.VERCEL_GIT_COMMIT_REF ??
    process.env.NETLIFY_BRANCH ??
    process.env.GITHUB_REF_NAME

  if (branch) {
    return branch
  }

  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return ''
  }
}

const deployBranch = getDeployBranch()

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
