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
        "off-black": "#2B2D42",
        "secondary-green": "#479A89",
        "mint-green": "#B9DFD7"
      },
      gridTemplateRows: {
        // Simple 8 row grid
        '8': 'repeat(8, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}