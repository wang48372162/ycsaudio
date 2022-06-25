const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: ['backface-hidden'],
  theme: {
    boxShadow: {
      DEFAULT: '0 4px 9px rgba(32, 32, 32, 0.4)',
      none: '0 0 #0000',
    },
    extend: {
      colors: {
        black: '#202020',
        gray: colors.neutral,
      },
    },
  },
}
