import ycs77, { GLOB_TESTS } from '@ycs77/eslint-config'

export default ycs77({
  vue: true,
  typescript: true,
  ignores: [
    '.github/**/*',
    'netlify.toml',
  ],
})
  .append({
    files: GLOB_TESTS,
    rules: {
      'test/prefer-lowercase-title': 'off',
    },
  })
