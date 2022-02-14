const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content:  ['./src/*.{html,ts}'],
  theme: {
    screens: {
      'xs': '420px',
      ...defaultTheme.screens,
    },
    fontFamily: {
      'main': ['Roboto', 'sans-serif'],
    },
    extend: {
      screens: {
        'sm': '576px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
