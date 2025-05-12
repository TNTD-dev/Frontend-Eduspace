/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Atyp', 'sans-serif'],
        'atyp': ['Atyp', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 