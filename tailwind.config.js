/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        architectural: {
          50: '#f7f8f9',
          100: '#eef1f4',
          200: '#dce1e7',
          300: '#bfc8d4',
          400: '#9baab9',
          500: '#7e8f9f',
          600: '#657484',
          700: '#525e6c',
          800: '#464f5b',
          900: '#1e242b',
          950: '#0f1317',
        },
        caribbean: {
          50: '#effbfb',
          100: '#d6f4f5',
          200: '#b2eaec',
          300: '#7dd9dd',
          400: '#3ebec6',
          500: '#1e9fa8',
          600: '#198089',
          700: '#19676e',
          800: '#195359',
          900: '#19454a',
        },
        clay: {
          500: '#d97736',
          600: '#c25e21',
        },
        warningCoral: '#f43f5e',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
