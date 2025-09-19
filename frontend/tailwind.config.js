/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#003366',
        'primary-dark': '#001a33',
        'primary-light': '#eef7ff',
        'accent': '#006edf',
        'error': '#E4332C',
      }
    },
  },
  plugins: [],
}