import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Pages from 'vite-plugin-pages'
import { HeadlessUiFloatResolver } from '@headlessui-float/vue'
import Yaml from '@rollup/plugin-yaml'
import RemoveElTestAttrPlugin from './src/plugins/remove-el-test-attr'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ycsaudio/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    Vue(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: '',
        }),
        HeadlessUiResolver(),
        HeadlessUiFloatResolver(),
      ],
      dts: true,
    }),
    AutoImport({
      dirs: ['src/composables', 'src/logic'],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
      dts: true,
      eslintrc: { enabled: true },
    }),
    Icons({
      autoInstall: true,
    }),
    Pages(),
    Yaml(),
    RemoveElTestAttrPlugin(),
  ],
  test: {
    globals: true,
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'vue-tippy',
      'nprogress',
      'nouislider',
      '@vueuse/core',
      '@headlessui/vue',
      '@headlessui-float/vue',
    ],
  },
})
