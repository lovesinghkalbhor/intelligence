


// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default { // Use 'export default' for ES Module compatibility with Vite
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // Add the Typography plugin here
  ],
}