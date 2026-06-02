/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pvsa: {
          navy: '#1F4E79',
          blue: '#2E75B6',
          light: '#D6E4F0',
          red: '#C00000',
          orange: '#C55A11',
          green: '#375623',
        },
      },
    },
  },
  plugins: [],
}
