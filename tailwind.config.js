/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#C6EBBE',
          DEFAULT: '#A9DBB8',
          dark: '#7CA5B8'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}