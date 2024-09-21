import { fileURLToPath } from 'node:url'
import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineViteConfig(configEnv =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    })
  )
)
