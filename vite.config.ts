import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'

// The commit this build came from, for the status panel. Cloudflare Pages provides it as an
// environment variable; locally we ask git.
function commit(): string {
  if (process.env.CF_PAGES_COMMIT_SHA) return process.env.CF_PAGES_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    __COMMIT__: JSON.stringify(commit()),
    __BUILT__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
})
