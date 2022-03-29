import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  plugins: [
    Vue(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: '',
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    Pages(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
