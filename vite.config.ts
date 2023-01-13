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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    Vue({
      template: {
        compilerOptions: {
          directiveTransforms: {
            tippy: () => ({ props: [], needRuntime: true }),
          },
        },
      },
    }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: '',
        }),
        HeadlessUiResolver(),
        HeadlessUiFloatResolver(),
      ],
      dts: 'src/shims/components.d.ts',
    }),
    AutoImport({
      dirs: ['src/composables', 'src/logic'],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
      dts: 'src/shims/auto-imports.d.ts',
      eslintrc: { enabled: true },
    }),
    Icons({
      autoInstall: true,
    }),
    Pages(),
    Yaml(),
    RemoveElTestAttrPlugin(),
  ],

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

  test: {
    globals: true,
    environment: 'jsdom',
  },

  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
})
