import type { Plugin, ResolvedConfig } from 'vite'

export default function RemoveElTestAttrPlugin() {
  let config: ResolvedConfig
  return <Plugin>{
    name: 'remove-el-test-attr',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transform(code) {
      if (config.command === 'build') {
        return code.replace(/ ?data-test="[^"]+"/g, '')
      }
    },
  }
}
