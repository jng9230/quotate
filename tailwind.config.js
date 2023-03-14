/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-green": "#357266",
        "off-white": "#EDF2F4",
        "off-black": "#2B2D42"
      }
    },
  },
  plugins: [],
}