/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We will rely on standard tailwind slate, teal, and yellow for the requested dark theme
        brand: {
          dark: '#0f172a', // slate-900 equivalent
          card: '#1e293b', // slate-800 equivalent
          primary: '#14b8a6', // teal-500
          accent: '#eab308', // yellow-500
        }
      }
    },
  },
  plugins: [],
}
