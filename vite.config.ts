import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Pages from 'vite-plugin-pages'
import Yaml from '@rollup/plugin-yaml'

function removeDataTestAttrs(node: any) {
  if (node.type === 1 /* NodeTypes.ELEMENT */) {
    node.props = node.props.filter((prop: any) =>
      prop.type === 6 /* NodeTypes.ATTRIBUTE */
        ? prop.name !== 'data-test'
        : true
    )
  }
}

export default defineConfig(({ command }) => ({
  plugins: [
    Vue({
      template: {
        compilerOptions: {
          nodeTransforms: command === 'build' ? [removeDataTestAttrs] : [],
          directiveTransforms: {
            tippy: () => ({ props: [], needRuntime: true }),
          },
        },
      },
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router': ['onBeforeRouteUpdate', 'useRoute', 'useRouter'],
          '@vueuse/core': ['onClickOutside', 'useEventListener', 'useLocalStorage', 'useMagicKeys', 'whenever'],
        },
      ],
      dirs: ['src/composables', 'src/logic'],
      dts: 'src/shims/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        IconsResolver({ prefix: '' }),
      ],
      dts: 'src/shims/components.d.ts',
    }),
    Pages(),
    Icons(),
    Yaml(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
}))
